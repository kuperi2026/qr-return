<nav className="nav">
  <button
    type="button"
    className={
      openMenu === "about"
        ? "menuButton active"
        : "menuButton"
    }
    onClick={() =>
      toggleMenu("about")
    }
  >
    {ka
      ? "ჩვენს შესახებ"
      : "About us"}

    <ChevronIcon />
  </button>

  <button
    type="button"
    className={
      openMenu === "shop"
        ? "menuButton active"
        : "menuButton"
    }
    onClick={() =>
      toggleMenu("shop")
    }
  >
    {ka
      ? "ონლაინ შეძენა"
      : "Online purchase"}

    <ChevronIcon />
  </button>

  <button
    type="button"
    className={
      openMenu === "faq"
        ? "menuButton active"
        : "menuButton"
    }
    onClick={() =>
      toggleMenu("faq")
    }
  >
    {ka
      ? "ხშირად დასმული კითხვები"
      : "FAQ"}

    <ChevronIcon />
  </button>
</nav>
