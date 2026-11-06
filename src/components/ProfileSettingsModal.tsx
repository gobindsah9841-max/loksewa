"use client";

import React, { useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import type { PublicUser } from "@/lib/auth";
import { COMMISSIONS, EXAM_LEVELS, UI_TEXT, type Lang } from "@/lib/i18n";

interface ProfileSettingsModalProps {
  user: PublicUser;
  lang: Lang;
  onClose: () => void;
  onProfileUpdated: () => void;
}

export function ProfileSettingsModal({
  user,
  lang,
  onClose,
  onProfileUpdated,
}: ProfileSettingsModalProps) {
  const t = UI_TEXT[lang];
  const [name, setName] = useState(user.name);
  const [targetCommission, setTargetCommission] = useState(
    user.targetCommission
  );
  const [targetLevel, setTargetLevel] = useState(user.targetLevel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          targetCommission,
          targetLevel,
        }),
      });
      if (res.ok) {
        onProfileUpdated();
        onClose();
      } else {
        setError("Failed to update preferences");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-[#131C31]">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#0F294A] dark:text-sky-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t.brandName} · {t.profileSettings}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ne" ? "परीक्षार्थीको नाम" : "Candidate Name"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ne" ? "लक्षित लोक सेवा आयोग" : "Target Commission"}
            </label>
            <select
              value={targetCommission}
              onChange={(e) => setTargetCommission(e.target.value)}
              className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {COMMISSIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {lang === "ne" ? c.ne : c.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === "ne" ? "परीक्षा तह / पद" : "Target Exam Level"}
            </label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {EXAM_LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {lang === "ne" ? l.ne : l.en}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              {lang === "ne" ? "बन्द गर्नुहोस्" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="min-h-[40px] rounded-lg bg-[#0F294A] px-5 text-xs font-semibold text-white hover:bg-[#1a3d6b] dark:bg-sky-500 dark:text-slate-950"
            >
              {loading
                ? "..."
                : lang === "ne"
                  ? "अपडेट सुरक्षित गर्नुहोस्"
                  : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
