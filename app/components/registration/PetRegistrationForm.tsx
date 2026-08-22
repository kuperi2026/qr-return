"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";

type PetRegistrationFormProps = {
  type: "dog" | "cat";
};

type OwnerData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

function createSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(
    supabaseUrl,
    supabaseKey
  );
}

export default function PetRegistrationForm({
  type,
}: PetRegistrationFormProps) {
  const router = useRouter();

  const [supabase, setSupabase] =
    useState<SupabaseClient | null>(null);

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [owner, setOwner] =
    useState<OwnerData>({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    });

  const [tagCode, setTagCode] =
    useState("");

  const [itemName, setItemName] =
    useState("");

  const [colour, setColour] =
    useState("");

  const [sex, setSex] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [weight, setWeight] =
    useState("");

  const [photo, setPhoto] =
    useState("");

  const [medicalInfo, setMedicalInfo] =
    useState("");

  const [behaviourNote, setBehaviourNote] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [finderMessage, setFinderMessage] =
    useState("");

  const [lostSeenLocation, setLostSeenLocation] =
    useState("");

  const [showEmail, setShowEmail] =
    useState(false);

  const [showPhoto, setShowPhoto] =
    useState(true);

  const [showMedicalInfo, setShowMedicalInfo] =
    useState(false);

  const [showBehaviourNote, setShowBehaviourNote] =
    useState(false);

  const [showDescription, setShowDescription] =
    useState(true);

  const [showFinderMessage, setShowFinderMessage] =
    useState(true);

  const [showLostLocation, setShowLostLocation] =
    useState(true);

  const [liveChatEnabled, setLiveChatEnabled] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const meta = useMemo(() => {
    if (type === "dog") {
      return {
        label: "ძაღლი",
        emoji: "🐶",
        title: "ძაღლის პროფილის შექმნა",
      };
    }

    return {
      label: "კატა",
      emoji: "🐱",
      title: "კატის პროფილის შექმნა",
    };
  }, [type]);

  useEffect(() => {
    async function loadAccount() {
      try {
        const client =
          createSupabaseClient();

        if (!client) {
          setErrorMessage(
            "Supabase კავშირი არ არის კონფიგურირებული."
          );

          return;
        }

        setSupabase(client);

        const {
          data: { user },
          error,
        } =
          await client.auth.getUser();

        if (error || !user) {
          router.replace("/login");
          return;
        }

        setCurrentUser(user);

        setOwner({
          firstName:
            String(
              user.user_metadata?.first_name || ""
            ),

          lastName:
            String(
              user.user_metadata?.last_name || ""
            ),

          phone:
            String(
              user.user_metadata?.phone ||
                user.phone ||
                ""
            ),

          email:
            String(
              user.email || ""
            ),
        });
      } catch (error) {
        console.error(
          "Account load error:",
          error
        );

        setErrorMessage(
          "ანგარიშის ინფორმაციის ჩატვირთვა ვერ მოხერხდა."
        );
      } finally {
        setAuthLoading(false);
      }
    }

    loadAccount();
  }, [router]);

  function handlePreview(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    if (!currentUser) {
      setErrorMessage(
        "მომხმარებლის ანგარიში ვერ მოიძებნა."
      );

      return;
    }

    if (!tagCode.trim()) {
      setErrorMessage(
        "QR / Tag Code სავალდებულოა."
      );

      return;
    }

    if (!itemName.trim()) {
      setErrorMessage(
        "ცხოველის სახელი სავალდებულოა."
      );

      return;
    }

    try {
      const draft = {
        type,
        owner,
        tagCode: tagCode.trim().toUpperCase(),
        itemName,
        colour,
        sex,
        dateOfBirth,
        weight,
        photo,
        medicalInfo,
        behaviourNote,
        description,
        finderMessage,
        lostSeenLocation,
        showEmail,
        showPhoto,
        showMedicalInfo,
        showBehaviourNote,
        showDescription,
        showFinderMessage,
        showLostLocation,
        liveChatEnabled,
      };

      sessionStorage.setItem(
        "qr_return_registration_draft",
        JSON.stringify(draft)
      );

      router.push(
        `/register-item/${type}/preview`
      );
    } catch (error) {
      console.error(
        "Preview draft error:",
        error
      );

      setErrorMessage(
        "Preview-ის გახსნა ვერ მოხერხდა."
      );
    }
  }

  if (authLoading) {
    return (
      <div className="loading">
        პროფილი იტვირთება...

        <style jsx>{`
          .loading {
            min-height: 260px;
            display: grid;
            place-items: center;
            border-radius: 20px;
            background: #ffffff;
            color: #66788c;
            font-size: 15px;
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <form
        className="form"
        onSubmit={handlePreview}
      >
        <section className="heroCard">
          <div className="heroIcon">
            {meta.emoji}
          </div>

          <div>
            <span>
              STEP 2 OF 3
            </span>

            <h1>
              {meta.title}
            </h1>

            <p>
              შეავსეთ ინფორმაცია, რომელიც
              მოგვიანებით შეგიძლიათ სრულად
              დაარედაქტიროთ.
            </p>
          </div>
        </section>

        {errorMessage && (
          <div className="errorBox">
            {errorMessage}
          </div>
        )}

        <section className="sectionCard">
          <div className="sectionHeader">
            <span>
              01
            </span>

            <div>
              <h2>
                ძირითადი ინფორმაცია
              </h2>

              <p>
                ცხოველის იდენტიფიცირებისთვის
                საჭირო ძირითადი მონაცემები.
              </p>
            </div>
          </div>

          <div className="grid">
            <Field
              label="QR / Tag Code *"
              full
            >
              <input
                value={tagCode}
                onChange={(e) =>
                  setTagCode(
                    e.target.value
                      .toUpperCase()
                      .replace(/\s/g, "")
                  )
                }
                placeholder="მაგ. QR-000123"
              />
            </Field>

            <Field label="სახელი *">
              <input
                value={itemName}
                onChange={(e) =>
                  setItemName(e.target.value)
                }
                placeholder={
                  type === "dog"
                    ? "მაგ. Max"
                    : "მაგ. Mimi"
                }
              />
            </Field>

            <Field label="ფერი">
              <input
                value={colour}
                onChange={(e) =>
                  setColour(e.target.value)
                }
                placeholder="მაგ. შავი"
              />
            </Field>

            <Field label="სქესი">
              <select
                value={sex}
                onChange={(e) =>
                  setSex(e.target.value)
                }
              >
                <option value="">
                  აირჩიეთ
                </option>

                <option value="male">
                  მამრი
                </option>

                <option value="female">
                  მდედრი
                </option>

                <option value="unknown">
                  არ არის მითითებული
                </option>
              </select>
            </Field>

            <Field label="დაბადების თარიღი">
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) =>
                  setDateOfBirth(
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="წონა">
              <input
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(e) =>
                  setWeight(e.target.value)
                }
                placeholder="kg"
              />
            </Field>

            <Field
              label="ფოტოს URL"
              full
            >
              <input
                type="url"
                value={photo}
                onChange={(e) =>
                  setPhoto(e.target.value)
                }
                placeholder="https://..."
              />
            </Field>
          </div>
        </section>

        <section className="sectionCard">
          <div className="sectionHeader">
            <span>
              02
            </span>

            <div>
              <h2>
                ჯანმრთელობა და მნიშვნელოვანი ინფორმაცია
              </h2>

              <p>
                დაამატეთ მხოლოდ ის ინფორმაცია,
                რომელიც მპოვნელს შეიძლება დასჭირდეს.
              </p>
            </div>
          </div>

          <Field
            label="სამედიცინო ინფორმაცია"
            full
          >
            <textarea
              rows={4}
              value={medicalInfo}
              onChange={(e) =>
                setMedicalInfo(
                  e.target.value
                )
              }
              placeholder="მედიკამენტები, მდგომარეობა, მნიშვნელოვანი გაფრთხილება..."
            />
          </Field>

          <Field
            label="ქცევის შესახებ ინფორმაცია"
            full
          >
            <textarea
              rows={4}
              value={behaviourNote}
              onChange={(e) =>
                setBehaviourNote(
                  e.target.value
                )
              }
              placeholder="მაგ. უცხო ადამიანებთან ფრთხილია..."
            />
          </Field>

          <Field
            label="აღწერა"
            full
          >
            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="აღწერეთ ცხოველი..."
            />
          </Field>
        </section>

        <section className="sectionCard">
          <div className="sectionHeader">
            <span>
              03
            </span>

            <div>
              <h2>
                დაკარგვის ინფორმაცია
              </h2>

              <p>
                ეს ინფორმაცია შეგიძლიათ
                მოგვიანებით შეცვალოთ ან საერთოდ
                გამორთოთ.
              </p>
            </div>
          </div>

          <Field
            label="დაკარგვის ადგილი"
            full
          >
            <input
              value={lostSeenLocation}
              onChange={(e) =>
                setLostSeenLocation(
                  e.target.value
                )
              }
              placeholder="მაგ. Central Park, New York"
            />
          </Field>

          <Field
            label="შეტყობინება მპოვნელისთვის"
            full
          >
            <textarea
              rows={4}
              value={finderMessage}
              onChange={(e) =>
                setFinderMessage(
                  e.target.value
                )
              }
              placeholder="მაგ. გთხოვთ დამიკავშირდეთ, თუ იპოვეთ."
            />
          </Field>
        </section>

        <section className="sectionCard">
          <div className="sectionHeader">
            <span>
              04
            </span>

            <div>
              <h2>
                რას დაინახავს მპოვნელი
              </h2>

              <p>
                სახელი, გვარი და ტელეფონი
                ყოველთვის გამოჩნდება. დანარჩენი
                თქვენ აკონტროლებთ.
              </p>
            </div>
          </div>

          <div className="toggleList">
            <Toggle
              label="ელფოსტის ჩვენება"
              checked={showEmail}
              onChange={setShowEmail}
            />

            <Toggle
              label="ფოტოს ჩვენება"
              checked={showPhoto}
              onChange={setShowPhoto}
            />

            <Toggle
              label="სამედიცინო ინფორმაციის ჩვენება"
              checked={showMedicalInfo}
              onChange={setShowMedicalInfo}
            />

            <Toggle
              label="ქცევის ინფორმაციის ჩვენება"
              checked={showBehaviourNote}
              onChange={setShowBehaviourNote}
            />

            <Toggle
              label="აღწერის ჩვენება"
              checked={showDescription}
              onChange={setShowDescription}
            />

            <Toggle
              label="მპოვნელისთვის შეტყობინების ჩვენება"
              checked={showFinderMessage}
              onChange={setShowFinderMessage}
            />

            <Toggle
              label="დაკარგვის ადგილის ჩვენება"
              checked={showLostLocation}
              onChange={setShowLostLocation}
            />

            <Toggle
              label="Live Chat"
              checked={liveChatEnabled}
              onChange={setLiveChatEnabled}
            />
          </div>

          <div className="phoneInfo">
            <strong>
              ტელეფონი
            </strong>

            <span>
              ყოველთვის ხილულია
            </span>
          </div>
        </section>

        <section className="bottomBar">
          <a
            href={`/register-item/${type}`}
          >
            ← უკან
          </a>

          <button
            type="submit"
            disabled={saving}
          >
            Preview →
          </button>
        </section>
      </form>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .form {
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
        }

        .heroCard,
        .sectionCard,
        .bottomBar {
          border: 1px solid #dce6f1;
          border-radius: 20px;
          background: #ffffff;

          box-shadow:
            0 12px 30px
            rgba(30,70,120,.05);
        }

        .heroCard {
          padding: 28px;

          display: flex;
          align-items: center;

          gap: 18px;
        }

        .heroIcon {
          width: 68px;
          height: 68px;

          flex: 0 0 68px;

          display: grid;
          place-items: center;

          border-radius: 18px;

          background: #0b52d6;

          color: #ffffff;

          font-size: 34px;
        }

        .heroCard span {
          color: #0b52d6;

          font-size: 13px;
          font-weight: 900;

          letter-spacing: .8px;
        }

        .heroCard h1 {
          margin: 6px 0 0;

          color: #20384f;

          font-size: 30px;
        }

        .heroCard p {
          margin: 8px 0 0;

          color: #738397;

          font-size: 15px;
        }

        .sectionCard {
          margin-top: 18px;

          padding: 28px;
        }

        .sectionHeader {
          display: flex;
          align-items: flex-start;

          gap: 14px;

          padding-bottom: 22px;

          border-bottom:
            1px solid #e6edf4;
        }

        .sectionHeader > span {
          width: 40px;
          height: 40px;

          flex: 0 0 40px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #eaf2ff;

          color: #0b52d6;

          font-size: 13px;
          font-weight: 900;
        }

        .sectionHeader h2 {
          margin: 0;

          color: #29425d;

          font-size: 21px;
        }

        .sectionHeader p {
          margin: 5px 0 0;

          color: #7b8b9d;

          font-size: 14px;
        }

        .grid {
          margin-top: 22px;

          display: grid;

          grid-template-columns:
            repeat(2,minmax(0,1fr));

          gap: 17px;
        }

        input,
        select,
        textarea {
          width: 100%;

          border: 1px solid #d5e0eb;
          border-radius: 11px;

          background: #ffffff;

          color: #253e58;

          font-family: inherit;
          font-size: 15px;

          outline: none;
        }

        input,
        select {
          min-height: 50px;

          padding: 0 14px;
        }

        textarea {
          padding: 14px;

          resize: vertical;

          line-height: 1.55;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #0b52d6;

          box-shadow:
            0 0 0 4px
            rgba(11,82,214,.08);
        }

        .toggleList {
          margin-top: 20px;

          display: grid;

          grid-template-columns:
            repeat(2,minmax(0,1fr));

          gap: 12px;
        }

        .phoneInfo {
          margin-top: 16px;

          padding: 16px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-radius: 12px;

          background: #edf4ff;
        }

        .phoneInfo strong {
          color: #29445f;

          font-size: 15px;
        }

        .phoneInfo span {
          color: #0b52d6;

          font-size: 13px;
          font-weight: 850;
        }

        .errorBox {
          margin-top: 16px;

          padding: 15px;

          border: 1px solid #efc7cb;
          border-radius: 12px;

          background: #fff7f8;

          color: #a3434c;

          font-size: 14px;
        }

        .bottomBar {
          margin-top: 18px;

          padding: 20px;

          display: flex;
          align-items: center;
          justify-content: flex-end;

          gap: 10px;
        }

        .bottomBar a,
        .bottomBar button {
          min-height: 48px;

          padding: 0 20px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 11px;

          font-family: inherit;

          font-size: 15px;
          font-weight: 850;

          text-decoration: none;
        }

        .bottomBar a {
          border:
            1px solid #cad8e7;

          background:
            #ffffff;

          color:
            #5e7186;
        }

        .bottomBar button {
          min-width: 150px;

          border: 0;

          background: #0b52d6;

          color: #ffffff;

          cursor: pointer;
        }

        @media (max-width: 700px) {
          .grid,
          .toggleList {
            grid-template-columns: 1fr;
          }

          .heroCard {
            align-items: flex-start;
          }

          .heroCard h1 {
            font-size: 24px;
          }

          .sectionCard {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}

function Field({
  label,
  full = false,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        gridColumn:
          full
            ? "1 / -1"
            : undefined,
        marginTop:
          full
            ? "18px"
            : undefined,
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: "#344d67",
          fontSize: "14px",
          fontWeight: 800,
        }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange:
    (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      style={{
        minHeight: "58px",
        padding: "0 15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "15px",
        border: "1px solid #dce6f1",
        borderRadius: "12px",
        background: "#ffffff",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <span
        style={{
          color: "#405974",
          fontSize: "14px",
          fontWeight: 750,
          textAlign: "left",
        }}
      >
        {label}
      </span>

      <span
        style={{
          width: "44px",
          height: "25px",
          flex: "0 0 44px",
          padding: "3px",
          display: "block",
          borderRadius: "999px",
          background:
            checked
              ? "#0b52d6"
              : "#d8e2ed",
        }}
      >
        <span
          style={{
            width: "19px",
            height: "19px",
            display: "block",
            borderRadius: "50%",
            background: "#ffffff",
            transform:
              checked
                ? "translateX(19px)"
                : "translateX(0)",
            transition:
              "transform .2s ease",
          }}
        />
      </span>
    </button>
  );
}
