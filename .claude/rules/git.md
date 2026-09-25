# Git 運用ルール

## ブランチ

- `master` から切る
- 形式: `<type>/<内容>`（例: `feature/harness-setting`, `docs/infra-docs`, `chore/playwright-agents`）
- Issue がある場合は番号を含めてもよい（例: `feature/460-playwright-agents`）

## コミットメッセージ（Conventional Commits）

形式: `<type>: <description>`（scope は付けない）

| type       | 使いどき                                     |
| ---------- | -------------------------------------------- |
| `feat`     | 新機能の追加                                 |
| `fix`      | バグ修正                                     |
| `refactor` | 動作を変えないコードの整理                   |
| `perf`     | パフォーマンス改善                           |
| `test`     | テストの追加・修正                           |
| `docs`     | ドキュメントのみの変更                       |
| `style`    | フォーマット・スタイルのみの変更             |
| `chore`    | ビルド・設定・依存関係の変更（機能変化なし） |

- description は**日本語**で書く
- 1行目は 72 文字以内
- 命令形ではなく体言止めまたは名詞句で書く（例:「追加」「修正」「削除」）
- Issue 番号は入れない

## PR

- タイトルはコミットメッセージと同じ形式にする
- 関連 Issue（`Closes #番号` など）は作成者が自分で判断して記載する
- CI（lint / type-check / test）が通ってからマージする
