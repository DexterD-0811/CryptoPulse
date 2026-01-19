import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: styles.header,
          headerTintColor: "#ffffff",
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
          contentStyle: styles.content,
          animation: Platform.OS === "web" ? "none" : "default",
        }}
      >
        <Stack.Screen name="index" options={{ title: "CryptoPulse" }} />
        <Stack.Screen name="coin/[id]" options={{ title: "Details" }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: "#0b1220" },
  headerTitle: { fontWeight: "900" },
  content: { backgroundColor: "#0b1220" },
});
