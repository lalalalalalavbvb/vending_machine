const loginButton = document.getElementById('login')
const error = document.getElementById('error')

if (localStorage.getItem('adminToken')) {
    window.location.href = '../admin/'
}

async function login() {
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    if (!email || !password) {
        error.textContent = 'กรุณากรอก Username และ Password'
        return
    }

    try {
        const response = await api.users.login({ email, password })
        localStorage.setItem('adminToken', response.data.token)
        window.location.href = '../admin/'
    } catch (err) {
        error.textContent = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
    }
}

loginButton.addEventListener('click', login)
document.getElementById('password').addEventListener('keydown', event => {
    if (event.key === 'Enter') login()
})
