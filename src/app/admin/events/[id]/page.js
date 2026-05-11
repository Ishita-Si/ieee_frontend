"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import PillNav from "@/components/ui/PillNav";
import Loader from "@/components/ui/Loader";
import { authService } from "@/lib/auth";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "Programs", href: "/admin/events" },
];

const API = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function EditBootcampPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    (async () => {
      const token = authService.getToken();
      const res = await fetch(`${API()}/admin/bootcamp/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const ev = (data.events || []).find((x) => x._id === id);
      setForm(ev || null);
      setLoading(false);
    })();
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const token = authService.getToken();
    const { _id, createdAt, updatedAt, __v, ...rest } = form;
    const res = await fetch(`${API()}/admin/bootcamp/events/${id}`, {
      method: "PATCH",
      headers: { ...authService.getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(rest),
    });
    setSaving(false);
    if (res.ok) router.push("/admin/events");
    else alert((await res.json().catch(() => ({}))).error || "Save failed");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (!form) {
    return (
      <div className="min-h-screen bg-black text-white p-24 text-center">
        Not found <Link href="/admin/events" className="text-purple-400">Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 max-w-2xl mx-auto">
      <PillNav items={navItems} />
      <h1 className="text-2xl font-bold mb-6">Edit program</h1>
      <form onSubmit={save} className="space-y-4">
        {["title", "slug", "tagline", "short_description", "duration", "banner_url"].map((k) => (
          <div key={k}>
            <label className="block text-sm text-white/60 mb-1">{k}</label>
            <input
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
              value={form[k] || ""}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm text-white/60 mb-1">description</label>
          <textarea
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 h-28"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">roadmap</label>
          <textarea
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 h-28"
            value={form.roadmap || ""}
            onChange={(e) => setForm({ ...form, roadmap: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Active
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-purple-600">
            {saving ? "Saving…" : "Save"}
          </button>
          <Link href="/admin/events" className="px-6 py-2 rounded-lg border border-white/20">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
