const { useState, useMemo, useEffect } = React;

const INR = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const PRODUCTS = [
  {id: "paracetamol-1000", name:"Paracetamol 500mg", price:35, strike:45, category:"Pain Relief", stock:48, rating:4.6, img:"images/paracetamol1.jpg"},
  {id: "ibuprofen-200", name:"Ibuprofen 200mg", price:58, strike:75, category:"Pain Relief", stock:31, rating:4.4, img:"images/ibuprofen.jpg"},
  {id: "cetirizine", name:"Cetirizine Tablets", price:42, strike:55, category:"Allergy", stock:65, rating:4.5, img:"images/c1.jpg"},
  {id: "vitamin-c", name:"Vitamin C 1000mg", price:199, strike:249, category:"Vitamins", stock:23, rating:4.7, img:"images/vitaminc.jpg"},
  {id: "multivitamin", name:"Daily Multivitamin", price:349, strike:399, category:"Vitamins", stock:12, rating:4.2, img:"images/multi.jpg"},
  {id: "face-mask", name:"3‑Ply Face Masks (50)", price:149, strike:199, category:"Essentials", stock:120, rating:4.3, img:"images/mask.jpg"},
  {id: "hand-sanitizer", name:"Hand Sanitizer 500ml", price:99, strike:129, category:"Essentials", stock:87, rating:4.1, img:"images/hand.jpg"},
  {id: "bandage-roll", name:"Elastic Bandage Roll", price:79, strike:99, category:"First Aid", stock:54, rating:4.0, img:"images/bandage.jpg"},
  {id: "thermometer", name:"Digital Thermometer", price:229, strike:299, category:"Devices", stock:18, rating:4.4, img:"images/thermo.jpg"},
  {id: "bp-monitor", name:"BP Monitor", price:1699, strike:1999, category:"Devices", stock:7, rating:4.6, img:"images/bp1.jpg"},
  {id: "ORS", name:"ORS Hydration Sachets (10)", price:65, strike:85, category:"Essentials", stock:90, rating:4.2, img:"images/ors.jpg"},
  {id: "antiseptic", name:"Antiseptic Liquid 1L", price:189, strike:229, category:"First Aid", stock:32, rating:4.3, img:"images/anti1.jpg"},
];
const CATEGORIES = ["All","Pain Relief","Allergy","Vitamins","Essentials","First Aid","Devices"];

function useCart() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("smiley_cart")||"[]"); } catch { return []; }
  });
  useEffect(()=> localStorage.setItem("smiley_cart", JSON.stringify(items)), [items]);

  const add = id => setItems(prev => {
    const f = prev.find(x=>x.id===id);
    return f ? prev.map(x=>x.id===id?({...x, qty:x.qty+1}):x) : [...prev, {id, qty:1}];
  });
  const inc = id => setItems(prev => prev.map(x=>x.id===id?({...x, qty:x.qty+1}):x));
  const dec = id => setItems(prev => prev.flatMap(x=> x.id===id ? (x.qty>1?[{...x, qty:x.qty-1}]:[]) : [x]));
  const remove = id => setItems(prev => prev.filter(x=>x.id!==id));
  const clear = () => setItems([]);

  const detailed = items.map(ci => ({...ci, product: PRODUCTS.find(p=>p.id===ci.id)})).filter(x=>x.product);
  const subtotal = detailed.reduce((s, it)=> s + it.product.price*it.qty, 0);
  const count = items.reduce((n,i)=>n+i.qty,0);
  return { items, add, inc, dec, remove, clear, detailed, subtotal, count };
}

function Header({query, setQuery, category, setCategory, onOpenCart, cartCount, subtotal}){
  return (
    <div className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-sky-600 text-white grid place-content-center shadow">😊</div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight text-sky-700">Smiley Medical Store</div>
            <div className="text-[11px] text-slate-500">Your trusted medical store</div>
          </div>
        </div>
        <div className="hidden md:flex flex-1 max-w-xl items-center gap-2">
          <div className="relative w-full">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search medicines & essentials..." className="w-full pl-9 pr-3 py-2 rounded-xl border outline-none focus:ring-2 ring-sky-200" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={()=>setCategory(cat)} className={`btn ${category===cat ? 'btn-primary' : 'btn-outline'}`}>{cat}</button>
            ))}
          </div>
          <button className="btn btn-primary relative" onClick={onOpenCart}>
            🛒 Cart
            {cartCount>0 && <span className="absolute -top-2 -right-2 text-[10px] bg-rose-600 text-white rounded-full h-5 w-5 grid place-content-center">{cartCount}</span>}
          </button>
        </div>
      </div>
      {/* mobile search */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search medicines & essentials..." className="w-full pl-9 pr-3 py-2 rounded-xl border outline-none focus:ring-2 ring-sky-200" />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
        </div>
      </div>
    </div>
  );
}

function ProductCard({p, onAdd}){
  const stars = Math.round(p.rating);
  return (
    <div className="card border rounded-2xl overflow-hidden bg-white">
      <img src={p.img} alt={p.name} className="h-40 w-full object-cover" />
      <div className="p-3">
        <div className="badge">{p.category}</div>
        <div className="font-semibold mt-2 leading-snug">{p.name}</div>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <span className="font-extrabold text-slate-900">{INR(p.price)}</span>
          <span className="text-xs text-slate-400 line-through">{INR(p.strike)}</span>
        </div>
        <div className="mt-2 text-amber-500 text-sm">
          {"★".repeat(stars)}{"☆".repeat(5-stars)} <span className="text-xs text-slate-500">{p.rating.toFixed(1)}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button className="btn btn-primary flex-1" onClick={()=>onAdd(p.id)}>＋ Add to cart</button>
          <button className="btn btn-outline text-xs">In stock: {p.stock}</button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({open, onClose, detailed, subtotal, inc, dec, remove, clear, onCheckout}){
  return (
    <>
      {open && <div className="fixed inset-0 backdrop" onClick={onClose}></div>}
      <div className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl p-4 drawer ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-slate-500 text-xl">✕</button>
        </div>
        <div className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {detailed.length===0 ? <div className="text-sm text-slate-500">Your cart is empty.</div> : detailed.map(({product:p, qty}) => (
            <div key={p.id} className="flex gap-3 border rounded-xl p-3">
              <img src={p.img} alt={p.name} className="h-16 w-16 rounded-lg object-cover"/>
              <div className="flex-1">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-slate-500">Qty: {qty}</div>
                <div className="text-sm font-semibold mt-1">{INR(p.price*qty)}</div>
                <div className="mt-2 flex items-center gap-2">
                  <button className="btn btn-outline px-2" onClick={()=>dec(p.id)}>−</button>
                  <span className="text-sm w-6 text-center">{qty}</span>
                  <button className="btn btn-outline px-2" onClick={()=>inc(p.id)}>＋</button>
                  <button className="ml-auto btn btn-outline px-2" onClick={()=>remove(p.id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{INR(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{subtotal>999 ? "Free" : INR(49)}</span></div>
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{INR(subtotal + (subtotal>999?0:49))}</span></div>
          <div className="flex gap-2 mt-2">
            <button className="btn btn-primary flex-1" disabled={detailed.length===0} onClick={onCheckout}>Checkout</button>
            <button className="btn btn-outline" onClick={clear} disabled={detailed.length===0}>Clear</button>
          </div>
        </div>
      </div>
    </>
  );
}

function CheckoutModal({open, onClose, items, subtotal, onOrderPlaced}){
  if(!open) return null;
  const shipping = subtotal>999?0:49;
  const total = subtotal + shipping;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-30">
      <div className="absolute inset-0 backdrop" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-[95%] max-w-lg p-6 z-10">
        <div className="text-lg font-semibold">Checkout</div>
        <div className="mt-4 space-y-3 max-h-64 overflow-auto pr-1">
          {items.length===0 ? <div className="text-sm text-slate-500">Your cart is empty.</div> : items.map(({product:p, qty})=>(
            <div key={p.id} className="flex gap-3 border rounded-xl p-3">
              <img src={p.img} alt={p.name} className="h-16 w-16 rounded-lg object-cover"/>
              <div className="flex-1">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-slate-500">Qty: {qty}</div>
                <div className="text-sm font-semibold mt-1">{INR(p.price*qty)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 text-sm mt-4">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{INR(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping===0?'Free':INR(shipping)}</span></div>
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{INR(total)}</span></div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <input placeholder="Full Name" className="border rounded-xl px-3 py-2"/>
          <input placeholder="Phone Number" className="border rounded-xl px-3 py-2"/>
          <input placeholder="Address Line 1" className="border rounded-xl px-3 py-2 sm:col-span-2"/>
          <input placeholder="City" className="border rounded-xl px-3 py-2"/>
          <input placeholder="PIN Code" className="border rounded-xl px-3 py-2"/>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button className="btn btn-primary flex-1" disabled={items.length===0} onClick={()=>{ onOrderPlaced(); onClose(); alert('Order placed! A confirmation has been sent to your email.'); }}>Place Order</button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Hero(){
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">Everything you need for better health — delivered fast.</h1>
          <p className="mt-4 text-slate-600">Shop genuine medicines, daily essentials, and trusted devices. Real‑time stock, transparent pricing, and a secure cart.</p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <span className="badge">24×7 Online</span>
            <span className="badge">Licensed Pharmacy</span>
            <span className="badge">Free Returns</span>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-3">
            {PRODUCTS.slice(0,6).map(p => (
              <img key={p.id} src={p.img} alt={p.name} className="rounded-2xl h-28 sm:h-32 w-full object-cover shadow" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function App(){
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const cart = useCart();

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(p => (category==="All" || p.category===category) && (!q || p.name.toLowerCase().includes(q)));
  }, [query, category]);

  return (
    <div>
      <Header
        query={query} setQuery={setQuery}
        category={category} setCategory={setCategory}
        onOpenCart={()=>setCartOpen(true)}
        cartCount={cart.count}
        subtotal={cart.subtotal}
      />
      <Hero/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Popular Products</h2>
          <div className="hidden sm:block text-sm text-slate-500">{filtered.length} items</div>
        </div>
        {filtered.length===0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl grid place-content-center bg-slate-100 mb-3">🔎</div>
            <div className="font-semibold">No results for “{query}”</div>
            <div className="text-sm text-slate-500 mt-1">Try a different spelling or check another category.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} p={p} onAdd={cart.add} />)}
          </div>
        )}
      </main>

      <footer className="mt-16 border-t bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="font-bold text-sky-700">Smiley Medical Store</div>
            <div className="text-slate-500 mt-1">Licensed chemist & druggist. Genuine products, GST invoices, and expert support.</div>
          </div>
          <div>
            <div className="font-semibold">Support</div>
            <ul className="mt-2 space-y-1 text-slate-600">
              <li>Contact: +91-98765-43210</li>
              <li>Email: support@smileymedical.example</li>
              <li>WhatsApp: +91-90000-00000</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Policies</div>
            <ul className="mt-2 space-y-1 text-slate-600">
              <li>Returns & Refunds</li>
              <li>Shipping & Delivery</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Address</div>
            <div className="mt-2 text-slate-600">Shop 12, Health Plaza, MG Road, Bengaluru, KA 560001</div>
          </div>
        </div>
        <div className="text-xs text-center text-slate-500 pb-6">© <span id="year"></span> Smiley Medical Store. All rights reserved.</div>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={()=>setCartOpen(false)}
        detailed={cart.detailed}
        subtotal={cart.subtotal}
        inc={cart.inc}
        dec={cart.dec}
        remove={cart.remove}
        clear={cart.clear}
        onCheckout={()=>setOpenCheckout(true)}
      />
      <CheckoutModal open={openCheckout} onClose={()=>setOpenCheckout(false)} items={cart.detailed} subtotal={cart.subtotal} onOrderPlaced={()=>cart.clear()} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
document.getElementById("year").textContent = new Date().getFullYear();
