# ハーネスエンジニアリング（AI自動コードレビュー）

Claude Code によるAI自動コードレビューを実現するための仕組みです。AIが安全・確実にレビューを実行できるよう、**実行できる操作・判断基準・出力フォーマット**を構造化しています。

## 構成ファイル

| ファイル                        | 役割                               |
| ------------------------------- | ---------------------------------- |
| `.claude/settings.json`         | 許可コマンドのホワイトリスト管理   |
| `.claude/commands/review_pr.md` | `/review_pr` スキル定義            |
| `.claude/rules/frontend.md`     | フロントエンド規約                 |
| `.claude/rules/testing.md`      | テスト規約                         |
| `CLAUDE.md`                     | プロジェクト全体の指示・判定ルール |

## 使い方

### GitHub PRコメントから実行（主な使い方）

PRのコメント欄に以下を投稿すると Claude が自動でレビューを実行します：

```
@claude /review_pr
```

### ターミナルから実行

PRのブランチをチェックアウトした状態で Claude Code を起動し実行します：

```bash
/review_pr
```

## レビューフロー

`/review_pr` を実行すると以下を自動処理します：

1. PR情報・差分取得（`gh pr view` / `gh pr diff`）
2. CI（lint / type-check / test）の合否確認（`gh pr checks`）
3. レビュー観点（セキュリティ・型安全性・パフォーマンス・認証認可）でdiffを分析
4. GitHubのPRに日本語レビューを投稿（`gh pr review`）

## GitHub上のレビュー形式

投稿されるレビューは以下のフォーマットで GitHub PR のレビューコメントとして記録されます：

```markdown
## コードレビュー

### 🔴 Critical（要修正）

### 🟡 Warning（要確認）

### 🟢 Suggestion（任意）

### ✅ 総評
```

GitHub の「Files changed」タブでレビューステータス（Approved / Request Changes / Comment）として反映されます。

## 判定ルール

| 条件             | GitHubアクション    |
| ---------------- | ------------------- |
| CI失敗           | `--request-changes` |
| Critical 0件     | `--approve`         |
| Critical 1件以上 | `--request-changes` |
| それ以外         | `--comment`         |
