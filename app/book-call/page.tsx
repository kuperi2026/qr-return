"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BookCallPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !issue.trim()) {
      setError("გთხოვთ, შეავსოთ ყველა ველი.");
      return;
    }

    try {
      setLoading(true);
      let { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const { data, error: authError } = await supabase.auth.signInAnonymously();
        if (authError) throw authError;
        user = data.user;
      }
      if (!user) throw new Error("ავტორიზაცია ვერ მოხერხდა.");

      const { data: existing, error: findError } = await supabase
        .from("support_conversations")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (findError) throw findError;

      let conversationId = existing?.id;
      if (!conversationId) {
        const { data: created, error: createError } = await supabase
          .from("support_conversations")
          .insert({ user_id: user.id })
          .select("id")
          .single();
        if (createError) throw createError;
        conversationId = created.id;
      }

      const message = `📞 ზარის დაჯავშნის მოთხოვნა\n\nსახელი: ${firstName.trim()}\nგვარი: ${lastName.trim()}\nტელეფონი: ${phone.trim()}\nსაკითხი: ${issue.trim()}`;
      const { error: messageError } = await supabase.from("support_messages").insert({
        conversation_id: conversationId,
        sender: "user",
        message,
      });
      if (messageError) throw messageError;
      setSent(true);
    } catch (err) {
      console.error("Callback request error:", err);
      setError("მოთხოვნის გაგზავნა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან ან მოგვწეროთ ონლაინ ჩათში.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <Link className="brand" href="/">QR RETURN</Link>
      <section className="card">
        {sent ? (
          <div className="success">
            <span>✓</span><h1>მოთხოვნა მიღებულია</h1>
            <p>ჩვენი გუნდი დაგიკავშირდებათ მითითებულ ნომერზე.</p>
            <div><Link href="/">მთავარ გვერდზე</Link><Link href="/support">ონლაინ ჩათი</Link></div>
          </div>
        ) : (
          <>
            <header><span>24/7 SUPPORT</span><h1>ზარის დაჯავშნა</h1><p>დატოვეთ საკონტაქტო ინფორმაცია და მოკლედ აღწერეთ საკითხი.</p></header>
            <form onSubmit={submit}>
              <div className="row"><label>სახელი<input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" /></label><label>გვარი<input value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" /></label></div>
              <label>ტელეფონის ნომერი<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+995" /></label>
              <label>რა საკითხზე გსურთ საუბარი?<textarea value={issue} onChange={(e) => setIssue(e.target.value)} rows={5} /></label>
              {error && <p className="error">{error}</p>}
              <button disabled={loading}>{loading ? "იგზავნება..." : "მოთხოვნის შენახვა"}</button>
              <Link className="chat" href="/support">💬 ან მოგვწერეთ ონლაინ ჩათში</Link>
            </form>
          </>
        )}
      </section>
      <style jsx>{`
        .page{min-height:100vh;padding:34px 18px 70px;background:radial-gradient(circle at 20% 10%,#2476b9 0,transparent 30%),linear-gradient(160deg,#0a4c8a,#052f5d);font-family:Arial,sans-serif}.brand{display:block;max-width:680px;margin:0 auto 28px;color:#fff;font-weight:950;letter-spacing:.7px;text-decoration:none}.card{max-width:680px;margin:auto;padding:36px;border-radius:24px;background:#fff;box-shadow:0 28px 75px rgba(0,18,48,.3)}header span{color:#d93449;font-size:10px;font-weight:900;letter-spacing:1.4px}h1{margin:7px 0 9px;color:#173a5e;font-size:32px}header p,.success p{margin:0 0 27px;color:#687d91;line-height:1.6}.row{display:grid;grid-template-columns:1fr 1fr;gap:13px}label{margin-bottom:16px;display:grid;gap:7px;color:#274968;font-size:13px;font-weight:850}input,textarea{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #cfdae5;border-radius:11px;color:#173a5e;background:#f9fbfd;font:inherit;outline:none}input:focus,textarea:focus{border-color:#1266e9;box-shadow:0 0 0 3px rgba(18,102,233,.1)}textarea{resize:vertical}button{width:100%;min-height:52px;border:0;border-radius:12px;color:#fff;background:#d93449;font-weight:900;cursor:pointer}button:disabled{opacity:.65}.chat{margin-top:12px;min-height:48px;display:flex;align-items:center;justify-content:center;border:1px solid #cad8e5;border-radius:12px;color:#0a4c8a;font-size:13px;font-weight:900;text-decoration:none}.error{padding:11px;border-radius:9px;color:#a61f33;background:#fff0f2;font-size:12px}.success{text-align:center}.success>span{width:64px;height:64px;margin:auto;display:grid;place-items:center;border-radius:50%;color:#fff;background:#25a36f;font-size:30px}.success div{display:flex;justify-content:center;gap:10px}.success a{padding:12px 16px;border-radius:10px;color:#fff;background:#0a4c8a;font-weight:900;text-decoration:none}.success a:last-child{background:#d93449}@media(max-width:560px){.card{padding:25px 18px}.row{grid-template-columns:1fr}h1{font-size:27px}.success div{flex-direction:column}}
      `}</style>
    </main>
  );
}
