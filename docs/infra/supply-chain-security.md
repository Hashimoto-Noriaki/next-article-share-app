# サプライチェーン攻撃の対策

## サプライチェーン攻撃とは

npm パッケージを乗っ取り、悪意あるコードを仕込む攻撃。
攻撃者は新バージョン公開直後を狙うことが多い。

## このプロジェクトの対策

| 対策 | ツール・設定 | 内容 |
| ---- | ------------ | ---- |
| lockfile の厳格適用 | `npm ci` | lockfile と一致しない場合はインストールを失敗させる |
| バージョン更新のクールダウン | Dependabot cooldown | 公開直後の悪意あるバージョンを避ける |
| マルウェア・タイポスクワッティング検知 | Socket.dev | PR 時に依存パッケージを自動スキャン |

## lockfile（npm ci）

CI と Dockerfile の両方で `npm ci` を使用。
`npm install` と異なり lockfile を上書きせず、内容と一致しない場合はエラーになる。

```bash
# CI / Dockerfile で使用
npm ci
```

## Dependabot クールダウン

`.github/dependabot.yml` に cooldown を設定。
新バージョン公開からクールダウン期間を過ぎた更新のみ PR を作成する。

| バージョン種別 | クールダウン |
| -------------- | ------------ |
| major          | 14日         |
| minor          | 7日          |
| patch          | 3日          |

セキュリティ更新はクールダウン対象外（即時 PR 作成）。

## Socket.dev

PR に npm パッケージの変更が含まれる場合に自動スキャンを実行する GitHub App。

### 検知対象

| 設定 | 内容 |
| ---- | ---- |
| `malware` | 悪意あるコードの埋め込み |
| `installScripts` | 不審な postinstall スクリプト |
| `gitDependency` | npm レジストリ外の git 依存 |
| `typosquatting` | タイポスクワッティング |
| `unmaintained` | メンテナンス放棄パッケージ |

### 設定ファイル

`socket.yml`（リポジトリルート）で動作を制御する。

```yaml
version: 2

issueRules:
  malware: true
  installScripts: true
  hasNativeCode: false  # esbuild / sharp が該当するため無効化
  gitDependency: true
  unmaintained: true
  typosquatting: true
```

`hasNativeCode` を `true`（ブロック）にすると `esbuild` や `sharp` が引っかかるため `warn` にしている。

### インストール

https://github.com/apps/socket-security からリポジトリを指定してインストール。
