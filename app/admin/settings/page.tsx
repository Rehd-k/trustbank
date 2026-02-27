"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const KEYS = ["heroText", "helpPhone", "helpAddress", "supportEmail", "siteName", "maintenanceMode"];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string | number | boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/admin/settings").then((res) => { setSettings(res.data.settings || {}); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    api
      .post("/api/admin/settings", { settings })
      .then(() => setMessage("Saved"))
      .catch((err) => setMessage("Error: " + (err.response?.data?.error ?? "Failed")))
      .finally(() => setSaving(false));
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Site settings</h1>
      {message && <p className="mb-2 rounded bg-green-100 p-2">{message}</p>}
      <form onSubmit={save} className="flex max-w-lg flex-col gap-4">
        {KEYS.map((key) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium">{key}</label>
            {key === "maintenanceMode" ? (
              <input type="checkbox" checked={!!settings[key]} onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.checked }))} />
            ) : (
              <input type="text" value={String(settings[key] ?? "")} onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))} className="w-full rounded border px-3 py-2" />
            )}
          </div>
        ))}
        <button type="submit" disabled={saving} className="rounded bg-zinc-900 py-2 text-white">{saving ? "Saving…" : "Save"}</button>
      </form>
    </div>
  );
}
