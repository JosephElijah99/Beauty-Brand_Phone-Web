/* ── RASAMI Beauty – app.js with Supabase Backend ── */

/* ── SUPABASE CONFIG ── */
const SUPA_URL = 'https://ngcrcjrgybzsdnlxeuiu.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nY3JjanJneWJ6c2RubHhldWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDczMTksImV4cCI6MjA5NTAyMzMxOX0.fAIdQqhZSuOBXeZyYYID58KJZyVqAEo7T4VkTPvn0JU';

/* ── SUPABASE API HELPER ── */
async function supa(method, table, body=null, query='', token=null){
  const headers = {
    'apikey': SUPA_KEY,
    'Authorization': `Bearer ${token || SUPA_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': method==='POST' ? 'return=representation' : 'return=minimal'
  };
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}${query}`, {
    method, headers, body: body ? JSON.stringify(body) : null
  });
  if(!res.ok){ const err = await res.text(); console.error('Supabase error:', err); return null; }
  try{ return await res.json(); } catch{ return true; }
}

/* ── SUPABASE AUTH ── */
async function supaSignIn(email, password){
  const res = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, {
    method:'POST',
    headers:{'apikey':SUPA_KEY,'Content-Type':'application/json'},
    body: JSON.stringify({email, password})
  });
  const data = await res.json();
  if(data.access_token){
    sessionStorage.setItem('rasami_token', data.access_token);
    sessionStorage.setItem('rasami_user', JSON.stringify({email: data.user?.email}));
    return {success:true, token: data.access_token};
  }
  return {success:false, error: data.error_description || 'Invalid credentials'};
}

async function supaSignOut(){
  const token = sessionStorage.getItem('rasami_token');
  if(token){
    await fetch(`${SUPA_URL}/auth/v1/logout`, {
      method:'POST',
      headers:{'apikey':SUPA_KEY,'Authorization':`Bearer ${token}`}
    });
  }
  sessionStorage.removeItem('rasami_token');
  sessionStorage.removeItem('rasami_user');
  window.location.href='index.html';
}

function getToken(){ return sessionStorage.getItem('rasami_token'); }
function isLoggedIn(){ return !!getToken(); }

/* ── IMAGE URL CONVERTER ── */
function rawUrl(url){
  return url.replace('https://github.com/','https://raw.githubusercontent.com/').replace('/blob/','/')
}

/* ── PRODUCTS ── */
const PRODUCTS=[
  {id:1,name:"Hydrating Gel Cleanser",cat:"Cleanser",price:10000,badge:"Bestseller",isNew:false,
   keyIngredients:"Hibiscus · Chamomile · Panthenol",
   image:"https://raw.githubusercontent.com/JosephElijah99/Rasama-Beauty-Brand-Website/main/Images/Hydrated%20Gel%20Cleanser%201.jpeg",
   desc:"A gentle daily face wash designed for really gentle cleansing, without the typical stripping after-feel. A blend of chamomile, rice protein, and hibiscus extracts that helps to reduce inflammation and soothe irritated skin.",
   benefits:["Gentle cleansing, non-stripping","Soothes irritation, calms inflammation"],
   ingredients:"Aqua, Glycerin, Potassium Cocoyl Glycinate, Sodium C14-16 Alpha Olefin Sulfonate, Cocamidopropyl Betaine, Coco Glucoside, PEG-40 Hydrogenated Castor Oil, Hydroxyethyl Cellulose, Hydrolyzed Rice Protein, Panthenol, Hibiscus Sabdariffa Flower Extract, Chamomilla Recutita Flower Extract, Polyquaternium 7, Xanthan Gum, Sodium Chloride, Fragrance, Sodium Sulfate, Potassium Sorbate, Sodium Benzoate, Propylene Glycol, Diazolidinyl Urea, Iodopropynyl Butylcarbamate.",
   directions:"Massage onto wet skin for at least 30 seconds. Rinse thoroughly and pat dry with a soft cloth.",
   caution:"For external use only. Avoid contact with eyes. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.",stock:25},
  {id:2,name:"Niacinamide Face Serum",cat:"Serum",price:9000,badge:"Bestseller",isNew:false,
   keyIngredients:"Niacinamide · N-Acetyl Glucosamine · Alpha Arbutin",
   image:"https://raw.githubusercontent.com/JosephElijah99/Beauty-Brand_Phone-Web/main/Images/Niacinamide%20Face%20Serum%201.jpeg",
   desc:"A lightweight serum infused with niacinamide and other active ingredients that work in synergy to promote smooth, even skin, helping to refine skin tone and texture for a brighter, healthier-looking skin.",
   benefits:["Promotes smooth texture","Brightens, refines skin tone","Helps fade dark marks post acne"],
   ingredients:"Aqua, Niacinamide, Butylene Glycol, N-Acetyl Glucosamine, Propanediol, Alpha Arbutin, Betaine, Xanthan Gum, Polyquaternium 10, Sodium Citrate, Propylene Glycol, Diazolidinyl Urea, Iodopropynyl Butylcarbamate.",
   directions:"Apply a few drops onto cleansed face and neck. Use in the morning and at night before moisturizer.",
   caution:"For external use only. Avoid contact with eyes. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.",stock:20},
  {id:3,name:"Moisture Boost Face Cream",cat:"Moisturizer",price:10500,badge:"New",isNew:true,
   keyIngredients:"Niacinamide · Hyaluronic Acid · Panthenol",
   image:"https://raw.githubusercontent.com/JosephElijah99/Rasama-Beauty-Brand-Website/main/Images/Moisture%20Boost%20Face%20Cream%201.jpeg",
   desc:"A gel cream designed to boost moisture in the skin. A lightweight, non-greasy and fast absorbing formula that nourishes, plumps and revives dull, dehydrated skin.",
   benefits:["Nourishes and plumps","Revives dull, dehydrated skin","Brightens and improves radiance"],
   ingredients:"Aqua, N-Acetyl Glucosamine, Caprylic/Capric Triglyceride, Niacinamide, Betaine, Panthenol, Butylene Glycol, Allantoin, Camellia Sinensis Seed Oil, Vitis Vinifera Seed Oil, Tocopherol, Sodium Hyaluronate, Cetearyl Olivate, Stearic Acid, Cetearyl Alcohol, Xanthan Gum, Sodium Hydroxide, Glycerin, Carbomer, Sorbitan Olivate, Disodium EDTA, Dimethicone, Phenoxyethanol, Propylene Glycol, Diazolidinyl Urea, Iodopropynyl Butylcarbamate, Fragrance.",
   directions:"Apply morning and evening over the face and neck. For better results, use the RASAMI Beauty Niacinamide Serum before the cream.",
   caution:"For external use only. Avoid contact with eyes. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.",stock:18},
  {id:4,name:"Glow Essence Body Lotion",cat:"Body",price:25000,badge:"Bestseller",isNew:false,
   keyIngredients:"Turmeric Extract · Hyaluronic Acid · Sym White 377",
   image:"https://raw.githubusercontent.com/JosephElijah99/Rasama-Beauty-Brand-Website/main/Images/Glow%20Essence%20Body%20Lotion%201.jpeg",
   desc:"Combines powerful antioxidants and skin brighteners to maintain healthy, beautiful skin. Hydrates, moisturizes and supports firm, youthful looking skin while promoting even skin tone.",
   benefits:["Hydrates and moisturizes, improves skin lustre","Supports firm, youthful looking skin","Improves the appearance of sun damage and promotes even skin tone"],
   ingredients:"Aqua, Helianthus Annuus Seed Oil, Propylene Glycol, Butyrospermum Parkii Butter, Methyl Sulfonyl Methane, Dimethicone, Cetyl Alcohol, Glycerin, Cetearyl Alcohol, Stearic Acid, PEG-20 Stearate, Glyceryl Stearate, Phenylethyl Resorcinol, Curcuma Longa Root Extract, Sodium Hyaluronate, Tocopherol, Allantoin, Xanthan Gum, Phenoxyethanol, Caprylyl Glycol, Sorbic Acid, Fragrance.",
   directions:"Gently massage the lotion onto the entire body in circular motions. Apply as needed throughout the day.",
   caution:"Do not rub or scrub too hard to avoid micro tears. For external use only. Avoid contact with eyes. Keep out of reach of children.",stock:15},
  {id:5,name:"Island Coconut Body Polish",cat:"Body",price:15000,badge:"New",isNew:true,
   keyIngredients:"Sucrose · Coconut Oil · Beeswax · Vitamin E",
   image:"https://raw.githubusercontent.com/JosephElijah99/Rasama-Beauty-Brand-Website/main/Images/Island%20Coconut%20Body%20polish%201.jpeg",
   desc:"A rich, creamy sugar exfoliant that removes dead skin cells while nourishing with fatty acids. Reveals a softer, smoother and more radiant skin.",
   benefits:["Reveals softer, smoother and more radiant skin","Improves skin texture","Increased blood circulation for a healthy glow"],
   ingredients:"Sucrose, Cocos Nucifera Oil, Isopropyl Myristate, Stearic Acid, Polysorbate 80, Cetearyl Alcohol, Cetyl Alcohol, Polysorbate 60, Cera Alba, Tocopherol, Propylene Glycol, Diazolidinyl Urea, Iodopropynyl Butylcarbamate, Fragrance.",
   directions:"Apply over dry or damp skin in circular motion. Rinse off with water. Use two to three times weekly.",
   caution:"Do not rub too hard to avoid micro tears. For external use only. Avoid contact with eyes. Keep out of reach of children.",stock:22},
  {id:6,name:"Velvet Oat & Licorice Shower Milk",cat:"Body",price:29500,badge:"Bestseller",isNew:false,
   keyIngredients:"Colloidal Oat · Licorice Root Extract",
   image:"https://raw.githubusercontent.com/JosephElijah99/Beauty-Brand_Phone-Web/main/Images/Velvet%20oat%20%26%20Licorice%20Shower%20Milk%20Real.jpeg",
   desc:"Gently cleanses and brightens without stripping the skin of its natural oils. Combines the soothing properties of colloidal oatmeal with the brightening benefits of licorice root.",
   benefits:["Ideal for sensitive skin including eczema, rashes, and psoriasis","Mild exfoliation","Fades dark spots"],
   ingredients:"Water, Sodium C14-16 Olefin Sulfonate, Cocamidopropyl Betaine, Glycerin, Polysorbate 20, Decyl Glucoside, Polyquaternium 7, Avena Sativa Kernel Flour, Glycyrrhiza Glabra Root Extract, Fragrance, Propylene Glycol, Iodopropynyl Butylcarbamate, Diazolidinyl Urea.",
   directions:"Apply two to three pumps to wet puff or palms. Lather and wash the body, then rinse thoroughly.",
   caution:"For external use only. Avoid contact with eyes. Keep out of reach of children.",stock:12},
  {id:7,name:"Cocoa-Mango Body Butter",cat:"Body",price:17000,badge:"",isNew:false,
   keyIngredients:"Urea · Mango Butter · Cocoa Butter",
   image:"https://raw.githubusercontent.com/JosephElijah99/Rasama-Beauty-Brand-Website/main/Images/Cocoa-Mango%20Body%20Butter%201%20(Pair).jpeg",
   desc:"A blend of Cocoa butter and Mango butter with vital moisturizing oils and actives that keeps your skin hydrated all day.",
   benefits:["Helps improve the appearance of rough, dry and patchy skin","Promotes smoother, softer skin"],
   ingredients:"Water, Cocos Nucifera Oil, Hydroxyethyl Urea, Butyrospermum Parkii Butter, Mangifera Indica Seed Butter, Cetearyl Alcohol, Theobroma Cacao Seed Butter, Tocopherol, Sodium Hyaluronate, Allantoin, Xanthan Gum, Propylene Glycol, Diazolidinyl Urea, Iodopropynyl Butylcarbamate, Fragrance.",
   directions:"Scoop a generous amount, warm between palms and apply on skin, paying attention to dryer areas.",
   caution:"For external use only. Avoid contact with eyes. Keep out of reach of children.",stock:19},
  {id:8,name:"Golden Glow Turmeric & Honey Soap",cat:"Soap",price:12000,badge:"New",isNew:true,
   keyIngredients:"Turmeric · Raw Honey · Shea Butter · Vitamin E",
   image:"https://raw.githubusercontent.com/JosephElijah99/Beauty-Brand_Phone-Web/main/Images/Tumeric%20and%20Honey%20Real.jpeg",
   desc:"A handcrafted artisan bar combining the healing power of turmeric with raw honey. Gently cleanses while brightening dull skin, fading dark spots, and leaving your complexion radiant and nourished.",
   benefits:["Brightens and evens out skin tone","Fades dark spots and hyperpigmentation","Deeply moisturises and softens skin","Anti-inflammatory — soothes irritated skin"],
   ingredients:"Saponified Coconut Oil, Saponified Palm Oil, Shea Butter, Raw Honey, Turmeric Powder, Castor Oil, Vitamin E Oil, Distilled Water, Sodium Hydroxide, Natural Fragrance.",
   directions:"Wet skin with lukewarm water. Lather soap and massage in circular motions for 30–60 seconds. Rinse and pat dry.",
   caution:"For external use only. Turmeric may temporarily stain light towels. Patch test for sensitive skin. Keep out of reach of children.",stock:30},
];

/* ── SETTINGS ── */
let CFG = JSON.parse(localStorage.getItem('rasami_cfg')||'null')||{
  pk:'pk_live_65f452eda574b09fcb6edce23919dd28d0e76bd8',
  wa:'+2347047572322',
  email:'rasamiskincare@outlook.com',
  name:'RASAMI Beauty'
};

/* ── CART (sessionStorage) ── */
let cart = JSON.parse(sessionStorage.getItem('rasami_cart')||'[]');
function saveCart(){ sessionStorage.setItem('rasami_cart', JSON.stringify(cart)); }
function cartTotal(){ return cart.reduce((s,x)=>s+x.price*x.qty,0); }

/* ── NAV ACTIVE ── */
function setActiveNav(){
  const page = window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nl').forEach(a=>{ if(a.getAttribute('href')===page) a.classList.add('active'); });
}
function toggleMob(){ document.getElementById('navLinks').classList.toggle('mob-open'); }

/* ── CART FUNCTIONS ── */
function addToCart(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p||p.stock===0) return;
  const ex=cart.find(x=>x.id===id);
  if(ex){ if(ex.qty<p.stock) ex.qty++; else{ showToast('Max stock reached'); return; }}
  else cart.push({id:p.id,name:p.name,price:p.price,image:p.image,qty:1});
  saveCart(); updateCartUI(); showToast(p.name+' added ✓');
  closeProductModal();
}
function removeFromCart(id){ cart=cart.filter(x=>x.id!==id); saveCart(); updateCartUI(); }
function changeQty(id,d){
  const item=cart.find(x=>x.id===id); if(!item) return;
  item.qty+=d; if(item.qty<1) removeFromCart(id); else{ saveCart(); updateCartUI(); }
}
function updateCartUI(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  const cc=document.getElementById('cartCount'); if(cc) cc.textContent=count;
  const el=document.getElementById('cartItemsEl'), foot=document.getElementById('cartFootEl');
  if(!el) return;
  if(!cart.length){
    el.innerHTML='<div class="cart-empty">Your cart is empty.<br>Add a product to begin.</div>';
    if(foot) foot.style.display='none'; return;
  }
  el.innerHTML=cart.map(x=>`
    <div class="ci">
      <div class="ci-img"><img src="${x.image}" alt="${x.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.style.background='var(--ivw)'"></div>
      <div class="ci-info">
        <div class="ci-name">${x.name}</div>
        <div class="ci-price">₦${(x.price*x.qty).toLocaleString()}</div>
        <div class="ci-qty">
          <button class="qb" onclick="changeQty(${x.id},-1)">−</button>
          <span class="qv">${x.qty}</span>
          <button class="qb" onclick="changeQty(${x.id},1)">+</button>
        </div>
      </div>
      <button class="ci-rm" onclick="removeFromCart(${x.id})">✕</button>
    </div>`).join('');
  if(foot){ foot.style.display='block'; document.getElementById('cartTotalEl').textContent='₦'+cartTotal().toLocaleString(); }
}
function toggleCart(){ document.getElementById('cartDrawer').classList.toggle('open'); closeProductModal(); }

/* ── PRODUCT MODAL ── */
function openProduct(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p) return;
  document.getElementById('productModalContent').innerHTML=`
    <div class="pm-img-wrap"><img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.style.background='var(--ivw)'"></div>
    <div class="pm-info">
      <div class="pm-cat">${p.cat}</div>
      ${p.badge?`<span class="pm-badge${p.isNew?' new':''}">${p.badge}</span>`:''}
      <h2 class="pm-name">${p.name}</h2>
      <div class="pm-price">₦${p.price.toLocaleString()}</div>
      <div class="pm-key-ing">✨ <strong>Key Ingredients:</strong> ${p.keyIngredients}</div>
      <div class="pm-divider"></div>
      <div class="pm-section-title">📝 About</div><p class="pm-text">${p.desc}</p>
      <div class="pm-section-title">✅ Key Benefits</div>
      <ul class="pm-list">${p.benefits.map(b=>`<li>${b}</li>`).join('')}</ul>
      <div class="pm-section-title">🧪 Full Ingredients</div><p class="pm-text pm-small">${p.ingredients}</p>
      <div class="pm-section-title">📋 Direction of Use</div><p class="pm-text">${p.directions}</p>
      ${p.caution?`<div class="pm-section-title">⚠️ Caution</div><p class="pm-text pm-caution">${p.caution}</p>`:''}
      <div class="pm-actions">
        ${p.stock>0?`<button class="pm-add-btn" onclick="addToCart(${p.id})">Add to Cart — ₦${p.price.toLocaleString()}</button>`:`<button class="pm-add-btn" style="background:var(--ivd);color:var(--tmu);cursor:not-allowed" disabled>Out of Stock</button>`}
        <button class="pm-close-btn" onclick="closeProductModal()">Close</button>
      </div>
    </div>`;
  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeProductModal(){
  const m=document.getElementById('productModal');
  if(m){ m.classList.remove('open'); document.body.style.overflow=''; }
}

/* ── CHECKOUT ── */
function openCheckout(){
  document.getElementById('cartDrawer').classList.remove('open');
  const sumEl=document.getElementById('orderSumEl');
  if(sumEl) sumEl.innerHTML=`<div class="os-title">Order Summary</div>`+
    cart.map(x=>`<div class="os-line"><span>${x.name} × ${x.qty}</span><span>₦${(x.price*x.qty).toLocaleString()}</span></div>`).join('')+
    `<div class="os-total"><span>Total</span><span>₦${cartTotal().toLocaleString()}</span></div>`;
  const fa=document.getElementById('checkoutFormArea'); if(fa) fa.style.display='block';
  const sv=document.getElementById('successView'); if(sv) sv.classList.remove('show');
  document.getElementById('checkoutModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCheckout(){ document.getElementById('checkoutModal').classList.remove('open'); document.body.style.overflow=''; }

function initiatePaystack(){
  const fn=document.getElementById('f-fname').value.trim();
  const ln=document.getElementById('f-lname').value.trim();
  const em=document.getElementById('f-email').value.trim();
  const ph=document.getElementById('f-phone').value.trim();
  const ad=document.getElementById('f-address').value.trim();
  const ci=document.getElementById('f-city').value.trim();
  const st=document.getElementById('f-state').value;
  if(!fn||!ln||!em||!ph){ showToast('Please fill all required fields'); return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){ showToast('Please enter a valid email'); return; }
  const total=cartTotal();
  if(CFG.pk.includes('demo')){
    showToast('Processing payment...');
    setTimeout(()=>onPaySuccess(fn,ln,em,ph,ad,ci,st,total,'RASAMI-DEMO-'+Date.now()),1800);
    return;
  }
  const h=PaystackPop.setup({
    key:CFG.pk, email:em, amount:total*100, currency:'NGN',
    ref:'RASAMI-'+Date.now(),
    callback:r=>onPaySuccess(fn,ln,em,ph,ad,ci,st,total,r.reference),
    onClose:()=>showToast('Payment cancelled')
  });
  h.openIframe();
}


async function onPaySuccess(fn,ln,em,ph,ad,ci,st,total,ref){
  const oid='#RB-'+(Date.now().toString().slice(-6));
  const now=new Date();
  const address=ad+(ci?', '+ci:'')+(st?', '+st:'');
 
  const order = {
    id: oid, fname: fn, lname: ln, email: em, phone: ph, address: address,
    items: cart.map(x=>({id:x.id,name:x.name,price:x.price,qty:x.qty})),
    total: total
  };
  const customer = {
    email: em, fname: fn, lname: ln, phone: ph,
    last_order: now.toISOString(), total_orders: 1,
    total_spent: total, first_order: now.toISOString()
  };
  const emails = [
    { order_id: oid, recipient: em, subject: `Order Confirmed – ${oid}`, type: 'customer' },
    { order_id: oid, recipient: CFG.email, subject: `New Order ${oid} – ₦${total.toLocaleString()}`, type: 'owner' }
  ];
 
  showToast('Verifying payment...');
 
  let data;
  try {
    const res = await fetch(`${SUPA_URL}/functions/v1/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`
      },
      body: JSON.stringify({ reference: ref, order, customer, emails })
    });
    data = await res.json();
  } catch (e) {
    showToast('Could not reach server — contact support with your reference: ' + ref);
    return;
  }
 
  if (!data || !data.success) {
    showToast('Payment could not be verified. Contact support with reference: ' + ref);
    return;
  }
 
  // Show success — same as before
  const cep=document.getElementById('custEmailPreview');
  const oep=document.getElementById('ownerEmailPreview');
  if(cep) cep.innerHTML=`To: <strong>${em}</strong><br>Subject: Order Confirmed – ${oid}`;
  if(oep) oep.innerHTML=`To: <strong>${CFG.email}</strong><br>Subject: New Order ${oid} — ₦${total.toLocaleString()}`;
  const fa=document.getElementById('checkoutFormArea'); if(fa) fa.style.display='none';
  const sv=document.getElementById('successView'); if(sv) sv.classList.add('show');
  cart=[]; saveCart(); updateCartUI();
  showToast('Order confirmed ✓');
}

function resetAfterOrder(){
  const sv=document.getElementById('successView'); if(sv) sv.classList.remove('show');
  const fa=document.getElementById('checkoutFormArea'); if(fa) fa.style.display='block';
  ['f-fname','f-lname','f-email','f-phone','f-address','f-city'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const fs=document.getElementById('f-state'); if(fs) fs.value='';
  document.body.style.overflow='';
}

/* ── WHATSAPP ── */
let waOpen=false;
function getWaNum(){ return CFG.wa.replace(/\D/g,''); }
function openWhatsApp(msg){ window.open(`https://wa.me/${getWaNum()}?text=${encodeURIComponent(msg)}`,'_blank'); }
function toggleWa(){ waOpen=!waOpen; document.getElementById('waPopup').classList.toggle('open',waOpen); document.getElementById('waNotif').style.display=waOpen?'none':'flex'; }
function closeWa(){ waOpen=false; document.getElementById('waPopup').classList.remove('open'); }

/* ── TOAST ── */
function showToast(msg){
  const t=document.getElementById('toast'); if(!t) return;
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2600);
}

/* ── SVG ICONS ── */
const WA_ICON=`<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.524 5.854L0 24l6.335-1.507A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.874 9.874 0 01-5.031-1.378l-.36-.214-3.732.888.917-3.636-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.467 0 9.882 4.415 9.882 9.882 0 5.467-4.415 9.882-9.882 9.882z"/></svg>`;
const IG_ICON=`<svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;

function injectCartAndModal(){
  const states=['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'];
  document.body.insertAdjacentHTML('beforeend',`
  <div class="product-modal-bg" id="productModal" onclick="if(event.target===this)closeProductModal()">
    <div class="product-modal"><button class="pm-x" onclick="closeProductModal()">✕</button><div class="pm-inner" id="productModalContent"></div></div>
  </div>
  <div class="cart-drawer" id="cartDrawer">
    <div class="drawer-head"><h3>Your Cart</h3><button class="close-x" onclick="toggleCart()">✕</button></div>
    <div class="cart-items" id="cartItemsEl"></div>
    <div class="cart-foot" id="cartFootEl" style="display:none">
      <div class="cart-total-row"><span>Total</span><span id="cartTotalEl">₦0</span></div>
      <button class="checkout-btn" onclick="openCheckout()">Proceed to Checkout</button>
      <p class="secure-note">🔒 Secured by Paystack · Cards · Bank Transfer · USSD</p>
    </div>
  </div>
  <div class="modal-bg" id="checkoutModal">
    <div class="modal">
      <div class="modal-head"><h3>Checkout</h3><button class="close-x" onclick="closeCheckout()">✕</button></div>
      <div id="checkoutFormArea"><div class="modal-body">
        <div class="order-sum" id="orderSumEl"></div>
        <div class="form-row2"><div><label class="form-lbl">First Name *</label><input class="form-inp" id="f-fname" placeholder="Amara"></div><div><label class="form-lbl">Last Name *</label><input class="form-inp" id="f-lname" placeholder="Okafor"></div></div>
        <label class="form-lbl">Email *</label><input class="form-inp" id="f-email" type="email" placeholder="you@example.com">
        <label class="form-lbl">Phone *</label><input class="form-inp" id="f-phone" type="tel" placeholder="+234 700 000 0000">
        <label class="form-lbl">Delivery Address</label><input class="form-inp" id="f-address" placeholder="House no., Street, Area">
        <div class="form-row2"><div><label class="form-lbl">City</label><input class="form-inp" id="f-city" placeholder="Kano"></div>
        <div><label class="form-lbl">State</label><select class="form-inp" id="f-state"><option value="">Select State</option>${states.map(s=>`<option>${s}</option>`).join('')}</select></div></div>
        <button class="pay-btn" onclick="initiatePaystack()">Pay with Paystack</button>
        <p class="pay-note">🔒 100% Secure · Powered by Paystack</p>
      </div></div>
      <div class="success-view" id="successView">
        <div class="suc-icon">✅</div><h2>Order Confirmed!</h2>
        <p>Thank you for shopping with <strong>RASAMI Beauty</strong>.</p>
        <div class="email-box"><div class="eb-label">📧 Customer Email Sent</div><p id="custEmailPreview"></p></div>
        <div class="email-box"><div class="eb-label">📧 Store Owner Alert Sent</div><p id="ownerEmailPreview"></p></div>
        <p style="font-size:11px;color:var(--tmu);margin-top:1rem">Delivery within 2–5 business days.</p>
        <button class="btn-gold" style="margin-top:1.5rem" onclick="closeCheckout();resetAfterOrder()">Continue Shopping</button>
      </div>
    </div>
  </div>
  <div class="wa-widget" id="waWidget">
    <div class="wa-popup" id="waPopup">
      <button class="wa-close-popup" onclick="closeWa()">✕</button>
      <div class="wa-popup-head"><div class="wa-avatar">🌿</div><div><div class="wa-agent">RASAMI Beauty Support</div><div class="wa-status">● Online now</div></div></div>
      <div class="wa-msg">Hi there! 👋 Welcome to <strong>RASAMI Beauty</strong>.<br><br>Have a question? Chat with us instantly on WhatsApp!</div>
      <button class="wa-start" onclick="openWhatsApp('Hello! I have a question about RASAMI Beauty products.')" style="background:var(--wa);color:white;border:none;width:100%;padding:10px;font-family:Jost,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;border-radius:6px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer">${WA_ICON} Start WhatsApp Chat</button>
    </div>
    <button class="wa-fab" onclick="toggleWa()" title="Chat on WhatsApp">
      <div class="wa-notif" id="waNotif">1</div>${WA_ICON}
    </button>
  </div>
  <div class="toast" id="toast"></div>`);
  setTimeout(()=>{if(!waOpen){waOpen=true;document.getElementById('waPopup').classList.add('open');document.getElementById('waNotif').style.display='none';}},5000);
}

function renderNav(){
  document.body.insertAdjacentHTML('afterbegin',`
  <nav>
    <a class="nav-logo" href="index.html">
      <img src="https://raw.githubusercontent.com/JosephElijah99/Beauty-Brand_Phone-Web/main/Images/RASAMI%20Beauty%20Logo.jpeg" alt="RASAMI Beauty" class="nav-logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'">
      <span style="display:none;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:300;color:var(--iv);letter-spacing:2px;text-transform:uppercase">RASAMI <em style="color:var(--goldl);font-style:italic">Beauty</em></span>
    </a>
    <div class="nav-links" id="navLinks">
      <a class="nl" href="index.html">Shop</a>
      <a class="nl" href="about.html">About Us</a>
      <a class="nl" href="blog.html">Blog</a>
      <a class="nl" href="contact.html">Contact</a>
      <a class="nl" href="faq.html">FAQs</a>
    </div>
    <div class="nav-right">
      <a class="insta-nav-btn" href="https://www.instagram.com/rasamibeauty/" target="_blank" title="Follow @rasamibeauty">${IG_ICON}</a>
      <button class="cart-btn" onclick="toggleCart()">Cart <span class="cart-count" id="cartCount">0</span></button>
      <button class="mob-btn" onclick="toggleMob()">☰</button>
    </div>
  </nav>`);
  setActiveNav();
}

function renderFooter(){
  document.body.insertAdjacentHTML('beforeend',`
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo-f">RASAMI <em>Beauty</em></div>
        <p>Luxurious botanicals crafted for African skin. 100% natural ingredients, ethically sourced, lovingly made in Nigeria.</p>
        <div class="footer-socials">
          <a href="https://www.instagram.com/rasamibeauty/" target="_blank" class="soc-btn ig-btn">${IG_ICON} @rasamibeauty</a>
          <button class="soc-btn wa-btn" onclick="openWhatsApp('Hello! I need help with my RASAMI Beauty order.')">${WA_ICON} WhatsApp</button>
        </div>
      </div>
      <div class="footer-col"><h4>Shop</h4><a href="index.html">All Products</a><a href="index.html">Face Serums</a><a href="index.html">Moisturizers</a><a href="index.html">Body Care</a><a href="index.html">Artisan Soaps</a></div>
      <div class="footer-col"><h4>Company</h4><a href="about.html">About Us</a><a href="blog.html">Blog</a><a href="contact.html">Contact Us</a><a href="faq.html">FAQs</a><a href="https://www.instagram.com/rasamibeauty/" target="_blank">Instagram</a></div>
      <div class="footer-col"><h4>Support</h4><span>✉️ rasamiskincare@outlook.com</span><span>📞 07047572322</span><span>Mon–Sat · 8am–6pm</span>
        <button class="wa-footer-btn" onclick="openWhatsApp('Hello! I need help with my RASAMI Beauty order.')">${WA_ICON} WhatsApp Support</button>
      </div>
    </div>
    <div class="footer-bottom">© 2024 <span>RASAMI Beauty</span> · All rights reserved · Made with love in Nigeria · <a href="https://www.instagram.com/rasamibeauty/" target="_blank" style="color:var(--gold)">@rasamibeauty</a></div>
  </footer>`);
}
