document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    mobileMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenu.classList.toggle('active'); // Optional: add active class to button for styling
    });
    
    const neighborhoodInput = document.getElementById('neighborhood-input');
    const searchButton = document.getElementById('search-button');
    const resultArea = document.getElementById('result-area');
    const suggestionsList = document.getElementById('suggestions-list');
    let currentFocus = -1;

    // Função para filtrar sugestões
}); 