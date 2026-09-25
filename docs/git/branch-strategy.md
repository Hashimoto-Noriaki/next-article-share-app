# Branch Strategy

本ドキュメントでは、本プロジェクトにおける Git ブランチ運用方針を定義する。

本プロジェクトは GitHub Flow（`master` 直下運用）を採用し、以下を前提とする。

- `master` ブランチは常にデプロイ可能な状態を保つ
- 作業ブランチは `master` から切り、`master` 向けに PR を出す
- CI（lint / type-check / test / SAST）により PR マージ前に品質を担保する
- `master` へのマージでステージング、GitHub Release の公開で本番へデプロイする

---

## ブランチ一覧と役割

| ブランチ       | 役割                 | 主な用途                       |
| -------------- | -------------------- | ------------------------------ |
| `master`       | 本番ブランチ         | デプロイ対象。常に安定         |
| `feature/*`    | 機能開発ブランチ     | 新機能追加                     |
| `fix/*`        | 修正ブランチ         | バグ・UI 修正                  |
| `docs/*`       | ドキュメントブランチ | ドキュメントのみの変更         |
| `chore/*`      | 雑務ブランチ         | 設定・依存関係・ツール導入など |
| `refactor/*`   | リファクタリング     | 動作を変えないコードの整理     |
| `dependabot/*` | 依存更新             | Dependabot が自動作成          |

- 形式: `<type>/<内容>`（例: `feature/harness-setting`, `docs/infra-docs`）
- Issue がある場合は番号を含めてもよい（例: `feature/460-playwright-agents`）

---

## 開発フロー

```txt
master → feature/* → (PR + CI) → master → ステージングへ自動デプロイ
                                     ↓
                              GitHub Release 公開 → 本番へデプロイ
```

1. `master` から作業ブランチを作成する
2. 作業完了後、`master` 向けに PR を作成する
3. CI が通ったらマージする（`.github/workflows/ci.yml`, `sast.yml`）
4. マージ後、ステージングへ自動デプロイされる（`deploy-staging.yml`）
5. リリース時は GitHub Release を公開し、本番へデプロイする（`deploy-prod.yml`）

緊急修正も同じ流れ（`fix/*` → `master` → Release）で行う。

コミットメッセージ・PR の規約は `.claude/rules/git.md` を参照。

---

## ドキュメント

- [ブランチ命名規則](https://qiita.com/Hashimoto-Noriaki/items/5d990e21351b331d2aa1)
