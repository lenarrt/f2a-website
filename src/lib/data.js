import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getSettings = cache(async function getSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return data;
});

export const getCategories = cache(async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getProducts = cache(async function getProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("sort_order", { ascending: true });
  return data ?? [];
});
