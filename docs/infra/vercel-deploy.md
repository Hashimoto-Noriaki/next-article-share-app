# Vercel デプロイ手順書（ステージング・本番）

ステージング（stg）と本番を Vercel にデプロイするための初期構築手順と、日々のデプロイ運用をまとめる。
方針や Cloud Run との比較は [deployment.md](./deployment.md) を参照。

---

## 構成概要

| 項目         | 内容                                                             |
| ------------ | ---------------------------------------------------------------- |
| ホスティング | Vercel（Hobby プラン）。stg と本番で **別プロジェクト**          |
| DB           | Neon（PostgreSQL）。`production` ブランチ＝本番、`staging` ＝stg |
| デプロイ     | GitHub Actions から Vercel CLI でデプロイ                        |
| 環境変数     | アプリ用は Vercel、デプロイ用は GitHub Secrets で管理            |

```bash
master へマージ → CI（lint / type-check / test）成功
  → Deploy Staging：build → migrate（Neon staging）→ stg プロジェクトへデプロイ

GitHub Release を公開
  → Deploy Production：build → migrate（Neon production）→ 本番プロジェクトへデプロイ
```

### この構成にした理由

- **stg も固定ドメインにしたい**：Vercel の Preview はデプロイごとに URL が変わるため、OAuth のコールバック URL を登録できない。また Preview には Vercel Authentication（デプロイ保護）が既定でかかり、E2E や他メンバーから開けない。stg を別プロジェクトの Production として出せば、両方とも解消できる
- **デプロイは GitHub Actions に一本化**：Vercel の Git 連携による自動デプロイは `vercel.json` の `git.deploymentEnabled: false` で全ブランチ止めている
- **サードパーティ action を使わない**：Vercel 公式 CLI（`vercel pull` → `vercel build` → `vercel deploy --prebuilt`）を直接呼ぶ

---

## Step 1: Neon のセットアップ

1. [neon.tech](https://neon.tech) でアカウントを作成する
2. **New Project** でプロジェクトを作成する
   - リージョンは作成画面の一覧からアジア圏で近いものを選ぶ（Step 2 の Vercel Functions のリージョンと合わせる）
   - **Services は Postgres database のみ ON**。Object storage（画像は Cloudinary）・Functions・AI gateway・Realtime・Better Auth（認証は NextAuth）は OFF
3. **Branches** タブで `staging` ブランチを追加する（既定の `production` ブランチは本番用）
4. 各ブランチの **Connect** から、次の 2 種類の URL を控える

| 用途                 | 種類                                        | 使う場所                                |
| -------------------- | ------------------------------------------- | --------------------------------------- |
| アプリ実行時         | **Pooled** connection URL（`-pooler` 付き） | Vercel の環境変数 `DATABASE_URL`        |
| マイグレーション実行 | **Direct** connection URL                   | GitHub Secrets `*_MIGRATE_DATABASE_URL` |

> Prisma 7 では `prisma.config.ts` が `DATABASE_URL` だけを読むため、`DIRECT_URL` は使われない。
> マイグレーション時は `DATABASE_URL` に Direct URL を渡す（Pooled 経由だと `migrate deploy` が失敗することがある）。

---

## Step 2: Vercel プロジェクトを 2 つ作成

stg 用・本番用で同じ手順を 2 回行う（例: `article-share-stg` / `article-share-prod`）。

1. [vercel.com](https://vercel.com) で **Add New... > Project** から本リポジトリを Import する
   - 作成直後に 1 回自動ビルドが走るが、環境変数が未設定なので失敗してよい
   - 作成画面で Postgres などのデータベース／ストレージは **追加しない**（DB は Step 1 で Neon に直接作成し、`DATABASE_URL` は Step 3 で手動登録する）
2. Functions のリージョンは `vercel.json` の `regions` で `sin1`（シンガポール）に固定している。Neon のリージョンを変える場合はここも合わせる
   - 既定は米国東部（`iad1`）。DB がアジアにあると毎クエリが太平洋を往復して遅くなる
3. （任意）**Settings > Git > Ignored Build Step** を `exit 0` にする
   - `vercel.json` で自動デプロイは止めているので必須ではない。二重の保険として設定する場合のみ
   - **`exit 0` ＝ビルドをスキップ、`exit 1` ＝ビルドする** なので逆にしないこと

---

## Step 3: Vercel に環境変数を登録

各プロジェクトの **Settings > Environment Variables** で、**Production** 環境に登録する
（stg も本番扱いでデプロイするため、stg プロジェクトでも Production に入れる）。

| 変数名                                         | stg プロジェクト                 | 本番プロジェクト                 |
| ---------------------------------------------- | -------------------------------- | -------------------------------- |
| `DATABASE_URL`                                 | Neon `staging` の Pooled URL     | Neon `production` の Pooled URL  |
| `AUTH_SECRET`                                  | `openssl rand -base64 32` で生成 | 別途生成（stg と同じ値にしない） |
| `AUTH_URL`                                     | stg の URL                       | 本番の URL                       |
| `APP_URL`                                      | stg の URL                       | 本番の URL                       |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`        | stg 用 OAuth App                 | 本番用 OAuth App                 |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`        | stg 用 OAuth クライアント        | 本番用 OAuth クライアント        |
| `CLOUDINARY_CLOUD_NAME`                        | 共通で可                         | 共通で可                         |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | 共通で可                         | 共通で可                         |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD`            | 共通で可                         | 共通で可                         |

- 変数名は NextAuth v5 の規約（`AUTH_*`）に合わせる。`NEXTAUTH_*` / `OAUTH_*` では読まれない（#490 / #516）
- GitHub / Google のプロバイダは `AUTH_GITHUB_ID` などを自動で読む（`src/external/auth/config.ts`）
- `JWT_SECRET` / `DIRECT_URL` はコードから参照されていないため登録不要
- URL は末尾スラッシュなしで `https://xxx.vercel.app` の形で入れる

---

## Step 4: GitHub Secrets に登録

### Vercel の ID を調べる

ダッシュボードで探すより、CLI でリンクして確認するのが確実。

```bash
npx vercel login
npx vercel link   # stg プロジェクトを選択
cat .vercel/project.json   # orgId と projectId が出る
rm -rf .vercel
npx vercel link   # 本番プロジェクトを選択して同様に確認
cat .vercel/project.json
rm -rf .vercel
```

> `.vercel/` は `.gitignore` 対象。コミットしないこと。

トークンは stg 用・本番用に分けて **Account Settings > Tokens** で発行する（スコープは対象のチームに限定）。

### 登録する Secrets

リポジトリの **Settings > Secrets and variables > Actions** に登録する。

| シークレット名              | 内容                                |
| --------------------------- | ----------------------------------- |
| `VERCEL_STG_TOKEN`          | stg 用の Vercel アクセストークン    |
| `VERCEL_PROD_TOKEN`         | 本番用の Vercel アクセストークン    |
| `VERCEL_ORG_ID`             | `.vercel/project.json` の `orgId`   |
| `VERCEL_STG_PROJECT_ID`     | stg プロジェクトの `projectId`      |
| `VERCEL_PROD_PROJECT_ID`    | 本番プロジェクトの `projectId`      |
| `STG_MIGRATE_DATABASE_URL`  | Neon `staging` の **Direct** URL    |
| `PROD_MIGRATE_DATABASE_URL` | Neon `production` の **Direct** URL |

アプリ用の環境変数（`AUTH_*` など）は Vercel 側にあるので、GitHub Secrets には入れない。

---

## Step 5: OAuth のコールバック URL を登録

stg・本番それぞれの OAuth App / クライアントに登録する。

| プロバイダ | 登録する URL                                  |
| ---------- | --------------------------------------------- |
| GitHub     | `https://<ドメイン>/api/auth/callback/github` |
| Google     | `https://<ドメイン>/api/auth/callback/google` |

- GitHub OAuth App は 1 つにつきコールバック URL が 1 つなので、stg と本番で App を分ける
- Google は「承認済みのリダイレクト URI」に追加する（同一クライアントに複数登録も可能だが、環境ごとに分けるのを推奨）

---

## Step 6: GitHub Actions ワークフロー

| ファイル                               | トリガー                            | デプロイ先       |
| -------------------------------------- | ----------------------------------- | ---------------- |
| `.github/workflows/deploy-staging.yml` | master の CI 成功（`workflow_run`） | stg プロジェクト |
| `.github/workflows/deploy-prod.yml`    | GitHub Release の公開               | 本番プロジェクト |

どちらも次の順で実行する。

1. `vercel pull --environment=production` … Vercel の環境変数とプロジェクト設定を取得
2. `vercel build --prod` … ランナー上でビルド（`vercel.json` の `buildCommand` で `prisma generate` も実行）
3. `npm ci` → `npx prisma migrate deploy` … **ビルドが通った場合のみ** DB をマイグレーション
4. `vercel deploy --prebuilt --prod` … ビルド済みの成果物をデプロイ

- 本番は draft / prerelease の Release では動かない
- `concurrency` で同じ環境へのデプロイは直列化している（実行中のデプロイはキャンセルしない）

---

## Step 7: 初回デプロイと確認

1. Step 1〜5 がすべて終わってから PR をマージする（Secrets が無い状態でマージすると Deploy Staging が失敗する）
2. **Actions > Deploy Staging** が success になることを確認する
3. stg の URL で QA する
   - [ ] トップページが表示される
   - [ ] GitHub / Google でログイン・ログアウトできる
   - [ ] 記事の作成・編集・削除ができる
   - [ ] 画像アップロードができる（Cloudinary）
   - [ ] メール送信が届く（Gmail）
4. 問題なければ Release を作成して本番へデプロイする

   ```bash
   gh release create v1.0.0 --target master --generate-notes
   ```

5. **Actions > Deploy Production** が success になったら、本番でも 3. と同じ確認を行う

---

## 運用

### ロールバック

Vercel ダッシュボードの **Deployments** から直前のデプロイを選び **Promote to Production**（Instant Rollback）する。
ただし **DB マイグレーションは戻らない**。破壊的なスキーマ変更（カラム削除・リネーム）は、旧コードでも動くように段階的にリリースする。

### マイグレーションを手動で流す（緊急時）

```bash
DATABASE_URL="<Neon の Direct URL>" npx prisma migrate deploy
```

ローカルの `.env` より、コマンドの前に書いた `DATABASE_URL` が優先される。本番 DB に向けるときは URL の取り違えに注意する。

### よくある失敗

| 症状                                   | 原因・対処                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| Deploy が `Project not found`          | `VERCEL_ORG_ID` / `VERCEL_*_PROJECT_ID` の取り違え。`.vercel/project.json` で再確認 |
| OAuth ログインで `redirect_uri` エラー | Step 5 のコールバック URL 未登録、または `AUTH_URL` がドメインと不一致              |
| ログイン後 `Configuration` エラー      | `AUTH_SECRET` 未設定、または変数名が `NEXTAUTH_*` のまま                            |
| `migrate deploy` が失敗・タイムアウト  | `*_MIGRATE_DATABASE_URL` に Pooled URL を入れている。Direct URL に変える            |
| ページ表示が遅い                       | Vercel Functions のリージョンと Neon のリージョンが離れている（Step 2）             |

---

## 費用

| サービス       | 無料枠                                                  |
| -------------- | ------------------------------------------------------- |
| Vercel         | Hobby プラン（**個人・非商用のみ**。商用は Pro が必要） |
| Neon           | Free プラン（ストレージ・コンピュート時間に上限あり）   |
| GitHub Actions | パブリックリポジトリは無料、プライベートは無料枠あり    |

無料枠の上限値は変更されることがあるため、各サービスの料金ページで最新を確認する。
