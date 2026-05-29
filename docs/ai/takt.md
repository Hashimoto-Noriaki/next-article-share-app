# TAKT — AIエージェントワークフロー管理

「AIに実装させるだけ」から「開発プロセス全体をAIに実行させる」へ。  
TAKT はワークフローを YAML で定義し、plan・実装・レビュー・修正・最終承認の一連の工程を AIエージェントに強制実行させるツールです。

---

## 構成ファイル

| ファイル / ディレクトリ         | 役割                                             |
| ------------------------------- | ------------------------------------------------ |
| `.takt/config.yaml`             | プロバイダー・モデル・言語の基本設定             |
| `.takt/workflows/default.yaml`  | 汎用ワークフロー（4ステップ）                    |
| `.takt/workflows/frontend.yaml` | フロントエンド向け拡張ワークフロー（11ステップ） |
| `.takt/.gitignore`              | ランタイム生成物を除外し、定義ファイルのみ管理   |

---

## config.yaml — 基本設定

```yaml
provider: claude # AIプロバイダー（claude / codex / opencode）
model: claude-sonnet-4-6
language: ja
```

グローバル設定（`~/.takt/config.yaml`）とプロジェクト設定の2層構造で、プロジェクト設定が優先されます。

---

## .gitignore — バージョン管理対象の明示

デフォルトで全ファイルを除外し、管理したいものだけ許可します。  
セッションキャッシュ・タスクファイルなどのランタイム生成物はコミットしません。

```gitignore
*
!.gitignore
!config.yaml
!workflows/
!workflows/**
!facets/
!facets/**
```

---

## ワークフロー概要

### default.yaml — 汎用ワークフロー

```bash
plan → write_tests → draft（実装 + AI自己レビュー）→ peer-review（並列3本）→ COMPLETE
```

### frontend.yaml — フロントエンド向け拡張ワークフロー

```bash
plan
  ↓
write_tests（テストファースト）
  ↓
implement
  ↓
ai-antipattern-review-1st ◀──┐
  ↓ 問題あり                  │
ai-antipattern-fix ──────────┘  ← ループ監視（最大3サイクル）
  ↓ 問題なし
reviewers_1（並列4本）
  ├─ arch-review
  ├─ frontend-review
  ├─ testing-review
  └─ ai-antipattern-review-2nd
  ↓ 全員 approved
reviewers_2（並列2本）
  ├─ security-review
  └─ qa-review
  ↓ 全員 approved
supervise（最終チェック）
  ↓
COMPLETE
```

---

## ステップの主要パラメータ

| パラメータ                      | 説明                               | 例                                        |
| ------------------------------- | ---------------------------------- | ----------------------------------------- |
| `persona`                       | エージェントの役割・思考スタイル   | `planner` / `coder` / `frontend-reviewer` |
| `policy`                        | 判断基準・制約                     | `coding` / `testing` / `review`           |
| `knowledge`                     | 注入するドメイン知識               | `frontend` / `react` / `security`         |
| `edit`                          | ファイル編集を許可するか           | `true` / `false`                          |
| `session: refresh`              | 前ステップのコンテキストをリセット | 実装→レビューの汚染防止                   |
| `pass_previous_response: false` | 前ステップの出力を渡さない         | レビュアーのバイアス防止                  |
| `required_permission_mode`      | 編集許可モードを強制               | `edit`                                    |

---

## ループ監視（loop_monitors）

同じサイクルが閾値（`threshold`）を超えて繰り返されると、supervisor が介入します。

```yaml
loop_monitors:
  - cycle:
      - ai-antipattern-review-1st
      - ai-antipattern-fix
    threshold: 3
    judge:
      persona: supervisor
      rules:
        - condition: Healthy (making progress)
          next: ai-antipattern-review-1st
        - condition: Unproductive (no improvement)
          next: reviewers_1 # 強制的に次フェーズへ
```

「改善しているか／無限ループか」を supervisor が判定し、硬直を防ぎます。

---

## ルール設計

### 失敗系は必ず plan か ABORT に向ける

実装不能のままレビュー工程へ流れないよう、条件分岐を明示します。

```yaml
# implement ステップのルール
rules:
  - condition: Implementation is complete
    next: ai-antipattern-review-1st
  - condition: No implementation (report only)
    next: plan # 未実装 → 要件を再整理
  - condition: Cannot proceed with implementation
    next: ABORT # 完全ブロック → 中断
```

失敗系を `ABORT` / `plan` にせず後続のレビューへ流すと、未実装のまま supervise まで進む経路ができてしまいます。

### 並列レビューの集約ルール

`parallel` ブロック配下の全エージェントの判定を集約します。

```yaml
rules:
  - condition: all("approved") # 全員 OK → 次フェーズへ
    next: reviewers_2
  - condition: any("needs_fix") # 1人でも NG → 修正へ
    next: fix
```

---

## output_contracts — レポートの強制出力

各ステップ終了時に、指定フォーマットの Markdown を `.takt/runs/{slug}/reports/` へ出力します。

```yaml
output_contracts:
  report:
    - name: ai-antipattern-review-1st.md # 1st と 2nd で名前を分ける
      format: ai-antipattern-review
```

同一ワークフロー内で複数ステップが同じファイル名を出力すると後段が前段を上書きします。  
段階別にファイル名を一意にしてください（例：`-1st.md` / `-2nd.md`）。

---

## コマンド一覧

```bash
# ワークフロー定義のバリデーション
takt workflow doctor

# プロンプトのプレビュー（実行なし・定義確認用）
takt prompt default
takt prompt frontend

# インタラクティブ起動（ワークフロー・タスクを対話選択）
takt

# タスクを直接指定して実行
takt --workflow frontend --task "記事一覧のページネーション実装"

# GitHub Issue から起動
takt --workflow frontend --issue 123

# 利用可能なペルソナ・ポリシー・ナレッジの一覧
takt catalog
```

---

## カスタマイズ（eject）

組み込みのペルソナ・ポリシー・ナレッジを上書きしたい場合は `eject` でプロジェクトにコピーします。

```bash
takt eject persona planner       # ペルソナをプロジェクトへ
takt eject knowledge frontend    # ナレッジをプロジェクトへ
takt eject workflow frontend     # ワークフロー自体をプロジェクトへ
```

ejected したファイルは `.takt/facets/` 以下に配置され、組み込みより優先されます。
