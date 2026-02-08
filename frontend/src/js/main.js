// Função global para mostrar notificações
window.showNotification = function(message, type = 'info') {
    // Remove notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;

    // Definir cores baseadas no tipo
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#ff9800'
    };

    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Auto-remover após 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
};

// Adicionar estilos CSS para animações se não existirem
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 2000;
            animation: slideIn 0.3s ease;
        }

        .notification-success {
            background-color: #4CAF50;
        }

        .notification-error {
            background-color: #f44336;
        }

        .notification-info {
            background-color: #2196F3;
        }

        .notification-warning {
            background-color: #ff9800;
        }
    `;
    document.head.appendChild(style);
}

// Função para inicializar tudo
window.initializeApp = function() {
    // Verifica se os objetos globais já foram criados
    if (window.auth && typeof window.auth.init === 'function') {
        window.auth.init();
    }

    if (window.bookingManager && typeof window.bookingManager.init === 'function') {
        window.bookingManager.init();
    }

    // Testar conexão com API
    testAPI();
};

// Testar conexão com a API
async function testAPI() {
    try {
        const response = await fetch('http://localhost:5000/api');
        if (response.ok) {
            console.log('✅ API conectada com sucesso');
        } else {
            console.warn('⚠️ API retornou erro:', response.status);
        }
    } catch (error) {
        console.error('❌ Não foi possível conectar à API:', error.message);
        window.showNotification('Não foi possível conectar ao servidor. Verifique se o backend está rodando.', 'error');
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initializeApp);
} else {
    window.initializeApp();
}