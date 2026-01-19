import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { fetchCoin } from "../../api/coingecko";

export default function CoinDetail() {
  const { id } = useLocalSearchParams();

  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await fetchCoin(id);
      setCoin(data);
    } catch (e) {
      setError("Unable to load coin details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading coin…</Text>
      </View>
    );
  }

  if (error || !coin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errTitle}>Details</Text>
        <Text style={styles.errText}>{error || "Coin not found."}</Text>
      </View>
    );
  }

  const md = coin.market_data;

  const symbol = String(coin.symbol || "").toUpperCase();
  const price = md?.current_price?.usd;
  const pct24h = md?.price_change_percentage_24h;

  const isPositive = typeof pct24h === "number" ? pct24h >= 0 : true;

  const marketCap = md?.market_cap?.usd;
  const volume = md?.total_volume?.usd;
  const high24h = md?.high_24h?.usd;
  const low24h = md?.low_24h?.usd;
  const circulating = md?.circulating_supply;
  const rank = coin.market_cap_rank;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: symbol || "Details" }} />

      <View style={styles.top}>
        <View style={styles.logoWrap}>
          <Image source={{ uri: coin.image?.large }} style={styles.logo} />
        </View>

        <Text style={styles.name}>{coin.name}</Text>
        <Text style={styles.symbol}>{symbol}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${formatMoney(price)}</Text>
          <Text style={[styles.pct, isPositive ? styles.pos : styles.neg]}>
            {formatPercent(pct24h)}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        <StatCard label="Market Cap" value={`$${formatCompact(marketCap)}`} />
        <StatCard label="24h Volume" value={`$${formatCompact(volume)}`} />

        <StatCard label="24h High" value={`$${formatMoney(high24h)}`} />
        <StatCard label="24h Low" value={`$${formatMoney(low24h)}`} />

        <StatCard
          label="Circulating"
          value={`${formatCompact(circulating)} ${symbol}`}
        />
        <StatCard label="Rank" value={rank ? `#${rank}` : "—"} />
      </View>

      <Text style={styles.footer}>
        Data provided by CoinGecko. Prices may be delayed.
      </Text>
    </ScrollView>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue} numberOfLines={1}>
        {value ?? "—"}
      </Text>
    </View>
  );
}

function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  if (n < 1) return n.toFixed(6);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function formatCompact(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, {
    notation: "compact",
    maximumFractionDigits: 2,
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b1220",
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 10,
  },

  top: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 14,
  },
  logoWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginBottom: 10,
  },
  logo: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },
  symbol: {
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
    fontWeight: "700",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginTop: 10,
  },
  price: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
  },
  pct: {
    fontSize: 13,
    fontWeight: "800",
  },
  pos: { color: "#3ddc97" },
  neg: { color: "#ff6b6b" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  card: {
    width: "48%",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cardLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
  },
  cardValue: {
    color: "#fff",
    marginTop: 6,
    fontSize: 16,
    fontWeight: "900",
  },

  footer: {
    marginTop: 6,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    fontSize: 12,
  },

  errTitle: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 12 },
  errText: { color: "#ff6b6b", marginTop: 10 },
});
