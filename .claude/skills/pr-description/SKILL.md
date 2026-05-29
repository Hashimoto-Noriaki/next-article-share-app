---
name: pr-description
description: コミットと diff から PR 説明文を生成して GitHub に投稿する
---

# PR Description

現在のブランチのコミットと diff から PR 説明文を生成し、GitHub に投稿する。

## Steps

1. `gh pr view --json number,title,baseRefName 2>/dev/null` で PR 情報を取得する。  
   PR が存在しない場合は「PRが見つかりません。先に `gh pr create` でPRを作成してください。」と伝えて終了する。

2. `git log --oneline origin/<baseRefName>...HEAD` でブランチのコミット一覧を取得する。

3. `gh pr diff` で変更の全 diff を取得する。

4. 取得した情報をもとに以下のフォーマットで PR 説明文を日本語で生成する。

## PR 説明文フォーマット

```markdown
## 概要

<!-- 変更の目的・背景を1〜3行で -->

## 変更内容

-

## テスト方法

- [ ]

## 関連 Issue

<!-- 関連する Issue があれば記載 (例: Closes #123) -->
```

### 生成ルール

- **概要**: コミットメッセージと diff から変更の目的・背景を要約する
- **変更内容**: 変更されたファイル・機能を箇条書きにする（技術的な詳細より「何が変わったか」を書く）
- **テスト方法**: 変更内容に応じた確認手順をチェックリスト形式で記載する
- **関連 Issue**: コミットメッセージに `#番号` が含まれていれば記載する。なければセクションごと省略する

## 実行

HEREDOC を使って PR 説明文を投稿する：

```sh
gh pr edit <number> --body "$(cat <<'EOF'
<生成した説明文>
EOF
)"
```

投稿後、PR の URL を表示する。
