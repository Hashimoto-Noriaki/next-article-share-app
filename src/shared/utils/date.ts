export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('ja-JP');
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('ja-JP');
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}日前`;
  if (hours > 0) return `${hours}時間前`;
  if (minutes > 0) return `${minutes}分前`;
  return 'たった今';
}
