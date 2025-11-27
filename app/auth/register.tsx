import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import colors from "../../constants/theme";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) return alert(error.message);

    alert("Akun berhasil dibuat");
    router.replace("/auth/login");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.primary }}>
        Daftar Akun
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginTop: 20, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderBottomWidth: 1, marginTop: 20, padding: 10 }}
      />

      <TouchableOpacity
        onPress={handleRegister}
        style={{
          marginTop: 20,
          padding: 14,
          backgroundColor: colors.primary,
          borderRadius: 10,
        }}
      >
        <Text
          style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
        >
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}
