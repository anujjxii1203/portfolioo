import { Suspense } from "react";
import { Metadata } from "next";
import { assertLocalDev, isAuthenticated } from "@/lib/adminAuth";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";

export const metadata: Metadata = {
  title: "Local Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

async function AdminContent() {
  assertLocalDev();
  const authed = await isAuthenticated();

  if (!authed) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center font-mono text-sm">
          Loading Admin...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
