"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PillNav from "@/components/ui/PillNav";
import Loader from "@/components/ui/Loader";
import { authService } from "@/lib/auth";

const navItems = [
  { label: "IEEE", href: "/" },
  { label: "Admin", href: "/admin" },
];

const API = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminBootcampEventsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    const token = authService.getToken();
    if (!token) {
      router.push("/");
      return;
    }
    const res = await fetch(`${API()}/admin/bootcamp/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 403) {
      setErr("Admin access denied");
      setLoading(false);
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data.error || "Failed to load");
      setLoading(false);
      return;
    }
    setEvents(data.events || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [router]);

  const del = async (id) => {
    if (!confirm("Delete this program and all registrations/updates?")) return;
    const token = authService.getToken();
    await fetch(`${API()}/admin/bootcamp/events/${id}`, {
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
    <div className="min-h-screen bg-black text-white">
      <PillNav items={navItems} />
      <div className="max-w-5xl mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bootcamp programs</h1>
          <div className="flex gap-3">
            <Link href="/admin" className="text-white/60 hover:text-white text-sm">
              ← Main admin
            </Link>
            <Link
              href="/admin/events/new"
              className="px-4 py-2 rounded-lg bg-purple-600 text-sm font-semibold"
            >
              New program
            </Link>
          </div>
        </div>
        {err && <p className="text-red-400 mb-6">{err}</p>}
        <div className="space-y-3">
          {events.map((e) => (
            <div
              key={e._id}
              className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-white/5"
            >
              <div>
                <p className="font-semibold">{e.title}</p>
                <p className="text-xs text-white/50">
                  /events/{e.slug} · {e.is_active ? "active" : "inactive"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/events/${e._id}/updates`}
                  className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20"
                >
                  Updates
                </Link>
                <Link
                  href={`/admin/events/${e._id}`}
                  className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => del(e._id)}
                  className="text-sm px-3 py-1 rounded bg-red-500/20 text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && !err && (
            <p className="text-white/50">
              No programs yet. Run{" "}
              <code className="text-purple-300">npm run seed:bootcamp</code> on the API server, or create one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
