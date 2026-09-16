"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { createClient } from "@supabase/supabase-js";

function createSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase კავშირი ვერ მოიძებნა."
    );
  }

  return createClient(url, key);
}

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(true);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    registered,
    setRegistered,
  ] = useState(false);

  const [
    nextPath,
    setNextPath,
  ] = useState("/account");

  const [appMode, setAppMode] = useState(false);

  /*
   * აქ ვკითხულობთ URL პარამეტრებს
   * useSearchParams-ის გარეშე.
   *
   * მაგალითად:
   *
   * /login?registered=1&email=test@test.com&next=/register
   */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const registeredValue =
      params.get("registered");

    const emailValue =
      params.get("email");

    const requestedNext =
      params.get("next");
    const appSource =
      params.get("source") === "app";

    setRegistered(
      registeredValue === "1"
    );

    const rememberedEmail =
      window.localStorage.getItem(
        "qr-return-remembered-email"
      );

    if (emailValue) {
      setEmail(
        emailValue
      );
    } else if (rememberedEmail) {
      setEmail(rememberedEmail);
    }

    if (appSource) {
      window.localStorage.setItem("kompasi-app-mode", "1");
      setAppMode(true);
    }

    if (
      requestedNext &&
      requestedNext.startsWith("/") &&
      !requestedNext.startsWith("//")
    ) {
      setNextPath(
        requestedNext
      );
    } else if (appSource) {
      setNextPath("/app/profiles");
    } else {
      setNextPath(
        "/account"
      );
    }
  }, []);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage(
        "გთხოვთ შეიყვანოთ ელფოსტა."
      );

      return;
    }

    if (!password) {
      setErrorMessage(
        "გთხოვთ შეიყვანოთ პაროლი."
      );

      return;
    }

    setLoading(true);

    try {
      const supabase =
        createSupabase();

      const {
        error,
      } =
        await supabase.auth
          .signInWithPassword({
            email: cleanEmail,
            password,
          });

      if (error) {
        throw error;
      }

      if (rememberMe) {
        window.localStorage.setItem(
          "qr-return-remembered-email",
          cleanEmail
        );
      } else {
        window.localStorage.removeItem(
          "qr-return-remembered-email"
        );
      }

      /*
       * ახალი რეგისტრაცია:
       *
       * /login?...&next=/register
       *
       * => პირდაპირ 6 პროდუქტის არჩევაზე
       *
       * ჩვეულებრივი login:
       *
       * => /account
       */

      window.location.replace(
        nextPath
      );
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "";

      const lower =
        message.toLowerCase();

      if (
        lower.includes(
          "invalid login credentials"
        ) ||
        lower.includes(
          "invalid login"
        )
      ) {
        setErrorMessage(
          "ელფოსტა ან პაროლი არასწორია."
        );
      } else if (
        lower.includes(
          "email not confirmed"
        )
      ) {
        setErrorMessage(
          "გთხოვთ ჯერ დაადასტუროთ ელფოსტა."
        );
      } else {
        setErrorMessage(
          message ||
            "ანგარიშში შესვლა ვერ მოხერხდა."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className={`page ${appMode ? "appAuth" : ""}`}>
        <div
          className="decor decorOne"
          aria-hidden="true"
        >
          QR
        </div>

        <div
          className="decor decorTwo"
          aria-hidden="true"
        >
          QR
        </div>

        <header className="header">
          <a
            href={appMode ? "/app" : "/"}
            className="brand"
          >
            <span className="brandIcon">
              QR
            </span>

            <span className="brandMessage">
              ერთი ანგარიშიდან მართეთ თქვენი ყველა QR პროფილი.
            </span>
          </a>
        </header>

        <section className="center">
          <div className="card">
            {appMode && (
              <div className="productScene" aria-hidden="true">
                <svg className="flightPath" viewBox="0 0 390 150" fill="none">
                  <path d="M18 105C84 29 132 127 194 73C255 19 300 44 372 17" />
                  <path d="M39 130C112 91 173 145 240 100C286 69 320 75 365 59" />
                </svg>
                <span className="productMark markKeys">
                  <svg viewBox="0 0 32 32"><circle cx="10" cy="12" r="5"/><path d="m14 16 12 12m-5-5 3-3m-7-1 3-3"/></svg>
                </span>
                <span className="productMark markPet">
                  <svg viewBox="0 0 32 32"><circle cx="9" cy="9" r="3"/><circle cx="23" cy="9" r="3"/><circle cx="6" cy="17" r="3"/><circle cx="26" cy="17" r="3"/><path d="M10 24c0-5 3-8 6-8s6 3 6 8c0 3-3 5-6 5s-6-2-6-5Z"/></svg>
                </span>
                <span className="productMark markCase">
                  <svg viewBox="0 0 32 32"><rect x="6" y="9" width="20" height="19" rx="4"/><path d="M12 9V6c0-1 1-2 2-2h4c1 0 2 1 2 2v3M11 15v7m10-7v7"/></svg>
                </span>
                <span className="productMark markWallet">
                  <svg viewBox="0 0 32 32"><path d="M5 9c0-2 2-4 4-4h16v22H9c-2 0-4-2-4-4V9Z"/><path d="M20 14h8v8h-8c-2 0-3-2-3-4s1-4 3-4Z"/><circle cx="21" cy="18" r="1"/></svg>
                </span>
                <span className="productMark markEmergency">
                  <svg viewBox="0 0 32 32"><rect x="4" y="9" width="24" height="14" rx="7"/><path d="M16 12v8m-4-4h8"/></svg>
                </span>
                <span className="sceneDot dotOne" />
                <span className="sceneDot dotTwo" />
                <span className="sceneQr">
                  <svg viewBox="0 0 40 40">
                    <path d="M4 4h11v11H4zm4 4v3h3V8zM25 4h11v11H25zm4 4v3h3V8zM4 25h11v11H4zm4 4v3h3v-3z" fillRule="evenodd" />
                    <path d="M19 4h3v6h-3zm0 10h7v4h-7zm11 4h6v4h-6zm-11 4h4v5h-4zm7 3h4v4h-4zm7 1h3v10h-3zM19 31h10v5H19z" />
                  </svg>
                </span>
              </div>
            )}
             <h1>
              შედით თქვენს ანგარიშში
            </h1>

             {registered && (
              <div className="successNotice">
                ✓ ანგარიში შექმნილია.
                შედით და გააგრძელეთ
                პროდუქტის არჩევა.
              </div>
            )}

            {errorMessage && (
              <div
                className="error"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="field">
                <label htmlFor="email">
                  ელ-ფოსტა
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field">
                <div className="passwordLabel">
                  <label htmlFor="password">
                    პაროლი
                  </label>

                  <a
                    href={appMode ? "/forgot-password?source=app" : "/forgot-password"}
                    className="forgot"
                  >
                    დაგავიწყდათ პაროლი?
                  </a>
                </div>

                <div className="passwordBox">
                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="showButton"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                  >
                    {showPassword
                      ? "დამალვა"
                      : "ნახვა"}
                  </button>
                </div>
              </div>

              <label className="rememberRow">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                />
                <span>
                  პაროლის დამახსოვრება
                </span>
              </label>

              <button
                type="submit"
                className="submit"
                disabled={loading}
              >
                {loading
                  ? "შესვლა..."
                  : registered
                    ? "შესვლა და გაგრძელება →"
                    : "შესვლა"}
              </button>
            </form>

            <div className="divider">
              <span />
            </div>

            <div className="signup">
              <span>
                არ გაქვთ ანგარიში?
              </span>

              <a href={appMode ? "/signup?source=app" : "/signup"}>
                რეგისტრაცია
              </a>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;

          padding: 0 20px 30px;

          background:
            radial-gradient(
              circle at 21% 17%,
              rgba(78, 166, 238, 0.3),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #0a4c8a 0%,
              #063b72 100%
            );

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .decor {
          position: fixed;

          color:
            rgba(255, 255, 255, 0.04);

          font-size: 150px;
          font-weight: 950;

          pointer-events: none;
          user-select: none;
        }

        .decorOne {
          top: 15%;
          left: 6%;

          transform:
            rotate(-14deg);
        }

        .decorTwo {
          right: 7%;
          bottom: 8%;

          transform:
            rotate(14deg);
        }

        .header {
          position: relative;
          z-index: 2;

          width: 100%;
          max-width: 1060px;
          height: 68px;

          margin: auto;

          display: flex;
          align-items: center;

          border-bottom:
            1px solid
            rgba(255, 255, 255, 0.18);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;

          transform: translateY(12px);

          text-decoration: none;
        }

        .brandIcon {
          width: 41px;
          height: 41px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #ffffff;
          color: #0647c8;

          font-size: 15px;
          font-weight: 950;
        }

        .brandMessage {
          max-width: 430px;

          color: #ffffff;

          font-size: 17px;
          font-weight: 800;
          line-height: 1.4;
        }

        .center {
          position: relative;
          z-index: 2;

          min-height:
            calc(100vh - 90px);

          display: grid;
          place-items: center;

          padding: 20px 0 35px;
        }

        .card {
          width: 100%;
          max-width: 430px;

          padding:
            29px 30px 27px;

          border-radius: 18px;

          background: #ffffff;

          box-shadow:
            0 24px 58px
            rgba(0, 24, 78, 0.3);
        }

        .eyebrow {
          display: block;

          margin-bottom: 10px;

          color: #0647c8;

          font-size: 10px;
          font-weight: 900;

          letter-spacing: 0.7px;
        }

        h1 {
          margin: 0;

          color: #203a55;

          font-size: 24px;
          font-weight: 900;

          line-height: 1.25;
        }

        .description {
          margin: 12px 0 0;

          color: #78899a;

          font-size: 13px;

          line-height: 1.55;
        }

        .successNotice {
          margin-top: 17px;

          padding:
            11px 13px;

          border:
            1px solid #cfe5d8;

          border-radius: 9px;

          background: #f1fbf5;
          color: #24704a;

          font-size: 12px;
          font-weight: 750;

          line-height: 1.45;
        }

        form {
          margin-top: 23px;

          display: grid;

          gap: 18px;
        }

        .field label {
          display: block;

          color: #42576b;

          font-size: 15px;
          font-weight: 850;
        }

        .field > label {
          margin-bottom: 8px;
        }

        .passwordLabel {
          margin-bottom: 8px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;
        }

        .forgot {
          color: #0647c8;

          font-size: 14px;
          font-weight: 800;

          text-decoration: none;
        }

        .forgot:hover {
          text-decoration: underline;
        }

        input {
          display: block;

          width: 100%;
          height: 56px;

          padding: 0 16px;

          border:
            1.5px solid #d5e0ea;

          border-radius: 11px;

          background: #fbfdff;
          color: #263f59;

          font-family: inherit;
          font-size: 15px;

          outline: none;
        }

        input:focus {
          border-color: #1266e9;

          background: #ffffff;

          box-shadow:
            0 0 0 4px
            rgba(18, 102, 233, 0.09);
        }

        .passwordBox {
          position: relative;
        }

        .passwordBox input {
          padding-right: 85px;
        }

        .rememberRow {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #42576b;
          font-size: 14px;
          font-weight: 850;
          line-height: 1.35;
          cursor: pointer;
        }

        .rememberRow input {
          width: 18px;
          height: 18px;
          margin: 1px 0 0;
          padding: 0;
          flex: 0 0 auto;
          accent-color: #0a4c8a;
          box-shadow: none;
        }

        .rememberRow small {
          display: block;
          margin-top: 3px;
          color: #8291a0;
          font-size: 10px;
          font-weight: 600;
        }

        .showButton {
          position: absolute;

          top: 50%;
          right: 9px;

          transform:
            translateY(-50%);

          min-width: 61px;
          height: 34px;

          border: 0;
          border-radius: 8px;

          background: #edf4ff;
          color: #0647c8;

          font-family: inherit;
          font-size: 13px;
          font-weight: 850;

          cursor: pointer;
        }

        .submit {
          width: 100%;
          height: 51px;

          border: 0;
          border-radius: 10px;

          background: #0647c8;
          color: #ffffff;

          font-family: inherit;
          font-size: 13px;
          font-weight: 900;

          cursor: pointer;

          box-shadow:
            0 8px 19px
            rgba(6, 71, 200, 0.18);
        }

        .submit:hover:not(:disabled) {
          background: #0754dc;
        }

        .submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .error {
          margin-top: 16px;

          padding:
            10px 12px;

          border:
            1px solid #f0ced2;

          border-radius: 9px;

          background: #fff3f4;
          color: #a3424a;

          font-size: 12px;

          line-height: 1.45;
        }

        .divider {
          margin:
            23px 0 18px;
        }

        .divider span {
          display: block;

          height: 1px;

          background: #e7edf3;
        }

        .signup {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 5px;

          color: #718396;

          font-size: 14px;
        }

        .signup a {
          color: #0647c8;

          font-weight: 900;

          text-decoration: none;
        }

        .page.appAuth {
          padding: 0 12px 28px;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 18% 3%, rgba(83, 185, 255, .45), transparent 29%),
            linear-gradient(165deg, #0b579b 0%, #073f78 50%, #052d59 100%);
        }

        .appAuth .decor { display: none; }
        .appAuth .header { display: none; }
        .appAuth .brand { transform: none; }
        .appAuth .brandIcon { width: 38px; height: 38px; border-radius: 12px; }
        .appAuth .brandMessage { display:none; }
        .appAuth .center { min-height: 100vh; padding: 24px 0; align-items: start; }
        .appAuth .card { max-width: 440px; padding: 18px 16px 15px; border: 1px solid rgba(255,255,255,.8); border-radius: 18px; box-shadow: 0 18px 42px rgba(1,24,58,.28); }
        .productScene{position:relative;height:164px;margin:-3px -2px 14px;overflow:hidden;border-radius:16px;background:radial-gradient(circle at 50% 46%,rgba(255,255,255,.9) 0 13%,transparent 32%),radial-gradient(circle at 15% 8%,rgba(61,159,231,.19),transparent 35%),linear-gradient(155deg,#edf9ff 0%,#dceff9 52%,#e7f7f1 100%)}
        .productScene:before,.productScene:after{content:"";position:absolute;border:1px solid rgba(25,117,181,.13);border-radius:50%}.productScene:before{width:210px;height:210px;left:-79px;top:-130px}.productScene:after{width:170px;height:170px;right:-85px;bottom:-117px}.flightPath{position:absolute;inset:0;width:100%;height:100%}.flightPath path{stroke:rgba(10,111,177,.25);stroke-width:1.35;stroke-linecap:round;stroke-dasharray:3 7}.productMark{position:absolute;width:43px;height:43px;display:grid;place-items:center;color:#0b609b;filter:drop-shadow(0 8px 7px rgba(13,82,127,.16));transform:rotate(var(--turn))}.productMark:before{content:"";position:absolute;inset:4px;border-radius:50%;background:rgba(255,255,255,.88);box-shadow:inset 0 0 0 1px rgba(255,255,255,.95)}.productMark svg{position:relative;z-index:1;width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}.markKeys{--turn:-13deg;left:6%;top:58%}.markPet{--turn:7deg;left:23%;top:14%;color:#078b6d}.markCase{--turn:-5deg;right:23%;top:13%;color:#6653ca}.markWallet{--turn:11deg;right:5%;top:55%;color:#bb651c}.markEmergency{--turn:-7deg;left:48.5%;bottom:3%;color:#bd3650}.sceneQr{position:absolute;left:50%;top:46%;width:60px;height:60px;display:grid;place-items:center;transform:translate(-50%,-50%) rotate(5deg);border:6px solid rgba(255,255,255,.96);border-radius:18px;background:linear-gradient(145deg,#0873c9,#079b78);color:#fff;box-shadow:0 16px 30px rgba(5,75,123,.25),inset 0 1px 0 rgba(255,255,255,.25)}.sceneQr:after{content:"";position:absolute;right:-9px;top:21px;width:9px;height:16px;border-radius:0 8px 8px 0;background:#fff}.sceneQr svg{width:34px;height:34px;fill:currentColor;transform:rotate(-5deg)}.sceneDot{position:absolute;width:5px;height:5px;border-radius:50%;background:#2db999;box-shadow:0 0 0 5px rgba(45,185,153,.1)}.dotOne{left:17%;top:30%}.dotTwo{right:16%;bottom:28%;width:4px;height:4px;background:#368bdd;box-shadow:0 0 0 4px rgba(54,139,221,.1)}
        .appAuth h1 { font-size: 20px; text-align: center; }
        .appAuth .field { margin-top: 11px; }
        .appAuth input { height: 44px; border-radius: 10px; font-size: 15px; }
        .appAuth .submit { height: 45px; margin-top:14px;border-radius: 11px; background: #0aa369; box-shadow: 0 8px 19px rgba(10,163,105,.22); }
        .appAuth .submit:hover:not(:disabled) { background: #078a58; }
        .appAuth .signup { font-size: 12px; }

        @media (max-width: 520px) {
          .brandMessage {
            font-size: 15px;
          }

          .card {
            padding:
              25px 19px;

            border-radius: 16px;
          }

          h1 {
            font-size: 23px;
          }

          input {
            height: 54px;

            font-size: 16px;
          }
          .page.appAuth .card{padding:17px 13px 14px}
          .page.appAuth input{height:44px;font-size:15px}
        }
      `}</style>
    </>
  );
}
