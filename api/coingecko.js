const BASE_URL = "https://api.coingecko.com/api/v3";

export async function fetchMarkets() {
  const url =
    `${BASE_URL}/coins/markets?vs_currency=usd` +
    `&order=market_cap_desc&per_page=50&page=1&sparkline=false` +
    `&price_change_percentage=24h`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch market data");

  return res.json();
}

export async function fetchCoin(id) {
  const url =
    `${BASE_URL}/coins/${encodeURIComponent(id)}` +
    `?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch coin details");

  return res.json();
}
