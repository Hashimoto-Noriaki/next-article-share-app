# Branch Strategy

本ドキュメントでは、本プロジェクトにおける Git ブランチ運用方針を定義する。

本プロジェクトは以下を前提とする。

- `master` ブランチは常にデプロイ可能な状態を保つ
- 日常的な開発は `develop` を中心に行う
- CI により PR マージ前に品質を担保する
- CD は Vercel / Cloud Run 側の GitHub 連携に任せる

---

## ブランチ一覧と役割

| ブランチ    | 役割                 | 主な用途                          |
| ----------- | -------------------- | --------------------------------- |
| `master`    | 本番ブランチ         | デプロイ対象。常に安定            |
| `develop`   | 開発統合ブランチ     | 次リリース予定のコードを集約      |
| `topic/*`   | 作業まとめ用ブランチ | 複数 feature / fix を一時的に統合 |
| `release/*` | リリース準備ブランチ | 最終調整・QA                      |
| `feature/*` | 機能開発ブランチ     | 新機能追加                        |
| `fix/*`     | 非緊急修正ブランチ   | 軽微なバグ・UI修正                |
| `hotfix/*`  | 緊急修正ブランチ     | 本番障害対応                      |

---

---

## 開発フロー（通常）

### feature / fix 開発

- `develop` から `feature/*` または `fix/*` を作成する
- 作業完了後、`develop` 向けに PR を作成する

```txt
develop → feature/* → (PR) → develop
develop → fix/*     → (PR) → develop


### ドキュメント
[Git Flow](https://qiita.com/KosukeSone/items/514dd24828b485c69a05)
[ブランチ命名規則](https://qiita.com/Hashimoto-Noriaki/items/5d990e21351b331d2aa1)
```
