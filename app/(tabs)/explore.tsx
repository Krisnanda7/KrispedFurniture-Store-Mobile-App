import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import colors from "../../constants/theme";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: cat } = await supabase.from("categories").select("*");
    const { data: pop } = await supabase
      .from("products")
      .select("*")
      .order("views", { ascending: false })
      .limit(10);

    const { data: coll } = await supabase.from("collections").select("*");

    setCategories(cat || []);
    setPopular(pop || []);
    setCollections(coll || []);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background, padding: 16 }}>
      <SearchBar value={search} setValue={setSearch} />

      {/* Title */}
      <Text
        style={{
          marginTop: 20,
          fontSize: 22,
          fontWeight: "bold",
          color: colors.text,
        }}
      >
        Jelajahi Inspirasi
      </Text>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 16 }}
      >
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 10,
              paddingHorizontal: 18,
              borderRadius: 20,
              marginRight: 10,
              borderWidth: 1,
              borderColor: "#d4c1a5",
            }}
          >
            <Text style={{ color: colors.primary, fontWeight: "600" }}>
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Popular Items */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        🔥 Populer Minggu Ini
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {popular.map((item) => (
          <View key={item.id} style={{ width: 150, marginRight: 14 }}>
            <Image
              source={{ uri: item.image }}
              style={{
                width: "100%",
                height: 140,
                borderRadius: 12,
                backgroundColor: "#ddd",
              }}
            />
            <Text
              style={{ marginTop: 6, fontWeight: "600", color: colors.text }}
            >
              {item.name}
            </Text>
            <Text style={{ color: colors.secondary }}>
              Rp {item.price.toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Collections */}
      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>
        📸 Koleksi Desain
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
        {collections.map((col) => (
          <TouchableOpacity
            key={col.id}
            style={{ width: "48%", marginBottom: 14, marginRight: "4%" }}
          >
            <Image
              source={{ uri: col.image }}
              style={{
                width: "100%",
                height: 150,
                borderRadius: 10,
                backgroundColor: "#ddd",
              }}
            />
            <Text style={{ fontWeight: "600", marginTop: 6 }}>{col.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
