import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import colors from "../../constants/theme";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return Alert.alert("Login Gagal", error.message);

    router.push("/(tabs)/home");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ padding: 14, borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ padding: 14, borderWidth: 1 }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: colors.primary, padding: 14, marginTop: 14 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={{ textAlign: "center", marginTop: 14 }}>
          Belum punya akun? Daftar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
