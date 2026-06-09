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
└─ external/      # 外部接続（dto, handler, service, repository, client）
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
- Dependabot
- Prisma
- Swagger
- Supabase
- ESLint Prettier
- cloudinary
- nodemailer
- Gmail SMTP
- GCP(予定)

## 使用したAI

- Claude Code
- TAKT
- ChatGPT
- PlayWright MCP
- CodeRabbit

### ハーネスエンジニアリング（品質の自動化）

「人が守るルール」ではなく「仕組みが守るルール」として、フェーズごとに自動チェックを配置しています。

| レイヤー     | ツール                       | タイミング               |
| ------------ | ---------------------------- | ------------------------ |
| 開発中       | CLAUDE.md + `.claude/rules/` | コードを書くとき         |
| タスク実行時 | TAKT ワークフロー            | 実装・レビュー・修正全体 |
| コミット前   | ESLint カスタムルール        | CI / save 時             |
| PR 時        | CodeRabbit + `/code-review`  | マージ前                 |

CodeRabbit はマージ前に自動でバグ・セキュリティ・可読性をチェックします。Claude Code のスキル（`/code-review` `/smart-commit` `/test` など）はプロジェクト固有のルールに基づいた操作を手動で実行するときに使います。

詳細: [docs/ai/ai-review.md](docs/ai/ai-review.md)

### TAKT — AIエージェントワークフロー管理

「AIに実装させるだけ」から「開発プロセス全体をAIに実行させる」へ。  
TAKT はワークフローを YAML で定義し、plan・実装・レビュー・修正・最終承認の一連の工程を AI エージェントに強制実行させます。

```text
plan → write_tests → implement → ai-antipattern-review（ループ）→ 並列レビュー → supervise → COMPLETE
```

主なワークフロー:

- **default.yaml** — 汎用（plan → テスト → 実装 → 並列レビュー）
- **frontend.yaml** — フロントエンド向け拡張（11ステップ、ループ監視・並列レビュー付き）

```bash
# インタラクティブ起動
takt

# ワークフローとタスクを直接指定
takt --workflow frontend --task "記事一覧のページネーション実装"
```

詳細: [docs/ai/takt.md](docs/ai/takt.md)

## サプライチェーン攻撃の対策

| 対策                                   | ツール・設定        | 内容                                                                          |
| -------------------------------------- | ------------------- | ----------------------------------------------------------------------------- |
| lockfile の厳格適用                    | `npm ci`            | lockfile と一致しない場合はインストールを失敗させる                           |
| 依存パッケージの自動更新               | Dependabot          | 毎週月曜に更新 PR を自動作成                                                  |
| バージョン更新のクールダウン           | Dependabot cooldown | 公開直後の悪意あるバージョンを避ける（patch: 3日 / minor: 7日 / major: 14日） |
| マルウェア・タイポスクワッティング検知 | Socket.dev          | PR 時に依存パッケージを自動スキャン                                           |

詳細: [docs/infra/supply-chain-security.md](docs/infra/supply-chain-security.md)

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
