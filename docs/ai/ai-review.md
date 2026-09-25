# ハーネスエンジニアリング（Claude Code による品質自動化）

「人が守るルール」ではなく「仕組みが守るルール」として、開発フェーズごとに自動チェックを配置しています。  
Claude Code をハーネス（馬具）のように制御し、プロジェクト固有のルールを安全・確実に実行できる状態を整えます。

## 品質ゲートの3層構造

| レイヤー   | ツール                                                | タイミング       |
| ---------- | ----------------------------------------------------- | ---------------- |
| 開発中     | CLAUDE.md + `.claude/rules/` + スキル                 | コードを書くとき |
| コミット前 | ESLint カスタムルール（層の依存方向・`'use client'`） | CI / save 時     |
| PR 時      | Claude Code Review（GitHub Actions）+ CodeRabbit      | PR 作成・更新時  |
| PR / Issue | Claude Code（`@claude` メンション）                   | 必要なとき       |

---

## 構成ファイル

| ファイル / ディレクトリ                    | 役割                                                            |
| ------------------------------------------ | --------------------------------------------------------------- |
| `CLAUDE.md`                                | Claude へのプロジェクト全体の指示・判定ルール                   |
| `.claude/settings.json`                    | 許可コマンドのホワイトリスト管理                                |
| `.claude/rules/`                           | 設計・コーディング・テスト・Git の規約                          |
| `.claude/skills/`                          | スラッシュコマンド（スキル）定義                                |
| `.coderabbit.yaml`                         | CodeRabbit のレビュー設定                                       |
| `.github/workflows/claude-code-review.yml` | PR の自動コードレビュー（Claude Code Actions）                  |
| `.github/workflows/claude.yml`             | `@claude` メンションで Claude を呼び出す（Claude Code Actions） |

---

## settings.json — 許可コマンド管理

Claude Code が実行できるコマンドを明示的に許可・拒否することで、意図しない操作を防ぎます。

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run type-check)",
      "Bash(npm run test)",
      "Bash(gh pr view:*)",
      "Bash(gh pr diff:*)",
      "Bash(gh pr review:*)",
      "Bash(gh pr edit:*)",
      "Bash(gh issue create:*)",
      "Bash(git diff:*)",
      "Bash(git status)",
      "Bash(git commit:*)",
      "Read",
      "Grep",
      "Glob"
    ],
    "deny": ["Read(.env)", "Read(.env.*)"]
  }
}
```

- **allow**: スキル実行に必要な最小限のコマンドのみ許可
- **deny**: `.env` ファイルの読み取りを明示的にブロック（シークレット漏洩防止）

---

## スキル一覧（`.claude/skills/`）

スラッシュコマンドとして呼び出せる自動化スキルを定義しています。

### `/smart-commit` — Conventional Commits 形式でコミット

ステージ済みの変更を解析し、コミットメッセージを自動生成してコミットします。

```bash
/smart-commit
```

| type       | 使いどき                                     |
| ---------- | -------------------------------------------- |
| `feat`     | 新機能の追加                                 |
| `fix`      | バグ修正                                     |
| `chore`    | ビルド・設定・依存関係の変更（機能変化なし） |
| `refactor` | 動作を変えないコードの整理                   |
| `test`     | テストの追加・修正                           |
| `docs`     | ドキュメントのみの変更                       |
| `style`    | フォーマット・スタイルのみの変更             |
| `perf`     | パフォーマンス改善                           |

### `/pr-description` — PR 説明文の自動生成

コミット一覧と diff から PR 説明文を日本語で生成し、GitHub に投稿します。

```bash
/pr-description
```

生成される構成：`概要 / 変更内容 / テスト方法 / 関連 Issue`

### `/test` — lint・型チェック・Jest を一括実行

3 つのチェックを順番に実行し、結果を表形式で報告します。

```bash
/test
```

| チェック   | コマンド             |
| ---------- | -------------------- |
| lint       | `npm run lint`       |
| type-check | `npm run type-check` |
| Jest       | `npm run test`       |

各ステップは前が失敗しても続けて実行し、まとめて報告します。

### `/create-issue` — GitHub Issue の作成

バグ報告・機能追加のどちらかを選び、フォーマットに沿った Issue を GitHub に作成します。

```bash
/create-issue
```

| 種別     | ラベル        |
| -------- | ------------- |
| バグ報告 | `bug`         |
| 機能追加 | `enhancement` |

---

## コードレビューの体制

PR 時は **Claude Code Review** と **CodeRabbit** が自動でレビューし、必要に応じて **`@claude`** で Claude を呼び出します。

| ツール             | 役割                                                                                                                       | 実行タイミング                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Claude Code Review | CLAUDE.md・`.claude/rules/` のプロジェクト固有ルール（層の依存・認証漏れなど）に沿ってレビューし、インラインコメントを投稿 | 自動（PR 作成・更新時）                 |
| CodeRabbit         | 一般的なバグ・セキュリティ・可読性を自動チェック                                                                           | 自動（PR 作成時）                       |
| `@claude`          | PR / Issue 上での質問・修正依頼への対応                                                                                    | 手動（コメントで `@claude` メンション） |

### Claude Code Actions

`anthropics/claude-code-action` を使った2つのワークフローで構成しています。

| ワークフロー                               | トリガー                                                 | 動作                                                                 |
| ------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------- |
| `.github/workflows/claude-code-review.yml` | PR の opened / synchronize / ready_for_review / reopened | `code-review` プラグインで PR をレビューし、インラインコメントを投稿 |
| `.github/workflows/claude.yml`             | Issue / PR のコメント・レビューでの `@claude` メンション | コメントの指示に従って Claude が対応                                 |

### Claude Code Review の強み

- `CLAUDE.md` と `.claude/rules/` のプロジェクト固有ルールを理解した上でレビューできる
- `restrict-action-imports` のような独自 ESLint ルールの意図も把握している
- リポジトリのコードを直接確認してから判断できる

### `@claude` を使うケース

| ケース                             | 理由                                   |
| ---------------------------------- | -------------------------------------- |
| レビューコメントの意図を確認したい | プロジェクトコンテキストで再判断したい |
| 指摘への修正を任せたい             | PR 上でそのまま修正を依頼できる        |
| Issue の調査・実装方針を相談したい | コードを読んだ上で回答できる           |

---

## レビューフロー（`/code-review` 実行時）

1. PR 情報・差分取得（`gh pr view` / `gh pr diff`）
2. CI（lint / type-check / test）の合否確認（`gh pr checks`）
3. レビュー観点（セキュリティ・型安全性・パフォーマンス・認証認可）で diff を分析
4. GitHub の PR に日本語レビューを投稿（`gh pr review`）

### GitHub 上のレビュー形式

```markdown
## コードレビュー

### 🔴 Critical（要修正）

### 🟡 Warning（要確認）

### 🟢 Suggestion（任意）

### ✅ 総評
```

GitHub の「Files changed」タブでレビューステータス（Approved / Request Changes / Comment）として反映されます。

### 判定ルール

| 条件              | GitHub アクション   |
| ----------------- | ------------------- |
| CI 失敗           | `--request-changes` |
| Critical 0 件     | `--approve`         |
| Critical 1 件以上 | `--request-changes` |
| それ以外          | `--comment`         |

---

## rules — Claude が参照する規約

`.claude/rules/` 以下のファイルを Claude が自動参照し、規約に沿ったコードを書きます。
ルールの中身は各ファイルを正とし、ここには一覧だけを載せます。

| ファイル          | 内容                                                              | 読み込み条件                   |
| ----------------- | ----------------------------------------------------------------- | ------------------------------ |
| `architecture.md` | レイヤーの責務・依存方向・`app/` を薄く保つ・handler の責務・命名 | `src/**/*.{ts,tsx}` を触るとき |
| `frontend.md`     | コンポーネント設計・`'use client'` の基準・スタイリング・import   | `src/**/*.{ts,tsx}` を触るとき |
| `testing.md`      | テストの命名・書き方・モック・カバレッジ方針                      | 常時                           |
| `git.md`          | ブランチ命名・コミットメッセージ・PR のルール                     | 常時                           |

Prettier / ESLint で担保できること（フォーマット・`any` 禁止など）は rules に書かず、ツールで検出できない規約だけを置いています。
