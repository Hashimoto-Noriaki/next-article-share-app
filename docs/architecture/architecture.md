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
│   ├── server/   # Server Components（PageTemplate）
│   └── client/   # Container / Presenter
├── hooks/        # TanStack Query
├── queries/      # QueryKey + DTOヘルパー
├── actions/      # Server Actions（薄いラッパー）
└── types/        # 型定義
```

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
├── dto/          # Zodスキーマ + 型
├── handler/      # features層からの入口
├── service/      # ビジネスロジック
├── repository/   # DBアクセス（PrismaやDrizzleなど）
└── client/       # 外部APIクライアント
```

## サービスの成長に強いフロントエンドの設計方針

![サービス成長の設計方針](../image.png)
