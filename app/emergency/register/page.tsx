"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EmergencyRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    const form = new FormData(event.currentTarget);
    const { error: insertError } = await supabase.from("emergency_profiles").insert({
      tag_code: String(form.get("tag_code") || "").trim(),
      first_name: String(form.get("first_name") || "").trim(),
      owner_email: String(form.get("contact") || "").trim(),
      emergency_contact_name: String(form.get("emergency_name") || "").trim(),
      emergency_contact_phone: String(form.get("emergency_phone") || "").trim(),
      emergency_contact_enabled: true,
      location_sharing_enabled: form.get("share_location") === "on",
      show_emergency_contact: form.get("show_contact") === "on",
      show_medical_note: form.get("show_medical") === "on",
      emergency_message: String(form.get("medical_note") || "").trim(),
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      terms_version: "2026-08",
    });
    setLoading(false);
    if (insertError) { setError(insertError.message); return; }
    setSuccess("პროფილი წარმატებით შეიქმნა. QR კოდი ახლა შეგიძლია გამოიყენო.");
    event.currentTarget.reset();
  }
  return (<main className="page"><header className="header"><a href="/" className="brand"><span className="brandMark">✚</span><span><b>QR RETURN</b><small>EMERGENCY</small></span></a><a href="/register" className="back">← Lost &amp; Found</a></header><section className="shell"><div className="intro"><span className="eyebrow">EMERGENCY BRACELET</span><h1>შექმენი უსაფრთხოების პროფილი ადამიანისთვის.</h1><p>QR კოდის დასკანერებისას საჭირო ადამიანმა სწრაფად უნდა დაინახოს მხოლოდ ის ინფორმაცია, რომლის გაზიარებაც გსურს.</p><div className="promise"><span>✓</span> შენი მონაცემები კონტროლს შენთან ტოვებს</div><div className="promise"><span>✓</span> საგანგებო კონტაქტებთან სწრაფი კავშირი</div><div className="promise"><span>✓</span> ლოკაციის გაზიარება ერთი მოქმედებით</div></div><form className="form" onSubmit={submit}><div className="formHeader"><span>00</span><div><h2>QR კოდის მიბმა</h2><p>შეიყვანე ბრასლეტზე ან QR ბარათზე მითითებული კოდი.</p></div></div><label>Bracelet / QR code<input name="tag_code" required placeholder="მაგ. EMG-000123" /></label><div className="formHeader"><span>01</span><div><h2>პირადი ინფორმაცია</h2><p>ეს მონაცემები გამოიყენება შენი პროფილის იდენტიფიცირებისთვის.</p></div></div><label>სახელი ან ზედსახელი<input name="first_name" required placeholder="მაგ. ნინო" /></label><label>ელფოსტა ან ტელეფონი<input name="contact" required placeholder="საკონტაქტო ინფორმაცია" /></label><label>ფოტო <em>სურვილისამებრ</em><input type="file" /></label><div className="formHeader"><span>02</span><div><h2>საგანგებო კონტაქტი</h2><p>ვის უნდა დაუკავშირდეს მპოვნელი საჭიროების შემთხვევაში?</p></div></div><label>კონტაქტის სახელი<input name="emergency_name" required placeholder="მაგ. გიორგი — მეუღლე" /></label><label>კონტაქტის ნომერი<input name="emergency_phone" required placeholder="+995 5XX XX XX XX" /></label><div className="formHeader"><span>03</span><div><h2>რა გამოჩნდეს QR-ის სკანირებისას?</h2><p>შეგიძლია ეს ინფორმაცია მოგვიანებითაც შეცვალო.</p></div></div><label className="check"><input name="show_contact" type="checkbox" defaultChecked /> საგანგებო კონტაქტთან დარეკვის ღილაკი</label><label className="check"><input name="share_location" type="checkbox" defaultChecked /> ლოკაციის გაზიარების ღილაკი</label><label className="check"><input name="show_medical" type="checkbox" /> ჯანმრთელობის მნიშვნელოვანი ინფორმაცია</label><textarea name="medical_note" placeholder="მაგ. ალერგია, მედიკამენტი ან სხვა მნიშვნელოვანი მითითება" /><input type="hidden" name="medical_note" /><button type="submit" disabled={loading}>{loading ? "ინახება..." : "პროფილის შექმნა"} <span>→</span></button>{success && <div className="success">✓ {success}</div>}{error && <div className="error">⚠ {error}</div>}<p className="privacy">ღილაკზე დაჭერით ეთანხმები QR Return-ის წესებსა და კონფიდენციალურობის პოლიტიკას.</p></form></section><style jsx>{`*{box-sizing:border-box}.page{min-height:100vh;color:#fff7ed;background:#171216;font-family:Inter,Arial,sans-serif}.header{max-width:1180px;min-height:86px;margin:auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.1)}.brand{display:flex;align-items:center;gap:11px;color:white;text-decoration:none}.brandMark{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;color:#291814;background:#ffb36b;font-size:22px;font-weight:900}.brand b,.brand small{display:block}.brand b{font-size:16px;letter-spacing:.5px}.brand small{margin-top:3px;color:#bd9f94;font-size:9px;letter-spacing:1.5px}.back{color:#d5bcb3;text-decoration:none;font-size:13px;font-weight:700}.shell{max-width:1080px;margin:auto;padding:72px 24px 90px;display:grid;grid-template-columns:.8fr 1.2fr;gap:80px}.intro{padding-top:30px}.eyebrow{color:#ffb36b;font-size:11px;font-weight:900;letter-spacing:2px}h1{max-width:420px;margin:17px 0 20px;font-size:clamp(34px,4vw,54px);line-height:1.05;letter-spacing:-1.8px}.intro>p{max-width:420px;color:#c4aaa0;font-size:15px;line-height:1.75}.promise{margin-top:18px;display:flex;gap:10px;align-items:center;color:#ecdcd4;font-size:13px}.promise span{width:22px;height:22px;display:grid;place-items:center;border-radius:50%;color:#332019;background:#ffb36b;font-weight:900}.form{padding:30px;border:1px solid rgba(255,179,107,.2);border-radius:24px;background:#231b20;box-shadow:0 24px 70px rgba(0,0,0,.2)}.formHeader{margin:0 0 18px;display:flex;gap:12px;align-items:flex-start}.formHeader:not(:first-child){margin-top:30px}.formHeader>span{color:#ffb36b;font-size:11px;font-weight:900;letter-spacing:1px}h2{margin:0;font-size:17px}.formHeader p{margin:5px 0 0;color:#a88f88;font-size:11px;line-height:1.5}label{display:grid;gap:7px;margin-top:14px;color:#eadad3;font-size:12px;font-weight:800}label em{color:#9d8580;font-style:normal;font-weight:500}input,textarea{width:100%;border:1px solid #4a3839;border-radius:11px;outline:none;color:white;background:#1a1519;padding:13px 14px;font:inherit;font-size:13px}input:focus,textarea:focus{border-color:#ffb36b}input[type=file]{color:#b9a29a}textarea{min-height:84px;resize:vertical}.check{display:flex;align-items:center;gap:9px;font-weight:600}.check input{width:16px;height:16px;accent-color:#ff9b5e}button{width:100%;margin-top:24px;padding:15px;border:0;border-radius:12px;color:#291814;background:#ffb36b;cursor:pointer;font:inherit;font-size:14px;font-weight:900}button span{margin-left:7px;font-size:18px}.success,.error{margin-top:14px;padding:12px;border-radius:10px;font-size:12px;line-height:1.5}.success{color:#b7f0c8;background:#163826}.error{color:#ffc5bd;background:#432322}.privacy{margin:14px 0 0;color:#927e7a;font-size:10px;line-height:1.5;text-align:center}@media(max-width:800px){.shell{grid-template-columns:1fr;gap:38px;padding-top:46px}.intro{padding-top:0}}@media(max-width:520px){.header{min-height:74px}.back{font-size:11px}.shell{padding:38px 16px 60px}.form{padding:22px 18px;border-radius:18px}}`}</style></main>);
}
