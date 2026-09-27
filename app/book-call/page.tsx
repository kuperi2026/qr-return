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
    <main className="bookingPage">
      <section className="bookingCard">
        <aside className="callIntro">
          <div className="callBrand">QR RETURN <span>მხარდაჭერა</span></div>
          <div className="callIntroBody"><span className="callIcon"><InterfaceIcon name="phone" size={27}/></span><h1>ზარის დაჯავშნა</h1><p>დაგვიტოვეთ ნომერი და მოგვიყევით, რაში გჭირდებათ დახმარება.</p></div>
          <ol className="callSteps"><li><span>01</span><p>შეავსეთ საკონტაქტო ინფორმაცია</p></li><li><span>02</span><p>ჩვენი გუნდი დაგიკავშირდებათ</p></li></ol>
          <Link className="callAlternative" href="/support"><InterfaceIcon name="chat" size={22}/><span><small>წერა გირჩევნიათ?</small><strong>ონლაინ ჩათი</strong></span><InterfaceIcon name="arrow" size={17}/></Link>
        </aside>
        <div className="callForm">
          {sent ? <div className="callSuccess" role="status"><span><InterfaceIcon name="check" size={28}/></span><h2>მოთხოვნა მიღებულია</h2><p>ჩვენი გუნდი დაგიკავშირდებათ მითითებულ ნომერზე.</p><div><Link href="/">მთავარ გვერდზე</Link><Link href="/support">ონლაინ ჩათი</Link></div></div> : <>
            <header className="formHeading"><span>საკონტაქტო ინფორმაცია</span><h2>როგორ დაგიკავშირდეთ?</h2></header>
            <form onSubmit={submit}>
              <div className="nameFields"><label>სახელი<input value={firstName} onChange={e => setFirstName(e.target.value)} required maxLength={80} autoComplete="given-name" placeholder="სახელი" /></label><label>გვარი<input value={lastName} onChange={e => setLastName(e.target.value)} required maxLength={80} autoComplete="family-name" placeholder="გვარი" /></label></div>
              <label>ტელეფონის ნომერი<input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required maxLength={30} autoComplete="tel" placeholder="+995 5XX XX XX XX" /></label>
              <label>რა საკითხზე გსურთ საუბარი?<textarea value={issue} onChange={e => setIssue(e.target.value)} required maxLength={2000} rows={3} placeholder="მოკლედ აღწერეთ თქვენი შეკითხვა…" /></label>
              {error && <p className="callError" role="alert">{error}</p>}
              <div className="formAction"><button type="submit" disabled={loading}><span>{loading ? "იგზავნება…" : "ზარის მოთხოვნის გაგზავნა"}</span><InterfaceIcon name="arrow" size={18}/></button><small>ყველა ველი აუცილებელია.</small></div>
            </form>
          </>}
        </div>
      </section>
      <style jsx>{`
        .bookingPage{min-height:calc(100svh - 56px);box-sizing:border-box;padding:56px 24px 72px;background:#f3f6f9;color:#17354c;font-family:var(--font-georgian),Arial,sans-serif}.bookingPage *{box-sizing:border-box}.bookingCard{display:grid;grid-template-columns:340px minmax(0,1fr);max-width:990px;margin:auto;border:1px solid #dbe4ed;border-radius:24px;background:#fff;box-shadow:0 20px 60px #1d426010;overflow:hidden}
        .callIntro{display:flex;flex-direction:column;padding:32px;background:linear-gradient(155deg,#194e73,#153b57 65%,#176775);color:#fff}.callBrand{display:flex;align-items:center;justify-content:space-between;gap:12px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:.08em}.callBrand span{font-family:var(--font-georgian),Arial,sans-serif;font-size:13px;letter-spacing:0;font-weight:400;color:#bfd1df}.callIntroBody{margin-top:46px}.callIcon{display:grid;place-items:center;width:58px;height:58px;border:1px solid #ffffff25;border-radius:17px;background:#c1efdf;color:#1c625d}.callIntro h1{font-size:30px;line-height:1.6;font-weight:600;letter-spacing:-.3px;margin:22px 0 12px}.callIntroBody p{font-size:16px;line-height:1.95;color:#dfebf4;margin:0}.callSteps{display:grid;gap:19px;list-style:none;padding:0;margin:30px 0 38px}.callSteps li{display:flex;align-items:center;gap:12px}.callSteps li>span{display:grid;place-items:center;flex:0 0 27px;height:27px;border:1px solid #ffffff26;border-radius:50%;font-size:13px;color:#a1d9c8}.callSteps p{font-size:14px;line-height:1.75;margin:0;color:#d3dfe8}
        .callIntro :global(.callAlternative){display:flex;align-items:center;gap:13px;color:#c4e8dc;text-decoration:none;border-top:1px solid #ffffff23;padding-top:23px;margin-top:auto}.callIntro :global(.callAlternative>span){flex:1}.callIntro :global(.callAlternative small){display:block;color:#b7cbd9;font-size:13px;line-height:1.6}.callIntro :global(.callAlternative strong){display:block;color:#fff;font-size:16px;line-height:1.8;font-weight:500;margin-top:2px}.callIntro :global(.callAlternative:hover strong){color:#a6dfce}
        .callForm{padding:38px 42px 32px;background:linear-gradient(180deg,#f3f9ff,#fff 45%)}.formHeading{margin-bottom:27px}.formHeading>span{font-size:13px;line-height:1.6;color:#32816b;font-weight:600}.formHeading h2{font-size:24px;line-height:1.6;font-weight:600;margin:8px 0 0;letter-spacing:-.2px}form{display:flex;flex-direction:column;gap:21px}.nameFields{display:grid;grid-template-columns:1fr 1fr;gap:18px}label{display:flex;flex-direction:column;gap:9px;font-size:15px;line-height:1.65;font-weight:500;min-width:0;color:#3f5a70}input,textarea{width:100%;min-width:0;padding:12px 14px;border:1px solid #d8e2ec;border-radius:10px;font:inherit;font-size:16px;line-height:1.6;font-weight:400;background:#f3f8fc;color:#193954;outline:none;transition:border-color .15s,box-shadow .15s}input{height:48px}textarea{min-height:112px;resize:vertical}input::placeholder,textarea::placeholder{color:#648097;font-size:15px}input:focus,textarea:focus{background:#fff;border-color:#589485;box-shadow:0 0 0 3px #eaf4f0}.formAction{margin-top:4px}.formAction button{width:100%;min-height:49px;padding:12px 17px;display:flex;justify-content:center;align-items:center;gap:12px;background:#176d65;color:#fff;border:1px solid #176d65;border-radius:10px;font:inherit;font-size:16px;font-weight:500;line-height:1.65;cursor:pointer}.formAction button:hover{background:#125b55}.formAction button:disabled{opacity:.55;cursor:wait}.formAction small{display:block;text-align:center;margin-top:12px;font-size:13px;color:#7a8d9c}.callError{margin:0;padding:12px 14px;border-radius:10px;background:#fff2f3;color:#a03c4a;font-size:15px;line-height:1.8}
        .callSuccess{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:480px;text-align:center}.callSuccess>span{width:66px;height:66px;display:grid;place-items:center;border-radius:50%;background:#e2f2e9;color:#33785e;margin-bottom:23px}.callSuccess h2{font-size:27px;font-weight:600;line-height:1.6;margin:0 0 12px}.callSuccess p{max-width:310px;font-size:16px;line-height:1.9;color:#687e90;margin:0}.callSuccess>div{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:30px}.callSuccess :global(a){font-size:15px;padding:12px 17px;border-radius:9px;background:#143650;color:#fff;text-decoration:none}.callSuccess :global(a:last-child){background:#edf4f0;color:#31775e}.bookingPage :global(a:focus-visible),button:focus-visible{outline:3px solid #7ebdb0;outline-offset:3px}
        @media(max-width:850px){.bookingPage{padding:32px 20px 48px}.bookingCard{grid-template-columns:290px minmax(0,1fr)}.callIntro{padding:27px}.callForm{padding:32px 28px}.nameFields{gap:12px}.callIntro h1{font-size:27px}.formHeading h2{font-size:23px}}
        @media(max-width:680px){.bookingPage{padding:22px 14px 35px}.bookingCard{grid-template-columns:1fr;max-width:480px;border-radius:20px}.callIntro{padding:24px}.callBrand{font-size:14px}.callIntroBody{position:relative;margin-top:23px;padding-left:57px}.callIcon{position:absolute;left:0;top:3px;width:42px;height:42px;border-radius:12px}.callIntro h1{font-size:26px;margin:0 0 8px}.callIntroBody p{font-size:15px;line-height:1.85}.callSteps{display:none}.callIntro :global(.callAlternative){margin-top:22px;padding-top:16px}.callIntro :global(.callAlternative small){display:inline}.callIntro :global(.callAlternative strong){display:inline;margin-left:8px;font-size:15px}.callForm{padding:26px 24px}.formHeading{margin-bottom:23px}.formHeading h2{font-size:23px}form{gap:19px}.nameFields{gap:13px}input,textarea{font-size:16px}input::placeholder,textarea::placeholder{font-size:14px}.formAction button{font-size:15px}.callSuccess{min-height:330px}}
        @media(max-width:360px){.nameFields{grid-template-columns:1fr;gap:19px}.callForm{padding:24px 20px}.callIntro{padding:23px 20px}}
      `}</style>
    </main>
  );
}
