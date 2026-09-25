# 設計方針

- [AI駆動開発においてNext.jsのAppRouterの最適な設計方針](https://qiita.com/Hashimoto-Noriaki/private/b2ada6ca9e3c98c512ef)

## ディレクトリ構成

### 1. app/ — 薄く保つ

ルーティングの定義だけ（薄くする）

```bash
src/
├─ app/           # App Router: ルート・レイアウト・メタデータ（薄く保つ）
├─ features/      # 専属ロジック、ドメインごとの機能群
├─ shared/        # 共通UI・レイアウト・providerなど(アプリ全体で使うもの)
└─ external/      # 外部接続（dto, handler, service, repository, client）
```

### 2. features/ — 司令塔

機能ごとのロジックと UI をまとめて、ドメインごとにディレクトリを切る

```bash
features/articles/
├── components/
│   ├── server/   # ページ単位のテンプレート（XxxPageTemplate）。auth() / handler でデータ取得
│   ├── client/   # server テンプレートから props を受け取るページ専用の Client コンテナ（フォームなど）
│   └── Xxx/      # 直下: 再利用可能な UI 部品（データ取得はしない）
├── hooks/        # TanStack Query（QueryKey は xxxKeys オブジェクトで管理）
├── actions/      # Server Actions（薄いラッパー）
└── types/        # 型定義
```

components / hooks / actions / types は機能に必要なものだけ置く。

### 3. shared/ — 共通

アプリ全体で横断的に使うものを置く場所

```bash
shared/
├── components/   # 再利用可能な UI コンポーネント
├── hooks/        # 共通カスタムフック
├── lib/          # ユーティリティ・バリデーション
├── providers/    # アプリ全体のコンテキストプロバイダー
└── types/        # 共通型定義
```

### 4. external/ — I/O専用

アプリの外側にある仕組みへのアクセスをまとめる層

```bash
external/
├── auth/         # NextAuth 設定・auth()
├── cloudinary/   # 画像アップロードクライアント
├── email/        # メール送信クライアント
├── dto/          # Zodスキーマ + 型（クライアントのフォームとサーバーで共有）
├── handler/      # features層からの入口（入力検証・認可）
├── service/      # 複数 handler で共有するビジネスロジック
└── repository/   # DBアクセス（Prisma）
```

### 依存の方向

```txt
components/client, hooks → features/*/actions → external/handler → external/service → external/repository
components/server        → external/handler（query）
```

一部は ESLint（`src/eslint-local-rules/`）で強制している。Claude Code 向けのルールは `.claude/rules/architecture.md` を参照。

## サービスの成長に強いフロントエンドの設計方針

![サービス成長の設計方針](../image.png)
