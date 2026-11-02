// Modal de Experiência: clicar num card abre uma mini tela com mais detalhes e uma foto.
// O conteúdo de cada experiência fica num <template id="xp-NOME"> no index.html.
const modal = document.getElementById('xp-modal');
const corpo = modal?.querySelector('[data-xp-body]');
const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let gatilho = null;

function abrir(chave, origem) {
    const tpl = document.getElementById(`xp-${chave}`);
    if (!modal || !tpl) return;
    gatilho = origem;
    corpo.replaceChildren(tpl.content.cloneNode(true));
    modal.classList.remove('is-closing');
    modal.showModal();
    document.documentElement.classList.add('modal-open');
    modal.querySelector('[data-xp-close]').focus();
}

function fechar() {
    if (!modal?.open || modal.classList.contains('is-closing')) return;
    const concluir = () => {
        modal.classList.remove('is-closing');
        modal.close();
    };
    if (reduzMovimento) return concluir();
    modal.classList.add('is-closing');
    modal.addEventListener('animationend', concluir, { once: true });
    setTimeout(() => modal.open && concluir(), 400);
}

if (modal) {
    document.querySelectorAll('[data-xp-open]').forEach((botao) => {
        botao.addEventListener('click', () => abrir(botao.dataset.xpOpen, botao));
    });

    modal.querySelector('[data-xp-close]').addEventListener('click', fechar);

    // Clique fora do painel (no fundo escurecido) fecha.
    modal.addEventListener('click', (e) => {
        if (e.target === modal) fechar();
    });

    // Esc: usa a mesma animação de saída.
    modal.addEventListener('cancel', (e) => {
        e.preventDefault();
        fechar();
    });

    modal.addEventListener('close', () => {
        document.documentElement.classList.remove('modal-open');
        gatilho?.focus({ preventScroll: true });
    });
}
