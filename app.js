// ════════════════════════════════════════════
// WANDERLUST — Leaflet + OpenStreetMap (no token needed)
// ════════════════════════════════════════════

// ══ DATA STORE ══
const DB = {
  get users()    { try{return JSON.parse(localStorage.getItem('wl_users')||'[]');}catch(e){return[];} },
  get listings() { try{return JSON.parse(localStorage.getItem('wl_listings')||'[]');}catch(e){return[];} },
  get reviews()  { try{return JSON.parse(localStorage.getItem('wl_reviews')||'[]');}catch(e){return[];} },
  get session()  { try{return JSON.parse(localStorage.getItem('wl_session')||'null');}catch(e){return null;} },
  saveUsers(u)    { localStorage.setItem('wl_users',    JSON.stringify(u)); },
  saveListings(l) { localStorage.setItem('wl_listings', JSON.stringify(l)); },
  saveReviews(r)  { localStorage.setItem('wl_reviews',  JSON.stringify(r)); },
  saveSession(s)  { localStorage.setItem('wl_session',  JSON.stringify(s)); },
  clearSession()  { localStorage.removeItem('wl_session'); }
};

// ══ UTILITIES ══
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type || '');
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => { t.className = 'toast'; }, 3000);
}

function formatPrice(p) { return '₹' + Number(p).toLocaleString('en-IN'); }
function starsHTML(r) { const n = Math.round(r||4); return '★'.repeat(n)+'☆'.repeat(5-n); }

// ══ OSM TILE LAYER ══
const OSM_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const OSM_ATTR  = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>';

function makeMap(containerId, lat, lng, zoom) {
  // Destroy existing map on container if any
  const el = document.getElementById(containerId);
  if (el && el._leaflet_id) {
    window._leafletMaps = window._leafletMaps || {};
    if (window._leafletMaps[containerId]) {
      try { window._leafletMaps[containerId].remove(); } catch(e) {}
    }
  }
  const map = L.map(containerId, { zoomControl: true, attributionControl: true }).setView([lat, lng], zoom);
  L.tileLayer(OSM_TILES, { attribution: OSM_ATTR, subdomains: 'abcd', maxZoom: 19 }).addTo(map);
  window._leafletMaps = window._leafletMaps || {};
  window._leafletMaps[containerId] = map;
  return map;
}

// Custom orange marker
function makeMarker(lat, lng) {
  const icon = L.divIcon({
    className: '',
    html: '<div style="width:18px;height:18px;background:#e8935a;border:3px solid white;border-radius:50%;box-shadow:0 3px 8px rgba(0,0,0,0.5)"></div>',
    iconSize: [18, 18], iconAnchor: [9, 9], popupAnchor: [0, -12]
  });
  return L.marker([lat, lng], { icon });
}

// ══ SEED DATA ══
function seedData() {
  if (DB.listings.length > 0) return;
  DB.saveListings([
    { id:'seed1', userId:'seed', title:'Himalayan Pine Retreat', category:'Cabins', description:'Nestled among tall deodar pines, this cozy cabin offers panoramic Himalayan views, a wood-burning fireplace, and absolute peace. Perfect for couples seeking a romantic getaway.', price:8500, location:'Manali, Himachal Pradesh', country:'India', image:'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format', lat:32.2396, lng:77.1887, rating:4.8, ownerName:'Arjun Sharma' },
    { id:'seed2', userId:'seed', title:'Goa Beach Villa', category:'Beach', description:'A luxurious beachfront villa with private pool, direct beach access, and stunning sunset views over the Arabian Sea. Includes a personal chef on request.', price:22000, location:'Candolim, Goa', country:'India', image:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format', lat:15.5169, lng:73.7618, rating:4.9, ownerName:'Priya Menon' },
    { id:'seed3', userId:'seed', title:'Kerala Houseboat', category:'Boats', description:'Experience the magical backwaters of Kerala on a traditional kettuvallam houseboat. Includes all meals, an onboard cook, and private berthing each night.', price:15000, location:'Alleppey, Kerala', country:'India', image:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format', lat:9.4981, lng:76.3388, rating:4.7, ownerName:'Ravi Nair' },
    { id:'seed4', userId:'seed', title:'Rajasthan Desert Camp', category:'Camping', description:'Sleep under a million stars in a luxury desert camp in the Thar Desert. Includes camel rides, folk music performances, and traditional Rajasthani dinner.', price:9800, location:'Jaisalmer, Rajasthan', country:'India', image:'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=800&auto=format', lat:26.9157, lng:70.9083, rating:4.6, ownerName:'Meena Rawat' },
    { id:'seed5', userId:'seed', title:'Swiss Alps Chalet', category:'Tents', description:'A breathtaking mountain chalet with glass walls overlooking the Swiss Alps. Hot tub on the terrace, ski-in ski-out access, and a fully-stocked pantry.', price:45000, location:'Zermatt, Switzerland', country:'Switzerland', image:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format', lat:46.0207, lng:7.7491, rating:5.0, ownerName:'Hans Mueller' },
    { id:'seed6', userId:'seed', title:'Tuscany Farmhouse', category:'Farms', description:'A restored 16th-century farmhouse surrounded by vineyards and olive groves. Wake up to fresh bread, local wine, and rolling Tuscan hills.', price:18000, location:'Siena, Tuscany', country:'Italy', image:'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&auto=format', lat:43.3186, lng:11.3307, rating:4.8, ownerName:'Marco Rossi' },
    { id:'seed7', userId:'seed', title:'Scottish Highland Castle', category:'Castles', description:'Stay in a real 12th-century castle on the Scottish Highlands. Stone towers, canopy beds, roaring fireplaces, and a ghost tour included.', price:55000, location:'Inverness, Scotland', country:'UK', image:'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&auto=format', lat:57.4778, lng:-4.2247, rating:4.9, ownerName:'Fiona MacLeod' },
    { id:'seed8', userId:'seed', title:'Bali Jungle Pool Villa', category:'Amazing Pools', description:'An infinity pool villa perched above a jungle valley with rice terrace views. Includes daily breakfast, private butler, and a traditional Balinese spa.', price:28000, location:'Ubud, Bali', country:'Indonesia', image:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format', lat:-8.5069, lng:115.2625, rating:4.9, ownerName:'Kadek Sari' }
  ]);
}

// ══ AUTH ══
let currentUser = null;

function initAuth() {
  const s = DB.session;
  if (s && s.id) { const u = DB.users.find(x=>x.id===s.id); if(u) currentUser=u; }
  updateNavForAuth();
}

function updateNavForAuth() {
  const authBtns = document.getElementById('authBtns');
  const userMenu = document.getElementById('userMenu');
  const addBtn   = document.getElementById('addListingBtn');
  const avatar   = document.getElementById('userAvatar');
  const dropName = document.getElementById('dropdownName');
  if (currentUser) {
    authBtns.style.display = 'none';
    userMenu.style.display = 'flex';
    addBtn.style.display   = 'inline-flex';
    avatar.textContent     = currentUser.name[0].toUpperCase();
    dropName.textContent   = currentUser.name;
  } else {
    authBtns.style.display = 'flex';
    userMenu.style.display = 'none';
    addBtn.style.display   = 'none';
  }
}

function toggleDropdown() { document.getElementById('dropdown').classList.toggle('open'); }
document.addEventListener('click', e => {
  if (!e.target.closest('.user-menu')) { const d=document.getElementById('dropdown'); if(d) d.classList.remove('open'); }
});

function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const err   = document.getElementById('loginError');
  err.textContent = '';
  if (!email||!pass) { err.textContent='Please fill all fields.'; return; }
  const u = DB.users.find(x=>x.email===email&&x.password===pass);
  if (!u) { err.textContent='Invalid email or password.'; return; }
  currentUser=u; DB.saveSession({id:u.id}); updateNavForAuth();
  document.getElementById('loginEmail').value='';
  document.getElementById('loginPass').value='';
  showToast('Welcome back, '+u.name+'! ✦','success');
  showPage('listings');
}

function signup() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass  = document.getElementById('signupPass').value;
  const err   = document.getElementById('signupError');
  err.textContent='';
  if(!name||!email||!pass){err.textContent='Please fill all fields.';return;}
  if(pass.length<6){err.textContent='Password must be at least 6 characters.';return;}
  const users=DB.users;
  if(users.find(x=>x.email===email)){err.textContent='Email already registered.';return;}
  const u={id:uid(),name,email,password:pass};
  users.push(u); DB.saveUsers(users);
  currentUser=u; DB.saveSession({id:u.id}); updateNavForAuth();
  document.getElementById('signupName').value='';
  document.getElementById('signupEmail').value='';
  document.getElementById('signupPass').value='';
  showToast('Account created! Welcome, '+name+'! ✦','success');
  showPage('listings');
}

function logout() {
  currentUser=null; DB.clearSession(); updateNavForAuth();
  showToast('Logged out successfully.');
  showPage('home');
}

function requireAuth(page) {
  if(!currentUser){showToast('Please log in first.','error');showPage('login');return;}
  showPage(page);
}

// ══ PAGE SWITCHER ══
let currentPage='';

function showPage(page) {
  document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active');});
  const el=document.getElementById('page-'+page);
  if(!el) return;
  el.classList.add('active');
  currentPage=page;
  window.scrollTo(0,0);
  const d=document.getElementById('dropdown');
  if(d) d.classList.remove('open');
  if(page==='home')       renderHome();
  if(page==='listings')   renderListings();
  if(page==='map')        setTimeout(initMainMap, 100);
  if(page==='myListings') renderMyListings();
  if(page==='newListing') initNewListingForm(null);
}

// ══ CATEGORIES ══
const CATEGORIES = [
  {label:'All',icon:'🌍'},{label:'Rooms',icon:'🛏️'},{label:'Camping',icon:'⛺'},
  {label:'Beach',icon:'🏖️'},{label:'Lakefront',icon:'🚤'},{label:'Farms',icon:'🌾'},
  {label:'Cabins',icon:'🏠'},{label:'Castles',icon:'🏰'},{label:'Countryside',icon:'🌄'},
  {label:'Tents',icon:'🏕️'},{label:'Boats',icon:'⛵'},{label:'Arctic',icon:'❄️'},
  {label:'Amazing Pools',icon:'🏊'},{label:'Amazing Views',icon:'🌅'}
];
let activeCategory='All';
let searchQuery='';

function renderCatBtns(id,cb) {
  const el=document.getElementById(id); if(!el) return;
  el.innerHTML=CATEGORIES.map(c=>
    `<button class="cat-btn ${c.label===activeCategory?'active':''}" onclick="${cb}('${c.label}')">${c.icon} ${c.label}</button>`
  ).join('');
}
function setCategory(cat){activeCategory=cat;renderCatBtns('listingCats','setCategory');renderListings();}
function setCategoryHome(cat){activeCategory=cat;showPage('listings');}

// ══ HOME ══
function renderHome() {
  renderCatBtns('homeCats','setCategoryHome');
  const el=document.getElementById('featuredCards');
  if(el) el.innerHTML=DB.listings.slice(0,6).map(cardHTML).join('');
}

// ══ LISTINGS ══
function renderListings() {
  renderCatBtns('listingCats','setCategory');
  let list=DB.listings;
  if(activeCategory!=='All') list=list.filter(l=>l.category===activeCategory);
  if(searchQuery){
    const q=searchQuery.toLowerCase();
    list=list.filter(l=>l.title.toLowerCase().includes(q)||l.location.toLowerCase().includes(q)||(l.country||'').toLowerCase().includes(q)||l.category.toLowerCase().includes(q));
  }
  const grid=document.getElementById('allCards');
  const empty=document.getElementById('emptyState');
  if(!list.length){grid.innerHTML='';empty.style.display='flex';}
  else{empty.style.display='none';grid.innerHTML=list.map(cardHTML).join('');}
}

function searchListings() { searchQuery=document.getElementById('searchInput').value.trim(); showPage('listings'); }
document.getElementById('searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')searchListings();});

// Any logged-in user can edit/delete all listings (including pre-defined seed ones)
function isOwner(l){return !!currentUser;}

function cardHTML(l) {
  return `
    <div class="listing-card" onclick="showDetail('${l.id}')">
      ${isOwner(l)?'<div class="card-owner-badge">Yours</div>':''}
      <img class="card-img" src="${l.image}" alt="${l.title}"
           onerror="this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format'"/>
      <div class="card-body">
        <div class="card-cat">${l.category}</div>
        <div class="card-title">${l.title}</div>
        <div class="card-loc">📍 ${l.location}</div>
        <div class="card-price">${formatPrice(l.price)} <span>/ night</span></div>
        <div class="card-rating">${starsHTML(l.rating)} ${(l.rating||4).toFixed(1)}</div>
      </div>
    </div>`;
}

// ══ DETAIL ══
function showDetail(id) {
  const l=DB.listings.find(x=>x.id===id); if(!l) return;
  const mine=isOwner(l);
  const reviews=DB.reviews.filter(r=>r.listingId===id);
  const avg=reviews.length?(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1):(l.rating||4).toFixed(1);

  document.getElementById('detailContent').innerHTML=`
    <div class="detail-container">
      <div class="detail-back"><button onclick="showPage('listings')">← Back to Listings</button></div>
      <div class="detail-hero">
        <img src="${l.image}" alt="${l.title}" onerror="this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format'"/>
        <div class="detail-hero-overlay"></div>
        <div class="detail-hero-info"><div class="d-cat">${l.category}</div><h1>${l.title}</h1></div>
      </div>
      <div class="detail-body">
        <div class="detail-main">
          <div class="detail-loc">📍 ${l.location}${l.country?', '+l.country:''}</div>
          <div class="detail-meta">
            <div class="meta-item"><span class="meta-label">Rating</span><span class="meta-val">⭐ ${avg} (${reviews.length} reviews)</span></div>
            <div class="meta-item"><span class="meta-label">Host</span><span class="meta-val">${l.ownerName||'Wanderlust Host'}</span></div>
            <div class="meta-item"><span class="meta-label">Category</span><span class="meta-val">${l.category}</span></div>
          </div>
          <p class="detail-desc">${l.description}</p>
          ${mine?`
            <div class="owner-actions">
              <button class="btn-primary" onclick="editListing('${l.id}')">✏️ Edit Listing</button>
              <button class="btn-danger"  onclick="confirmDelete('${l.id}')">🗑️ Delete Listing</button>
            </div>`:''}
          ${l.lat&&l.lng?`<div class="detail-map" id="detailMap"></div>`:''}
          <div class="reviews-section">
            <h2>Reviews${reviews.length?' ('+reviews.length+')':''}</h2>
            ${currentUser&&!mine?reviewFormHTML(id):''}
            ${!reviews.length?'<p style="color:var(--text2);margin:1rem 0">No reviews yet. Be the first!</p>':''}
            ${reviews.map(r=>reviewCardHTML(r,mine)).join('')}
          </div>
        </div>
        <div class="detail-price-card">
          <div class="price-big">${formatPrice(l.price)} <span>/ night</span></div>
          <div style="color:var(--text2);font-size:0.85rem;margin-bottom:1rem">⭐ ${avg} · ${reviews.length} reviews</div>
          <hr style="border:none;border-top:1px solid var(--border);margin:1rem 0"/>
          <p style="color:var(--text2);font-size:0.85rem;line-height:1.6">Hosted by <strong style="color:var(--text)">${l.ownerName||'Wanderlust Host'}</strong></p>
          ${mine?`
            <div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:1rem">
              <button class="btn-primary" style="width:100%;padding:0.875rem;border-radius:0.75rem" onclick="editListing('${l.id}')">✏️ Edit Listing</button>
              <button class="btn-danger"  style="width:100%;padding:0.875rem;border-radius:0.75rem" onclick="confirmDelete('${l.id}')">🗑️ Delete Listing</button>
            </div>`:`
            <button class="book-btn" onclick="showToast('Booking coming soon! 🚀','success')">Reserve Now</button>
            <p style="text-align:center;color:var(--text3);font-size:0.75rem;margin-top:0.5rem">You won't be charged yet</p>`}
        </div>
      </div>
    </div>`;

  // Switch page
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-detail').classList.add('active');
  currentPage='detail'; window.scrollTo(0,0);

  // Mini map
  if(l.lat&&l.lng){
    setTimeout(()=>{
      const m=makeMap('detailMap', l.lat, l.lng, 13);
      makeMarker(l.lat,l.lng)
        .bindPopup(`<div class="popup-title">${l.title}</div><div class="popup-price">${formatPrice(l.price)}/night</div>`)
        .addTo(m).openPopup();
    },300);
  }
  initStarPicker();
}

// ══ REVIEWS ══
let selectedStars=0;

function reviewFormHTML(listingId) {
  return `<div class="review-form">
    <h3>Leave a Review</h3>
    <div class="star-picker" id="starPicker">
      ${[1,2,3,4,5].map(i=>`<span class="star-pick" data-val="${i}" onclick="pickStar(${i})">★</span>`).join('')}
    </div>
    <div class="form-group" style="margin-bottom:0.75rem">
      <textarea id="reviewText" rows="3" placeholder="Share your experience…"
        style="width:100%;background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:0.75rem;border-radius:0.625rem;font-family:'DM Sans',sans-serif;font-size:0.9rem;outline:none;resize:vertical"
        onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'"></textarea>
    </div>
    <button class="btn-primary" onclick="submitReview('${listingId}')">Submit Review</button>
  </div>`;
}

function initStarPicker(){selectedStars=0;document.querySelectorAll('.star-pick').forEach(s=>{s.style.color='var(--text3)';});}
function pickStar(val){selectedStars=val;document.querySelectorAll('.star-pick').forEach(s=>{s.style.color=parseInt(s.dataset.val)<=val?'#f0b97d':'var(--text3)';});}

function submitReview(listingId){
  if(!currentUser){showToast('Log in to leave a review.','error');return;}
  if(!selectedStars){showToast('Please select a star rating.','error');return;}
  const text=document.getElementById('reviewText').value.trim();
  if(!text){showToast('Please write a review.','error');return;}
  const reviews=DB.reviews;
  reviews.push({id:uid(),listingId,userId:currentUser.id,author:currentUser.name,rating:selectedStars,text,date:new Date().toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'})});
  DB.saveReviews(reviews);
  showToast('Review submitted! ✦','success');
  showDetail(listingId);
}

function reviewCardHTML(r,mine){
  const canDel=currentUser&&(currentUser.id===r.userId||mine);
  return `<div class="review-card">
    <div class="review-header">
      <div><div class="review-author">${r.author}</div><div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div></div>
      <div style="text-align:right"><div class="review-date">${r.date}</div>${canDel?`<button class="delete-review" onclick="deleteReview('${r.id}','${r.listingId}')">Delete</button>`:''}</div>
    </div>
    <p class="review-text">${r.text}</p>
  </div>`;
}

function deleteReview(reviewId,listingId){
  DB.saveReviews(DB.reviews.filter(r=>r.id!==reviewId));
  showToast('Review deleted.');
  showDetail(listingId);
}

// ══ ADD / EDIT LISTING ══
function initNewListingForm(editId){
  document.getElementById('listingFormTitle').textContent=editId?'Edit Listing':'Add New Listing';
  document.getElementById('editListingId').value=editId||'';
  document.getElementById('listingError').textContent='';
  ['fTitle','fDesc','fPrice','fLocation','fCountry','fImage','fLng','fLat'].forEach(id=>{document.getElementById(id).value='';});
  document.getElementById('fCategory').value='Rooms';
  if(editId){
    const l=DB.listings.find(x=>x.id===editId);
    if(l){
      document.getElementById('fTitle').value=l.title;
      document.getElementById('fDesc').value=l.description;
      document.getElementById('fPrice').value=l.price;
      document.getElementById('fLocation').value=l.location;
      document.getElementById('fCountry').value=l.country||'';
      document.getElementById('fImage').value=l.image||'';
      document.getElementById('fCategory').value=l.category;
      document.getElementById('fLng').value=l.lng||'';
      document.getElementById('fLat').value=l.lat||'';
    }
  }
  setTimeout(initPinMap, 400);
}

function editListing(id){
  if(!currentUser){showPage('login');return;}
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-newListing').classList.add('active');
  currentPage='newListing'; window.scrollTo(0,0);
  initNewListingForm(id);
}

// ══ PIN MAP (Leaflet) ══
let pinMap=null; let pinMarkerObj=null;

function initPinMap(){
  const lngV=parseFloat(document.getElementById('fLng').value)||78.9629;
  const latV=parseFloat(document.getElementById('fLat').value)||22.5937;
  const hasPin=!!document.getElementById('fLng').value;
  const zoom=hasPin?11:4;

  // Destroy old instance
  if(pinMap){try{pinMap.remove();}catch(e){} pinMap=null; pinMarkerObj=null;}

  pinMap=makeMap('pinMap',latV,lngV,zoom);

  if(hasPin){
    pinMarkerObj=makeMarker(latV,lngV).addTo(pinMap);
    pinMarkerObj.bindPopup('📍 Your location').openPopup();
  }

  // Click to place/move pin
  pinMap.on('click',function(e){
    const {lat,lng}=e.latlng;
    document.getElementById('fLat').value=lat.toFixed(6);
    document.getElementById('fLng').value=lng.toFixed(6);
    if(pinMarkerObj) pinMarkerObj.remove();
    pinMarkerObj=makeMarker(lat,lng).addTo(pinMap);
    pinMarkerObj.bindPopup('📍 Your listing location').openPopup();
  });
}

// ══ GEOCODE (Nominatim — free, no token) ══
let _geoTimer=null;
function geocodeLocation(){
  clearTimeout(_geoTimer);
  _geoTimer=setTimeout(async()=>{
    const q=document.getElementById('fLocation').value.trim();
    if(q.length<3) return;
    try{
      const res=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,{headers:{'Accept-Language':'en'}});
      const data=await res.json();
      if(data&&data[0]){
        const lat=parseFloat(data[0].lat);
        const lng=parseFloat(data[0].lon);
        document.getElementById('fLat').value=lat.toFixed(6);
        document.getElementById('fLng').value=lng.toFixed(6);
        if(pinMap){
          pinMap.flyTo([lat,lng],11);
          if(pinMarkerObj) pinMarkerObj.remove();
          pinMarkerObj=makeMarker(lat,lng).addTo(pinMap);
          pinMarkerObj.bindPopup('📍 '+data[0].display_name.split(',').slice(0,2).join(', ')).openPopup();
        }
      }
    }catch(e){console.warn('Geocode failed',e);}
  },900);
}

// ══ SAVE LISTING ══
function saveListing(){
  const title   =document.getElementById('fTitle').value.trim();
  const desc    =document.getElementById('fDesc').value.trim();
  const price   =document.getElementById('fPrice').value.trim();
  const location=document.getElementById('fLocation').value.trim();
  const country =document.getElementById('fCountry').value.trim();
  const category=document.getElementById('fCategory').value;
  const image   =document.getElementById('fImage').value.trim();
  const lng     =parseFloat(document.getElementById('fLng').value)||null;
  const lat     =parseFloat(document.getElementById('fLat').value)||null;
  const editId  =document.getElementById('editListingId').value;
  const errEl   =document.getElementById('listingError');
  errEl.textContent='';
  if(!title||!desc||!price||!location){errEl.textContent='Please fill all required fields.';return;}
  if(isNaN(price)||Number(price)<=0){errEl.textContent='Enter a valid price.';return;}
  const imgUrl=image||getDefaultImage(category);
  const listings=DB.listings;
  if(editId){
    const idx=listings.findIndex(x=>x.id===editId);
    if(idx>-1){
      Object.assign(listings[idx],{title,description:desc,price:Number(price),location,country,category,image:imgUrl,lng,lat});
      DB.saveListings(listings); showToast('Listing updated! ✦','success');
    } else {errEl.textContent='Listing not found.';return;}
  } else {
    listings.push({id:uid(),userId:currentUser.id,ownerName:currentUser.name,title,description:desc,price:Number(price),location,country,category,image:imgUrl,lng,lat,rating:4.5});
    DB.saveListings(listings); showToast('Listing created! ✦','success');
  }
  showPage('listings');
}

function getDefaultImage(cat){
  return({Beach:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format',Cabins:'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format',Camping:'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format',Castles:'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=800&auto=format',Rooms:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format',Farms:'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&auto=format',Lakefront:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format',Boats:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format',Arctic:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format',Tents:'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?w=800&auto=format',Countryside:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format','Amazing Pools':'https://images.unsplash.com/photo-1551882547-ff40c4a49f6b?w=800&auto=format','Amazing Views':'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format'}[cat])||'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format';
}

// ══ DELETE ══
function confirmDelete(id){
  document.getElementById('deleteModal').style.display='flex';
  document.getElementById('confirmDeleteBtn').onclick=()=>doDelete(id);
}
function closeDeleteModal(){document.getElementById('deleteModal').style.display='none';}
function doDelete(id){
  if(!currentUser){closeDeleteModal();return;}
  const listings=DB.listings; const idx=listings.findIndex(x=>x.id===id);
  if(idx===-1){showToast('Listing not found.','error');closeDeleteModal();return;}
  listings.splice(idx,1); DB.saveListings(listings);
  DB.saveReviews(DB.reviews.filter(r=>r.listingId!==id));
  closeDeleteModal(); showToast('Listing deleted.');
  showPage('listings');
}

// ══ MY LISTINGS ══
function renderMyListings(){
  if(!currentUser){showPage('login');return;}
  const list=DB.listings.filter(l=>l.userId===currentUser.id);
  const grid=document.getElementById('myCards');
  const empty=document.getElementById('myEmptyState');
  if(!list.length){grid.innerHTML='';empty.style.display='flex';}
  else{empty.style.display='none';grid.innerHTML=list.map(cardHTML).join('');}
}

// ══ MAIN MAP (Leaflet) ══
let mainMapInst=null;

function initMainMap(){
  if(mainMapInst){try{mainMapInst.remove();}catch(e){} mainMapInst=null;}
  mainMapInst=makeMap('mainMap',22.5937,78.9629,4);
  DB.listings.filter(l=>l.lat&&l.lng).forEach(l=>{
    const popup=`
      <div class="popup-title">${l.title}</div>
      <div class="popup-price">${formatPrice(l.price)}/night</div>
      <div class="popup-loc">📍 ${l.location}</div>
      <button class="popup-btn" onclick="showDetail('${l.id}')">View Details →</button>`;
    makeMarker(l.lat,l.lng).bindPopup(popup).addTo(mainMapInst);
  });
}

// ══ BOOT ══
(function boot(){
  seedData();
  initAuth();
  // All pages start hidden — CSS handles via .active class
  showPage('home');
})();