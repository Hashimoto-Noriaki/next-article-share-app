# デプロイ・インフラ構成

本ドキュメントでは、本プロジェクトのステージング・本番のデプロイ方針と、将来的な GCP Cloud Run への移行検討についてまとめる。

CI/CD の全体像は [docs/infra/ci-cd.md](./ci-cd.md) を参照。

---

## 1. ステージング・本番環境: Vercel へのデプロイ

構築手順・運用は [vercel-deploy.md](./vercel-deploy.md) を参照。

- stg と本番は Vercel の **別プロジェクト**。どちらも Production（固定ドメイン）としてデプロイする
- デプロイは GitHub Actions から Vercel CLI で行う。Vercel の Git 連携による自動デプロイは `vercel.json` で無効化している
- DB は Neon（`production` ブランチ＝本番、`staging` ブランチ＝stg）。マイグレーションはデプロイ前にワークフローで実行する

| 項目           | stg                                    | 本番                                |
| -------------- | -------------------------------------- | ----------------------------------- |
| トリガー       | master の CI 成功                      | GitHub Release の公開               |
| ワークフロー   | `.github/workflows/deploy-staging.yml` | `.github/workflows/deploy-prod.yml` |
| ビルド         | GitHub Actions 上で `vercel build`     | 同左                                |
| DB             | Neon `staging` ブランチ                | Neon `production` ブランチ          |
| 環境変数の管理 | Vercel Project Settings（Env Vars）    | 同左                                |

---

## 2. ステージング環境の残課題

- ステージングの Basic 認証など、外部に見せない仕組みの要否（Hobby プランでは Production デプロイにパスワード保護をかけられない）
- Sentry など監視系ツールをステージングにも導入するか（Sentry は現状未導入、導入時期は本番デプロイ前を予定）
- Cloudinary は stg・本番で共通にしている。誤混入が問題になればフォルダ/プリセットを分ける

---

## 3. GCP Cloud Run への移行検討

現状は Vercel での運用を継続しつつ、将来的な選択肢として GCP Cloud Run への移行を検討する。

### 移行を検討する背景

- インフラを GCP に統一したい場合のコスト・運用の一元化
- Vercel の従量課金・関数実行時間制限などの制約を回避したい場合
- Dockerfile が既にマルチステージビルド構成になっており、Cloud Run へのデプロイに転用しやすい（[docs/infra/docker-environment-setup.md](./docker-environment-setup.md) 参照）

### Vercel と Cloud Run の比較

| 観点               | Vercel                                      | Cloud Run                                                        |
| ------------------ | ------------------------------------------- | ---------------------------------------------------------------- |
| ビルド             | Vercel 側で自動ビルド                       | Cloud Build または Dockerfile から自前ビルド                     |
| デプロイ           | GitHub 連携で自動                           | Cloud Build トリガー or GitHub Actions で構築が必要              |
| Next.js との親和性 | 高い（App Router / ISR などをフルサポート） | コンテナ化すれば動作するが、Next.js 特有の最適化は自前対応が必要 |
| 料金体系           | 従量課金（関数実行・帯域など）              | 従量課金（CPU/メモリ使用量ベース、スケールtoゼロ可）             |
| 既存資産の活用     | 現状そのまま                                | 既存の Dockerfile（マルチステージ）を流用可能                    |

### 移行時の主な考慮点

- 環境変数・シークレットの移行（Vercel → GCP Secret Manager 等）
- 画像最適化など Vercel 固有機能（`next/image` の Vercel 最適化等）の代替手段の検討
- カスタムドメイン・SSL 証明書の再設定
- DB（Neon）は GCP 移行後も継続利用可能なため、DB 移行は必須ではない

### 現時点のステータス

- 未着手・検討段階（README の技術構成にも `GCP(予定)` として記載）
- 本番運用は当面 Vercel を継続し、必要に応じて段階的に検討する
