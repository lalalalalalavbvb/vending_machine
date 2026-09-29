const $ = id => document.getElementById(id);
let products = []
if (!localStorage.getItem('adminToken')) location.href = '../login/'
const money = n => `฿${Number(n || 0).toFixed(2)}`
async function load() {
    try {
        products = (await api.products.getAllAdmin()).data;
        renderProducts();
        const orders = (await api.orders.getAll()).data;
        renderOrders(orders)
    }
    catch (e) {
        if (e.response?.status === 401) {
            localStorage.removeItem('adminToken');
            location.href = '../login/'
        }
    }
}
function renderProducts() {
    $('admin-products').innerHTML = products.map(p => `<article class="product-card"><img src="${p.image_url || '../../assets/images/no-image.svg'}" onerror="this.src='../../assets/images/no-image.svg'"><h3>${p.name}</h3><p>${p.description || ''}</p><div class="price">${money(p.price)}</div><div class="stock">Stock ${p.stock}</div><button class="add" onclick="edit(${p.id})">แก้ไข</button><button class="delete" onclick="removeProduct(${p.id})">ลบ</button></article>`).join('')
}
function renderOrders(rows) {
    $('orders').innerHTML = rows.map(o => `<tr><td>#${o.id}</td><td>${o.items || '-'}</td><td>${money(o.total_price)}</td><td>${o.payment_method === 'cash' ? 'Cash' : 'PromptPay'}</td><td>${money(o.amount_received)}</td><td>${money(o.change_amount)}</td><td>${new Date(o.created_at).toLocaleString('th-TH')}</td></tr>`).join('')
}
function openModal(p) {
    $('pid').value = p?.id || '';
    $('modal-title').textContent = p ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า';
    $('name').value = p?.name || '';
    $('price').value = p?.price || '';
    $('stock').value = p?.stock || '';
    $('desc').value = p?.description || '';
    $('image').value = '';
    $('preview').style.display = p?.image_url ? 'block' : 'none';
    if (p?.image_url) $('preview').src = p.image_url;
    $('modal').classList.remove('hidden')
}
$('add').onclick = () => openModal();
$('close').onclick = () => $('modal').classList.add('hidden');
$('refresh').onclick = load;
$('logout').onclick = () => {
    localStorage.removeItem('adminToken');
    location.href = '../login/'
}
window.edit = id => openModal(products.find(p => p.id == id))
window.removeProduct = async id => {
    if (!confirm('ต้องการลบสินค้านี้ใช่หรือไม่?')) return;
    await api.products.remove(id);
    load()
}
$('image').onchange = e => {
    const f = e.target.files[0];
    if (f) {
        $('preview').src = URL.createObjectURL(f);
        $('preview').style.display = 'block'
    }
}
$('save').onclick = async () => {
    try {
        let image_url = '';
        const id = $('pid').value;
        const old = products.find(p => p.id == id);
        image_url = old?.image_url || '';
        const f = $('image').files[0];
        if (f) image_url = (await api.products.upload(f)).data.image_url;
        const data = {
            name: $('name').value.trim(), price: Number($('price').value), stock: Number($('stock').value), description: $('desc').value.trim(), image_url, is_active: 1
        };
        if (!data.name) return alert('กรุณากรอกชื่อสินค้า');
        if (id) await api.products.update(id, data);
        else await api.products.create(data);
        $('modal').classList.add('hidden');
        load()
    }
    catch (e) {
        alert(e.response?.data?.message || 'บันทึกไม่สำเร็จ')
    }
}
load()
