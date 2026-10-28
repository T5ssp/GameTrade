const $=s=>document.querySelector(s);
const icons={all:'<path d="M5 32h38M2 38h44M7 31a17 17 0 0 1 34 0M12 28a12 12 0 0 1 9-10M24 13V9a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>',main:'<path d="M9 5v12m5-12v12m5-12v12M9 12h10M14 17v24M32 5v36M32 5c-8 5-8 17 0 17M39 5v36"/>',drinks:'<path d="m12 15 3 28h20l3-28ZM13 21h24M25 30l6-26 8-3M20 16l6-7"/>',dessert:'<path d="m11 27 4 16h23l3-16ZM13 27c-7-5-2-13 4-12-1-8 9-12 13-6 8-2 13 4 10 10 8 1 7 10 1 10M19 29v8m8-8v8m8-8v8M24 4v-2"/>',healthy:'<path d="M8 39C0 12 26 9 42 3c1 24-10 38-27 32M6 44l30-32"/>',robot:'<rect x="9" y="13" width="30" height="24" rx="9"/><path d="M24 13V6m-4 0h8M4 21v10m40-10v10M16 40v4m16-4v4"/><circle cx="18" cy="24" r="2"/><circle cx="30" cy="24" r="2"/><path d="M19 31h10"/>'};
const svg=id=>`<svg viewBox="0 0 48 48" aria-hidden="true">${icons[id]||icons.all}</svg>`;
const categories=[['all','All'],['main','Main Dishes'],['drinks','Beverages'],['dessert','Desserts'],['healthy','Healthy Choices']];
const dishes=[
['salmon','main','Grilled Salmon','With quinoa, avocado & lemon sauce',4.5,'photo-1467003909585-2f8a72700288','Salmon · Fish · Gluten-free','Flaky grilled salmon, vibrant quinoa, ripe avocado and a bright lemon sauce.'],
['pasta','main','Chicken Alfredo','Creamy sauce with mushrooms',3.8,'photo-1645112411341-6c4fd023714a','Chicken · Dairy · Wheat','Tender chicken and pasta tossed in a silky parmesan cream sauce with sautéed mushrooms.'],
['steak','main','Beef Steak','With roasted vegetables and herbs',5.2,'photo-1546833999-b9f581a1996d','Beef · Signature dish','Flame-grilled beef with seasonal roasted vegetables, fragrant herbs and house jus.'],
['bowl','main','Vegetable Bowl','Fresh seasonal vegetables with brown rice',3.2,'photo-1512621776951-a57141f2eefd','Plant-based · High fiber','A colorful bowl of seasonal vegetables, chickpeas and brown rice with a light citrus dressing.'],
['blue','drinks','Blue Ocean','Refreshing & natural',1.5,'photo-1536935338788846bb9981813','Alcohol-free · Chilled','A sparkling blue citrus cooler over ice, finished with fresh lime.'],
['mango','drinks','Mango Bliss','Fresh mango juice',1.5,'photo-1600271886742-f049cd451bba','Alcohol-free · Fruit','Sun-ripened mango blended into a refreshing tropical juice.'],
['matcha','drinks','Iced Matcha Latte','Smooth & creamy',1.8,'photo-1515823064-d6e0c04616a7','Dairy · Chilled','Japanese matcha over ice and creamy milk. Ask for an oat milk alternative in your order notes.'],
['lava','dessert','Chocolate Lava','Rich & warm',1.8,'photo-1578985545062-69928b1d9587','Dairy · Eggs · Wheat','Warm chocolate cake with a molten center, served with vanilla ice cream.'],
['berry','dessert','Berry Cheesecake','Fresh & creamy',1.6,'photo-1533134242443-d4fd215305ad','Dairy · Wheat','Smooth cheesecake on a buttery biscuit base, topped with a fresh berry compote.'],
['ice','dessert','Ice Cream Bowl','Multiple flavors',1.4,'photo-1563805042-7684c019e1cb','Dairy · May contain nuts','Three scoops of our favorite ice cream flavors with a delicate seasonal garnish.'],
['toast','healthy','Avocado Toast','With seeds & herbs',2.8,'photo-1525351484163-7529414344d8','Wheat · Seeds · Vegetarian','Toasted artisan bread with creamy avocado, mixed seeds and garden herbs.'],
['salad','healthy','Quinoa Salad','Fresh & nutritious',2.5,'photo-1511690743698-d9d85f2fbf38','Plant-based · Gluten-free','Quinoa, crisp vegetables and fresh herbs, tossed in a light lemon dressing.'],
['fruit','healthy','Fruit Smoothie Bowl','With granola',2.2,'photo-1490645935967-10de6ba17061','Fruit · Wheat · May contain nuts','A thick berry smoothie topped with fresh fruit, crunchy granola and seeds.']
].map(([id,category,name,description,price,image,tags,detail])=>({id,category,name,description,price,image,tags,detail}));
const metadata = {
  salmon: { kcal: 480, protein: 38, minutes: 18 },
  pasta: { kcal: 640, protein: 32, minutes: 16 },
  steak: { kcal: 610, protein: 45, minutes: 22 },
  bowl: { kcal: 380, protein: 12, minutes: 12, plant: true, vegetarian: true },
  blue: { kcal: 95, protein: 0, minutes: 4, plant: true, vegetarian: true },
  mango: { kcal: 140, protein: 1, minutes: 4, plant: true, vegetarian: true },
  matcha: { kcal: 180, protein: 7, minutes: 5, vegetarian: true },
  lava: { kcal: 420, protein: 6, minutes: 10, vegetarian: true },
  berry: { kcal: 360, protein: 5, minutes: 5, vegetarian: true },
  ice: { kcal: 290, protein: 4, minutes: 4, vegetarian: true },
  toast: { kcal: 340, protein: 9, minutes: 8, plant: true, vegetarian: true },
  salad: { kcal: 310, protein: 11, minutes: 8, plant: true, vegetarian: true },
  fruit: { kcal: 320, protein: 6, minutes: 6, plant: true, vegetarian: true }
};
const addons = {
  quinoa: { name: 'Extra quinoa', fils: 600 },
  greens: { name: 'Side of greens', fils: 400 },
  lemon: { name: 'Lemon sauce', fils: 200 },
  oat: { name: 'Oat milk instead', fils: 300 },
  large: { name: 'Make it large', fils: 400 },
  icecream: { name: 'Vanilla ice cream', fils: 400 },
  berries: { name: 'Fresh berries', fils: 300 },
  seeds: { name: 'Mixed seeds', fils: 200 },
  avocado: { name: 'Extra avocado', fils: 500 }
};
const dishById = id => dishes.find(dish => dish.id === id);
const allowedAddons = dish => dish.category === 'main' ? ['quinoa', 'greens', 'lemon']
  : dish.category === 'healthy' ? ['seeds', 'avocado']
  : dish.category === 'dessert' ? ['icecream', 'berries']
  : dish.id === 'matcha' ? ['oat', 'large'] : ['large'];
const money = fils => `OMR ${(fils / 1000).toFixed(3)}`;
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const photo = (dish, extra = '') => {
  const index = dishes.indexOf(dish);
  return `<div class="food-photo ${extra}" role="img" aria-label="${dish.name}" style="background-position:${(index % 4) * 100 / 3}% ${Math.floor(index / 4) * 100 / 3}%"></div>`;
};
const makeLineId = () => `line-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const storage = {
  read(key, fallback, session = false) {
    try {
      const value = (session ? sessionStorage : localStorage).getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch { return fallback; }
  },
  write(key, value, session = false) {
    try { (session ? sessionStorage : localStorage).setItem(key, JSON.stringify(value)); } catch {}
  },
  remove(key, session = false) {
    try { (session ? sessionStorage : localStorage).removeItem(key); } catch {}
  }
};
const CART_KEY = 'future2060-cart-v2';
const HISTORY_KEY = 'future2060-history-v2';
const ACTIVE_KEY = 'future2060-active-order-v2';
const FAVORITES_KEY = 'future2060-favorites';
const STAGE_MS = 2500;

function normalizeLines(value) {
  if (!Array.isArray(value)) return [];
  const seenIds = new Set();
  return value.slice(0, 100).flatMap(line => {
    if (!line || typeof line !== 'object') return [];
    const dish = dishById(line.dishId);
    if (!dish || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) return [];
    const extraIds = Array.isArray(line.addonIds)
      ? [...new Set(line.addonIds.filter(id => allowedAddons(dish).includes(id)))].sort() : [];
    let id = typeof line.id === 'string' && /^line-[a-z0-9-]{3,60}$/.test(line.id) ? line.id : makeLineId();
    if (seenIds.has(id)) id = makeLineId();
    seenIds.add(id);
    return [{ id, dishId: dish.id, quantity: line.quantity, addonIds: extraIds,
      note: typeof line.note === 'string' ? line.note.trim().slice(0, 160) : '' }];
  });
}
const unitPrice = line => Math.round(dishById(line.dishId).price * 1000)
  + line.addonIds.reduce((sum, id) => sum + addons[id].fils, 0);
const totalPrice = lines => lines.reduce((sum, line) => sum + unitPrice(line) * line.quantity, 0);
const itemCount = lines => lines.reduce((sum, line) => sum + line.quantity, 0);
const copyLines = lines => lines.map(line => ({ ...line, addonIds: [...line.addonIds] }));
function normalizeOrder(value, allowPersonal = false) {
  if (!value || typeof value !== 'object' || !/^FR-[A-Z0-9-]{4,30}$/.test(value.id || '')) return null;
  const lines = normalizeLines(value.lines);
  if (!lines.length || !Number.isFinite(value.createdAt) || value.createdAt <= 0 || value.createdAt > Date.now() + 5000) return null;
  return {
    id: value.id, lines, createdAt: value.createdAt,
    pickup: value.pickup === true,
    table: Number.isInteger(value.table) && value.table >= 1 && value.table <= 30 ? value.table : 7,
    name: allowPersonal && typeof value.name === 'string' ? value.name.slice(0, 60) : '',
    notes: allowPersonal && typeof value.notes === 'string' ? value.notes.slice(0, 300) : '',
    completed: value.completed === true
  };
}
let cart = normalizeLines(storage.read(CART_KEY, null));
if (storage.read(CART_KEY, null) === null) {
  const oldCart = storage.read('future2060-cart', {});
  if (oldCart && typeof oldCart === 'object' && !Array.isArray(oldCart)) {
    cart = normalizeLines(Object.entries(oldCart).map(([dishId, quantity]) => ({ dishId, quantity })));
  }
  storage.write(CART_KEY, cart);
}
const storedFavorites = storage.read(FAVORITES_KEY, []);
let favorites = new Set(Array.isArray(storedFavorites) ? storedFavorites.filter(id => dishById(id)) : []);
const storedHistory = storage.read(HISTORY_KEY, []);
let history = Array.isArray(storedHistory) ? storedHistory.map(order => normalizeOrder(order)).filter(Boolean).slice(0, 5) : [];
let activeOrder = normalizeOrder(storage.read(ACTIVE_KEY, null, true), true);
let busy = Boolean(activeOrder && !activeOrder.completed);
let filter = 'all';
let diet = 'all';
let favoritesOnly = false;
let sort = 'featured';
let lastFocus = null;
let editingLineId = null;
let detailDishId = null;
let detailQuantity = 1;
let trackingTimer = null;
let renderedStage = -1;
let toastTimer;

function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2600);
}
function saveCart() {
  storage.write(CART_KEY, cart);
  renderCart();
}
function hasFilters() {
  return filter !== 'all' || diet !== 'all' || favoritesOnly || $('#search').value.trim() || sort !== 'featured';
}
function resetFilters() {
  filter = 'all'; diet = 'all'; favoritesOnly = false; sort = 'featured';
  $('#search').value = ''; $('#sortMenu').value = sort;
  renderMenu();
}
function dishCard(dish) {
  const saved = favorites.has(dish.id);
  const meta = metadata[dish.id];
  return `<article class="dish" data-dish="${dish.id}" data-price="${Math.round(dish.price * 1000)}">
    <div class="dish-media"><button class="dish-image" data-detail="${dish.id}" aria-label="Customize ${dish.name}">${photo(dish)}</button>
      <button class="favorite-button" data-favorite="${dish.id}" aria-label="${saved ? 'Unsave' : 'Save'} ${dish.name}" aria-pressed="${saved}">${saved ? '♥' : '♡'}</button>
    </div><div class="dish-info"><h4>${dish.name}</h4><p>${dish.description}</p>
      <div class="nutrition-row"><span>${meta.minutes} min</span><span>~${meta.kcal} kcal</span></div>
      <div class="dish-bottom"><span class="price">OMR ${dish.price.toFixed(1)}</span><button class="add" data-add="${dish.id}" aria-label="Add ${dish.name} to order" title="Quick add">+</button></div>
    </div></article>`;
}
function promoCards() {
  return `<section class="future-promos"><div class="robot-card"><div class="robot-copy">${svg('robot')}<small>Special Service</small><h3>Moving Robots</h3><p>Deliver food directly<br>to your table!</p><button id="robotInfo">Meet your robot →</button></div></div>
    <div class="qr-card"><p>Scan the QR code<br>to open the menu</p><img id="menuQR" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" alt="QR code to open this restaurant menu"><a href="#menu"><svg viewBox="0 0 24 32"><rect x="4" y="2" width="16" height="28" rx="2"/><path d="M8 6h8m-6 20h4M9 12l3 3 3-3"/></svg>You can also browse<br>our menu here <span>→</span></a></div></section>`;
}
function renderMenu() {
  const query = $('#search').value.toLowerCase().trim();
  $('#categories').innerHTML = categories.map(([id, name]) => `<button class="category ${filter === id ? 'active' : ''}" data-category="${id}" aria-pressed="${filter === id}">${svg(id)}<span>${name}</span></button>`).join('');
  document.querySelectorAll('[data-diet]').forEach(button => {
    const selected = button.dataset.diet === diet;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', selected);
  });
  $('#favoritesOnly').classList.toggle('active', favoritesOnly);
  $('#favoritesOnly').setAttribute('aria-pressed', favoritesOnly);
  $('#favoriteCount').textContent = favorites.size;
  let visible = dishes.filter(dish => (filter === 'all' || dish.category === filter)
    && (diet === 'all' || metadata[dish.id][diet === 'plant' ? 'plant' : 'vegetarian'])
    && (!favoritesOnly || favorites.has(dish.id))
    && `${dish.name} ${dish.description} ${dish.tags}`.toLowerCase().includes(query));
  if (sort === 'price-asc') visible.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') visible.sort((a, b) => b.price - a.price);
  if (sort === 'name') visible.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  const filtered = Boolean(hasFilters());
  $('#menuGrid').classList.toggle('filtered', filtered);
  const sections = sort === 'featured' ? categories.slice(1).map(([id, name]) => ({ id, name, items: visible.filter(dish => dish.category === id) }))
    : [{ id: 'sorted', name: categories.find(([id]) => id === filter)[1] === 'All' ? 'Our selection' : categories.find(([id]) => id === filter)[1], items: visible }];
  $('#menuGrid').innerHTML = sections.filter(section => section.items.length).map(section => `<section class="menu-section ${section.id}"><div class="section-title"><h3>${svg(section.id)}${section.name}</h3>${sort === 'featured' ? `<button class="view-all" data-category="${section.id}">View All <span>→</span></button>` : ''}</div><div class="dish-grid">${section.items.map(dishCard).join('')}</div></section>`).join('');
  if (!filtered) $('#menuGrid').insertAdjacentHTML('beforeend', promoCards());
  $('#menuResults').textContent = `${visible.length} ${visible.length === 1 ? 'dish' : 'dishes'} to discover${favoritesOnly ? ' · Your saved selection' : ''}`;
  $('#clearFilters').hidden = !filtered;
  $('#empty').hidden = visible.length > 0;
  $('#emptyTitle').textContent = favoritesOnly && !favorites.size ? 'Your favorites start here.' : 'No dishes found';
  $('#emptyMessage').textContent = favoritesOnly && !favorites.size ? 'Tap the heart on a dish to save it for your next visit.' : 'Try a different search or clear your filters.';
  updateQR();
}
function favorite(id) {
  if (!dishById(id)) return;
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  storage.write(FAVORITES_KEY, [...favorites]);
  renderMenu();
  const target = document.querySelector(`[data-favorite="${id}"]`);
  if (target) target.focus({ preventScroll: true });
  toast(favorites.has(id) ? 'Saved to your favorites' : 'Removed from your favorites');
}
function addLine(line) {
  const signature = value => JSON.stringify([value.dishId, value.addonIds, value.note]);
  const match = cart.find(item => signature(item) === signature(line));
  if (match) {
    if (match.quantity + line.quantity > 99) {
      toast('You can add up to 99 of the same selection.');
      return false;
    }
    match.quantity += line.quantity;
  } else {
    if (cart.length >= 100) { toast('Your order has reached the item limit.'); return false; }
    cart.push({ ...line, id: makeLineId(), addonIds: [...line.addonIds] });
  }
  return true;
}
function prepareNewCart() {
  if (busy) { toast('Your robot is already on its way. Follow your order in the cart.'); return false; }
  activeOrder = null;
  storage.remove(ACTIVE_KEY, true);
  $('#tracking').hidden = true;
  $('#cartItems').hidden = false;
  $('#orderError').textContent = '';
  return true;
}
function quickAdd(id) {
  if (!dishById(id) || !prepareNewCart()) return;
  if (addLine({ dishId: id, quantity: 1, addonIds: [], note: '' })) {
    saveCart();
    toast(`${dishById(id).name} added to your order`);
  }
}
function lineDescription(line) {
  return line.addonIds.map(id => addons[id].name).join(' · ') || 'Original recipe';
}
function cartSuggestions() {
  if (!cart.length || busy) { $('#cartSuggestions').hidden = true; return; }
  const ids = new Set(cart.map(line => line.dishId));
  const hasDrink = cart.some(line => dishById(line.dishId).category === 'drinks');
  const hasDessert = cart.some(line => dishById(line.dishId).category === 'dessert');
  const suggestions = [!hasDrink && 'blue', !hasDessert && 'berry'].filter(id => id && !ids.has(id));
  $('#cartSuggestions').hidden = suggestions.length === 0;
  $('#cartSuggestions').innerHTML = `<div class="cart-suggestions"><p class="eyebrow">COMPLETE YOUR MEAL</p>${suggestions.map(id => {
    const dish = dishById(id);
    return `<div class="suggestion-card">${photo(dish, 'cart-photo')}<div><strong>${dish.name}</strong><small>${money(Math.round(dish.price * 1000))}</small></div><button class="add" data-add="${id}" aria-label="Add ${dish.name} to order">+</button></div>`;
  }).join('')}</div>`;
}
function renderCart() {
  const tracking = activeOrder && cart.length === 0;
  const displayLines = busy ? activeOrder.lines : cart;
  const total = totalPrice(displayLines);
  const count = itemCount(displayLines);
  $('#count').textContent = count;
  $('#cartItems').hidden = Boolean(tracking);
  $('#cartItems').innerHTML = cart.length ? cart.map(line => {
    const dish = dishById(line.dishId);
    return `<div class="cart-item" data-line="${line.id}">${photo(dish, 'cart-photo')}<div class="cart-item-description"><h4>${dish.name}</h4><p>${escapeHTML(lineDescription(line))}</p>${line.note ? `<p class="line-note">${escapeHTML(line.note)}</p>` : ''}<p>${money(unitPrice(line) * line.quantity)}</p><div class="cart-item-actions"><button class="edit-item" data-edit-line="${line.id}">Customize</button><button class="remove-item" data-remove-line="${line.id}" aria-label="Remove ${dish.name}">Remove</button></div></div><div class="quantity"><button data-change-line="${line.id}" data-delta="-1" aria-label="Remove one ${dish.name}">−</button><span>${line.quantity}</span><button data-change-line="${line.id}" data-delta="1" aria-label="Add one ${dish.name}" ${line.quantity === 99 ? 'disabled' : ''}>+</button></div></div>`;
  }).join('') : '<div class="empty-state"><h3>A taste of tomorrow awaits.</h3><p>Add something delicious from our menu.</p><button class="primary" id="browseMenu">Explore Menu →</button></div>';
  $('#subtotal').textContent = money(totalPrice(cart));
  $('#total').textContent = money(totalPrice(cart));
  $('#checkoutArea').hidden = !cart.length || busy || Boolean(tracking);
  $('#checkout').disabled = busy || !cart.length;
  $('#tracking').hidden = !tracking;
  document.querySelectorAll('.order-tabs span').forEach((tab, index) => tab.classList.toggle('selected', index === (tracking ? 1 : 0)));
  cartSuggestions();
  if (tracking) $('#cartSuggestions').hidden = true;
  $('#mobileCartBar').hidden = (!count && !busy) || !$('#cart').hidden;
  $('#mobileCartCount').textContent = count;
  $('#mobileCartCount').className = 'cart-count';
  $('#mobileCartTotal').textContent = money(total);
  $('#mobileCartLabel').textContent = busy ? 'Track your order' : 'View your order';
  $('#orderStatus').hidden = !busy;
  if (busy) $('#orderStatus').textContent = `◉ ${activeOrder.id} · Your demo order is in progress · Track order →`;
  document.body.classList.toggle('has-mobile-cart', count > 0 || busy);
}
function openCart() {
  closeMobileNavigation();
  lastFocus = document.activeElement;
  $('#cart').hidden = false;
  $('#overlay').hidden = false;
  document.body.style.overflow = 'hidden';
  renderCart();
  if (activeOrder && cart.length === 0) renderTracking(true);
  $('#cartClose').focus();
}
function closeCart() {
  $('#cart').hidden = true;
  $('#overlay').hidden = true;
  document.body.style.overflow = '';
  renderCart();
  if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
  else $('#cartOpen').focus({ preventScroll: true });
}
function info(title, content) {
  closeMobileNavigation();
  $('#infoContent').innerHTML = `<p class="eyebrow">FUTURE RESTAURANT 2060</p><h2 id="infoTitle">${title}</h2>${content}`;
  $('#infoDialog').setAttribute('aria-labelledby', 'infoTitle');
  $('#infoDialog').showModal();
}
function showDetail(id, lineId = null) {
  if (busy) { toast('Please wait for your current demo order to finish.'); return; }
  const dish = dishById(id);
  if (!dish) return;
  const line = cart.find(item => item.id === lineId);
  editingLineId = line ? line.id : null;
  detailDishId = id;
  detailQuantity = line ? line.quantity : 1;
  const meta = metadata[id];
  $('#detailDialog').innerHTML = `<button class="close" id="detailClose" aria-label="Close dish details">×</button>${photo(dish, 'detail-photo')}<div class="detail-content"><p class="eyebrow">${categories.find(([category]) => category === dish.category)[1]}</p><h2 id="detailTitle">${dish.name}</h2><p>${dish.detail}</p><div class="dish-tags">${dish.tags.split(' · ').map(tag => `<span>${tag}</span>`).join('')}</div><div class="detail-nutrition"><span>~${meta.kcal} kcal</span><span>${meta.protein} g protein</span><span>~${meta.minutes} min</span></div><p class="field-hint">Estimates are for the base recipe, before extras. Confirm ingredients and allergies with the restaurant team.</p>
    <form id="customizeForm"><fieldset class="customization-section"><legend>Make it yours <span>Optional extras · per portion</span></legend><div class="option-grid">${allowedAddons(dish).map(addonId => `<label class="addon-option"><input type="checkbox" name="addon" value="${addonId}" ${line && line.addonIds.includes(addonId) ? 'checked' : ''}><span>${addons[addonId].name}</span><small>+${money(addons[addonId].fils)}</small></label>`).join('')}</div></fieldset>
      <label class="field">Notes for this dish <span>(optional)</span><textarea id="itemNote" class="item-note" maxlength="160" placeholder="Sauce on the side, no extra salt…">${escapeHTML(line ? line.note : '')}</textarea></label>
      <div class="customization-footer"><div class="detail-quantity"><span>Quantity</span><div class="quantity"><button type="button" data-detail-quantity="-1" aria-label="Decrease quantity">−</button><output id="detailQuantity">${detailQuantity}</output><button type="button" data-detail-quantity="1" aria-label="Increase quantity">+</button></div></div><strong id="detailTotal"></strong></div><button type="submit" class="primary" id="addCustomized">${line ? 'Save changes' : 'Add to order'} <span>→</span></button></form></div>`;
  $('#detailDialog').showModal();
  updateDetailTotal();
}
function currentDetailLine() {
  return { dishId: detailDishId, quantity: detailQuantity,
    addonIds: [...$('#customizeForm').querySelectorAll('input[name="addon"]:checked')].map(input => input.value).sort(),
    note: $('#itemNote').value.trim().slice(0, 160) };
}
function updateDetailTotal() {
  const line = currentDetailLine();
  $('#detailQuantity').textContent = detailQuantity;
  $('#detailTotal').textContent = money(unitPrice(line) * detailQuantity);
  $('[data-detail-quantity="-1"]').disabled = detailQuantity === 1;
  $('[data-detail-quantity="1"]').disabled = detailQuantity === 99;
}
function submitCustomization() {
  if (busy || !detailDishId) return;
  const line = currentDetailLine();
  const oldIndex = cart.findIndex(item => item.id === editingLineId);
  if (oldIndex >= 0) {
    const oldLine = cart.splice(oldIndex, 1)[0];
    if (!addLine(line)) { cart.splice(oldIndex, 0, oldLine); return; }
  } else if (!addLine(line)) return;
  prepareNewCart();
  saveCart();
  $('#detailDialog').close();
  if (!$('#cart').hidden) $('#cartClose').focus();
  toast(oldIndex >= 0 ? 'Your selection has been updated' : `${dishById(line.dishId).name} added to your order`);
}
function changeLine(id, delta) {
  if (busy) return;
  const line = cart.find(item => item.id === id);
  if (!line || ![-1, 1].includes(delta)) return;
  line.quantity = Math.min(99, line.quantity + delta);
  if (!line.quantity) cart = cart.filter(item => item.id !== id);
  saveCart();
  const button = document.querySelector(`[data-change-line="${id}"][data-delta="${delta}"]`);
  if (button && !button.disabled) button.focus({ preventScroll: true });
  else $('#cartClose').focus({ preventScroll: true });
}
const dateLabel = timestamp => new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Dubai', dateStyle: 'medium', timeStyle: 'short'
}).format(timestamp);
function stagesFor(order) {
  return [
    ['Order confirmed', 'Your selection has arrived at our smart kitchen.'],
    ['Preparing your meal', 'Fresh flavors are coming together.'],
    [order.pickup ? 'Ready for collection' : 'Robot on the way', order.pickup ? 'Your meal is ready at our collection point.' : `Your robot is heading to Table ${order.table}.`],
    [order.pickup ? 'Collected. Enjoy!' : 'Delivered. Enjoy!', 'Thank you for dining with the future.']
  ];
}
function completeOrder() {
  if (!activeOrder || activeOrder.completed) return;
  activeOrder.completed = true;
  busy = false;
  const latest = storage.read(HISTORY_KEY, history);
  const latestHistory = Array.isArray(latest) ? latest.map(order => normalizeOrder(order)).filter(Boolean) : [];
  if (!latestHistory.some(order => order.id === activeOrder.id)) {
    const safeOrder = { ...activeOrder, name: '', notes: '', lines: activeOrder.lines.map(line => ({ ...line, note: '' })) };
    const combined = [safeOrder, ...latestHistory, ...history];
    history = combined.filter((order, index) => combined.findIndex(other => other.id === order.id) === index)
      .sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
    storage.write(HISTORY_KEY, history);
  }
  storage.write(ACTIVE_KEY, activeOrder, true);
  clearInterval(trackingTimer);
  trackingTimer = null;
  renderCart();
}
function renderTracking(force = false) {
  if (!activeOrder) return;
  const stage = Math.min(3, Math.max(0, Math.floor((Date.now() - activeOrder.createdAt) / STAGE_MS)));
  if (stage === 3 && !activeOrder.completed) completeOrder();
  if (!force && renderedStage === stage) return;
  renderedStage = stage;
  const order = activeOrder;
  const focused = $('#tracking').contains(document.activeElement) ? document.activeElement.id : null;
  $('#tracking').innerHTML = `<div class="track-head"><span class="check">${stage === 3 ? '✓' : '✧'}</span><h3>${stage === 3 ? 'Bon appétit!' : 'A little future is on its way.'}</h3><p id="orderGreeting"></p><p>${order.id} · ${order.pickup ? 'Takeaway' : `Table ${order.table}`}<br>Demo order · No payment collected</p></div><div class="order-progress" role="progressbar" aria-label="Demo order progress" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${stage}"><span style="width:${(stage + 1) * 25}%"></span></div>${stagesFor(order).map(([title, description], index) => `<div class="track-step ${index <= stage ? 'done' : ''}"><i>${index < stage ? '✓' : String(index + 1).padStart(2, '0')}</i><div><strong>${title}</strong><small>${description}</small></div></div>`).join('')}<p id="kitchenNotes" class="demo-note"></p><div class="track-summary">${order.lines.map(line => `<div><span>${line.quantity} × ${dishById(line.dishId).name}${line.addonIds.length ? `<small> · ${escapeHTML(lineDescription(line))}</small>` : ''}</span><span>${money(unitPrice(line) * line.quantity)}</span></div>`).join('')}<div><strong>Total</strong><strong>${money(totalPrice(order.lines))}</strong></div></div><div class="track-actions"><button class="secondary" id="downloadReceipt">Download summary ↓</button>${stage === 3 ? '<button class="primary" id="newOrder">Start a new order →</button>' : ''}</div>`;
  $('#orderGreeting').textContent = `Thank you${order.name ? `, ${order.name}` : ''}. ${stage === 3 ? 'Your demo experience is complete.' : 'Follow your order below.'}`;
  $('#kitchenNotes').textContent = order.notes ? `Kitchen notes: ${order.notes}` : '';
  if (focused) document.getElementById(focused)?.focus({ preventScroll: true });
}
function resumeTracking() {
  clearInterval(trackingTimer);
  renderedStage = -1;
  if (!activeOrder) return;
  renderTracking(true);
  if (!activeOrder.completed) trackingTimer = setInterval(() => renderTracking(), 500);
}
function placeOrder() {
  if (busy || !cart.length) return;
  const input = $('#customerName');
  const name = input.value.trim();
  if (!name) {
    $('#orderError').textContent = 'Please enter your name to place your demo order.';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  $('#orderError').textContent = '';
  input.removeAttribute('aria-invalid');
  activeOrder = {
    id: `FR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    createdAt: Date.now(), name: name.slice(0, 60), notes: $('#notes').value.trim().slice(0, 300),
    pickup: $('#service').value === 'pickup', table: Number($('#table').value),
    lines: copyLines(cart), completed: false
  };
  busy = true;
  cart = [];
  storage.write(ACTIVE_KEY, activeOrder, true);
  saveCart();
  resumeTracking();
  $('#tracking').setAttribute('tabindex', '-1');
  $('#tracking').focus({ preventScroll: true });
  $('#tracking').scrollIntoView({ block: 'start', behavior: 'smooth' });
}
function downloadReceipt(order) {
  if (!order) return;
  const text = [
    'FUTURE RESTAURANT 2060', 'DEMO ORDER SUMMARY — NOT A PAYMENT RECEIPT', '',
    `Order: ${order.id}`, `Date: ${dateLabel(order.createdAt)} (Dubai time)`,
    `Service: ${order.pickup ? 'Takeaway' : `Robot delivery to Table ${order.table}`}`, '',
    ...order.lines.map(line => `${line.quantity} x ${dishById(line.dishId).name} — ${money(unitPrice(line) * line.quantity)}${line.addonIds.length ? `\n  Extras: ${lineDescription(line)}` : ''}${line.note ? `\n  Dish note: ${line.note}` : ''}`), '',
    `TOTAL: ${money(totalPrice(order.lines))}`, ...(order.notes ? [`Kitchen notes: ${order.notes}`] : []), '',
    'No payment was collected. No real order was sent.'
  ].join('\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = `${order.id}-demo-summary.txt`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function showHistory() {
  const latest = storage.read(HISTORY_KEY, history);
  if (Array.isArray(latest)) history = latest.map(order => normalizeOrder(order)).filter(Boolean).slice(0, 5);
  const content = history.length ? history.map(order => `<article class="history-card"><div class="history-card-top"><strong>${order.id}</strong><span>${money(totalPrice(order.lines))}</span></div><p>${dateLabel(order.createdAt)} · ${order.pickup ? 'Takeaway' : `Table ${order.table}`}</p><div class="history-items">${order.lines.map(line => `<div>${line.quantity} × ${dishById(line.dishId).name}${line.addonIds.length ? ` <small>(${lineDescription(line)})</small>` : ''}</div>`).join('')}</div><div class="history-actions"><button class="primary" data-reorder="${order.id}" ${busy ? 'disabled' : ''}>Order again →</button><button class="secondary" data-receipt="${order.id}">Download summary</button></div></article>`).join('')
    : '<div class="empty-state"><h3>Your next favorite meal is waiting.</h3><p>Completed demo orders appear here, ready to order again.</p></div>';
  info('A taste worth revisiting.', '<p>Recent demo orders saved on this device. Your name and kitchen notes are not kept in this history.</p>' + content);
}
function reorder(id) {
  if (busy) return;
  const order = history.find(item => item.id === id);
  if (!order) return;
  const before = copyLines(cart);
  for (const line of order.lines) {
    if (!addLine(line)) { cart = before; return; }
  }
  prepareNewCart();
  saveCart();
  $('#infoDialog').close();
  openCart();
  toast('Your previous selection is back in your cart');
}
function showAbout() {
  info('A Taste of Tomorrow.', '<p>Welcome to Future Restaurant 2060, where modern technology meets authentic flavors. Thoughtfully crafted food, smart table ordering and friendly robot delivery come together in one dining experience.</p><div class="contact-grid"><div><strong>OUR FOOD</strong>Fresh ingredients. Familiar favorites. A futuristic experience.</div><div><strong>YOUR TABLE</strong>Customize each dish, save your favorites, and let our robot bring it to you.</div><div><strong>OUR PLANET</strong>Thoughtful portions and a vision for less waste.</div></div><p>This is an interactive restaurant concept. Prices, ingredients, nutrition and preparation times are illustrative. All orders are simulated.</p>');
}
function showContact() {
  info('Let’s connect.', '<p>A new dining experience is on the horizon. Our restaurant location, opening hours and contact details will be announced before launch.</p><div class="contact-grid"><div><strong>LOCATION</strong>Future location · To be announced</div><div><strong>OPENING HOURS</strong>Coming soon</div><div><strong>ORDERING</strong>Explore the menu and try smart table ordering.</div></div><a class="primary" href="#menu" id="contactMenu">Explore Menu →</a>');
}
function closeMobileNavigation() {
  $('#mobileNavigation').hidden = true;
  $('#mobileNavToggle').setAttribute('aria-expanded', 'false');
  $('#mobileNavToggle').setAttribute('aria-label', 'Open navigation');
}
function updateQR() {
  const image = $('#menuQR');
  if (!image || typeof qrcode === 'undefined') return;
  const code = qrcode(0, 'M');
  code.addData(new URL('./#menu', location.href).href);
  code.make();
  image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(code.createSvgTag({ cellSize: 3, margin: 2, scalable: true }));
  image.title = 'Scan to open this menu on your phone';
}

document.addEventListener('click', event => {
  const button = event.target.closest('button, a');
  if (!button) { if (!event.target.closest('.site-header')) closeMobileNavigation(); return; }
  if (!button.closest('.site-header')) closeMobileNavigation();
  if (button.closest('#mobileNavigation')) {
    closeMobileNavigation();
    if (button.dataset.mobileInfo === 'about') showAbout();
    if (button.dataset.mobileInfo === 'contact') showContact();
  }
  if (button.hasAttribute('data-category')) {
    filter = button.dataset.category;
    renderMenu();
  }
  if (button.hasAttribute('data-diet')) { diet = button.dataset.diet; renderMenu(); }
  if (button.hasAttribute('data-favorite')) favorite(button.dataset.favorite);
  if (button.hasAttribute('data-add')) quickAdd(button.dataset.add);
  if (button.hasAttribute('data-detail')) showDetail(button.dataset.detail);
  if (button.hasAttribute('data-edit-line')) {
    const line = cart.find(item => item.id === button.dataset.editLine);
    if (line) showDetail(line.dishId, line.id);
  }
  if (button.hasAttribute('data-remove-line') && !busy) {
    cart = cart.filter(line => line.id !== button.dataset.removeLine);
    saveCart();
    $('#cartClose').focus({ preventScroll: true });
  }
  if (button.hasAttribute('data-change-line')) changeLine(button.dataset.changeLine, Number(button.dataset.delta));
  if (button.hasAttribute('data-detail-quantity')) {
    detailQuantity = Math.max(1, Math.min(99, detailQuantity + Number(button.dataset.detailQuantity)));
    updateDetailTotal();
  }
  if (button.hasAttribute('data-reorder')) reorder(button.dataset.reorder);
  if (button.hasAttribute('data-receipt')) downloadReceipt(history.find(order => order.id === button.dataset.receipt));
  if (button.id === 'detailClose') $('#detailDialog').close();
  if (button.id === 'browseMenu') { closeCart(); $('#menu').scrollIntoView({ behavior: 'smooth' }); }
  if (button.id === 'robotInfo') info('Meet your future waiter.', '<p>Order from the tablet fixed to your table, customize your meal, and follow every step. Our friendly delivery robots carry freshly prepared dishes directly from the kitchen to your table.</p><p>This concept demo simulates smart kitchen preparation and contactless delivery.</p><button class="primary" id="tryRobot">Try smart ordering →</button>');
  if (button.id === 'tryRobot') { $('#infoDialog').close(); openCart(); }
  if (button.id === 'contactMenu') $('#infoDialog').close();
  if (button.id === 'downloadReceipt') downloadReceipt(activeOrder);
  if (button.id === 'newOrder') {
    activeOrder = null;
    storage.remove(ACTIVE_KEY, true);
    $('#tracking').hidden = true;
    renderCart(); closeCart();
    $('#menu').scrollIntoView({ behavior: 'smooth' });
  }
  if (button.hasAttribute('data-contact')) info('Follow our future.', `<p>Our ${button.dataset.contact} channel will be announced when Future Restaurant opens. For now, explore the menu and share this concept with your friends.</p>`);
});
document.addEventListener('submit', event => {
  if (event.target.id === 'customizeForm') { event.preventDefault(); submitCustomization(); }
});
document.addEventListener('change', event => {
  if (event.target.matches('#customizeForm input[name="addon"]')) updateDetailTotal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('#mobileNavigation').hidden) { closeMobileNavigation(); $('#mobileNavToggle').focus(); }
  const nativeModalOpen = $('#detailDialog').open || $('#infoDialog').open;
  if (event.key === 'Escape' && !$('#cart').hidden && !nativeModalOpen) closeCart();
  if (event.key !== 'Tab' || $('#cart').hidden || nativeModalOpen) return;
  const nodes = [...$('#cart').querySelectorAll('button:not(:disabled),input,select,textarea')].filter(node => node.offsetParent !== null && !node.disabled);
  if (!nodes.length) return;
  const first = nodes[0], last = nodes[nodes.length - 1];
  if (!$('#cart').contains(document.activeElement)) {
    event.preventDefault(); (event.shiftKey ? last : first).focus(); return;
  }
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
$('#search').addEventListener('input', renderMenu);
$('#resetSearch').onclick = resetFilters;
$('#clearFilters').onclick = resetFilters;
$('#favoritesOnly').onclick = () => { favoritesOnly = !favoritesOnly; renderMenu(); };
$('#sortMenu').onchange = event => { sort = event.target.value; renderMenu(); };
$('#searchOpen').onclick = () => { $('#menu').scrollIntoView({ behavior: 'smooth' }); $('#search').focus({ preventScroll: true }); };
$('#cartOpen').onclick = openCart;
$('#mobileCartOpen').onclick = openCart;
$('#orderStatus').onclick = openCart;
$('#cartClose').onclick = closeCart;
$('#overlay').onclick = closeCart;
$('#infoClose').onclick = () => $('#infoDialog').close();
$('#aboutOpen').onclick = showAbout;
$('#contactOpen').onclick = showContact;
$('#locationOpen').onclick = showContact;
$('#historyOpen').onclick = showHistory;
$('#mobileNavToggle').onclick = () => {
  const open = $('#mobileNavigation').hidden;
  $('#mobileNavigation').hidden = !open;
  $('#mobileNavToggle').setAttribute('aria-expanded', String(open));
  $('#mobileNavToggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
};
$('#customerName').addEventListener('input', () => {
  if ($('#customerName').value.trim()) { $('#orderError').textContent = ''; $('#customerName').removeAttribute('aria-invalid'); }
});
$('#table').innerHTML = Array.from({ length: 30 }, (_, index) => `<option value="${index + 1}" ${index === 6 ? 'selected' : ''}>Table ${String(index + 1).padStart(2, '0')}</option>`).join('');
$('#service').onchange = () => { $('#tableLabel').hidden = $('#service').value === 'pickup'; };
$('#checkout').onclick = placeOrder;
renderMenu();
renderCart();
resumeTracking();
