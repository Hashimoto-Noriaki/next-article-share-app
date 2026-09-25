---
name: smart-commit
description: ステージ済みの変更を Conventional Commits 形式でコミットする
---

# Smart Commit

ステージされた変更を確認し、Conventional Commits 形式でコミットを作成する。

## Steps

1. `git diff --staged` でステージ済みの変更を確認する。  
   変更がなければ `git status` を確認し、「ステージされた変更がありません。`git add` でファイルをステージしてください。」と伝えて終了する。

2. `git log --oneline -5` で直近のコミットメッセージのスタイルを確認する。

3. 変更内容から `.claude/rules/git.md` の規約に沿ってコミットメッセージを生成する。

## コミットメッセージ規約

形式・type の選び方・記述ルールは `.claude/rules/git.md` に従う。

## 実行

HEREDOC を使ってコミットを作成する：

```sh
git commit -m "$(cat <<'EOF'
<type>: <description>
EOF
)"
```

コミット後、コミットハッシュとメッセージを表示する。
