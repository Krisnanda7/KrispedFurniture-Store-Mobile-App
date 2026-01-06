import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Ambil dari app.json extra (untuk production build) atau .env (untuk development)
const supabaseUrl =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;

const supabaseKey =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("⚠️ Supabase credentials missing!");
  console.log("URL:", supabaseUrl);
  console.log("Key:", supabaseKey ? "exists" : "missing");
  // Hapus throw error supaya tidak langsung crash
  // throw new Error("Supabase URL or Key missing in .env");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");
