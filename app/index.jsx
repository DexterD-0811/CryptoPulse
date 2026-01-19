import { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Image
} from "react-native";
import { router } from "expo-router";
import CoinRow from "../components/CoinRow";
import { fetchMarkets } from "../api/coingecko";
import CryptoPulseLogo from "../assets/images/CryptoPulseLogo.png";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadCoins = useCallback(async () => {
    setError("");
    try {
      const data = await fetchMarkets();
      setCoins(data);
    } catch (e) {
      setError("Unable to load market data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

  const filteredCoins = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coins;

    return coins.filter((c) => {
      const name = String(c.name || "").toLowerCase();
      const sym = String(c.symbol || "").toLowerCase();
      return name.includes(q) || sym.includes(q);
    });
  }, [coins, query]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading crypto data…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={CryptoPulseLogo} style={styles.logo} />
        <Text style={styles.title}>CryptoPulse</Text>
      </View>

      <Text style={styles.subtitle}>Top cryptocurrencies by market cap</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search BTC, ETH, SOL…"
        placeholderTextColor="rgba(255,255,255,0.45)"
        style={styles.search}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={filteredCoins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CoinRow
            coin={item}
            onPress={() => router.push(`/coin/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptyText}>Try searching: BTC, ETH, SOL</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0b1220" },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 8 },
  subtitle: {
    color: "rgba(255,255,255,0.65)",
    marginTop: 6,
    marginBottom: 14,
  },

  search: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 14,
  },

  error: { color: "#ff6b6b", marginBottom: 12 },
  listContent: { paddingBottom: 24 },

  emptyBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  emptyTitle: { color: "#fff", fontWeight: "900" },
  emptyText: { color: "rgba(255,255,255,0.65)", marginTop: 6 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0b1220",
  },
  loadingText: { color: "rgba(255,255,255,0.7)", marginTop: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },

  logo: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },

});
