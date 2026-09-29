let products = [], cart = [], cash = 0, payment = 'cash'
const $ = id => document.getElementById(id), money = n => `฿${Number(n || 0).toFixed(2)}`, total = () => cart.reduce((s, x) => s + Number(x.price) * x.quantity, 0), delay = ms => new Promise(r => setTimeout(r, ms))
async function load() {
    try {
        products = (await api.products.getAll()).data;
        render()
    }
    catch (e) {
        $('product-list').innerHTML = '<div class="error">โหลดสินค้าไม่ได้</div>'
    }
}
function render() {
    $('product-list').innerHTML = products.map(p => `<article class="product-card"><img src="${p.image_url || '../../assets/images/no-image.svg'}" onerror="this.src='../../assets/images/no-image.svg'"><h3>${p.name}</h3><p>${p.description || ''}</p><div class="price">${money(p.price)}</div><div class="stock">คงเหลือ ${p.stock} ชิ้น</div><button class="add" ${p.stock < 1 ? 'disabled' : ''} onclick="add(${p.id})">${p.stock < 1 ? 'สินค้าหมด' : 'เพิ่มสินค้า'}</button></article>`).join('')
    renderCart()
}
function add(id) {
    const p = products.find(x => x.id == id);
    if (!p) return;
    let x = cart.find(i => i.product_id == id);
    if (x) {
        if (x.quantity < p.stock) x.quantity++
    }
    else cart.push({
        product_id: p.id, name: p.name, price: p.price, quantity: 1, stock: p.stock
    });
    renderCart()
}
function qty(id, n) {
    const x = cart.find(i => i.product_id == id);
    if (!x) return;
    x.quantity += n;
    if (x.quantity <= 0) cart = cart.filter(i => i.product_id != id);
    if (x.quantity > x.stock) x.quantity = x.stock;
    renderCart()
}
function renderCart() {
    $('cart').innerHTML = cart.length ? cart.map(x => `<div class="cart-row"><div><b>${x.name}</b><small>${money(x.price)} × ${x.quantity}</small></div><div class="qty"><button onclick="qty(${x.product_id},-1)">−</button><span>${x.quantity}</span><button onclick="qty(${x.product_id},1)">+</button></div></div>`).join('') : '<div class="empty">ยังไม่มีสินค้า</div>';
    $('total').textContent = money(total());
    updatePay()
}
function updatePay() {
    const t = total();
    $('cash-display').textContent = money(cash);
    const b = $('pay-button');
    if (!cart.length) {
        b.disabled = true;
        b.textContent = 'เลือกสินค้าที่ต้องการ';
        $('cash-message').textContent = '';
        return
    }
    if (payment === 'promptpay') {
        b.disabled = true;
        b.textContent = 'ชำระด้วย QR PromptPay';
        return
    }
    if (cash < t) {
        $('cash-message').textContent = `จำนวนเงินไม่ครบ ขาด ${money(t - cash)}`;
        $('cash-message').className = 'message error';
        b.disabled = true;
        b.textContent = 'จำนวนเงินไม่ครบ'
    }
    else {
        $('cash-message').textContent = `เงินทอน ${money(cash - t)}`;
        $('cash-message').className = 'message success';
        b.disabled = false;
        b.textContent = 'ชำระเงิน'
    }
}
document.querySelectorAll('[data-cash]').forEach(b => b.onclick = () => {
    cash += Number(b.dataset.cash); updatePay()
});
$('clear-cash').onclick = () => {
    cash = 0;
    updatePay()
}
$('cash-tab').onclick = () => {
    payment = 'cash';
    $('cash-tab').classList.add('active');
    $('qr-tab').classList.remove('active');
    $('cash-box').style.display = 'block';
    $('pay-button').style.display = 'block';
    updatePay()
}
$('qr-tab').onclick = () => {
    if (!cart.length) return alert('กรุณาเลือกสินค้าที่ต้องการก่อน');
    payment = 'promptpay';
    $('cash-tab').classList.remove('active');
    $('qr-tab').classList.add('active');
    $('cash-box').style.display = 'none';
    $('pay-button').style.display = 'none';
    openQR()
}
$('pay-button').onclick = payCash
function modal(show) {
    $('payment-modal').classList.toggle('hidden', !show)
}
function openQR() {
    $('processing-step').classList.add('hidden');
    $('success-step').classList.add('hidden');
    $('qr-step').classList.remove('hidden');
    $('qr-total').textContent = money(total());
    modal(true)
}
$('cancel-qr').onclick = () => {
    modal(false);
    $('cash-tab').click()
}
$('confirm-qr').onclick = payQR
function processing() {
    modal(true);
    $('processing-step').classList.remove('hidden');
    $('success-step').classList.add('hidden');
    $('qr-step').classList.add('hidden')
}
function showPaymentSuccess(change) {
    $('processing-step').classList.add('hidden');
    $('success-step').classList.remove('hidden');
    $('success-step').innerHTML = `<div class="success-icon">✓</div><h2>ชำระเงินสำเร็จ</h2>${change ? `<p>เงินทอน ${money(change)}</p>` : ''}<div class="medicine">💊</div><h2>กำลังจ่ายยา</h2><p>กรุณารอสักครู่...</p>`
}
function showDispenseComplete() {
    $('success-step').innerHTML = `<div class="success-icon">✓</div><h2>จ่ายยาเรียบร้อยแล้ว</h2><div class="medicine">💊</div><p>ขอบคุณที่ใช้บริการ</p>`
}
async function payCash() {
    processing();
    try {
        const r = (await api.orders.create({
            items: cart, payment_method: 'cash', amount_received: cash
        })).data;
        await delay(3000);
        showPaymentSuccess(r.change);
        await delay(10000);
        showDispenseComplete();
        await delay(2000);
        finish()
    }
    catch (e) {
        modal(false);
        alert(e.response?.data?.message || 'ชำระเงินไม่สำเร็จ')
    }
}
async function payQR() {
    const b = $('confirm-qr');
    b.disabled = true;
    b.textContent = 'กำลังดำเนินการ...';
    processing();
    try {
        await api.orders.create({
            items: cart, payment_method: 'promptpay', amount_received: total()
        });
        await delay(3000);
        showPaymentSuccess(0);
        await delay(10000);
        showDispenseComplete();
        await delay(2000);
        finish()
    }
    catch (e) {
        $('qr-step').classList.remove('hidden');
        $('processing-step').classList.add('hidden');
        b.disabled = false;
        b.textContent = 'ชำระเงิน';
        alert(e.response?.data?.message || 'ชำระเงินไม่สำเร็จ')
    }
}
async function finish() {
    modal(false);
    cart = [];
    cash = 0;
    payment = 'cash';
    await load();
    $('cash-tab').click()
}
load()
