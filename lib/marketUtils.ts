export function getMarketStatus(): "Open" | "Closed" {
  const now = new Date();
  const malawiTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const isWeekday = malawiTime.getDay() !== 0 && malawiTime.getDay() !== 6;
  const isMarketOpen = malawiTime.getHours() >= 9 && malawiTime.getHours() < 17;
  return isWeekday && isMarketOpen ? "Open" : "Closed";
}
