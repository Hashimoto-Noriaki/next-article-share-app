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

# 安全と判断した gh サブコマンドのみ除外
if echo "$COMMAND" | grep -Eq "^gh (pr create|pr view|issue view)\b"; then
  exit 0
fi

# git commitは除外
if echo "$COMMAND" | grep -q "^git commit"; then
  exit 0
fi

# 本番環境への直接操作をブロック
if echo "$COMMAND" | grep -q "production"; then
  echo "本番環境への直接操作は禁止されています"
  exit 2
fi

exit 0
