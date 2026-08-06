import '../css/style.css';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Auth
function getToken() {
    return sessionStorage.getItem('admin_token');
}

function authHeaders() {
    return { 'Authorization': `Bearer ${getToken()}` };
}

function mostrarLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('admin-content').classList.add('hidden');
}

function mostrarAdmin() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-content').classList.remove('hidden');
    carregarMensagens();
}

function fazerLogout() {
    sessionStorage.removeItem('admin_token');
    mostrarLogin();
}

// Formulário de login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const senha = document.getElementById('senha-input').value;
    const erro = document.getElementById('login-erro');

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: senha })
        });

        if (!res.ok) {
            erro.classList.remove('hidden');
            return;
        }

        const { token } = await res.json();
        sessionStorage.setItem('admin_token', token);
        erro.classList.add('hidden');
        mostrarAdmin();
    } catch {
        erro.classList.remove('hidden');
    }
});

// Mensagens
async function carregarMensagens() {
    const loading = document.getElementById('loading');
    const vazio = document.getElementById('vazio');
    const lista = document.getElementById('lista-mensagens');
    const contador = document.getElementById('contador');

    loading.classList.remove('hidden');
    vazio.classList.add('hidden');
    lista.classList.add('hidden');
    lista.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/messages`, {
            headers: authHeaders()
        });

        if (response.status === 401) {
            sessionStorage.removeItem('admin_token');
            mostrarLogin();
            return;
        }

        const mensagens = await response.json();

        loading.classList.add('hidden');

        if (mensagens.length === 0) {
            vazio.classList.remove('hidden');
            contador.textContent = 'Nenhuma mensagem';
            return;
        }

        const naoLidas = mensagens.filter(m => !m.read).length;
        contador.textContent = naoLidas > 0
            ? `${naoLidas} não lida${naoLidas > 1 ? 's' : ''} · ${mensagens.length} total`
            : `${mensagens.length} mensagem${mensagens.length > 1 ? 's' : ''} · todas lidas`;

        lista.classList.remove('hidden');

        mensagens.forEach(mensagem => {
            const card = criarCard(mensagem);
            lista.appendChild(card);
        });

    } catch (err) {
        loading.classList.add('hidden');
        lista.classList.remove('hidden');
        lista.innerHTML = `
            <div class="text-center text-red-400 py-20">
                <p class="text-xl">❌ Erro ao carregar mensagens.</p>
                <p class="text-sm mt-2">Verifique se o servidor está rodando em ${API_URL}</p>
            </div>
        `;
    }
}

// Card de Mensagem
function criarCard(mensagem) {
    const div = document.createElement('div');
    const naoLida = !mensagem.read;

    div.id = `mensagem-${mensagem.id}`;
    div.className = `
        rounded-xl p-6 border transition-all
        ${naoLida
            ? 'bg-[#001a4d] border-[#3a86ff] shadow-lg shadow-blue-900/20'
            : 'bg-[#000d1a] border-[#002878] opacity-75'}
    `;

    const data = new Date(mensagem.createdAt).toLocaleString('pt-BR');

    div.innerHTML = `
        <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-1 flex-wrap">
                    ${naoLida
                        ? '<span class="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1"></span>'
                        : '<span class="w-2 h-2 bg-gray-600 rounded-full flex-shrink-0 mt-1"></span>'}
                    <span class="text-white font-semibold">${escaparHTML(mensagem.name)}</span>
                    ${naoLida
                        ? '<span class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Não lida</span>'
                        : '<span class="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Lida</span>'}
                </div>
                <p class="text-gray-400 text-sm mb-3">${escaparHTML(mensagem.email)} · ${data}</p>
                <p class="text-gray-200 leading-relaxed">${escaparHTML(mensagem.message)}</p>
            </div>

            <div class="flex flex-col gap-2 flex-shrink-0">
                ${naoLida ? `
                    <button
                        onclick="marcarComoLida(${mensagem.id})"
                        class="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                        ✅ Marcar como lida
                    </button>
                ` : ''}
                <button
                    onclick="deletarMensagem(${mensagem.id})"
                    class="bg-red-900/40 hover:bg-red-700 text-red-400 hover:text-white text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                    🗑️ Deletar
                </button>
            </div>
        </div>
    `;

    return div;
}

// Ações Admin
async function marcarComoLida(id) {
    try {
        const response = await fetch(`${API_URL}/messages/${id}`, {
            method: 'PATCH',
            headers: authHeaders()
        });

        if (response.status === 401) {
            sessionStorage.removeItem('admin_token');
            mostrarLogin();
            return;
        }

        if (!response.ok) throw new Error('Erro ao atualizar');
        await carregarMensagens();
    } catch (err) {
        alert('Erro ao marcar mensagem como lida.');
    }
}

async function deletarMensagem(id) {
    const confirmar = confirm('Tem certeza que deseja deletar esta mensagem?');
    if (!confirmar) return;

    try {
        const response = await fetch(`${API_URL}/messages/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (response.status === 401) {
            sessionStorage.removeItem('admin_token');
            mostrarLogin();
            return;
        }

        if (!response.ok) throw new Error('Erro ao deletar');
        await carregarMensagens();
    } catch (err) {
        alert('Erro ao deletar mensagem.');
    }
}

// Utilitários
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(texto));
    return div.innerHTML;
}

// Expor funções para os onclick inline do HTML
window.carregarMensagens = carregarMensagens;
window.marcarComoLida = marcarComoLida;
window.deletarMensagem = deletarMensagem;
window.fazerLogout = fazerLogout;

// Inicialização
// Se já tem token salvo na sessão, vai direto pro admin
if (getToken()) {
    mostrarAdmin();
} else {
    mostrarLogin();
}