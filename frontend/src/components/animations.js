// Animações do portfólio (layout "Logo L4 Órbita" do Figma).
const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const temHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const raiz = document.documentElement;

// ---------- Hero ----------
// .hero-in entra ao carregar; .hero-after espera o typewriter terminar.
requestAnimationFrame(() => raiz.classList.add('hero-ready'));
const liberarHero = () => raiz.classList.add('hero-typed');
document.addEventListener('typewriter:done', liberarHero, { once: true });
setTimeout(liberarHero, reduzMovimento ? 0 : 3200);

// Redes sociais em volta da foto. Para testar outra posição: ?redes=arco | orbita | base
const redes = document.querySelector('[data-hero-social]');
const layoutRedes = new URLSearchParams(location.search).get('redes');
if (redes && ['arco', 'orbita', 'base'].includes(layoutRedes)) redes.dataset.layout = layoutRedes;

// ---------- Revelação ao rolar ----------
const alvos = document.querySelectorAll('[data-reveal], [data-reveal-group], [data-reveal-lines]');

// Atrasos em cascata para itens lado a lado.
document.querySelectorAll('.skills-grid, .xp-list').forEach((lista) => {
    Array.from(lista.children).forEach((filho, i) => filho.style.setProperty('--d', `${i * 0.1}s`));
});
document.querySelectorAll('[data-reveal-group]').forEach((grupo) => {
    Array.from(grupo.children).forEach((filho, i) => filho.style.setProperty('--d', `${0.15 + i * 0.08}s`));
});

if (reduzMovimento || !('IntersectionObserver' in window)) {
    alvos.forEach((el) => el.classList.add('is-visible'));
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
    alvos.forEach((el) => observador.observe(el));
}

// ---------- Link ativo no menu ----------
const linksMenu = document.querySelectorAll('.nav-link[href^="#"]');
const secoes = Array.from(linksMenu)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
if ('IntersectionObserver' in window && secoes.length) {
    const espiao = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                const id = `#${entrada.target.id}`;
                linksMenu.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === id));
            });
        },
        { rootMargin: '-45% 0px -50% 0px' }
    );
    secoes.forEach((secao) => espiao.observe(secao));
}

// ---------- Carrossel de projetos ----------
const carrossel = document.querySelector('[data-carousel]');
if (carrossel) {
    const slides = Array.from(carrossel.querySelectorAll('.project'));
    const anterior = document.querySelector('[data-carousel-prev]');
    const proximo = document.querySelector('[data-carousel-next]');
    const pontos = document.querySelector('[data-carousel-dots]');
    const total = slides.length;
    const doisDigitos = (n) => String(n).padStart(2, '0');
    let atual = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));

    slides.forEach((slide, i) => {
        const indice = slide.querySelector('[data-carousel-index]');
        if (indice) indice.textContent = `${doisDigitos(i + 1)} / ${doisDigitos(total)}`;
        const titulo = slide.querySelector('.project__title')?.textContent.trim() || `Projeto ${i + 1}`;
        const ponto = document.createElement('button');
        ponto.type = 'button';
        ponto.setAttribute('aria-label', `Ver projeto ${titulo}`);
        ponto.addEventListener('click', () => irPara(i));
        pontos?.appendChild(ponto);
    });

    function irPara(i) {
        if (i === atual || i < 0 || i >= total) return;
        const indo = i > atual ? 'left' : 'right';
        const saindo = slides[atual];
        saindo.classList.remove('is-active');
        if (indo === 'left') saindo.classList.add('is-leaving-left');
        setTimeout(() => saindo.classList.remove('is-leaving-left'), 800);
        slides[i].classList.add('is-active');
        atual = i;
        atualizar();
    }

    function atualizar() {
        slides.forEach((s, i) => s.setAttribute('aria-hidden', String(i !== atual)));
        pontos?.querySelectorAll('button').forEach((p, i) => p.setAttribute('aria-current', String(i === atual)));
        if (anterior) anterior.disabled = atual === 0;
        if (proximo) proximo.disabled = atual === total - 1;
    }

    anterior?.addEventListener('click', () => irPara(atual - 1));
    proximo?.addEventListener('click', () => irPara(atual + 1));
    atualizar();
}

// ---------- Mockup do projeto inclina com o mouse ----------
if (temHover && !reduzMovimento) {
    document.querySelectorAll('.project__stage').forEach((palco) => {
        const mock = palco.querySelector('.mock');
        if (!mock) return;
        palco.addEventListener('pointermove', (e) => {
            const r = palco.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            mock.style.setProperty('--ry', `${x * 8}deg`);
            mock.style.setProperty('--rx', `${y * -6}deg`);
        });
        palco.addEventListener('pointerleave', () => {
            mock.style.setProperty('--ry', '0deg');
            mock.style.setProperty('--rx', '0deg');
        });
    });

    // ---------- Botão "Contato" magnético ----------
    document.querySelectorAll('[data-magnetic]').forEach((botao) => {
        const miolo = botao.firstElementChild;
        botao.addEventListener('pointermove', (e) => {
            const r = botao.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2);
            const y = e.clientY - (r.top + r.height / 2);
            botao.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
            if (miolo) miolo.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });
        botao.addEventListener('pointerleave', () => {
            botao.style.transform = '';
            if (miolo) miolo.style.transform = '';
        });
    });
}

// ---------- Barra de progresso de leitura ----------
const barra = document.createElement('div');
barra.className = 'scroll-progress';
barra.setAttribute('aria-hidden', 'true');
document.body.appendChild(barra);

let agendado = false;
function atualizarProgresso() {
    const max = raiz.scrollHeight - raiz.clientHeight;
    barra.style.transform = `scaleX(${max > 0 ? raiz.scrollTop / max : 0})`;
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
