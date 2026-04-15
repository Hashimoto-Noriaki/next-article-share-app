# Prisma

バージョン確認

```bash
npx prisma --version
```

ダウングレード

```bash
npm install prisma@6 @prisma/client@6
```

## Prisma 運用コマンド集

本ドキュメントは、本プロジェクトで **Prisma を安全かつ一貫して運用するためのコマンド一覧**をまとめたものです。

対象：

- Prisma 初期導入
- マイグレーション作成・実行
- schema 変更時の運用
- バージョンアップ対応

---

## 前提

- Node.js / npm を使用
- Prisma はアプリケーション内 ORM として利用
- データベースは Prisma が対応する RDB（PostgreSQL / MySQL / SQLite 等）

---

## 1. Prisma の初期セットアップ

### Prisma のインストール

```bash
npm install prisma --save-dev
npm install @prisma/client
```

- `prisma`：CLI（開発用）
- `@prisma/client`：アプリケーションから利用する ORM

---

### Prisma 初期化

```bash
npx prisma init
```

実行されること：

- `prisma/schema.prisma` が作成される
- `.env` に `DATABASE_URL` が追加される

---

## 2. schema.prisma の編集

- モデル定義
- リレーション定義
- enum 定義
- datasource / generator 設定

※ schema.prisma を変更したら、**必ず次のステップ（マイグレーション or push）を行う**

---

## 3. マイグレーションの作成（基本）

### 開発環境での通常フロー（推奨）

```bash
npx prisma migrate dev --name <migration_name>
```

例：

```bash
npx prisma migrate dev --name add_user_table
```

行われること：

- マイグレーションファイルの生成
- データベースへの反映
- Prisma Client の自動生成

---

## 4. Prisma Client の生成（単体）

```bash
npx prisma generate
```

使用ケース：

- schema.prisma を変更したが DB は変更しない場合
- CI / build 時

---

## 5. 既存DBに合わせる（migrate を使わない場合）

### DBに schema を直接同期する

```bash
npx prisma db push
```

注意点：

- マイグレーション履歴は作られない
- プロトタイプ / 個人開発 / 初期段階向け

---

## 6. マイグレーションの確認・管理

### マイグレーション状態の確認

```bash
npx prisma migrate status
```

---

### 適用済みマイグレーションの確認

```bash
npx prisma migrate resolve
```

※ 手動で DB を変更した場合などに使用

---

## 7. 本番環境でのマイグレーション

```bash
npx prisma migrate deploy
```

用途：

- 本番 / ステージング環境
- CI/CD 内

特徴：

- 新規マイグレーションのみ適用
- schema の変更は行わない

---

## 8. データベースのリセット（⚠️開発専用）

```bash
npx prisma migrate reset
```

行われること：

- DB を削除
- 全マイグレーションを再実行
- 初期データの再投入（設定されていれば）

⚠️ 本番環境では使用禁止

---

## 9. Prisma Studio（GUI）

```bash
npx prisma studio
```

用途：

- データの確認
- 簡易編集
- デバッグ

---

## 10. Prisma のバージョンアップ

### 最新版へ更新

```bash
npm update prisma @prisma/client
```

または

```bash
npm install prisma@latest @prisma/client@latest
```

---

### バージョン確認

```bash
npx prisma -v
```

---

## 11. schema 変更時の基本ルール

- schema.prisma を変更したら必ず差分を意識する
- 開発環境：`migrate dev`
- 本番環境：`migrate deploy`
- DB を直接触ったら、Prisma 側の整合性を必ず確認する

---

## 12. 推奨フローまとめ

### 開発時

1. schema.prisma 編集
2. `prisma migrate dev`
3. 動作確認

### 本番反映時

1. マイグレーションを commit
2. デプロイ
3. `prisma migrate deploy`

---

## スタンス

- Prisma は「schema を正」とする
- DB を直接操作するのは最終手段
- マイグレーションは履歴として必ず残す

---

※ 本ドキュメントは Prisma 運用のベースラインであり、
※ プロジェクト方針に応じて拡張・調整すること
