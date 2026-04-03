/** 中文相对时间，用于工具历史时间线 */
export function formatRelativeTimeZh(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) {
    return iso;
  }
  const diff = Date.now() - t;
  if (diff < 0) {
    return new Date(iso).toLocaleString();
  }
  const sec = Math.floor(diff / 1000);
  if (sec < 60) {
    return "刚刚";
  }
  const min = Math.floor(sec / 60);
  if (min < 60) {
    return `${min} 分钟前`;
  }
  const hr = Math.floor(min / 60);
  if (hr < 24) {
    return `${hr} 小时前`;
  }
  const day = Math.floor(hr / 24);
  if (day < 7) {
    return `${day} 天前`;
  }
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
