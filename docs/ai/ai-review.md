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
| `.claude/settings.json` | 許可・禁止コマンドの管理とフックの登録        |
| `.claude/hooks/`        | コマンド実行前のガード（`guard.sh`）          |
| `.claude/rules/`        | フロントエンド・テスト規約                    |
| `.claude/skills/`       | スラッシュコマンド（スキル）定義              |
| `.claude/agents/`       | 観点ごとのレビュー用サブエージェント定義      |
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
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push -f*)",
      "Bash(git push * --force)",
      "Bash(git push * -f)",
      "Bash(git reset --hard*)",
      "Bash(git clean -f*)",
      "Bash(rm -rf*)",
      "Read(.env)",
      "Read(.env.*)",
      "Write(.env)",
      "Write(.env.*)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/guard.sh\""
          }
        ]
      }
    ]
  }
}
```

- **allow**: スキル実行に必要な最小限のコマンドのみ許可
- **deny**: 取り消しのきかない操作（強制プッシュ・`git reset --hard`・`git clean -f`・`rm -rf`）と、`.env` ファイルの読み書きをブロック（シークレット漏洩防止）
- **hooks**: Bash を実行する前に `guard.sh` を呼び出す（次の節を参照）

`bash` 経由で呼び出しているため、`guard.sh` に実行権限がなくても動きます。

---

## hooks — コマンド実行前のガード（`.claude/hooks/guard.sh`）

PreToolUse フックとして、Claude が Bash コマンドを実行する直前にコマンドの中身をチェックし、本番環境への直接操作をブロックします。
`permissions.deny` はコマンドの形（前方一致など）で禁止するのに対し、フックはコマンド全体を見て判定できます。

### 判定の流れ

1. 標準入力の JSON から `tool_input.command` を取り出す（`jq`、なければ `python3` を使う。どちらもなければブロック）
2. コマンドに `;` `&` `|` `` ` `` `$(` `<` `>` や改行が含まれていなければ「単純なコマンド」とみなし、次のものはチェックを省いて許可する
   - `gh pr create` / `gh pr view` / `gh issue view`
   - `git commit`
   - 読み取り専用のコマンド: `grep` / `cat` / `head` / `tail` / `less` / `wc` / `ls` / `git diff` / `git log` / `git show` / `git status`
   - `NODE_ENV=production npm run (build|start|lint|type-check|test)`
3. それ以外のコマンドに、英字に挟まれていない `production` / `prod` が含まれていれば、exit 2 でブロックする（大文字小文字は区別しない）
4. ブロックした理由（「本番環境への直接操作は禁止されています」）は stderr に出し、Claude に伝える

### 検出の例

| コマンド                                         | 結果     | 理由                             |
| ------------------------------------------------ | -------- | -------------------------------- |
| `vercel deploy --prod`                           | ブロック | `--prod` を検出                  |
| `kubectl --context prod_us delete namespace foo` | ブロック | `prod_us` を検出                 |
| `psql $DATABASE_URL_PROD`                        | ブロック | `_PROD` を検出                   |
| `git commit -m x; deploy production`             | ブロック | 連結を含むのでチェックを省かない |
| `rg --pre /bin/sh production ./deploy.sh`        | ブロック | `rg` は除外対象外                |
| `grep -r production src/`                        | 許可     | 単純な読み取り専用コマンド       |
| `NODE_ENV=production npm run build`              | 許可     | ローカルでの本番モードビルド     |
| `npm run product-list`                           | 許可     | `product` は対象外               |

### 設計上の注意

- `rg`（`--pre` で任意のプログラムを実行できる）と `git grep`（`-O` で任意のプログラムを実行できる）は、読み取り専用の除外対象に入れていません
- 判定は `production` / `prod` という語で行っているため、この語を含まない本番操作は止められません。うっかり実行を防ぐためのガードであり、本番の認証情報を開発環境に置かないことが前提です

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

---

## agents — レビュー用サブエージェント（`.claude/agents/`）

観点ごとに専門のサブエージェントを定義しています。Claude は依頼の内容（`description` に書いたきっかけ）に合わせて、適切なエージェントを呼び出します。
どのエージェントもコードを読むだけで変更は行わず、指摘のみを返します。

| エージェント          | 呼び出されるきっかけ                                                                | 使えるツール              |
| --------------------- | ----------------------------------------------------------------------------------- | ------------------------- |
| `code-review`         | 「レビューして」「コードをチェックして」                                            | Read / Grep / Glob        |
| `security-review`     | 「セキュリティチェックして」「認可漏れを確認して」、認証・API・アップロード等の変更 | Read / Grep / Glob / Bash |
| `architecture-review` | 「設計を見て」「アーキテクチャレビューして」、feature・handler・repository の追加   | Read / Grep / Glob        |

### 各エージェントの観点

- **code-review**: バグ・論理エラー、明らかな認証漏れ、可読性、テスト。認可・入力検証の詳細は `security-review` に任せる
- **security-review**: 認証、認可（IDOR）、入力検証、インジェクション・XSS、機密情報の露出、パスワード・トークン。Route Handler・Server Action まで呼び出し経路を遡り、実際に到達できる経路を確認してから指摘する。対象の指定がなければ `git diff master...HEAD --name-only` の変更ファイルを見るため、Bash を許可している
- **architecture-review**: レイヤーの責務・依存の方向・ファイルの置き場所。`.claude/rules/architecture.md` と `frontend.md` を基準にし、規約にないことは指摘しない。Bash を使えないため、対象ファイルは呼び出し元が指定する

### 出力形式と重要度

出力は `ファイルパス:行番号 [Critical/Warning/Suggestion] 指摘内容` の形式に統一しています（`security-review` は攻撃の到達経路、`architecture-review` は根拠となるルールを括弧で添える）。

CLAUDE.md の方針に合わせ、認証・認可・入力検証に関する問題は Critical として扱います。
