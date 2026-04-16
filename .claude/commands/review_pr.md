# Review PR

Review the code changes in the current GitHub PR and post the review directly to GitHub.

## Steps

1. Run `gh pr view --json number,title,baseRefName,url 2>/dev/null` to get PR info. If no PR exists, say "PRが見つかりません。先に `gh pr create` でPRを作成してください。" and stop.
2. Run `gh pr diff` to get the full diff of this PR
3. Run `gh pr view --json commits --jq '.commits[].messageHeadline'` to see commit messages
4. Run `gh pr checks` to get CI status. If any check has failed, treat it as a Critical issue.

Review the diff thoroughly, then post the review to GitHub using one of the following commands.

If everything looks good:

```sh
gh pr review <number> --approve --body "<review body>"
```

If critical issues are found:

```sh
gh pr review <number> --request-changes --body "<review body>"
```

Otherwise:

```sh
gh pr review <number> --comment --body "<review body>"
```

## Review Format

The review body should be in Japanese and follow this format:

```markdown
## コードレビュー

### 🔴 Critical（要修正）

- セキュリティ脆弱性（XSS, SQL injection, command injection など）
- データ破壊・損失につながるバグ
- 認証・認可の欠陥

### 🟡 Warning（要確認）

- ロジックエラーや境界値の問題
- TypeScript の型エラーや `any` の多用
- エラーハンドリングの漏れ（外部 API・ユーザー入力の境界）
- パフォーマンス上の問題

### 🟢 Suggestion（任意）

- コードの可読性・保守性の改善案
- より良いパターンの提案

### ✅ 総評

全体的な評価を記載。
```

## Approval Rules

- Critical が 0 件 → `--approve`
- Critical が 1 件以上 → `--request-changes`
- どちらでもない場合 → `--comment`

After posting, show the PR URL so the user can view the review on GitHub.
