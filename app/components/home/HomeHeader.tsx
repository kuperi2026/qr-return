"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  Chevron,
  QRIcon,
} from "./HomeIcons";

type Lang = "ka" | "en";

type Menu =
  | "about"
  | "shop"
  | "contact"
  | null;

type Props = {
  language: Lang;
  openMenu: Menu;
  setLanguage: (language: Lang) => void;
  toggleMenu: (menu: Exclude<Menu, null>) => void;
};

export default function HomeHeader({
  language,
  openMenu,
  setLanguage,
  toggleMenu,
}: Props) {
  const ka = language === "ka";
  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function checkAdmin(
      userId?: string
    ) {
      if (!userId) {
        if (active) {
          setIsAdmin(false);
        }

        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (active) {
        setIsAdmin(
          !error && Boolean(data)
        );
      }
    }

    async function loadAdminAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await checkAdmin(user?.id);
    }

    void loadAdminAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        window.setTimeout(() => {
          void checkAdmin(
            session?.user.id
          );
        }, 0);
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <header className="homeHeader">
        <div className="homeHeaderInner">

          <a href="/" className="homeBrand">
            <div className="homeBrandLogo">
              <QRIcon size={23} />
            </div>

            <div>
              <strong>QR RETURN</strong>
              <span>SMART LOST &amp; FOUND</span>
            </div>
          </a>

          <nav className="homeNav">

            <button
              onClick={() => toggleMenu("about")}
            >
              {ka ? "ჩვენ შესახებ" : "About"}
              <Chevron open={openMenu === "about"} />
            </button>

            <button
              onClick={() => toggleMenu("shop")}
            >
              {ka ? "ონლაინ შეძენა" : "Shop"}
              <Chevron open={openMenu === "shop"} />
            </button>

            <button
              onClick={() => toggleMenu("contact")}
            >
              {ka ? "კონტაქტი" : "Contact"}
            </button>

          </nav>

          <div className="homeActions">

            <div className="homeLanguages">

              <button
                className={
                  language === "ka"
                    ? "activeLanguage"
                    : ""
                }
                onClick={() => setLanguage("ka")}
              >
                GEO
              </button>

              <span />

              <button
                className={
                  language === "en"
                    ? "activeLanguage"
                    : ""
                }
                onClick={() => setLanguage("en")}
              >
                ENG
              </button>

            </div>

            {isAdmin && (
              <a
                href="/admin"
                className="homeAdmin"
              >
                {ka ? "ადმინ პანელი" : "Admin"}
              </a>
            )}

            <a
              href="/login"
              className="homeAuth"
            >
              {ka ? "შესვლა" : "Sign in"}
            </a>

            <a
              href="/signup"
              className="homeAuth"
            >
              {ka ? "რეგისტრაცია" : "Register"}
            </a>

          </div>
        </div>
      </header>

      <style jsx>{`

        .homeHeader {
          position: relative;
          z-index: 100;

          background: #0A4C8A;

          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .homeHeaderInner {
          width: calc(100% - 90px);
          max-width: 1380px;
          min-height: 78px;

          margin: auto;

          display: grid;
          grid-template-columns: 210px 1fr auto;

          align-items: center;

          gap: 25px;
        }


        /* BRAND */

        .homeBrand {
          display: flex;
          align-items: center;

          gap: 10px;

          text-decoration: none;
        }

        .homeBrandLogo {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #ffffff;
          color: #063B72;
        }

        .homeBrand strong,
        .homeBrand span {
          display: block;
        }

        .homeBrand strong {
          color: #ffffff;

          font-size: 18px;
          font-weight: 900;
        }

        .homeBrand span {
          margin-top: 3px;

          color: rgba(255, 255, 255, 0.65);

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 1.3px;
        }


        /* NAV */

        .homeNav {
          display: flex;
          align-items: center;

          gap: 28px;
        }

        .homeNav button {
          padding: 28px 0;

          display: flex;
          align-items: center;

          gap: 5px;

          border: 0;

          background: transparent;

          color: #ffffff;

          font-family: inherit;
          font-size: 14px;
          font-weight: 800;

          cursor: pointer;

          white-space: nowrap;
        }


        /* ACTIONS */

        .homeActions {
          display: flex;
          align-items: center;

          gap: 7px;

          padding-right: 25px;
        }

        .homeLanguages {
          margin-right: 9px;

          display: flex;
          align-items: center;

          gap: 7px;
        }

        .homeLanguages button {
          padding: 4px 1px;

          border: 0;

          background: transparent;

          color: rgba(255, 255, 255, 0.65);

          font-size: 12px;
          font-weight: 900;

          cursor: pointer;
        }

        .homeLanguages button.activeLanguage {
          color: #ffffff;
        }

        .homeLanguages span {
          width: 1px;
          height: 14px;

          background: rgba(255, 255, 255, 0.28);
        }


        /* AUTH */

        .homeAuth,
        .homeAdmin {
          min-height: 42px;

          padding: 0 15px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          font-size: 12px;
          font-weight: 800;

          text-decoration: none;

          white-space: nowrap;
        }

        .homeAuth {
          color: #063B72;

          background: #ffffff;

          border: 1px solid #ffffff;
        }

        .homeAuth[href="/login"] {
          color: #ffffff;
          background: transparent;
          border-color: rgba(255, 255, 255, 0.58);
        }

        .homeAdmin {
          color: #063B72;

          background: #ffffff;

          border: 1px solid #ffffff;
        }


        /* TABLET */

        @media (max-width: 1050px) {

          .homeHeaderInner {
            width: calc(100% - 35px);

            grid-template-columns:
              180px 1fr auto;

            gap: 15px;
          }

          .homeNav {
            gap: 14px;
          }

          .homeNav button {
            font-size: 11px;
          }

          .homeActions {
            padding-right: 0;
          }

          .homeAuth,
          .homeAdmin {
            padding: 0 9px;

            font-size: 10.5px;
          }

        }


        /* SMALL TABLET */

        @media (max-width: 850px) {

          .homeNav {
            width: 100%;
            padding: 0 0 10px;

            grid-column: 1 / -1;

            display: flex;
            gap: 18px;

            overflow-x: auto;
            scrollbar-width: none;
          }

          .homeNav::-webkit-scrollbar {
            display: none;
          }

          .homeNav button {
            padding: 9px 0;

            font-size: 12px;
          }

          .homeHeaderInner {
            grid-template-columns:
              auto 1fr;

            padding-top: 8px;
          }

          .homeActions {
            justify-self: end;
          }

          .homeAdmin {
            display: none;
          }

        }


        /* MOBILE */

        @media (max-width: 650px) {

          .homeHeaderInner {
            width: calc(100% - 20px);

            min-height: 68px;
          }

          .homeNav {
            gap: 15px;
          }

          .homeNav button {
            font-size: 11px;
          }

          .homeBrand span {
            display: none;
          }

          .homeBrandLogo {
            width: 36px;
            height: 36px;
          }

          .homeBrand strong {
            font-size: 13px;
          }

          .homeActions {
            gap: 5px;
          }

          .homeLanguages {
            margin-right: 2px;

            gap: 5px;
          }

          .homeLanguages button {
            font-size: 10px;
          }

          .homeAuth {
            min-height: 36px;

            padding: 0 8px;

            font-size: 10px;
          }

        }


        /* VERY SMALL MOBILE */

        @media (max-width: 430px) {

          .homeBrand strong {
            font-size: 11px;
          }

          .homeBrandLogo {
            width: 32px;
            height: 32px;
          }

          .homeLanguages {
            display: none;
          }

          .homeAuth {
            padding: 0 7px;
          }

        }

      `}</style>
    </>
  );
}
