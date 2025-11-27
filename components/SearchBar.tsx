import { TextInput, StyleSheet } from "react-native";
import colors from "../constants/theme";

export default function SearchBar({ value, setValue }) {
  return (
    <TextInput
      placeholder="Cari Furniture..."
      style={styles.input}
      placeholderTextColor="#8E8E8E"
      value={value}
      onChangeText={setValue}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
});
