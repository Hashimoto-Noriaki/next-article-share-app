# Next Article Share App

エンジニアが技術記事を投稿・共有できるテックブログ共有アプリです。[元プロジェクト（Article Share App）](https://github.com/Hashimoto-Noriaki/Article-Share-App)を Next.js App Router でリプレイスし、現場での運用を見据えた設計と、AI 駆動開発を前提にした品質の仕組みづくりに取り組んでいます。

<!-- markdownlint-disable MD033 -->

<img
  width="1437"
  height="787"
  alt="スクリーンショット 2025-10-29 14 47 02"
  src="https://github.com/user-attachments/assets/0fa79583-cfab-4d44-a4e7-d3deac320715"
/>

<!-- markdownlint-enable MD033 -->

## 関連記事（Qiita）

- [Next.jsのApp Routerを用いてテックブログの共有アプリを作成(現場での運用を見据えた技術構成と設計)](https://qiita.com/Hashimoto-Noriaki/items/caac04a808c8ec4b2a0d)

## 設計

`app/` はルーティングだけに薄く保ち、ロジック・共通部品・外部との I/O を分離しています。

```bash
src/
├─ app/        # ルーティングのみ（薄く保つ）
├─ features/   # 機能ごとのロジック（components / hooks / actions）
├─ shared/     # アプリ全体で使う共通 UI・hooks
└─ external/   # 外部との I/O（handler → service → repository、dto）
```

- 依存は `features → external/handler → service → repository` の一方向
- 入力検証（Zod）と認可（所有者チェック）は `external/handler` に集約
- 依存の方向は ESLint カスタムルールで強制し、AI が書いても層が崩れないようにしている

詳細: [docs/architecture/architecture.md](docs/architecture/architecture.md) / [Qiita: AI駆動開発においてNext.jsのAppRouterの最適な設計方針](https://qiita.com/Hashimoto-Noriaki/items/b2ada6ca9e3c98c512ef)

## ハーネスエンジニアリング（品質の自動化）

AI の出力を「人が守るルール」ではなく「仕組みが守るルール」で制御しています。

| フェーズ               | 仕組み                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 開発中（規約）         | CLAUDE.md・`.claude/rules/` でプロジェクトの規約を共有                                                              |
| 開発中（スキル）       | `.claude/skills/`：`/smart-commit`・`/pr-description`・`/create-issue`・`/test`                                     |
| 開発中（エージェント） | `.claude/agents/`：レビュー用（code / security / architecture）と Playwright Agents（planner / generator / healer） |
| コマンド実行時         | `settings.json` で権限を限定、hooks で本番環境への操作をブロック                                                    |
| CI                     | lint（層の依存方向を含む）・型チェック・Jest・Semgrep（E2E は予定）                                                 |
| 依存関係               | Dependabot（クールダウン付き）・Socket.dev                                                                          |
| PR                     | Claude Code Review（自動）・CodeRabbit・`@claude` メンション                                                        |
| リリース後             | ステージング環境・Sentry（予定）                                                                                    |

詳細: [docs/ai/ai-review.md](docs/ai/ai-review.md) / [docs/infra/ci-cd.md](docs/infra/ci-cd.md)

## Playwright Agents（E2E テストの作成・修正）

[Playwright Agents](https://playwright.dev/docs/test-agents) を Claude Code から使い、E2E テストの計画・生成・修正を自動化しています（`npx playwright init-agents --loop=claude` で導入）。

| エージェント                | 役割                                       | 出力先   |
| --------------------------- | ------------------------------------------ | -------- |
| `playwright-test-planner`   | アプリを実際に操作してテスト計画を作る     | `specs/` |
| `playwright-test-generator` | テスト計画をもとにテストコードを生成する   | `e2e/`   |
| `playwright-test-healer`    | 失敗したテストを実行・デバッグして修正する | `e2e/`   |

- ブラウザ操作は `.mcp.json` に登録した `playwright-test` MCP サーバー経由で行います
- planner と generator は、最初のページセットアップ（`planner_setup_page` / `generator_setup_page`）で `e2e/seed.spec.ts` を実行し、新規登録してログイン済みの状態から作業を始めます
- healer は seed を使わず、既存のテストを実行して失敗したものを調べます（各テストが自分でユーザーを登録するため）

詳細: [docs/test/test_strategy.md](docs/test/test_strategy.md)

## GitHub Flow を採用

`master` から作業ブランチを切り、PR + CI を通して `master` にマージします。現在は `master` へのマージで本番（Vercel）へデプロイしています。ステージング環境の構築後は、`master` へのマージでステージング、GitHub Release の公開で本番へデプロイする予定です。

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

## 機能一覧

| カテゴリ | 機能                                                                           |
| -------- | ------------------------------------------------------------------------------ |
| 認証     | 新規登録・ログイン（メール / Google / GitHub）・ログアウト・パスワードリセット |
| ユーザー | 詳細・編集・退会                                                               |
| 記事     | 作成・詳細・編集・削除・画像アップロード                                       |
| 下書き   | 作成・詳細・編集・削除                                                         |
| 交流     | いいね・コメント・ストック・通知                                               |
| 検索     | 記事の検索                                                                     |

## Storybook

### 起動

```bash
npm run storybook
```

### ビルド

```bash
npm run build-storybook
```

![スクリーンショット 2026-01-28 5 02 59](https://github.com/user-attachments/assets/14971429-0f75-47da-bb14-b66409dc84d2)

詳細: [docs/ui/storybook.md](docs/ui/storybook.md)

### バージョンアップ対策

Dependabot により、毎週月曜に `@storybook/*` 関連パッケージの更新 PR が自動作成されます。

## 各画面構成

詳細: [docs/ui/screens.md](docs/ui/screens.md)

- トップ画面

![スクリーンショット 2026-01-20 10.43.57.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/c68853d2-d274-471f-bc35-829fdd9f9456.png)

- 記事一覧画面

![スクリーンショット 2026-02-02 0.57.53.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/1361aa7b-eee8-4416-bbfd-1a0c8ba788f9.png)

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

## NextAuth.js

- [公式ドキュメント](https://next-auth.js.org/getting-started/example)

## Swagger起動

```bash
http://localhost:3000/api-docs
```

詳細: [docs/api/swagger.md](docs/api/swagger.md)

## Docker

```bash
# 1. DB だけ起動
docker compose up db -d

# 2. アプリはローカルで起動
npm run dev

# 3. 終わるとき
docker compose down
```

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

E2E は DB と dev サーバーを起動してから実行します。

```bash
# 1. DB だけ起動（DB が空なら npx prisma migrate dev でテーブルを作る）
docker compose up db -d

# 2. dev サーバーを起動
npm run dev

# 3. 別のターミナルで E2E を実行
npx playwright test
```
