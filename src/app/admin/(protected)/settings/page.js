import { getSettings } from "@/lib/data";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return <SettingsForm initialSettings={settings} />;
}
