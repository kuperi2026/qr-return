export default function Chat() {
  return (
    <main className="chatHub">
      <section className="chatPanel">
        <div className="heading">
          <span>💬</span>
          <div><small>KOMPASI CHAT</small><h1>ჩათი</h1></div>
        </div>

        <a className="chatChoice finder" href="/account/chat?source=app">
          <span className="choiceIcon">⌁</span>
          <span><strong>მპოვნელებთან საუბარი</strong><small>თქვენი QR პროფილების შეტყობინებები</small></span>
          <b>›</b>
        </a>

        <a className="chatChoice company" href="/support?source=app">
          <span className="choiceIcon">K</span>
          <span><strong>კომპანიასთან მიწერა</strong><small>დახმარება და მომსახურება</small></span>
          <b>›</b>
        </a>
      </section>

      <style jsx>{`
        .chatHub{min-height:100vh;padding:24px 12px 110px;background:radial-gradient(circle at 85% 0,rgba(61,151,239,.35),transparent 28%),linear-gradient(180deg,#07417f 0,#0a559d 245px,#eef5fb 245px);font-family:"Noto Sans Georgian","Sylfaen",Inter,Arial,sans-serif}.chatPanel{width:100%;max-width:500px;margin:auto}.heading{margin-bottom:17px;padding:15px;display:flex;align-items:center;gap:11px;border:1px solid rgba(255,255,255,.27);border-radius:20px;background:rgba(255,255,255,.13);color:#fff;box-shadow:0 18px 40px rgba(1,27,60,.2);backdrop-filter:blur(12px)}.heading>span{width:47px;height:47px;display:grid;place-items:center;border-radius:15px;background:rgba(255,255,255,.16);font-size:22px}.heading small{color:#c9e6ff;font-size:8px;font-weight:900;letter-spacing:1.2px}.heading h1{margin:2px 0 0;font-size:25px}.chatChoice{min-height:78px;margin-bottom:9px;padding:11px 12px;display:flex;align-items:center;gap:11px;border:1px solid #d2e2ef;border-radius:17px;background:#fff;color:#183b59;text-decoration:none;box-shadow:0 8px 22px rgba(4,48,94,.09)}.choiceIcon{width:48px;height:48px;display:grid;place-items:center;flex:0 0 48px;border-radius:15px;background:#e7f2ff;color:#0a69cf;font-size:22px;font-weight:950}.chatChoice>span:nth-child(2){min-width:0;flex:1}.chatChoice strong,.chatChoice small{display:block}.chatChoice strong{font-size:13px}.chatChoice small{margin-top:4px;color:#6f8598;font-size:9px}.chatChoice>b{color:#0b70d7;font-size:26px}.company{border-color:#b8daf8;background:linear-gradient(135deg,#f2f8ff,#fff)}.company .choiceIcon{background:#0b70d7;color:#fff}
      `}</style>
    </main>
  );
}
