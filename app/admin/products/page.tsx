"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  design_name: string | null;
  description: string | null;
  sku: string;
  price: number;
  currency: string;
  image_url: string | null;
  stock_quantity: number;
  active: boolean;
  featured: boolean;
  sort_order: number;
};

type FormState = {
  id: string;
  name: string;
  slug: string;
  category: string;
  design_name: string;
  description: string;
  sku: string;
  price: string;
  currency: string;
  image_url: string;
  stock_quantity: string;
  active: boolean;
  featured: boolean;
  sort_order: string;
};

const EMPTY: FormState = {
  id: "", name: "", slug: "", category: "dog", design_name: "",
  description: "", sku: "", price: "", currency: "USD", image_url: "",
  stock_quantity: "0", active: false, featured: false, sort_order: "0",
};

function slugify(value: string) {
  return value.toLowerCase().trim()
    .replace(/[^a-z0-9Ⴀ-ჿ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("products")
      .select("id,slug,name,category,design_name,description,sku,price,currency,image_url,stock_quantity,active,featured,sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (loadError) throw loadError;
    setProducts((data || []) as Product[]);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/login?next=/admin/products");
          return;
        }
        const { data: admin } = await supabase
          .from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
        if (!admin) {
          router.replace("/");
          return;
        }
        await loadProducts();
      } catch (err) {
        setError(err instanceof Error ? err.message : "პროდუქტები ვერ ჩაიტვირთა.");
      } finally {
        setLoading(false);
      }
    })();
  }, [loadProducts, router]);

  function edit(product: Product) {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      design_name: product.design_name || "",
      description: product.description || "",
      sku: product.sku,
      price: String(product.price),
      currency: product.currency || "USD",
      image_url: product.image_url || "",
      stock_quantity: String(product.stock_quantity),
      active: product.active,
      featured: product.featured,
      sort_order: String(product.sort_order),
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("აირჩიეთ სურათის ფაილი.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("სურათი მაქსიმუმ 5MB უნდა იყოს.");
      return;
    }
    try {
      setUploading(true);
      setError("");
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `store-products/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("qr-return-images").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("qr-return-images").getPublicUrl(path);
      setForm((current) => ({ ...current, image_url: data.publicUrl }));
      setMessage("სურათი წარმატებით აიტვირთა.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "სურათი ვერ აიტვირთა.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    const price = form.price.trim() ? Number(form.price) : 0;
    const stock = Number(form.stock_quantity);
    const sort = Number(form.sort_order);
    if (!form.name.trim() || !form.sku.trim() || !form.slug.trim()) {
      setError("სახელი, Slug და SKU სავალდებულოა.");
      return;
    }
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      setError("ფასი და მარაგი სწორად შეავსეთ.");
      return;
    }
    if (form.active && (price <= 0 || stock <= 0 || !form.image_url.trim())) {
      setError("გასაყიდად გამოჩენამდე დაამატეთ ფოტო, ფასი და მარაგი.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category: form.category.trim(),
      design_name: form.design_name.trim() || null,
      description: form.description.trim() || null,
      sku: form.sku.trim(),
      price,
      currency: form.currency.trim().toUpperCase() || "USD",
      image_url: form.image_url.trim() || null,
      stock_quantity: stock,
      active: form.active,
      featured: form.featured,
      sort_order: Number.isFinite(sort) ? sort : 0,
    };
    try {
      setSaving(true);
      const request = form.id
        ? supabase.from("products").update(payload).eq("id", form.id)
        : supabase.from("products").insert(payload);
      const { error: saveError } = await request;
      if (saveError) throw saveError;
      await loadProducts();
      setForm(EMPTY);
      setMessage(form.id ? "პროდუქტი განახლდა." : "პროდუქტი დაემატა.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "პროდუქტი ვერ შეინახა.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(product: Product, key: "active" | "featured") {
    setError("");
    if (key === "active" && !product.active && (Number(product.price) <= 0 || product.stock_quantity <= 0 || !product.image_url)) {
      setError("გასაყიდად გამოჩენამდე პროდუქტს სჭირდება ფოტო, ფასი და მარაგი.");
      return;
    }
    const { error: updateError } = await supabase
      .from("products").update({ [key]: !product[key] }).eq("id", product.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await loadProducts();
  }

  if (loading) return <main className="loading">პროდუქტები იტვირთება…</main>;

  return (
    <main className="page">
      <div className="shell">
        <header>
          <div>
            <span className="eyebrow">QR RETURN STORE</span>
            <h1>პროდუქტების მართვა</h1>
            <p>დაამატეთ პროდუქტი, ატვირთეთ სურათი, მართეთ ფასი, მარაგი და მაღაზიაში ხილვადობა.</p>
          </div>
          <nav><Link href="/store">მაღაზიის ნახვა</Link><Link href="/admin">Admin Panel</Link></nav>
        </header>

        <section className="editor">
          <div className="sectionTitle">
            <div className="icon">＋</div>
            <div><h2>{form.id ? "პროდუქტის რედაქტირება" : "ახალი პროდუქტი"}</h2><p>სავალდებულო ველები მონიშნულია *</p></div>
          </div>
          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}
          <form onSubmit={save}>
            <label>პროდუქტის სახელი *<input value={form.name} onChange={(e) => setForm((v) => ({...v, name:e.target.value, slug:v.id || v.slug ? v.slug : slugify(e.target.value)}))} required /></label>
            <label>Slug *<input value={form.slug} onChange={(e) => setForm((v) => ({...v, slug:slugify(e.target.value)}))} required /></label>
            <label>კატეგორია *
              <select value={form.category} onChange={(e) => setForm((v) => ({...v, category:e.target.value}))}>
                <option value="dog">🐶 ძაღლი / Dog</option><option value="cat">🐱 კატა / Cat</option>
                <option value="keys">🔑 გასაღები / Keys</option><option value="wallet">👛 საფულე / Wallet</option>
                <option value="bag">👜 ჩანთა / Bag</option><option value="suitcase">🧳 ჩემოდანი / Suitcase</option>
                <option value="emergency">🆘 Emergency</option>
              </select>
            </label>
            <label>დიზაინის სახელი<input value={form.design_name} onChange={(e) => setForm((v) => ({...v, design_name:e.target.value}))} /></label>
            <label>SKU *<input value={form.sku} onChange={(e) => setForm((v) => ({...v, sku:e.target.value}))} required /></label>
            <label>ფასი (მოგვიანებით)<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((v) => ({...v, price:e.target.value}))} /></label>
            <label>ვალუტა<input maxLength={3} value={form.currency} onChange={(e) => setForm((v) => ({...v, currency:e.target.value}))} /></label>
            <label>მარაგი<input type="number" min="0" step="1" value={form.stock_quantity} onChange={(e) => setForm((v) => ({...v, stock_quantity:e.target.value}))} /></label>
            <label>თანმიმდევრობა<input type="number" step="1" value={form.sort_order} onChange={(e) => setForm((v) => ({...v, sort_order:e.target.value}))} /></label>
            <label className="wide">აღწერა<textarea rows={4} value={form.description} onChange={(e) => setForm((v) => ({...v, description:e.target.value}))} /></label>
            <div className="wide upload">
              <div className="preview">{form.image_url ? <img src={form.image_url} alt="პროდუქტის სურათი" /> : <span>IMG</span>}</div>
              <div><strong>პროდუქტის სურათი</strong><p>JPG, PNG ან WEBP — მაქსიმუმ 5MB</p>
                <label className="uploadButton">{uploading ? "იტვირთება…" : "სურათის ატვირთვა"}<input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} /></label>
              </div>
            </div>
            <label className="wide">სურათის URL<input type="url" value={form.image_url} onChange={(e) => setForm((v) => ({...v, image_url:e.target.value}))} placeholder="ატვირთვის შემდეგ ავტომატურად შეივსება" /></label>
            <div className="wide checks">
              <label><input type="checkbox" checked={form.active} onChange={(e) => setForm((v) => ({...v, active:e.target.checked}))} /> მაღაზიაში გამოჩნდეს (ფოტო + ფასი + მარაგი)</label>
              <label><input type="checkbox" checked={form.featured} onChange={(e) => setForm((v) => ({...v, featured:e.target.checked}))} /> რჩეული პროდუქტი</label>
            </div>
            <div className="wide actions"><button className="primary" disabled={saving || uploading}>{saving ? "ინახება…" : form.id ? "ცვლილებების შენახვა" : "პროდუქტის დამატება"}</button>{form.id && <button type="button" className="secondary" onClick={() => setForm(EMPTY)}>გაუქმება</button>}</div>
          </form>
        </section>

        <section className="list">
          <div className="listHead"><div><span className="eyebrow">CATALOG</span><h2>ყველა პროდუქტი</h2></div><strong>{products.length}</strong></div>
          <div className="grid">{products.map((product) => (
            <article key={product.id}>
              <div className="photo">{product.image_url ? <img src={product.image_url} alt={product.name} /> : <span>QR</span>}</div>
              <div className="productBody"><div className="badges"><span>{product.category}</span>{product.featured && <span>რჩეული</span>}{!product.active && <span>DRAFT</span>}</div>
                <h3>{product.name}</h3><p>{product.design_name || product.sku}</p>
                <div className="facts"><strong>{Number(product.price) > 0 ? `${Number(product.price).toFixed(2)} ${product.currency}` : "ფასი მოგვიანებით"}</strong><span>მარაგი: {product.stock_quantity}</span></div>
                <div className="cardActions"><button onClick={() => edit(product)}>რედაქტირება</button><button onClick={() => void toggle(product, "active")}>{product.active ? "დამალვა" : "გამოჩენა"}</button><button onClick={() => void toggle(product, "featured")}>{product.featured ? "რჩეულიდან მოხსნა" : "რჩეულად მონიშვნა"}</button></div>
              </div>
            </article>
          ))}</div>
        </section>
      </div>
      <style jsx>{`
        *{box-sizing:border-box}.page,.loading{min-height:100vh;background:#0647c8;color:#fff}.page{padding:32px 0 80px}.loading{display:grid;place-items:center;font-size:18px;font-weight:800}.shell{width:calc(100% - 32px);max-width:1180px;margin:auto}header{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:28px 30px;border:1px solid #ffffff3b;border-radius:24px;background:#083fad;box-shadow:0 22px 55px #001e5960}.eyebrow{font-size:12px;font-weight:900;letter-spacing:1.5px;color:#cfe0ff}h1{margin:7px 0;font-size:clamp(30px,5vw,46px);line-height:1.05}header p{margin:0;max-width:720px;color:#ffffffd1;font-size:15px;line-height:1.6}nav{display:flex;gap:9px;flex-wrap:wrap}nav :global(a){padding:11px 14px;border:1px solid #ffffff55;border-radius:11px;color:#fff;text-decoration:none;font-size:13px;font-weight:800}.editor,.list{margin-top:24px;padding:26px;border:1px solid #ffffff33;border-radius:24px;background:#0b52d6;box-shadow:0 20px 45px #001e5940}.sectionTitle{display:flex;align-items:center;gap:14px}.sectionTitle .icon{width:50px;height:50px;display:grid;place-items:center;border-radius:15px;background:#ffffff1f;font-size:30px}.sectionTitle h2,.list h2{margin:0;font-size:26px}.sectionTitle p{margin:5px 0 0;color:#ffffffb8;font-size:13px}form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:24px}label{display:grid;gap:7px;font-size:13px;font-weight:800}input,select,textarea{width:100%;border:1px solid #ffffff45;border-radius:11px;padding:12px 13px;background:#fff;color:#10213d;font:inherit;outline:none}input:focus,select:focus,textarea:focus{border-color:#fff;box-shadow:0 0 0 3px #ffffff30}.wide{grid-column:1/-1}.upload{display:flex;align-items:center;gap:16px;padding:14px;border:1px dashed #ffffff66;border-radius:16px}.preview{width:100px;height:100px;display:grid;place-items:center;overflow:hidden;border-radius:13px;background:#fff;color:#0647c8;font-weight:900}.preview img,.photo img{width:100%;height:100%;object-fit:cover}.upload p{margin:5px 0 11px;color:#ffffffb8;font-size:12px}.uploadButton{display:inline-flex;width:auto;padding:10px 13px;border-radius:9px;background:#fff;color:#0647c8;cursor:pointer}.uploadButton input{display:none}.checks{display:flex;gap:24px;flex-wrap:wrap}.checks label{display:flex;align-items:center}.checks input{width:20px;height:20px}.actions,.cardActions{display:flex;gap:9px;flex-wrap:wrap}button{cursor:pointer;border:0;font:inherit;font-weight:850}.primary,.secondary{padding:13px 18px;border-radius:11px}.primary{background:#fff;color:#0647c8}.secondary{background:#ffffff20;color:#fff;border:1px solid #ffffff44}.alert{margin-top:16px;padding:12px 14px;border-radius:11px;font-size:14px;font-weight:800}.error{background:#7f1d1d}.success{background:#08783f}.listHead{display:flex;justify-content:space-between;align-items:end}.listHead>strong{font-size:35px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:20px}article{overflow:hidden;border:1px solid #ffffff30;border-radius:18px;background:#083fad}.photo{height:210px;display:grid;place-items:center;background:#fff;color:#0647c8;font-size:35px;font-weight:950}.productBody{padding:17px}.badges{display:flex;gap:6px;flex-wrap:wrap}.badges span{padding:5px 8px;border-radius:999px;background:#ffffff1b;font-size:10px;font-weight:850}.productBody h3{margin:11px 0 3px;font-size:20px}.productBody p{margin:0;color:#ffffffb8;font-size:13px}.facts{display:flex;justify-content:space-between;gap:10px;margin:18px 0;font-size:13px}.facts strong{font-size:18px}.cardActions button{padding:9px 10px;border-radius:9px;background:#ffffff18;color:#fff;border:1px solid #ffffff3d;font-size:11px}@media(max-width:850px){form,.grid{grid-template-columns:repeat(2,minmax(0,1fr))}header{align-items:flex-start;flex-direction:column}}@media(max-width:600px){.page{padding-top:14px}.shell{width:calc(100% - 20px)}header,.editor,.list{padding:19px;border-radius:18px}form,.grid{grid-template-columns:1fr}.upload{align-items:flex-start}.preview{width:82px;height:82px}.checks{flex-direction:column;gap:12px}.photo{height:235px}header p{font-size:14px}}
      `}</style>
    </main>
  );
}
