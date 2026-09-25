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

### app/ — 薄く保つ

ルーティングの定義だけ（薄くする）

```bash
src/
├─ app/           # App Router: ルート・レイアウト・メタデータ（薄く保つ）
├─ features/      # 専属ロジック、ドメインごとの機能群
├─ shared/        # 共通UI・レイアウト・providerなど(アプリ全体で使うもの)
└─ external/      # 外部接続（auth, dto, handler, service, repository など）
```

詳細: [docs/architecture/architecture.md](docs/architecture/architecture.md)

## トランクベース開発を採用

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

### ハーネスエンジニアリング（品質の自動化）

「人が守るルール」ではなく「仕組みが守るルール」として、フェーズごとに自動チェックを配置しています。

| レイヤー   | ツール                                                | タイミング       |
| ---------- | ----------------------------------------------------- | ---------------- |
| 開発中     | CLAUDE.md + `.claude/rules/` + スキル                 | コードを書くとき |
| コミット前 | ESLint カスタムルール（層の依存方向・`'use client'`） | CI / save 時     |
| PR 時      | Claude Code Review（GitHub Actions）+ CodeRabbit      | PR 作成・更新時  |
| PR / Issue | Claude Code（`@claude` メンション）                   | 必要なとき       |

#### rules（Claude が参照する規約）

| ファイル                        | 内容                                                              |
| ------------------------------- | ----------------------------------------------------------------- |
| `.claude/rules/architecture.md` | レイヤーの責務・依存方向・`app/` を薄く保つ・handler の責務・命名 |
| `.claude/rules/frontend.md`     | コンポーネント設計・`'use client'` の基準・スタイリング・import   |
| `.claude/rules/testing.md`      | テストの命名・書き方・モック・カバレッジ方針                      |
| `.claude/rules/git.md`          | ブランチ命名・コミットメッセージ・PR のルール                     |

Prettier / ESLint で担保できることは rules に書かず、ツールで検出できない規約だけを置いています。`architecture.md` / `frontend.md` は `paths` 指定で `src/` のコードを触るときだけ読み込まれます。

#### Claude Code Actions（GitHub Actions）

| ワークフロー                               | 動作                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `.github/workflows/claude-code-review.yml` | PR の作成・更新時に自動でコードレビューし、インラインコメントを投稿    |
| `.github/workflows/claude.yml`             | Issue / PR のコメントで `@claude` とメンションすると Claude が対応する |

Claude Code Review はリポジトリの CLAUDE.md と `.claude/rules/` を参照するため、プロジェクト固有の設計ルールに沿ってレビューされます。

#### スキル

`/smart-commit`（コミット）・`/pr-description`（PR 説明文）・`/create-issue`（Issue 作成）・`/test`（lint・型チェック・テスト）をプロジェクト規約に沿って実行できます。

詳細: [docs/ai/ai-review.md](docs/ai/ai-review.md)

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
