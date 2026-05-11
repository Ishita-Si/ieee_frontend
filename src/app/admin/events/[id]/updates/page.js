"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PillNav from "@/components/ui/PillNav";
import Loader from "@/components/ui/Loader";
import { authService } from "@/lib/auth";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "Programs", href: "/admin/events" },
];

const API = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function BootcampUpdatesAdminPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState([]);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [link, setLink] = useState("");

  const load = async () => {
    const token = authService.getToken();
    const res = await fetch(`${API()}/admin/bootcamp/events/${id}/updates`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUpdates(data.updates || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const add = async (e) => {
    e.preventDefault();
    const token = authService.getToken();
    const res = await fetch(`${API()}/admin/bootcamp/events/${id}/updates`, {
      method: "POST",
      headers: { ...authService.getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ title, short_description: shortDescription, link }),
    });
    if (res.ok) {
      setTitle("");
      setShortDescription("");
      setLink("");
      load();
    } else alert((await res.json().catch(() => ({}))).error || "Failed");
  };

  const del = async (uid) => {
    if (!confirm("Delete this update?")) return;
    const token = authService.getToken();
    await fetch(`${API()}/admin/bootcamp/updates/${uid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 max-w-3xl mx-auto">
      <PillNav items={navItems} />
      <Link href="/admin/events" className="text-sm text-purple-400 mb-6 inline-block">
        ← Programs
      </Link>
      <h1 className="text-2xl font-bold mb-8">Program updates</h1>

      <form onSubmit={add} className="space-y-3 mb-10 p-4 rounded-xl border border-white/10">
        <input
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          placeholder="Short description"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          placeholder="https://…"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <button type="submit" className="px-4 py-2 rounded-lg bg-purple-600 text-sm">
          Add update
        </button>
      </form>

      <ul className="space-y-3">
        {updates.map((u) => (
          <li
            key={u._id}
            className="flex justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5"
          >
            <div>
              <p className="font-medium">{u.title}</p>
              <p className="text-sm text-white/50">{u.short_description}</p>
              <a href={u.link} className="text-xs text-purple-400 break-all" target="_blank" rel="noreferrer">
                {u.link}
              </a>
            </div>
            <button
              type="button"
              onClick={() => del(u._id)}
              className="text-red-400 text-sm shrink-0"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
