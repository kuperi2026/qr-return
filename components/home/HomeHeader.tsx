"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomeHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center gap-6 px-6">

        {/* LOGO */}
        <Link
          href="/"
          className="shrink-0 text-xl font-black tracking-tight text-blue-600"
        >
          QR RETURN
        </Link>

        {/* LEFT MENU */}
        <nav className="flex flex-1 items-center gap-5 text-[14px] font-semibold text-slate-700">

          {/* ABOUT */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("about")}
              className="flex items-center gap-1 transition hover:text-blue-600"
            >
              ჩვენს შესახებ
              <span className="text-xs">⌄</span>
            </button>

            {openMenu === "about" && (
              <div className="absolute left-0 top-10 w-64 rounded-2xl border border-blue-100 bg-white p-2 shadow-xl">
                <Link
                  href="/#founder"
                  onClick={() => setOpenMenu(null)}
                  className="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-blue-600"
                >
                  დამფუძნებლის სიტყვა
                </Link>

                <Link
                  href="/#mission"
                  onClick={() => setOpenMenu(null)}
                  className="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-blue-600"
                >
                  მისია და ხედვა
                </Link>
              </div>
            )}
          </div>

          {/* HOW TO BUY */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("buy")}
              className="flex items-center gap-1 transition hover:text-blue-600"
            >
              როგორ შევიძინო
              <span className="text-xs">⌄</span>
            </button>

            {openMenu === "buy" && (
              <div className="absolute left-0 top-10 w-80 rounded-2xl border border-blue-100 bg-white p-5 shadow-xl">
                <h3 className="mb-2 font-bold text-slate-900">
                  შეიძინე QR RETURN
                </h3>

                <p className="mb-4 text-sm font-normal leading-6 text-slate-600">
                  აირჩიე შენთვის სასურველი QR RETURN პროდუქტი,
                  შეიძინე მაღაზიაში და მიღების შემდეგ დაარეგისტრირე
                  QR კოდი შენს ანგარიშზე.
                </p>

                <Link
                  href="/store"
                  onClick={() => setOpenMenu(null)}
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-bold text-white transition hover:bg-blue-700"
                >
                  მაღაზიის გახსნა
                </Link>
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("faq")}
              className="flex items-center gap-1 transition hover:text-blue-600"
            >
              ხშირად დასმული კითხვები
              <span className="text-xs">⌄</span>
            </button>

            {openMenu === "faq" && (
              <div className="absolute left-0 top-10 max-h-[480px] w-[420px] overflow-y-auto rounded-2xl border border-blue-100 bg-white p-5 shadow-xl">
                <FAQ
                  question="როგორ მუშაობს QR RETURN?"
                  answer="QR კოდის დასკანერების შემდეგ მპოვნელს შეუძლია ნახოს თქვენ მიერ გაზიარებული ინფორმაცია და დაგიკავშირდეთ."
                />

                <FAQ
                  question="სჭირდება მპოვნელს აპლიკაციის ჩამოტვირთვა?"
                  answer="არა. QR კოდის დასკანერება შესაძლებელია ჩვეულებრივი სმარტფონის კამერით."
                />

                <FAQ
                  question="შემიძლია ჩემი მონაცემების შეცვლა?"
                  answer="დიახ. თქვენს ანგარიშში შეგიძლიათ მართოთ და განაახლოთ პროფილის ინფორმაცია."
                />

                <FAQ
                  question="რისთვის შემიძლია QR RETURN-ის გამოყენება?"
                  answer="QR RETURN შეგიძლიათ გამოიყენოთ შინაური ცხოველებისთვის, გასაღებისთვის, საფულისთვის, ჩანთისთვის, ჩემოდნისთვის და სხვა მხარდაჭერილი პროდუქტებისთვის."
                />

                <FAQ
                  question="აჩვენებს QR კოდი ჩემს ყველა პირად ინფორმაციას?"
                  answer="არა. თქვენ თავად აკონტროლებთ, რომელი დამატებითი ინფორმაცია იყოს ხილული მპოვნელისთვის."
                />
              </div>
            )}
          </div>

          {/* CONTACT */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("contact")}
              className="flex items-center gap-1 transition hover:text-blue-600"
            >
              კონტაქტი
              <span className="text-xs">⌄</span>
            </button>

            {openMenu === "contact" && (
              <div className="absolute left-0 top-10 w-64 rounded-2xl border border-blue-100 bg-white p-3 shadow-xl">
                <Link
                  href="/support"
                  onClick={() => setOpenMenu(null)}
                  className="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-blue-600"
                >
                  💬 Live Chat
                </Link>

                <a
                  href="tel:+10000000000"
                  className="block rounded-xl px-4 py-3 hover:bg-blue-50 hover:text-blue-600"
                >
                  ☎ ტელეფონი
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT MENU */}
        <div className="flex shrink-0 items-center gap-3 text-sm font-semibold">

          <Link
            href="/register"
            className="text-slate-700 transition hover:text-blue-600"
          >
            რეგისტრაცია
          </Link>

          <Link
            href="/login"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700"
          >
            შესვლა
          </Link>

          <button className="rounded-lg px-2 py-2 text-blue-600 hover:bg-blue-50">
            KA / EN
          </button>

          <Link
            href="/admin-dashboard"
            className="rounded-xl border border-blue-200 px-3 py-2.5 text-blue-600 transition hover:bg-blue-50"
          >
            Admin Panel
          </Link>

        </div>
      </div>
    </header>
  );
}

function FAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="border-b border-slate-100 py-3 last:border-0">
      <summary className="cursor-pointer list-none font-semibold text-slate-800">
        {question}
      </summary>

      <p className="pt-2 text-sm font-normal leading-6 text-slate-600">
        {answer}
      </p>
    </details>
  );
}
