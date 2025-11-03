// Elementos do DOM
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginFormSubmit = document.getElementById('loginForm');
const registerFormSubmit = document.getElementById('registerForm');
const messageEl = document.getElementById('message');

// Sistema de Tabs
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    hideMessage();
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    hideMessage();
});

// Mostrar mensagem
function showMessage(text, type = 'info') {
    messageEl.textContent = text;
    messageEl.className = 'message show ' + type;
    
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }
}

function hideMessage() {
    messageEl.classList.remove('show');
}

// Validação de username
function validateUsername(username) {
    if (username.length < 3 || username.length > 20) {
        return { valid: false, msg: 'Username deve ter entre 3 e 20 caracteres' };
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return { valid: false, msg: 'Username deve conter apenas letras e números' };
    }
    return { valid: true };
}

// Validação de senha
function validatePassword(password) {
    if (password.length < 8) {
        return { valid: false, msg: 'Senha deve ter no mínimo 8 caracteres' };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return { valid: false, msg: 'Senha deve conter letras maiúsculas, minúsculas e números' };
    }
    return { valid: true };
}

// Validação de email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, msg: 'Email inválido' };
    }
    return { valid: true };
}

// Sistema de Login
loginFormSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validações
    if (!username || !password) {
        showMessage('Preencha todos os campos', 'error');
        return;
    }
    
    // Simulação de login (aqui você conectaria com backend real)
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = savedUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        showMessage('Login realizado com sucesso!', 'success');
        
        // Salvar sessão
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify({ username: user.username, email: user.email }));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify({ username: user.username, email: user.email }));
        }
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
            window.location.href = 'game.html'; // Página do jogo
        }, 1000);
    } else {
        showMessage('Usuário ou senha incorretos', 'error');
    }
});

// Sistema de Cadastro
registerFormSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const terms = document.getElementById('terms').checked;
    
    // Validações
    if (!username || !email || !password || !confirmPassword) {
        showMessage('Preencha todos os campos', 'error');
        return;
    }
    
    // Validar username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
        showMessage(usernameValidation.msg, 'error');
        return;
    }
    
    // Validar email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        showMessage(emailValidation.msg, 'error');
        return;
    }
    
    // Validar senha
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showMessage(passwordValidation.msg, 'error');
        return;
    }
    
    // Confirmar senha
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem', 'error');
        return;
    }
    
    // Aceitar termos
    if (!terms) {
        showMessage('Você deve aceitar os termos de serviço', 'error');
        return;
    }
    
    // Verificar se usuário já existe
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = savedUsers.find(u => u.username === username || u.email === email);
    
    if (userExists) {
        showMessage('Usuário ou email já cadastrado', 'error');
        return;
    }
    
    // Salvar novo usuário
    const newUser = {
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    savedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(savedUsers));
    
    showMessage('Conta criada com sucesso! Redirecionando...', 'success');
    
    // Salvar sessão e redirecionar
    sessionStorage.setItem('currentUser', JSON.stringify({ username: newUser.username, email: newUser.email }));
    
    setTimeout(() => {
        window.location.href = 'game.html'; // Página do jogo
    }, 1500);
});

// Efeitos visuais extras
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar som de hover nos botões
    const buttons = document.querySelectorAll('button, .forgot-link, .footer-links a');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'all 0.3s ease';
        });
    });
    
    // Verificar se já está logado
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        showMessage(`Bem-vindo de volta, ${user.username}! Redirecionando...`, 'info');
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 2000);
    }
});

console.log('🏚️ Torre de Ecos - Sistema de Login carregado 🏚️');
