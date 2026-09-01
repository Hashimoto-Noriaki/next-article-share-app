# デプロイ・インフラ構成

本ドキュメントでは、本プロジェクトの本番デプロイ方針・ステージング環境の構築計画・将来的な GCP Cloud Run への移行検討についてまとめる。

CI/CD の全体像は [docs/infra/ci-cd.md](./ci-cd.md) を参照。

---

## 1. 本番環境: Vercel へのデプロイ

- `master` ブランチへのマージをトリガーに、Vercel の GitHub 連携で自動ビルド・自動デプロイされる
- ビルドは Vercel 側で実行するため、GitHub Actions 側にデプロイ用のジョブは不要
- DB は Supabase（PostgreSQL）を使用

| 項目           | 内容                                |
| -------------- | ----------------------------------- |
| デプロイ対象   | `master` ブランチ                   |
| ビルド         | Vercel 側で自動ビルド               |
| トリガー       | GitHub 連携（push / merge）         |
| DB             | Supabase                            |
| 環境変数の管理 | Vercel Project Settings（Env Vars） |

---

## 2. ステージング環境の構築（予定）

現状は本番（`master` → Vercel）のみで、リリース前に統合された状態を確認する環境がない。以下の方針で構築を検討する。

### 目的

- `release/*` やマージ直前の `develop` の状態を、本番相当の環境で事前検証する
- 本番 DB・本番 Cloudinary などの外部サービスに影響を与えずに動作確認する

### 構築案

| 項目         | 案                                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| ホスティング | Vercel の別プロジェクト（`develop` ブランチを自動デプロイ対象にする）、または Vercel Preview Deployments の活用 |
| DB           | Supabase のステージング用プロジェクトを別途用意し、本番と分離する                                               |
| 環境変数     | ステージング用の `.env` を Vercel 側で別セットとして管理                                                        |
| 画像         | Cloudinary は開発用フォルダ/プリセットを分けて誤混入を防ぐ                                                      |

### 検討事項

- `develop` ブランチへの push で自動デプロイするか、`release/*` 作成時のみデプロイするか（[docs/git/branch-strategy.md](../git/branch-strategy.md) の運用と合わせて決定）
- ステージング用の Basic 認証など、外部に見せない仕組みの要否
- Sentry など監視系ツールをステージングにも導入するか（Sentry は現状未導入、導入時期は本番デプロイ前を予定）

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
- DB（Supabase）は GCP 移行後も継続利用可能なため、DB 移行は必須ではない

### 現時点のステータス

- 未着手・検討段階（README の技術構成にも `GCP(予定)` として記載）
- 本番運用は当面 Vercel を継続し、必要に応じて段階的に検討する
