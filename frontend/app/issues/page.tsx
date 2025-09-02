// app/issues/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

type Issue = {
  issue_id: number;
  inventory_stock_id?: number | null;
  user_id?: number | null;
  issue_date?: string | null;
  issue_quantity?: number | null;
  A_T_L_id?: number | null;
  inventory_lot_number?: string | null;
  inventory_quantity?: number | null;
  user_name?: string | null;
};

const CONFIG_API = (process.env.NEXT_PUBLIC_API_URL as string) || "";
const PRIMARY_API = CONFIG_API || "http://localhost:3001";
const FALLBACK_API = "http://localhost:3001"; // explicit fallback

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    async function fetchWithFallbacks() {
      const tryUrls = [
        `${PRIMARY_API}/api/issues/joined`,
        `${FALLBACK_API}/api/issues/joined`,
        `${PRIMARY_API}/api/issues`,
        `${FALLBACK_API}/api/issues`
      ];

      for (const url of tryUrls) {
        try {
          console.info("Trying to fetch issues from:", url);
          const res = await fetch(url, { cache: "no-store" });
          const contentType = res.headers.get("content-type") || "";

          // If server returned HTML (Next/Express error page) treat as failure and try next
          if (contentType.includes("text/html")) {
            const txt = await res.text();
            console.warn(`Got HTML response from ${url} — skipping. Preview:\n`, txt.slice(0, 500));
            continue;
          }

          // If response is JSON and ok (200-ish) parse it
          if (res.ok && contentType.includes("application/json")) {
            const data = await res.json();
            if (!mounted) return;
            setIssues(Array.isArray(data) ? data : []);
            setLoading(false);
            return;
          }

          // Not OK (404 etc.) — log and continue to next URL
          const text = await res.text().catch(() => "");
          console.warn(`Fetch to ${url} returned status ${res.status}. Body preview:`, text.slice(0, 300));
          continue;
        } catch (err: any) {
          console.error("Network / fetch error for", url, err?.message ?? err);
          // try next url
          continue;
        }
      }

      // if we get here, all attempts failed
      if (!mounted) return;
      setError("Failed to fetch issues. Check backend is running at http://localhost:3001 and that /api/issues or /api/issues/joined exists.");
      setLoading(false);
    }

    fetchWithFallbacks();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleDelete(issueId: number) {
    const ok = confirm("Delete this issue record? This action cannot be undone.");
    if (!ok) return;

    try {
      setDeleting(issueId);
      const endpoint = `${PRIMARY_API}/api/issues/${issueId}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText);
        throw new Error(txt || "Failed to delete");
      }
      setIssues((prev) => prev.filter((i) => i.issue_id !== issueId));
    } catch (err: any) {
      console.error("Delete error:", err);
      alert("Failed to delete: " + (err?.message ?? "Unknown error"));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issue Management</h1>
          <p className="text-muted-foreground">Track ammunition issues and distributions</p>
        </div>

        <Button asChild>
          <Link href="/issues/create" className="inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Issue
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="p-6 bg-muted rounded-md">Loading issues…</div>
      ) : error ? (
        <div className="p-6 bg-rose-100 text-rose-700 rounded-md">
          Error loading issues: {error}
        </div>
      ) : issues.length === 0 ? (
        <div className="p-6 bg-muted rounded-md">No issues found.</div>
      ) : (
        <div className="overflow-x-auto bg-card rounded-md border">
          <table className="min-w-full divide-y">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">#</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Issue Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Quantity</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Inventory (lot)</th>
                <th className="px-4 py-2 text-left text-sm font-medium">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Ammo Ref (A_T_L)</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {issues.map((issue) => {
                const date = issue.issue_date ? new Date(issue.issue_date) : null;
                const dateStr = date ? date.toLocaleDateString() : "-";
                return (
                  <tr key={issue.issue_id}>
                    <td className="px-4 py-3 text-sm">{issue.issue_id}</td>
                    <td className="px-4 py-3 text-sm">{dateStr}</td>
                    <td className="px-4 py-3 text-sm">{issue.issue_quantity ?? "-"}</td>
                    <td className="px-4 py-3 text-sm">{issue.inventory_lot_number ?? issue.inventory_stock_id ?? "-"}</td>
                    <td className="px-4 py-3 text-sm">{issue.user_name ?? issue.user_id ?? "-"}</td>
                    <td className="px-4 py-3 text-sm">{issue.A_T_L_id ?? "-"}</td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      <Link href={`/issues/${issue.issue_id}`}><span className="text-sm underline cursor-pointer">View</span></Link>
                      <Link href={`/issues/edit/${issue.issue_id}`}><span className="text-sm underline cursor-pointer">Edit</span></Link>
                      <button
                        onClick={() => handleDelete(issue.issue_id)}
                        disabled={deleting === issue.issue_id}
                        className="ml-2 text-sm text-rose-600 hover:underline disabled:opacity-50"
                      >
                        {deleting === issue.issue_id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
