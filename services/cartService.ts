import { supabase } from "../constants/supabase";

export const addToCart = async (productId: number) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { data, error } = await supabase
    .from("cart")
    .insert([{ user_id: user.id, product_id: productId, quantity: 1 }]);

  return { data, error };
};

export const getCart = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("cart")
    .select(
      `
      id, quantity,
      products:product_id (
        title, price, image_url
      )
    `
    )
    .eq("user_id", user.id);

  return data;
};
