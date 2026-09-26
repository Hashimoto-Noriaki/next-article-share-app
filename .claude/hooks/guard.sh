#!/bin/bash
INPUT=$(cat)
if command -v jq >/dev/null 2>&1; then
  COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null) || exit 2
elif command -v python3 >/dev/null 2>&1; then
  COMMAND=$(printf '%s' "$INPUT" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("tool_input", {}).get("command", ""))') || exit 2
else
  echo "guard.sh: command parser is unavailable" >&2
  exit 2
fi

if [ -z "$COMMAND" ]; then
  exit 0
fi

# コマンド連結・置換・リダイレクト・改行を含む場合は除外対象にしない
# （例: `gh pr view 1 && <本番操作>` で production チェックをすり抜けるのを防ぐ）
NL=$'\n'
IS_SIMPLE=1
case "$COMMAND" in
  *';'* | *'&'* | *'|'* | *'`'* | *'$('* | *'<'* | *'>'* | *"$NL"*)
    IS_SIMPLE=0
    ;;
esac

if [ "$IS_SIMPLE" -eq 1 ]; then
  # 安全と判断した gh サブコマンドのみ除外
  if printf '%s' "$COMMAND" | grep -Eq "^gh (pr create|pr view|issue view)( |$)"; then
    exit 0
  fi

  # git commitは除外
  if printf '%s' "$COMMAND" | grep -Eq "^git commit( |$)"; then
    exit 0
  fi
fi

# 本番環境への直接操作をブロック
if echo "$COMMAND" | grep -q "production"; then
  echo "本番環境への直接操作は禁止されています"
  exit 2
fi

exit 0
