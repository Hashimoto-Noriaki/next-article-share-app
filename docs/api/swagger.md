# Swagger

## 起動

```bash
http://localhost:3000/api-docs
```

## ファイル構成

```
project-root/
├── docs/
│   └── api/
│       └── openapi.yaml      ← API仕様（YAML）
├── src/
│   ├── app/
│   │   └── api-docs/
│   │       ├── page.tsx      ← ページ
│   │       └── SwaggerUI.tsx ← Client Component
│   └── lib/
│       └── swagger.ts        ← YAML読み込み
```

## 画面

![スクリーンショット 2026-02-02 1.34.47.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/2bd7cc0c-656f-4ab7-a403-1d4a80306361.png)

![スクリーンショット 2026-02-02 1.35.02.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/cc38beb9-a5d5-4f72-8c31-497df8cbf1d4.png)

![スクリーンショット 2026-02-02 1.35.17.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/0ec95660-c6b1-4107-9368-07348acbbfc0.png)

![スクリーンショット 2026-02-02 1.35.32.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/1748789/eebc5c5d-e89b-4cc7-9fa6-6496b1258980.png)
