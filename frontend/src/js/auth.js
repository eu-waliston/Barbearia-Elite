// Remova o import e use a instância global
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.initialized = false;
        this.bindEvents();
    }

    bindEvents() {
        // Event listeners para os botões de login/registro
        document.addEventListener('click', (e) => {
            if (e.target.id === 'login-btn' || e.target.id === 'register-btn') {
                this.openModal();
            }
        });

        // Fechar modal
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Alternar entre login e registro
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');

        if (switchToRegister) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('register-form').style.display = 'block';
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
            });
        }

        // Submit login
        const submitLogin = document.getElementById('submit-login');
        if (submitLogin) {
            submitLogin.addEventListener('click', () => this.handleLogin());
        }

        // Submit registro
        const submitRegister = document.getElementById('submit-register');
        if (submitRegister) {
            submitRegister.addEventListener('click', () => this.handleRegister());
        }
    }

    async init() {
        if (this.initialized) return;
        this.initialized = true;

        const token = localStorage.getItem('token');
        if (!token) {
            this.updateUI();
            return;
        }

        try {
            this.currentUser = await window.api.getCurrentUser();
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            window.api.clearToken();
            this.currentUser = null;
        }

        this.updateUI();
    }

    updateUI() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) {
            // Se ainda não existe, tenta novamente em 100ms
            setTimeout(() => this.updateUI(), 100);
            return;
        }

        authButtons.innerHTML = '';

        if (this.currentUser) {
            const span = document.createElement('span');
            span.className = 'user-greeting';
            span.textContent = `Olá, ${this.currentUser.name.split(' ')[0]}`;

            const btn = document.createElement('button');
            btn.className = 'btn btn-outline';
            btn.textContent = 'Sair';
            btn.onclick = () => this.logout();

            authButtons.append(span, btn);
        } else {
            const loginBtn = document.createElement('button');
            loginBtn.id = 'login-btn';
            loginBtn.className = 'btn btn-outline';
            loginBtn.textContent = 'Login';

            const registerBtn = document.createElement('button');
            registerBtn.id = 'register-btn';
            registerBtn.className = 'btn btn-primary';
            registerBtn.textContent = 'Registrar';

            authButtons.append(loginBtn, registerBtn);
        }
    }

    async handleLogin() {
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;

        if (!email || !password) {
            window.showNotification('Preencha todos os campos', 'error');
            return;
        }

        try {
            this.currentUser = await window.api.login(email, password);
            this.updateUI();
            this.closeModal();
            window.showNotification('Login realizado com sucesso!', 'success');
        } catch (error) {
            window.showNotification(error.message || 'Erro no login', 'error');
        }
    }

    async handleRegister() {
        const name = document.getElementById('register-name')?.value;
        const email = document.getElementById('register-email')?.value;
        const password = document.getElementById('register-password')?.value;
        const phone = document.getElementById('register-phone')?.value;

        if (!name || !email || !password || !phone) {
            window.showNotification('Preencha todos os campos', 'error');
            return;
        }

        try {
            this.currentUser = await window.api.register({
                name,
                email,
                password,
                phone
            });
            this.updateUI();
            this.closeModal();
            window.showNotification('Conta criada com sucesso!', 'success');
        } catch (error) {
            window.showNotification(error.message || 'Erro no registro', 'error');
        }
    }

    logout() {
        window.api.clearToken();
        this.currentUser = null;
        this.updateUI();
        window.showNotification('Logout realizado!', 'success');
    }

    openModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('show');
            // Mostrar formulário de login por padrão
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            if (loginForm) loginForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
        }
    }

    closeModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.remove('show');
        // Limpar formulários
        const inputs = document.querySelectorAll('#login-form input, #register-form input');
        inputs.forEach(input => input.value = '');
    }
}

window.createTestToken = async function () {
    try {
        // Tenta fazer login com cliente de exemplo
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'cliente@exemplo.com',
                password: 'cliente123'
            })
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            console.log('Token de teste criado com sucesso');
            return true;
        }
    } catch (error) {
        console.error('Erro ao criar token de teste:', error);
        return false;
    }
};

// E modifique o init para tentar criar token se não existir
async function init() {
    if (this.initialized) return;
    this.initialized = true;

    let token = localStorage.getItem('token');

    // Se não tem token, tenta criar um de teste
    if (!token) {
        const created = await window.createTestToken();
        if (created) {
            token = localStorage.getItem('token');
        }
    }

    if (token) {
        try {
            this.currentUser = await window.api.getCurrentUser();
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            window.api.clearToken();
            this.currentUser = null;
        }
    }

    this.updateUI();
}

window.createTestToken = async function () {
    try {
        // Tenta fazer login com cliente de exemplo
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'cliente@exemplo.com',
                password: 'cliente123'
            })
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            console.log('Token de teste criado com sucesso');
            return true;
        }
    } catch (error) {
        console.error('Erro ao criar token de teste:', error);
        return false;
    }
};

// E modifique o init para tentar criar token se não existir
async function init() {
    if (this.initialized) return;
    this.initialized = true;

    let token = localStorage.getItem('token');

    // Se não tem token, tenta criar um de teste
    if (!token) {
        const created = await window.createTestToken();
        if (created) {
            token = localStorage.getItem('token');
        }
    }

    if (token) {
        try {
            this.currentUser = await window.api.getCurrentUser();
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            window.api.clearToken();
            this.currentUser = null;
        }
    }

    this.updateUI();
}

window.createTestToken = async function () {
    try {
        // Tenta fazer login com cliente de exemplo
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'cliente@exemplo.com',
                password: 'cliente123'
            })
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            console.log('Token de teste criado com sucesso');
            return true;
        }
    } catch (error) {
        console.error('Erro ao criar token de teste:', error);
        return false;
    }
};

// Cria a instância global
window.auth = new AuthManager();

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.auth.init();
});