const money = value => `฿${Number(value || 0).toFixed(2)}`
const ordersEl = document.getElementById('orders')
const refresh = document.getElementById('refresh')

function renderOrders(rows) {
    if (!rows.length) {
        ordersEl.innerHTML = '<tr><td colspan="7">ยังไม่มีคำสั่งซื้อ</td></tr>'
        return
    }

    ordersEl.innerHTML = rows.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.items || '-'}</td>
            <td>${money(order.total_price)}</td>
            <td>${order.payment_method === 'cash' ? 'Cash' : 'PromptPay'}</td>
            <td>${money(order.amount_received)}</td>
            <td>${money(order.change_amount)}</td>
            <td>${new Date(order.created_at).toLocaleString('th-TH')}</td>
        </tr>
    `).join('')
}

async function loadOrders() {
    try {
        ordersEl.innerHTML = '<tr><td colspan="7">กำลังโหลด...</td></tr>'
        const response = await api.orders.getAll()
        renderOrders(response.data)
    } catch (error) {
        ordersEl.innerHTML = '<tr><td colspan="7">โหลดประวัติคำสั่งซื้อไม่ได้</td></tr>'
    }
}

refresh.addEventListener('click', loadOrders)
loadOrders()
