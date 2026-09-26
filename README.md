# Next Article Share App

<!-- markdownlint-disable MD033 -->

<img
  width="1437"
  height="787"
  alt="スクリーンショット 2025-10-29 14 47 02"
  src="https://github.com/user-attachments/assets/0fa79583-cfab-4d44-a4e7-d3deac320715"
/>

<!-- markdownlint-enable MD033 -->

## 詳しい詳細はこちら

- [Next.jsのApp Routerを用いてテックブログの共有アプリを作成(現場での運用を見据えた技術構成と設計)](https://qiita.com/Hashimoto-Noriaki/items/caac04a808c8ec4b2a0d)

## 設計

- [AI駆動開発においてNext.jsのAppRouterの最適な設計方針](https://qiita.com/Hashimoto-Noriaki/private/b2ada6ca9e3c98c512ef)

### ディレクトリ構成

`app/` はルーティングの定義だけにして薄く保ち、ロジックは `features/`、共通部品は `shared/`、外部との I/O は `external/` に分離しています。

```bash
src/
├─ app/           # App Router: ルート・レイアウト・メタデータ（薄く保つ）
├─ features/      # 専属ロジック、ドメインごとの機能群
├─ shared/        # 共通UI・レイアウト・providerなど(アプリ全体で使うもの)
└─ external/      # 外部接続（auth, dto, handler, service, repository など）
```

### レイヤーと責務

| レイヤー                        | 責務                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `app/`                          | ルーティング定義のみ。features の server テンプレートか client コンテナを呼ぶ    |
| `features/*/components/server/` | ページ単位のテンプレート。`auth()` / query handler でデータを取得し props で渡す |
| `features/*/components/client/` | ページ専用の Client コンテナ（フォームなど）                                     |
| `features/*/hooks/`             | TanStack Query・状態管理。Server Actions を呼ぶ                                  |
| `features/*/actions/`           | Server Actions。セッション検証して handler を呼ぶだけの薄いラッパー              |
| `external/handler/`             | features 層からの入口。入力検証（Zod）・認可（所有者チェック）                   |
| `external/service/`             | 複数 handler で共有するビジネスロジック                                          |
| `external/repository/`          | DB アクセス（Prisma）                                                            |
| `external/dto/`                 | Zod スキーマと入力型。クライアントのフォームとサーバーで共有する                 |

### 依存の方向

```txt
components/client, hooks → features/*/actions → external/handler → external/service → external/repository
components/server        → external/handler（query）

app/ → features/ → shared/
```

- `external/repository` は `external/` 内からのみ import する
- `shared/` は `features/` に依存しない
- 依存方向の一部は ESLint カスタムルール（`src/eslint-local-rules/`）で強制している

詳細: [docs/architecture/architecture.md](docs/architecture/architecture.md)

## ハーネスエンジニアリング（品質の自動化）

「人が守るルール」ではなく「仕組みが守るルール」として、フェーズごとに自動チェックを配置しています。

| レイヤー       | ツール                                                                 | タイミング                |
| -------------- | ---------------------------------------------------------------------- | ------------------------- |
| 開発中         | CLAUDE.md + `.claude/rules/` + スキル + サブエージェント               | コードを書くとき          |
| コマンド実行時 | `.claude/settings.json`（権限）+ hooks（`guard.sh`）                   | Claude がツールを使うとき |
| コミット前     | ESLint カスタムルール（層の依存方向・`'use client'`）                  | CI / save 時              |
| PR 時          | Claude Code Review（GitHub Actions・自動）+ CodeRabbit（手動トリガー） | PR 作成・更新時           |
| PR / Issue     | Claude Code（`@claude` メンション）                                    | 必要なとき                |

### rules（Claude が参照する規約）

| ファイル                        | 内容                                                              |
| ------------------------------- | ----------------------------------------------------------------- |
| `.claude/rules/architecture.md` | レイヤーの責務・依存方向・`app/` を薄く保つ・handler の責務・命名 |
| `.claude/rules/frontend.md`     | コンポーネント設計・`'use client'` の基準・スタイリング・import   |
| `.claude/rules/testing.md`      | テストの命名・書き方・モック・カバレッジ方針                      |
| `.claude/rules/git.md`          | ブランチ命名・コミットメッセージ・PR のルール                     |

Prettier / ESLint で担保できることは rules に書かず、ツールで検出できない規約だけを置いています。`architecture.md` / `frontend.md` は `paths` 指定で `src/` のコードを触るときだけ読み込まれます。

### Claude Code Actions（GitHub Actions）

| ワークフロー                               | 動作                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `.github/workflows/claude-code-review.yml` | PR の作成・更新時に自動でコードレビューし、インラインコメントを投稿    |
| `.github/workflows/claude.yml`             | Issue / PR のコメントで `@claude` とメンションすると Claude が対応する |

Claude Code Review は公式の `code-review` プラグインで動いており、バグと CLAUDE.md への準拠を確信度の高いものに絞って指摘します（`.claude/rules/` は参照しません）。

CodeRabbit はリポジトリのスター数が少ないため自動レビューの対象外となっており、PR の CodeRabbit コメントにある「Trigger review」から手動で実行します。

### スキル

`/smart-commit`（コミット）・`/pr-description`（PR 説明文）・`/create-issue`（Issue 作成）・`/test`（lint・型チェック・テスト）をプロジェクト規約に沿って実行できます。

### settings.json（Claude の権限）

`.claude/settings.json` で、Claude Code が確認なしで実行できるコマンドと、実行を禁止するコマンドを決めています。

| 設定                | 内容                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------- |
| `permissions.allow` | スキルに必要なコマンドだけを許可（`npm run lint` / `gh pr view` / `git commit` など） |
| `permissions.deny`  | 強制プッシュ・`git reset --hard`・`git clean -f`・`rm -rf`・`.env` の読み書きを禁止   |
| `hooks`             | Bash を実行する前に `.claude/hooks/guard.sh` を呼び出す                               |

### hooks（コマンド実行前のガード）

`.claude/hooks/guard.sh` は PreToolUse フックで、Claude が Bash コマンドを実行する前に内容をチェックし、本番環境への操作をブロックします。

- `production` / `prod` を含むコマンドをブロックする（大文字小文字は区別しない。`--prod`・`prod_us`・`DATABASE_URL_PROD` なども対象、`product` は対象外）
- ブロックした理由は stderr に出し、Claude に伝わるようにする
- 読み取り専用のコマンド（`grep`・`cat`・`git log` など）、`git commit`、一部の `gh` コマンドは、単体で実行する場合だけチェックを省く
- `&&` `;` `|` `$(` やリダイレクト・改行を含むコマンドは、チェックを省かない（`git commit -m x; <本番操作>` のようなすり抜けを防ぐ）

`permissions.deny` はコマンドの形で禁止するのに対し、hooks はコマンドの中身を見て判定できます。

### agents（サブエージェント）

`.claude/agents/` に、観点ごとのレビュー専用サブエージェントを置いています。どれもコードを読むだけで変更はせず、`ファイルパス:行番号 [Critical/Warning/Suggestion] 指摘内容` の形式で指摘を返します。

| エージェント          | 見る観点                                                                  | 使えるツール              |
| --------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `code-review`         | バグ・論理エラー、明らかな認証漏れ、可読性、テスト                        | Read / Grep / Glob        |
| `security-review`     | 認証・認可（IDOR）・入力検証・インジェクション・機密情報の露出            | Read / Grep / Glob / Bash |
| `architecture-review` | レイヤーの責務・依存の方向・ファイルの置き場所（`.claude/rules/` が基準） | Read / Grep / Glob        |

「セキュリティチェックして」「設計を見て」のように頼むと、Claude が内容に合ったエージェントを呼び出します。

詳細: [docs/ai/ai-review.md](docs/ai/ai-review.md)

## GitHub Flow を採用

`master` から作業ブランチを切り、PR + CI を通して `master` にマージします。`master` へのマージでステージング、GitHub Release の公開で本番へデプロイします。

詳細: [docs/git/branch-strategy.md](docs/git/branch-strategy.md)

## 技術構成

- TypeScript
- React
- Next.js(AppRouter)
- Tailwind
- CSS Modules
- Shadcn/ui
- React-Hook-Form
- Zod
- NextAuth.js
- OAuth(GoogleとGitHub)
- TanstackQuery
- StoryBook
- Jest
- Testing Library
- PlayWright
- Docker(マルチステージビルド)
- GitHubActions
- Claude Code Actions
- Dependabot
- Prisma
- Swagger
- Supabase
- ESLint Prettier
- SAST(Semgrep)
- cloudinary
- nodemailer
- Gmail SMTP
- Vercel
- GCP(予定)
- Sentry(予定)

## 使用したAI

- Claude Code
- ChatGPT
- PlayWright MCP
- CodeRabbit

## サプライチェーン攻撃の対策

| 対策                                   | ツール・設定        | 内容                                                                          |
| -------------------------------------- | ------------------- | ----------------------------------------------------------------------------- |
| lockfile の厳格適用                    | `npm ci`            | lockfile と一致しない場合はインストールを失敗させる                           |
| 依存パッケージの自動更新               | Dependabot          | 毎週月曜に更新 PR を自動作成                                                  |
| バージョン更新のクールダウン           | Dependabot cooldown | 公開直後の悪意あるバージョンを避ける（patch: 3日 / minor: 7日 / major: 14日） |
| マルウェア・タイポスクワッティング検知 | Socket.dev          | PR 時に依存パッケージを自動スキャン                                           |

詳細: [docs/infra/supply-chain-security.md](docs/infra/supply-chain-security.md)

## SAST（静的アプリケーションセキュリティテスト）

| 対策                     | ツール・設定  | 内容                                       |
| ------------------------ | ------------- | ------------------------------------------ |
| コードの静的解析         | Semgrep       | PR・push時に自動スキャン                   |
| ローカルでの手動スキャン | `semgrep` CLI | `npm run scan:sast` でいつでも手元実行可能 |

詳細: [docs/infra/sast.md](docs/infra/sast.md)

## デプロイ

| 環境             | デプロイ先         | 内容                                   |
| ---------------- | ------------------ | -------------------------------------- |
| 本番             | Vercel             | `master` マージで自動デプロイ          |
| ステージング     | Vercel（構築予定） | リリース前検証用環境                   |
| 将来的な移行検討 | GCP Cloud Run      | Dockerfile（マルチステージ）を活用予定 |

詳細: [docs/infra/deployment.md](docs/infra/deployment.md)

## エラーモニタリング（Sentry）

`@sentry/nextjs` は未導入。開発は大枠完了しており、e2e テストを拡充しつつ、本番デプロイ前に導入予定。

詳細: [docs/infra/sentry.md](docs/infra/sentry.md)

## 機能一覧

- ユーザーの新規登録
- ログイン
- ログイン(GoogleとGitHub)
- ログアウト
- パスワードリセット
- ユーザー詳細
- ユーザー編集
- ユーザー退会
- 記事の新規作成
- 記事の詳細
- 記事の編集
- 記事の削除
- 下書き作成
- 下書き詳細
- 下書き編集
- 下書き削除
- いいね
- コメント
- ストック
- 検索
- 通知
- 画像アップロード

## サーバー起動

```bash
npm run dev
```

### Prisma Studio

```bash
npx prisma studio
```

### ESLintとPrettier

- ESLint

```bash
npm run lint
```

- Prettier

```bash
npm run format
```

### 型チェック

```bash
npm run type-check
```

### SAST（Semgrep）

```bash
npm run scan:sast
```

ローカル実行には [Semgrep CLI](https://semgrep.dev/docs/getting-started/) のインストールが必要（`pip install semgrep` または `brew install semgrep`）。

### テスト

```bash
npm run test
```

```bash
npx playwright test
```

### StoryBook起動

```bash
npm run storybook
```

### StoryBookのビルド

```bash
npm run build-storybook
```

![スクリーンショット 2026-01-28 5 02 59](https://github.com/user-attachments/assets/14971429-0f75-47da-bb14-b66409dc84d2)

詳細: [docs/ui/storybook.md](docs/ui/storybook.md)

### Storybook バージョンアップ対策

Dependabot により、毎週月曜に `@storybook/*` 関連パッケージの更新 PR が自動作成されます。

## このプロジェクトを Next.js App Router へリプレイス

- [元プロジェクト（Article Share App）](https://github.com/Hashimoto-Noriaki/Article-Share-App)

## NextAuth.js

- [公式ドキュメント](https://next-auth.js.org/getting-started/example)

## Docker

```bash
# 1. DB だけ起動
docker compose up db -d

# 2. アプリはローカルで起動
npm run dev

# 3. 終わるとき
docker compose down
```

## Swagger起動

```bash
http://localhost:3000/api-docs
```

詳細: [docs/api/swagger.md](docs/api/swagger.md)

## 各画面構成

詳細: [docs/ui/screens.md](docs/ui/screens.md)

- トップ画面

![スクリーンショット 2026-01-20 10.43.57.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/c68853d2-d274-471f-bc35-829fdd9f9456.png)

- 記事一覧画面

![スクリーンショット 2026-02-02 0.57.53.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/1361aa7b-eee8-4416-bbfd-1a0c8ba788f9.png)
