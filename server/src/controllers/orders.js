const db = require('../config/db')
exports.getAll = async(req, res, next) => {
    try {
        const[r] = await db.query(`SELECT o.id,o.total_price,o.payment_method,o.amount_received,o.change_amount,o.status,o.created_at,GROUP_CONCAT(CONCAT(p.name,' x',oi.quantity) SEPARATOR ', ') items FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id LEFT JOIN products p ON p.id=oi.product_id GROUP BY o.id ORDER BY o.id DESC`);
        res.json(r)
    }
    catch(e) {
        next(e)
    }
}
exports.getById = async(req, res, next) => {
    try {
        const[r] = await db.query('SELECT * FROM orders WHERE id=?',[req.params.id]);
        if( ! r[0])return res.status(404).json( {
            message: 'ไม่พบคำสั่งซื้อ'
        });
        const[items] = await db.query('SELECT oi.*,p.name FROM order_items oi LEFT JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?',[req.params.id]);
        res.json( {
            ...r[0], items
        })
    }
    catch(e) {
        next(e)
    }
}
exports.create = async(req, res, next) => {
    const {
        items, payment_method, amount_received
    }
    = req.body;
    const c = await db.getConnection();
    try {
        await c.beginTransaction();
        if( ! Array.isArray(items) || ! items.length)throw Object.assign(new Error('กรุณาเลือกสินค้า'), {
            status: 400
        });
        let total = 0, checked =[];
        for(const i of items) {
            const[r] = await c.query('SELECT id,name,price,stock FROM products WHERE id=? AND is_active=1 FOR UPDATE',[i.product_id]);
            if( ! r[0])throw Object.assign(new Error('ไม่พบสินค้า'), {
                status: 400
            });
            const p = r[0], q = Number(i.quantity);
            if( ! Number.isInteger(q) || q < 1 || p.stock < q)throw Object.assign(new Error(`สินค้า ${p.name} มีไม่พอ`), {
                status: 400
            });
            total += Number(p.price) * q;
            checked.push( {
                ...p, quantity: q
            })
        }
        const received = Number(amount_received || 0);
        if(payment_method === 'cash' && received < total)throw Object.assign(new Error('จำนวนเงินไม่ครบ'), {
            status: 400
        });
        const change = payment_method === 'cash' ? received - total: 0;
        const[o] = await c.query('INSERT INTO orders(total_price,payment_method,amount_received,change_amount,status) VALUES(?,?,?,?,?)',[total, payment_method, received, change, 'paid']);
        for(const i of checked) {
            await c.query('INSERT INTO order_items(order_id,product_id,quantity,price_at_purchase) VALUES(?,?,?,?)',[o.insertId, i.id, i.quantity, i.price]);
            await c.query('UPDATE products SET stock=stock-? WHERE id=?',[i.quantity, i.id])
        }
        await c.commit();
        res.json( {
            id: o.insertId, total, change
        })
    }
    catch(e) {
        await c.rollback();
        next(e)
    }
    finally {
        c.release()
    }
}
