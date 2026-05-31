document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DO MENU MOBILE ---
    const btnMenu = document.getElementById('btn-menu');
    const menuLinks = document.getElementById('menu-links');
    // Pega todos os links <a> que estão dentro do menu
    const linksInternos = menuLinks.querySelectorAll('a'); 

    if (btnMenu && menuLinks) {
        // 1. Abre/Fecha o menu ao clicar no botão hambúrguer
        btnMenu.addEventListener('click', function() {
            menuLinks.classList.toggle('hidden');
            menuLinks.classList.toggle('flex');
        });

        // 2. Fecha o menu automaticamente quando o usuário clica em qualquer link
        linksInternos.forEach(function(link) {
            link.addEventListener('click', function() {
                menuLinks.classList.add('hidden');
                menuLinks.classList.remove('flex');
            });
        });
    }
});