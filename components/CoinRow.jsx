import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { formatPrice, formatPercent } from "../utils/format";

export default function CoinRow({ coin, onPress }) {
  const change = coin?.price_change_percentage_24h ?? 0;
  const isPositive = change >= 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <Image source={{ uri: coin.image }} style={styles.logo} />
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {coin.name}
          </Text>
          <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.price}>${formatPrice(coin.current_price)}</Text>
        <Text style={[styles.change, isPositive ? styles.pos : styles.neg]}>
          {formatPercent(change)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  name: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    maxWidth: 180,
  },
  symbol: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
  },
  price: {
    color: "#fff",
    fontWeight: "700",
  },
  change: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
  },
  pos: { color: "#3ddc97" },
  neg: { color: "#ff6b6b" },
});
