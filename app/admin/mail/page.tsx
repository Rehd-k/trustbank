"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function AdminMailPage() {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [to, setTo] = useState("");
  const [bulkTo, setBulkTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  function send() {
    setLoading(true);
    setResult("");
    if (mode === "single") {
      api
        .post("/api/admin/mail/send", { to, subject, body })
        .then(() => setResult("Sent"))
        .catch((err) => setResult("Error: " + (err.response?.data?.error ?? "Failed")))
        .finally(() => setLoading(false));
    } else {
      const recipients = bulkTo.split(/[\n,;]/).map((e) => e.trim()).filter(Boolean);
      api
        .post("/api/admin/mail/bulk", { recipients, subject, body })
        .then((res) => setResult("Sent " + res.data.success + "/" + res.data.total))
        .catch((err) => setResult("Error: " + (err.response?.data?.error ?? "Failed")))
        .finally(() => setLoading(false));
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Send mail</h1>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setMode("single")} className="rounded border px-3 py-1.5">Single</button>
        <button onClick={() => setMode("bulk")} className="rounded border px-3 py-1.5">Bulk</button>
      </div>
      {mode === "single" && <input type="email" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} className="mb-3 w-full max-w-md rounded border px-3 py-2" />}
      {mode === "bulk" && <textarea placeholder="To (one per line or comma separated)" value={bulkTo} onChange={(e) => setBulkTo(e.target.value)} rows={4} className="mb-3 w-full max-w-md rounded border px-3 py-2" />}
      <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="mb-3 w-full max-w-md rounded border px-3 py-2" />
      <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="mb-3 w-full max-w-md rounded border px-3 py-2" />
      <button onClick={send} disabled={loading} className="rounded bg-zinc-900 px-4 py-2 text-white">{loading ? "Sending…" : "Send"}</button>
      {result && <p className="mt-2 rounded bg-zinc-100 p-2">{result}</p>}
    </div>
  );
}
