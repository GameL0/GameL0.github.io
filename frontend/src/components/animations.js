// Animações do portfólio: entrada do hero, revelação ao rolar e barra de progresso.
const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const raiz = document.documentElement;

// ---------- Hero ----------
// Os itens .hero-in entram assim que a página carrega.
// Os itens .hero-after (texto, botão, "Role para descobrir") esperam o typewriter terminar.
requestAnimationFrame(() => raiz.classList.add('hero-ready'));

function liberarHero() {
    raiz.classList.add('hero-typed');
}
document.addEventListener('typewriter:done', liberarHero, { once: true });
// Garantia: se o typewriter não rodar, libera mesmo assim.
setTimeout(liberarHero, reduzMovimento ? 0 : 3000);

// ---------- Revelação ao rolar ----------
const itens = document.querySelectorAll('[data-reveal]');
const grupos = document.querySelectorAll('[data-reveal-group]');

// Cartões lado a lado entram em cascata.
document.querySelectorAll('.skill-card').forEach((card, i) => {
    card.style.setProperty('--d', `${(i % 4) * 0.09}s`);
});
grupos.forEach((grupo) => {
    Array.from(grupo.children).forEach((filho, i) => {
        filho.style.setProperty('--d', `${i * 0.06}s`);
    });
});

if (reduzMovimento || !('IntersectionObserver' in window)) {
    itens.forEach((el) => el.classList.add('is-visible'));
    grupos.forEach((el) => el.classList.add('is-visible'));
} else {
    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                entrada.target.classList.add('is-visible');
                observador.unobserve(entrada.target);
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    itens.forEach((el) => observador.observe(el));
    grupos.forEach((el) => observador.observe(el));
}

// ---------- Barra de progresso de leitura ----------
const barra = document.createElement('div');
barra.className = 'scroll-progress';
barra.setAttribute('aria-hidden', 'true');
document.body.appendChild(barra);

let agendado = false;
function atualizarProgresso() {
    const max = raiz.scrollHeight - raiz.clientHeight;
    const progresso = max > 0 ? raiz.scrollTop / max : 0;
    barra.style.transform = `scaleX(${progresso})`;
    agendado = false;
}
window.addEventListener(
    'scroll',
    () => {
        if (!agendado) {
            agendado = true;
            requestAnimationFrame(atualizarProgresso);
        }
    },
    { passive: true }
);
atualizarProgresso();
