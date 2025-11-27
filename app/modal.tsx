import { ThemedText } from "@/components/themed-text";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Krisped Modal Screen</ThemedText>
      <ThemedText>This is a modal example screen.</ThemedText>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c6a984",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
