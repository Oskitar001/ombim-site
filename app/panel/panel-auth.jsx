"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PanelAuth({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();

      if (!data?.user) {
        router.push("/login");
        return;
      }

      setLoading(false);
    }

    check();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Cargando panel...
      </div>
    );
  }

  return <>{children}</>;
}
