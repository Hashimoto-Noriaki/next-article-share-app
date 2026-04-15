# CI/CD ドキュメント

## 参考リンク

- https://zenn.dev/takaya39/articles/8f6b58cc6124d4
- https://docs.github.com/ja/actions/get-started/quickstart

## ビルドについて

| デプロイ先 | ビルドする場所                |
| ---------- | ----------------------------- |
| Vercel     | Vercel 側で自動ビルド         |
| Cloud Run  | Cloud Build または Dockerfile |

→ **どちらも CI でビルド不要**

## CI と CD の違い

### 1. CI（継続的インテグレーション）

PR をマージする前に問題を検出

### 2. CD（継続的デプロイ）

master にマージ → 自動でデプロイ

Vercel / Cloud Run を使うなら、GitHub 連携で自動化されるので GitHub Actions 不要。

### 3. その他の自動化

| 用途     | 例                         |
| -------- | -------------------------- |
| 定期実行 | 毎日テスト実行             |
| リリース | タグを打ったら自動リリース |
| 通知     | Slack に結果を通知         |

## このプロジェクトの設定

- ✅ CI（品質チェック）→ GitHub Actions
- ✅ CD（デプロイ）→ Vercel or Cloud Run に任せる

**GitHub Actions = PR の品質を守る門番**

マージ前に「lint / format / type / test」が通らないとマージできない設定にする。
