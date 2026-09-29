const db = require('../config/db')
const getAll = async() => {
    const[r] = await db.query('SELECT id,name,description,price,stock,image_url,is_active FROM products WHERE is_active=1 ORDER BY id');
    return r
}
const getAllAdmin = async() => {
    const[r] = await db.query('SELECT id,name,description,price,stock,image_url,is_active FROM products WHERE is_active=1 ORDER BY id DESC');
    return r
}
const getById = async id => {
    const[r] = await db.query('SELECT id,name,description,price,stock,image_url,is_active FROM products WHERE id=?',[id]);
    return r[0]
}
const create = async d => {
    const[r] = await db.query('INSERT INTO products(name,description,price,stock,image_url,is_active) VALUES(?,?,?,?,?,1)',[d.name, d.description || '', d.price, d.stock, d.image_url || '']);
    return getById(r.insertId)
}
const update = async(id, d) => {
    await db.query('UPDATE products SET name=?,description=?,price=?,stock=?,image_url=?,is_active=? WHERE id=?',[d.name, d.description || '', d.price, d.stock, d.image_url || '', d.is_active ? 1: 0, id]);
    return getById(id)
}
const remove = async id => db.query('UPDATE products SET is_active=0 WHERE id=?',[id])
module.exports = {
    getAll, getAllAdmin, getById, create, update, remove
}
