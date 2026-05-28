# Skills

このプロジェクトで使えるカスタムスキル一覧。

| スラッシュコマンド | ファイル           | 概要                                               |
| ------------------ | ------------------ | -------------------------------------------------- |
| `/smart-commit`    | `smart-commit.md`      | ステージ済みの変更を Conventional Commits 形式でコミット |
| `/review_pr`       | `review_pr.md`         | 現在の PR の diff を取得し、GitHub にレビューを投稿  |
| `/pr-description`  | `pr-description.md`    | コミット・diff から PR 説明文を生成して GitHub に投稿 |
| `/test`            | `test.md`              | lint・型チェック・Jest を順番に実行して結果を報告    |

## 新しいスキルを追加するには

1. `.claude/skills/<skill-name>.md` を作成する
2. このファイル（`SKILL.md`）のテーブルにエントリを追加する
3. `CLAUDE.md` の `## Skills` セクションにも追記する
