"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PillNav from "@/components/ui/PillNav";
import { authService } from "@/lib/auth";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "Programs", href: "/admin/events" },
];

const API = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function NewBootcampPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    tagline: "",
    short_description: "",
    description: "",
    roadmap: "",
    duration: "",
    banner_url: "",
    is_active: true,
  });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = authService.getToken();
    const res = await fetch(`${API()}/admin/bootcamp/events`, {
      method: "POST",
      headers: { ...authService.getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        highlights: [],
        topics: [],
      }),
    });
    setSaving(false);
    if (res.ok) router.push("/admin/events");
    else {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Save failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 max-w-2xl mx-auto">
      <PillNav items={navItems} />
      <h1 className="text-2xl font-bold mb-6">New bootcamp program</h1>
      <form onSubmit={submit} className="space-y-4">
        {["title", "slug", "tagline", "short_description", "duration", "banner_url"].map((k) => (
          <div key={k}>
            <label className="block text-sm text-white/60 mb-1">{k}</label>
            <input
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              required={k === "title" || k === "slug"}
            />
          </div>
        ))}
        <div>
          <label className="block text-sm text-white/60 mb-1">description</label>
          <textarea
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 h-28"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-1">roadmap</label>
          <textarea
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 h-28"
            value={form.roadmap}
            onChange={(e) => setForm({ ...form, roadmap: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Active
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-purple-600 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create"}
          </button>
          <Link href="/admin/events" className="px-6 py-2 rounded-lg border border-white/20">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
