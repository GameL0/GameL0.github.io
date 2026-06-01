document.addEventListener('DOMContentLoaded', function() {
    
    const btnMenu = document.getElementById('btn-menu');
    const menuLinks = document.getElementById('menu-links');
    const linksInternos = menuLinks.querySelectorAll('a'); 

    if (btnMenu && menuLinks) {
        btnMenu.addEventListener('click', function() {
            menuLinks.classList.toggle('hidden');
            menuLinks.classList.toggle('flex');
        });

        linksInternos.forEach(function(link) {
            link.addEventListener('click', function() {
                menuLinks.classList.add('hidden');
                menuLinks.classList.remove('flex');
            });
        });
    }
});