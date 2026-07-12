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

export const getPartners = cache(async function getPartners() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partners")
    .select("*, partner_products(*)")
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, foreignTable: "partner_products" });
  return data ?? [];
});

export const getPartnerProducts = cache(async function getPartnerProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partner_products")
    .select("*, partner:partners(name)")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getOffers = cache(async function getOffers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("offers")
    .select("*, partner_product:partner_products(name)")
    .order("sort_order", { ascending: true });
  return data ?? [];
});
