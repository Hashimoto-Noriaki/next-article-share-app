# ESLintとPrettier

### 全体像の意味

- `"env"`
  どんな環境でコードが動くか（ES・ブラウザ・Node）を指定

- `"extends"`
  どのベース設定を継承するか（標準＋プラグイン＋Prettier整形）

- `"parserOptions"`
  JavaScriptの構文レベルやモジュール形式の指定

- `"rules"`
  プロジェクト独自の細かいルール（ここが最重要）

### "env"

- `"browser": true`
  window, document などブラウザのグローバル変数を使えるようにする

- `"node": true`
  require, process などNode.jsのAPIを使えるようにする

- `"es2021": true`
  ECMAScript 2021の構文を認識する（例：String.replaceAll など）

**_ブラウザ・Node両対応のプロジェクト_**（Next.jsなど）に最適

### "extends"

- `eslint:recommended`
  ESLintが公式で推奨する基本ルールセット（バグ防止・構文エラーなど）

- `plugin:import/recommended`
  import/export の重複や並び・解決エラーを検出する

- `plugin:unused-imports/recommended`
  使われていない import を自動検出・削除できる

`prettier`
フォーマットに関するESLintルールを無効化し、Prettierに一任する

「**_構文エラー＋import整頓＋Prettierでフォーマット統一_**」という現場標準セット

### "parserOptions"

- `"ecmaVersion": "latest"`
  最新のES構文を許可（ES2022以降でもOK）

- `"sourceType": "module"`
  ES Modules形式（import/export）を使えるようにする

Next.jsやReactなどモダン構成で必須。

### "rules" 各ルールの意味

- "quotes": ["error", "single"] | ' ' のみ許可（"禁止） | コードスタイル統一
- "semi": ["error", "always"] | 行末に ; 必須 | セミコロン抜け防止
- "eqeqeq": ["error", "always"] | == 禁止 → === に統一 | 型比較の曖昧さを防ぐ
- "no-console": "error" | console.log 禁止 | デバッグ出し忘れを防止（本番コードの品質維持）
- "no-debugger": "error" | debugger 禁止 | デバッグ中断の置き忘れ防止
- "no-duplicate-imports": "error" | 同じモジュールの重複import禁止 | import整理・可読性向上
- "no-empty": "error" | 空のブロック {} 禁止 | 意図しない空関数などを防ぐ
- "no-shadow": "error" | 変数のシャドーイング禁止 | スコープ内で同名変数を再定義しない
- "no-unused-vars": "warn" | 未使用変数は警告 | コード整理促進（開発中は警告止まり）
- "unused-imports/no-unused-imports": "error" | 未使用のimportをエラー扱い | import整理を自動化（VSCodeで自動削除可）
- "no-unreachable": "error" | return以降の無効コード禁止 | ロジックミスを検出
- "no-constant-condition": "error" | 常にtrue/falseの条件禁止 | 無限ループ・意図しない条件を防止
