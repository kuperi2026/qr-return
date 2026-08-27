"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import AdminDashboard from "@/components/admin/AdminDashboard";

type DashboardStats = {
  supportCount: number;
  totalProfiles: number;
  activeProfiles: number;
  scanCount: number;
  totalUsers: number;
  totalOrders: number;
};

const emptyStats: DashboardStats = {
  supportCount: 0,
  totalProfiles: 0,
  activeProfiles: 0,
  scanCount: 0,
  totalUsers: 0,
  totalOrders: 0,
};

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [stats, setStats] =
    useState<DashboardStats>(
      emptyStats
    );

  useEffect(() => {
    void loadAdmin();
  }, []);

  async function loadAdmin() {
    try {
      setLoading(true);
      setError("");

      /*
        1. CHECK LOGIN
      */

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      /*
        2. CHECK ADMIN ACCESS
      */

      const {
        data: admin,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      if (!admin) {
        setError(
          "Admin Access Required"
        );

        setLoading(false);
        return;
      }

      /*
        3. LOAD STATS

        თითო query ცალკეა,
        რომ რომელიმე ცხრილი თუ დროებით
        არ არსებობს, მთელი Admin
        არ ჩამოიშალოს.
      */

      const [
        profilesResult,
        activeResult,
        emergencyProfilesResult,
        activeEmergencyResult,
        usersResult,
        ordersResult,
        supportResult,
      ] = await Promise.all([
        supabase
          .from("item")
          .select(
            "id",
            {
              count: "exact",
              head: true,
            }
          ),

        supabase
          .from("item")
          .select(
            "id",
            {
              count: "exact",
              head: true,
            }
          )
          .eq(
            "active",
            true
          ),

        supabase
          .from("emergency_profiles")
          .select(
            "id",
            {
              count: "exact",
              head: true,
            }
          ),

        supabase
          .from("emergency_profiles")
          .select("id", { count: "exact", head: true })
          .eq("active", true),

        supabase
          .from("owner_accounts")
          .select("user_id", { count: "exact", head: true }),

        supabase
          .from("orders")
          .select(
            "id",
            {
              count: "exact",
              head: true,
            }
          ),

        supabase
          .from("support_conversations")
          .select("id", { count: "exact", head: true })
          .neq("status", "closed"),
      ]);

      /*
        QR scan count
        item table-ის
        scan_count ჯამი
      */

      const {
        data: scanRows,
      } = await supabase
        .from("item")
        .select(
          "scan_count"
        );

      const scanCount =
        (scanRows || []).reduce(
          (
            total:
              number,
            row:
              {
                scan_count:
                  number | null;
              }
          ) =>
            total +
            Number(
              row.scan_count ||
                0
            ),
          0
        );

      /*
        Support-ის table name
        პროექტში შეიძლება განსხვავდებოდეს.

        ამიტომ ამ ეტაპზე
        Support count = 0 რჩება,
        თვითონ Support გვერდს
        არ ვეხებით.
      */

      setStats({
        supportCount:
          supportResult.count ||
          0,

        totalProfiles:
          (profilesResult.count || 0) +
          (emergencyProfilesResult.count || 0),

        activeProfiles:
          (activeResult.count || 0) +
          (activeEmergencyResult.count || 0),

        scanCount,

        totalUsers:
          usersResult.count ||
          0,

        totalOrders:
          ordersResult.count ||
          0,
      });
    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Admin Dashboard-ის ჩატვირთვა ვერ მოხერხდა."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight:
            "100vh",

          display:
            "grid",

          placeItems:
            "center",

          background:
            "#f5f7f8",

          color:
            "#687481",

          fontFamily:
            "Arial, sans-serif",
        }}
      >
        Admin Control Center
        იტვირთება...
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          minHeight:
            "100vh",

          display:
            "grid",

          placeItems:
            "center",

          padding:
            "30px",

          background:
            "#f5f7f8",

          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth:
              "520px",

            padding:
              "24px",

            border:
              "1px solid #e1e5e8",

            borderRadius:
              "14px",

            background:
              "#ffffff",

            textAlign:
              "center",
          }}
        >
          <strong
            style={{
              display:
                "block",

              color:
                "#a33f45",

              fontSize:
                "18px",
            }}
          >
            Admin Error
          </strong>

          <p
            style={{
              marginTop:
                "10px",

              color:
                "#6f7a85",

              fontSize:
                "13px",
            }}
          >
            {error}
          </p>

          <a
            href="/"
            style={{
              display:
                "inline-block",

              marginTop:
                "15px",

              color:
                "#225fc7",

              textDecoration:
                "none",

              fontWeight:
                700,
            }}
          >
            ← QR RETURN
          </a>
        </div>
      </main>
    );
  }

  return (
    <AdminDashboard
      supportCount={
        stats.supportCount
      }
      totalProfiles={
        stats.totalProfiles
      }
      activeProfiles={
        stats.activeProfiles
      }
      scanCount={
        stats.scanCount
      }
      totalUsers={
        stats.totalUsers
      }
      totalOrders={
        stats.totalOrders
      }
    />
  );
}
