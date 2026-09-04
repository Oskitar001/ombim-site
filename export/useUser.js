"use client";

import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // ⭐ NECESARIO PARA LEER LA COOKIE
      });

      const data = await res.json();

      if (data?.user) {
        setUser(data.user);
        setRole(data.role);
      } else {
        setUser(null);
        setRole(null);
      }
    } catch (err) {
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, role, loading, refresh: fetchUser };
}
