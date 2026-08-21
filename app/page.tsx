"use client";

import type { AuthStatus } from "@/hooks/useAuthStatus";
import { CloseIcon } from "./icons";
import type { Language, MenuType } from "./Header";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  language: Language;
  openMenu: MenuType;
  toggleMenu: (menu: Exclude<MenuType, null>) => void;
  auth: AuthStatus;
}

export function MobileNav({ open, onClose, language, openMenu, toggleMenu, auth }: MobileNavProps) {
  const ka = language === "ka";
  const { isLoggedIn, isAdmin } = auth;

  const items: { key: Exclude<MenuType, null>; label: string }[] = [
    { key: "about", label: ka ? "ჩვენ შესახებ" : "About" },
    { key: "shop", label: ka ? "ონლაინ შეძენა" : "Shop Online" },
    { key: "faq", label: ka ? "ხშირად დასმული კითხვები" : "FAQ" },
    { key: "contact", label: ka ? "კონტაქტი" : "Contact" },
  ];

  return (
    <>
      <div className={open ? "backdrop open" : "backdrop"} onClick={onClose} aria-hidden="true" />
      <aside className={open ? "drawer open" : "drawer"} role="dialog" aria-modal="true" aria-label={ka ? "ნავიგაცია" : "Navigation"}>
        <div className="drawerHeader">
          <strong>{ka ? "მენიუ" : "Menu"}</strong>
          <button type="button" className="closeButton" onClick={onClose} aria-label={ka ? "დახურვა" : "Close menu"}>
            <CloseIcon />
          </button>
        </div>

        <nav className="drawerNav">
          {items.map((item) => (
            <button key={item.key} type="button" className={openMenu === item.key ? "drawerLink active" : "drawerLink"} onClick={() => toggleMenu(item.key)}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="drawerActions">
          {isAdmin && <a href="/admin" className="drawerAdmin">{ka ? "ადმინ პანელი" : "Admin Panel"}</a>}
          {isLoggedIn ? (
            <a href="/account" className="drawerAccount">{ka ? "ჩემი ანგარიში" : "My Account"}</a>
          ) : (
            <>
              <a href="/login" className="drawerAccount">{ka ? "შესვლა" : "Sign In"}</a>
              <a href="/signup" className="drawerAccountOutline">{ka ? "რეგისტრაცია" : "Register"}</a>
            </>
          )}
        </div>
      </aside>

      <style jsx>{`
        .backdrop { position: fixed; inset: 0; z-index: 199; background: rgba(15, 26, 41, 0.42); opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
        .backdrop.open { opacity: 1; pointer-events: auto; }
        .drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 200; width: min(320px, 86vw); background: #ffffff; box-shadow: -20px 0 44px rgba(20, 38, 61, 0.16); transform: translateX(100%); transition: transform 0.25s ease; display: flex; flex-direction: column; }
        .drawer.open { transform: translateX(0); }
        .drawerHeader { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 16px; border-bottom: 1px solid #e5eaf0; }
        .drawerHeader strong { color: #172b43; font-size: 14px; }
        .closeButton { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #e5eaf0; border-radius: 8px; background: #ffffff; color: #172b43; cursor: pointer; }
        .closeButton:focus-visible { outline: 2px solid #1266e9; outline-offset: 2px; }
        .drawerNav { display: flex; flex-direction: column; padding: 8px 8px; }
        .drawerLink { text-align: left; padding: 14px 12px; border: 0; border-radius: 9px; background: transparent; color: #1d3048; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; }
        .drawerLink.active { color: #1266e9; background: #eef4ff; }
        .drawerLink:focus-visible { outline: 2px solid #1266e9; outline-offset: -2px; }
        .drawerActions { margin-top: auto; padding: 16px 20px 24px; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid #e5eaf0; }
        .drawerAccount, .drawerAdmin, .drawerAccountOutline { min-height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 9px; font-size: 12px; font-weight: 850; text-decoration: none; }
        .drawerAccount { background: #1266e9; color: #ffffff; }
        .drawerAdmin { background: #172b43; color: #ffffff; }
        .drawerAccountOutline { border: 1px solid #cdddf4; color: #1266e9; }
        @media (min-width: 981px) { .backdrop, .drawer { display: none; } }
      `}</style>
    </>
  );
}
