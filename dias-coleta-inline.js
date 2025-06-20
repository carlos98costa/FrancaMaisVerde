document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    mobileMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenu.classList.toggle('active'); // Optional: add active class to button for styling
    });

    // Code specific to dias-coleta.html
    if (document.getElementById('neighborhood-input')) {
        // ... (resto do script de busca de bairros e dias de coleta)
    }
}); 