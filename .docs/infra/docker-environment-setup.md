## Docker 環境構築メモ

### ファイル構成

```
project/
├── docker-compose.yml   # DB + アプリ起動設定
├── Dockerfile           # マルチステージビルド
├── .dockerignore        # 不要ファイル除外
└── .env.example         # 環境変数テンプレート
```

---

## 普段の開発フロー

```bash
# 1. DB だけ起動
docker compose up db -d

# 2. アプリはローカルで起動
npm run dev

# 3. 終わるとき
docker compose down
```

---

## コマンド一覧

| コマンド                  | 用途                                                                    |
| ------------------------- | ----------------------------------------------------------------------- |
| `docker compose up db -d` | DB のみ起動（普段の開発）                                               |
| `docker compose up -d`    | DB + アプリ起動（正確に言うと：本番に近い環境をローカルでテストする用） |
| `docker compose down`     | 停止                                                                    |
| `docker compose logs -f`  | ログ確認                                                                |
| `docker compose ps`       | 状態確認                                                                |

---

## 環境変数

### ローカル開発（Docker DB 使用時）

```dotenv
DATABASE_URL="postgresql://postgres:password@localhost:5432/techblog"
JWT_SECRET="your-secret-key"
```

### 本番（Supabase 使用時）

```dotenv
DATABASE_URL="postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres"
JWT_SECRET="your-secret-key"
```

---

## docker-compose.yml の構成

### db サービス

- PostgreSQL 15 (Alpine)
- ポート: 5432
- ボリューム: postgres_data（永続化）
- ヘルスチェック付き

### app サービス（オプション）

- マルチステージビルド
- ポート: 3000
- ホットリロード対応
- 普段は使わなくてOK

---

## Dockerfile の構成（マルチステージ）

```
base        → 共通設定（Node 20 Alpine）
  ↓
deps        → 依存関係インストール
  ↓
development → 開発環境（npm run dev）
  ↓
builder     → 本番ビルド
  ↓
production  → 本番環境（軽量イメージ）
```

### 本番用ビルド（将来使う場合）

```bash
docker build --target production -t techblog:latest .
```

---

## トラブルシューティング

### ポート競合エラー

```
Error: bind: address already in use
```

解決策:

```bash
# 使用中のプロセス確認
lsof -i :3000

# Docker 停止して再起動
docker compose down
docker compose up db -d
```

### npm ci エラー

→ Dockerfile で `npm install` を使用（互換性のため）

---

## 注意点

1. `.env` は Git にコミットしない
2. `.env.example` はコミットしてOK
3. 本番は Vercel デプロイなので Docker 不要(Cloud Run検討)
4. Docker は開発用 DB + 検証用として利用
