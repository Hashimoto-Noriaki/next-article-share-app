# ハーネスエンジニアリング（Claude Code による品質自動化）

「人が守るルール」ではなく「仕組みが守るルール」として、開発フェーズごとに自動チェックを配置しています。  
Claude Code をハーネス（馬具）のように制御し、プロジェクト固有のルールを安全・確実に実行できる状態を整えます。

## 品質ゲートの3層構造

| レイヤー   | ツール                       | タイミング       |
| ---------- | ---------------------------- | ---------------- |
| 開発中     | CLAUDE.md + `.claude/rules/` | コードを書くとき |
| コミット前 | ESLint カスタムルール        | CI / save 時     |
| PR 時      | CodeRabbit + `/code-review`  | マージ前         |

---

## 構成ファイル

| ファイル / ディレクトリ | 役割                                          |
| ----------------------- | --------------------------------------------- |
| `CLAUDE.md`             | Claude へのプロジェクト全体の指示・判定ルール |
| `.claude/settings.json` | 許可コマンドのホワイトリスト管理              |
| `.claude/rules/`        | フロントエンド・テスト規約                    |
| `.claude/skills/`       | スラッシュコマンド（スキル）定義              |
| `.coderabbit.yaml`      | CodeRabbit のレビュー設定                     |

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

## コードレビューの2ツール体制

PR 時は **CodeRabbit** と **`/code-review`** を役割で分担しています。

| ツール         | 役割                                                                   | 実行タイミング                 |
| -------------- | ---------------------------------------------------------------------- | ------------------------------ |
| CodeRabbit     | 一般的なバグ・セキュリティ・可読性を自動チェック                       | 自動（PR 作成時）              |
| `/code-review` | このプロジェクト固有のアーキテクチャルール（層の依存・認証漏れ）を確認 | 手動（`@claude /code-review`） |

### CodeRabbit の強み

- PR 全体のコンテキストを把握した包括的レビュー
- セキュリティ・パフォーマンス観点の自動チェック
- チームへの知識共有（PR コメントとして残る）

### `/code-review` の強み

- `CLAUDE.md` のプロジェクト固有ルールを理解した上でレビューできる
- `restrict-action-imports` のような独自 ESLint ルールの意図も把握している
- ローカルコードを `Read` / `Grep` で直接確認してから判断できる

### `/code-review` を追加実行するケース

CodeRabbit は毎 PR で自動実行されます。以下のケースでは追加で実行してください。

| ケース                                      | 理由                                              |
| ------------------------------------------- | ------------------------------------------------- |
| 認証・認可を触る PR                         | `auth()` 漏れなどプロジェクト固有のチェックが必要 |
| `external/` や `features/` の層をまたぐ変更 | ESLint ルールの意図まで理解した判断が必要         |
| CodeRabbit のコメントが腑に落ちない         | プロジェクトコンテキストで再判断したい            |

小さな PR や単純な UI 変更は CodeRabbit だけで十分です。

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

## rules — Claude が参照するコーディング規約

`.claude/rules/` 以下のファイルを Claude が自動参照し、規約に沿ったコードを書きます。

| ファイル      | 内容                                                             |
| ------------- | ---------------------------------------------------------------- |
| `frontend.md` | コンポーネント設計・ディレクティブ・スタイリング・Server Actions |
| `testing.md`  | テストファイル命名・Jest の書き方・モック・カバレッジ方針        |

### frontend.md の主なルール

- `shared/components/` は atoms / molecules / organisms の 3 層構造
- コンポーネントは **named export**（default export 禁止）
- `'use client'` はインタラクション・状態・ブラウザ API が必要な場合のみ
- スタイルは Tailwind CSS のみ（インラインスタイル禁止）
- Server Actions は冒頭で `auth()` を呼びセッションを検証する

### testing.md の主なルール

- `describe` / `it` の説明は日本語で書く
- カバレッジは **C1（分岐カバレッジ）** まで
- UI コンポーネントより hooks / utils のロジックを優先してテスト
