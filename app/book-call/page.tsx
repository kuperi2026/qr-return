"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import InterfaceIcon from "@/app/components/ui/InterfaceIcon";
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

      <section className="card">
        {sent ? (
          <div className="success">
            <span><InterfaceIcon name="check" size={28}/></span><h1>მოთხოვნა მიღებულია</h1>
            <p>ჩვენი გუნდი დაგიკავშირდებათ მითითებულ ნომერზე.</p>
            <div><Link href="/">მთავარ გვერდზე</Link><Link href="/support">ონლაინ ჩათი</Link></div>
          </div>
        ) : (
          <>
            <header><div className="callIcon"><InterfaceIcon name="phone" size={25}/></div><span>QR RETURN · SUPPORT</span><h1>ზარის დაჯავშნა</h1><p>დატოვეთ საკონტაქტო ინფორმაცია და მოკლედ აღწერეთ საკითხი.</p></header>
            <form onSubmit={submit}>
              <div className="row"><label>სახელი<input value={firstName} onChange={(e) => setFirstName(e.target.value)} required maxLength={80} autoComplete="given-name" /></label><label>გვარი<input value={lastName} onChange={(e) => setLastName(e.target.value)} required maxLength={80} autoComplete="family-name" /></label></div>
              <label>ტელეფონის ნომერი<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={30} autoComplete="tel" placeholder="+995" /></label>
              <label>რა საკითხზე გსურთ საუბარი?<textarea value={issue} onChange={(e) => setIssue(e.target.value)} required maxLength={2000} rows={4} /></label>
              {error && <p className="error" role="alert">{error}</p>}
              <button disabled={loading}>{loading ? "იგზავნება..." : "ზარის მოთხოვნის გაგზავნა"}</button>
              <Link className="chat" href="/support">ონლაინ ჩათი</Link>
            </form>
          </>
        )}
      </section>
      <style jsx>{`
        .page{box-sizing:border-box;min-height:calc(100svh - 56px);padding:48px 20px 70px;background:#f3f6fa;color:#193951;font-family:var(--font-georgian),Arial,sans-serif}.page *{box-sizing:border-box}.card{width:100%;max-width:680px;margin:auto;padding:38px 42px;border:1px solid #dce5ef;border-radius:24px;background:#fff;box-shadow:0 16px 42px #1539530c}header{margin-bottom:32px;padding-bottom:28px;border-bottom:1px solid #e5ebf2}.callIcon{display:grid;place-items:center;width:56px;height:56px;border-radius:16px;color:#315c81;background:#edf3f9;margin-bottom:22px}header>span{color:#6b8298;font-size:11px;font-weight:600;letter-spacing:.1em}h1{margin:10px 0 12px;font-size:28px;line-height:1.5;font-weight:600}header p,.success p{margin:0;color:#657b8f;font-size:15px;line-height:1.85}form{display:flex;flex-direction:column;gap:24px}.row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px}label{display:flex;flex-direction:column;gap:10px;color:#38556e;font-size:14px;font-weight:500;line-height:1.6;min-width:0}input,textarea{width:100%;padding:14px 15px;border:1px solid #d6e1ec;border-radius:12px;background:#fafcfe;color:#193951;font:inherit;font-size:16px;line-height:1.5;outline:none;min-width:0}input:focus,textarea:focus{border-color:#6e93b5;box-shadow:0 0 0 3px #e9f1f8}textarea{resize:vertical;min-height:120px}button{margin-top:4px;min-height:52px;padding:12px 18px;border:0;border-radius:12px;background:#174c78;color:#fff;font:inherit;font-size:15px;font-weight:600;line-height:1.6;cursor:pointer}button:hover{background:#123d62}button:disabled{opacity:.6;cursor:wait}:global(.page .chat){display:block;text-align:center;padding:4px 0;color:#426889;font-size:14px;text-decoration:underline;text-underline-offset:4px}.error{margin:0;padding:13px 15px;color:#a13a4a;background:#fff2f4;border-radius:10px;font-size:13px;line-height:1.7}.success{padding:25px 0;text-align:center}.success>span{display:grid;place-items:center;width:64px;height:64px;margin:0 auto 24px;border-radius:20px;background:#eaf5ee;color:#387656}.success div{display:flex;justify-content:center;flex-wrap:wrap;gap:14px;margin-top:32px}.success :global(a){padding:13px 18px;border-radius:10px;background:#174c78;color:#fff;text-decoration:none;font-size:14px}.success :global(a:last-child){color:#315c81;background:#edf3f9}a:focus-visible,button:focus-visible{outline:3px solid #80b5ea;outline-offset:3px}@media(max-width:560px){.page{padding:24px 12px 40px}.card{padding:26px 22px;border-radius:20px}.row{grid-template-columns:1fr;gap:24px}h1{font-size:25px}header{margin-bottom:26px;padding-bottom:24px}.success div{flex-direction:column}}
      `}</style>
    </main>
  );
}
