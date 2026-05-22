"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORGS } from "@/lib/data";
import { OrgLogo } from "@/components/ui/org-logo";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();
  const [follows, setFollows] = useState<Set<string>>(
    () => new Set(["o1", "o4", "o10"])
  );

  const toggle = (id: string) => {
    setFollows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toDashboard = () => router.push("/dashboard");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-0)",
        padding: "48px 32px 64px",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--ink-3)",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <span style={{ color: "var(--accent)" }}>Step 2 of 2</span>
          <span>·</span>
          <span>Pick your starting orgs</span>
        </div>

        <h1
          style={{
            marginTop: 14,
            fontFamily: "'Source Serif 4', serif",
            fontWeight: 500,
            fontSize: 34,
            letterSpacing: "-0.02em",
            color: "var(--ink-1)",
            lineHeight: 1.1,
          }}
        >
          Follow a few orgs to get started.
        </h1>
        <p
          style={{
            marginTop: 8,
            fontSize: 15,
            color: "var(--ink-3)",
            maxWidth: 560,
          }}
        >
          Pick anything that looks interesting — you can change this later from
          the directory. Your dashboard fills in based on who you follow.
        </p>

        {/* Org grid */}
        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
        >
          {ORGS.map((org) => {
            const on = follows.has(org.id);
            return (
              <div
                key={org.id}
                onClick={() => toggle(org.id)}
                role="checkbox"
                aria-checked={on}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggle(org.id);
                  }
                }}
                style={{
                  background: on
                    ? "color-mix(in oklch, var(--accent) 5%, var(--bg-1))"
                    : "var(--bg-1)",
                  border: `1.5px solid ${on ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  cursor: "pointer",
                  transition: "border-color 120ms ease, background 120ms ease",
                  position: "relative",
                  outline: "none",
                }}
              >
                <OrgLogo org={org} size={42} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                      color: "var(--ink-1)",
                    }}
                  >
                    {org.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "var(--ink-3)",
                      marginTop: 1,
                    }}
                  >
                    {org.category}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--ink-2)",
                      marginTop: 6,
                      lineHeight: 1.45,
                    }}
                  >
                    {org.tagline}
                  </div>
                </div>

                {/* Checkmark circle */}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    border: `1.5px solid ${on ? "var(--accent)" : "var(--border-strong)"}`,
                    background: on ? "var(--accent)" : "transparent",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    transition: "all 120ms ease",
                  }}
                >
                  {on && <Icon name="check" size={13} stroke={2.4} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
            Following{" "}
            <strong style={{ color: "var(--ink-1)" }}>{follows.size}</strong>{" "}
            {follows.size === 1 ? "org" : "orgs"}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost" onClick={toDashboard}>
              Skip for now
            </Button>
            <Button
              variant="primary"
              iconRight="arrow_r"
              onClick={toDashboard}
              disabled={follows.size === 0}
            >
              Go to dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
