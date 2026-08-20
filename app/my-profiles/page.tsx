export default function MyProfilesPage() {
  const router = useRouter();

  const [lang, setLang] =
    useState<Lang>("ka");

  const [userId, setUserId] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [items, setItems] =
    useState<ItemRow[]>([]);

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const ka = lang === "ka";

  useEffect(() => {
    void loadAccount();
  }, []);

  async function loadAccount() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");

      const {
        count: unreadCount,
        error: notificationError,
      } = await supabase
        .from("notifications")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .eq("read", false);

      if (notificationError) {
        console.error(
          "Unread notification count error:",
          notificationError
        );
      } else {
        setNotificationCount(
          unreadCount || 0
        );
      }

      const {
        data,
        error,
      } = await supabase
        .from("item")
        .select(`
          id,
          owner_id,
          tag_code,
          item_type,
          pet_type,
          item_name,
          photo,
          active,
          scan_count,
          lost_message,
          lost_seen_location,
          created_at
        `)
        .eq("owner_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setItems(
        (data || []) as ItemRow[]
      );
    } catch (err) {
      console.error(
        "My Profiles error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "პროფილების ჩატვირთვა ვერ მოხერხდა."
          : "Could not load profiles."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href =
      "/login";
  }

  const filteredItems =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      return items.filter(
        (item) => {
          const type =
            getProfileType(item);

          const filterMatch =
            filter === "all"
              ? true
              : filter === "emergency"
              ? type === "emergency"
              : filter === "return"
              ? Boolean(
                  item.lost_message ||
                    item.lost_seen_location
                )
              : type === filter;

          const text = [
            item.tag_code,
            item.item_name,
            item.item_type,
            item.pet_type,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const searchMatch =
            !q ||
            text.includes(q);

          return (
            filterMatch &&
            searchMatch
          );
        }
      );
    }, [
      items,
      search,
      filter,
    ]);

  const emergencyCount =
    items.filter(
      (item) =>
        getProfileType(item) ===
        "emergency"
    ).length;

  const returnCount =
    items.filter((item) =>
      Boolean(
        item.lost_message ||
          item.lost_seen_location
      )
    ).length;

  if (loading) {
    return (
      <main className="loading">
        {ka
          ? "QR პროფილები იტვირთება..."
          : "Loading QR profiles..."}

        <style jsx>{`
          .loading {
            min-height: 100vh;

            display: grid;
            place-items: center;

            color: #687481;
            background: #f5f7f8;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <AccountHeader
        email={email}
        notificationCount={
          notificationCount
        }
        onLogout={() =>
          void handleLogout()
        }
      />
