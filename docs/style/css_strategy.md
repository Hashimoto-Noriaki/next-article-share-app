# Tailwind と CSS Modules の共存ルール

本プロジェクトでは Tailwind を当面残し、段階的に CSS Modules を導入する。

## 基本方針

1.ちょい足し・試作・単発の調整は Tailwind でOK 2.ただし、スタイルが肥大化したら CSS Modules に寄せる

## 変換ルール

コンポーネント内で Tailwind のclass(Tailwind ユーティリティの数) が 5個以上になったら、CSS Modules へ変換する

- 目的：
  可読性・再利用性・設計の一貫性を守るため

※ class数の数え方は「className 内のユーティリティ数」を目安とし、改行や条件分岐を含めても合計で判断する。

### ユーティリティの数え方

この場合は5つ

```tsx
<div className="px-4 py-2 bg-white rounded shadow">
```
