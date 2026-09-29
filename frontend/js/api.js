const BASE_URL = 'http://localhost:8000'
const adminToken = () => localStorage.getItem('adminToken') || ''
const api = {
    products: {
        getAll: () => axios.get(`${BASE_URL}/products`), getAllAdmin: () => axios.get(`${BASE_URL}/admin/products`, {
            headers: {
                Authorization: adminToken()
            }
        }), create: d => axios.post(`${BASE_URL}/admin/products`, d, {
            headers: {
                Authorization: adminToken()
            }
        }), update: (id, d) => axios.put(`${BASE_URL}/admin/products/${id}`, d, {
            headers: {
                Authorization: adminToken()
            }
        }), remove: id => axios.delete(`${BASE_URL}/admin/products/${id}`, {
            headers: {
                Authorization: adminToken()
            }
        }), upload: file => {
            const f = new FormData();
            f.append('image', file);
            return axios.post(`${BASE_URL}/admin/products/upload`, f, {
                headers: {
                    Authorization: adminToken()
                }
            })
        }
    },
    users: {
        login: d => axios.post(`${BASE_URL}/users/login`, d)
    },
    orders: {
        getAll: () => axios.get(`${BASE_URL}/orders`), create: d => axios.post(`${BASE_URL}/orders`, d)
    }
}
