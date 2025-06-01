document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            mobileMenuButton.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.nav-menu') && !event.target.closest('.mobile-menu-button')) {
                navMenu.classList.remove('active');
                mobileMenuButton.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when window is resized to desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileMenuButton.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Data for ecopoints
    const ecopontos = [
        {
            id: 1,
            name: 'Ecoponto City Petrópolis',
            lat: -20.4998,
            lng: -47.4107,
            address: 'Avenida São Pedro, 1200 - City Petrópolis',
            hours: 'Seg a Sáb: 7h às 19h, Dom: 8h às 14h',
            description: 'Localizado na região norte, o Ecoponto City Petrópolis é um ponto crucial para o descarte adequado de resíduos volumosos e da construção civil. Essencial para manter a limpeza e organização do bairro.',
            materialsAccepted: [
                'Entulho de Construção Civil (pequenas quantidades até 1m³)',
                'Madeira, galhos e poda de árvores',
                'Móveis e Eletrodomésticos (sofás, armários, geladeiras)',
                'Pneus (limite de 4 por CPF)',
                'Óleo de Cozinha Usado (em garrafas PET)',
                'Lixo Eletrônico (computadores, TVs, celulares, etc.)',
                'Pilhas e Baterias',
                'Recicláveis (Plástico, Papel, Metal, Vidro)'
            ]
        },
        {
            id: 2,
            name: 'Ecoponto Jardim Portinari',
            lat: -20.5186,
            lng: -47.4042,
            address: 'Avenida Hotto Paiva, 1341 - Jardim Portinari',
            hours: 'Seg a Sáb: 7h às 19h, Dom: 8h às 14h',
            description: 'Atendendo a zona leste de Franca, o Ecoponto Portinari desempenha um papel vital no manejo de resíduos que não podem ser descartados na coleta comum, promovendo a sustentabilidade local.',
            materialsAccepted: [
                'Entulho de Construção Civil (pequenas quantidades)',
                'Restos de madeira e poda de jardim',
                'Colchões e estofados',
                'Vidro e plásticos em geral',
                'Metais ferrosos e não-ferrosos',
                'Óleo de cozinha',
                'Pilhas, baterias e lâmpadas fluorescentes',
                'Equipamentos eletrônicos em desuso'
            ]
        },
        {
            id: 3,
            name: 'Ecoponto Parque das Esmeraldas',
            lat: -20.5750,
            lng: -47.4040,
            address: 'Rua Geraldino Augusto Machado, 411 - Parque das Esmeraldas',
            hours: 'Seg a Sáb: 7h às 19h, Dom: 8h às 14h',
            description: 'Localizado na parte sul da cidade, o Ecoponto Esmeraldas é essencial para a gestão de resíduos volumosos e especiais, contribuindo para a limpeza e o bem-estar da comunidade.',
            materialsAccepted: [
                'Móveis, colchões e objetos grandes',
                'Pneus (sem limite de quantidade por CPF, mas com pré-agendamento para grandes volumes)',
                'Lixo eletrônico (diversos tipos de aparelhos)',
                'Óleo de cozinha usado (garrafas plásticas)',
                'Vidro, papel, plástico e metal (para reciclagem)',
                'Madeira e entulho de pequenas reformas',
                'Pilhas, baterias de celular e lâmpadas'
            ]
        },
        {
            id: 4,
            name: 'Ecoponto Jardim Luiza (Jardim Luiza 2)',
            lat: -20.5693,
            lng: -47.3687,
            address: 'Avenida Ida Zero Zaninelo, 2501 - Jardim Luiza',
            hours: 'Seg a Sáb: 7h às 19h, Dom: 8h às 14h',
            description: 'Situado na região sudeste, o Ecoponto Jardim Luiza é um ponto estratégico para o descarte ambientalmente correto de resíduos diversos, apoiando a coleta seletiva e o descarte de materiais específicos.',
            materialsAccepted: [
                'Resíduos de construção civil (até 1m³)',
                'Resíduos verdes (poda, capina)',
                'Eletrodomésticos e eletrônicos',
                'Pneus e outros objetos volumosos',
                'Óleo de fritura usado',
                'Pilhas, baterias e lâmpadas',
                'Recicláveis (papel, plástico, metal, vidro)'
            ]
        }
    ];

    // Initialize map
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.classList.add('loading');
        const map = L.map('map', {
            zoomControl: true,
            scrollWheelZoom: false // Disable scroll wheel zoom for better UX
        }).setView([-20.5407, -47.4005], 12);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map).on('load', () => {
            mapContainer.classList.remove('loading');
        });

        // Custom icon for markers
        const customIcon = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [12, 41]
        });

        // Map controls
        const showLocationsButton = document.getElementById('showLocations');
        const resetMapButton = document.getElementById('resetMap');
        let markersLayer = L.layerGroup().addTo(map);

        function showEcopoints() {
            try {
                markersLayer.clearLayers();
                ecopontos.forEach(ecoponto => {
                    const marker = L.marker([ecoponto.lat, ecoponto.lng], { 
                        icon: customIcon,
                        keyboard: true // Enable keyboard navigation
                    }).addTo(markersLayer);
                    marker.bindPopup(
                        `<b>${ecoponto.name}</b><br>` +
                        `${ecoponto.address}<br>` +
                        `Horário: ${ecoponto.hours}<br>` +
                        `<button class="more-details-button" onclick="window.showEcopointDetails(${ecoponto.id})" aria-label="Ver mais detalhes sobre ${ecoponto.name}">Mais Detalhes</button>`,
                        { closeButton: true }
                    );
                });

                if (ecopontos.length > 0) {
                    const latLngs = ecopontos.map(eco => [eco.lat, eco.lng]);
                    map.fitBounds(latLngs, { padding: [50, 50] });
                }

                showLocationsButton.disabled = true;
                showLocationsButton.textContent = 'Ecopontos no Mapa!';
                showLocationsButton.style.cursor = 'default';
                showLocationsButton.style.backgroundColor = '#6c757d';
                showLocationsButton.style.transform = 'none';
                showLocationsButton.style.boxShadow = 'none';
                resetMapButton.style.display = 'block';
            } catch (error) {
                console.error('Erro ao mostrar ecopontos:', error);
                alert('Ocorreu um erro ao carregar os ecopontos. Tente novamente.');
            }
        }

        function resetMap() {
            markersLayer.clearLayers();
            map.setView([-20.5407, -47.4005], 12);
            showLocationsButton.disabled = false;
            showLocationsButton.textContent = 'Mostrar Ecopontos no Mapa';
            showLocationsButton.style.cursor = 'pointer';
            showLocationsButton.style.backgroundColor = 'var(--secondary-color)';
            showLocationsButton.style.transform = '';
            showLocationsButton.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.2)';
            resetMapButton.style.display = 'none';
        }

        if (showLocationsButton && resetMapButton) {
            showLocationsButton.addEventListener('click', showEcopoints);
            resetMapButton.addEventListener('click', resetMap);
        }
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTopBtn');
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.scrollY > 400) {
                backToTopBtn.style.display = 'block';
                setTimeout(() => backToTopBtn.style.opacity = '1', 50);
            } else {
                backToTopBtn.style.opacity = '0';
                setTimeout(() => backToTopBtn.style.display = 'none', 300);
            }
        }, 100);
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Modal functionality
    const ecopointModal = document.getElementById('ecopointModal');
    const closeButton = document.querySelector('.close-button');

    if (closeButton && ecopointModal) {
        function openModal() {
            ecopointModal.style.display = 'flex';
            setTimeout(() => ecopointModal.classList.add('show'), 10);
            document.body.style.overflow = 'hidden';
            ecopointModal.focus();
        }

        function closeModal() {
            ecopointModal.classList.remove('show');
            setTimeout(() => {
                ecopointModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }

        closeButton.addEventListener('click', closeModal);
        window.addEventListener('click', (event) => {
            if (event.target === ecopointModal) {
                closeModal();
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && ecopointModal.classList.contains('show')) {
                closeModal();
            }
        });

        window.showEcopointDetails = (id) => {
            const selectedEcopoint = ecopontos.find(eco => eco.id === id);
            if (selectedEcopoint) {
                document.getElementById('modalEcopointName').textContent = selectedEcopoint.name;
                document.getElementById('modalEcopointAddress').textContent = selectedEcopoint.address;
                document.getElementById('modalEcopointHours').textContent = selectedEcopoint.hours;
                document.getElementById('modalEcopointDescription').textContent = selectedEcopoint.description;

                const materialsList = document.getElementById('modalEcopointMaterials');
                materialsList.innerHTML = '';
                selectedEcopoint.materialsAccepted.forEach(material => {
                    const li = document.createElement('li');
                    li.textContent = material;
                    materialsList.appendChild(li);
                });

                openModal();
            } else {
                console.error('Ecoponto não encontrado:', id);
                alert('Ecoponto não encontrado. Tente novamente.');
            }
        };
    }

    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentSlide = 0;
    const slideCount = slides.length;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        const offset = -currentSlide * 100;
        carousel.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        goToSlide(currentSlide);
    }

    // Auto-advance slides every 5 seconds (5000ms)
    let slideInterval = setInterval(nextSlide, 5000);

    // Não pausar autoplay ao clicar nos botões
    nextButton.addEventListener('click', () => {
        nextSlide();
    });
    prevButton.addEventListener('click', () => {
        prevSlide();
    });

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide();
        }
    }

    // Initialize first slide
    goToSlide(0);

    // Active navigation link highlighting
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.endsWith(linkPath)) {
            link.classList.add('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    const locateMeButton = document.getElementById('locateMe');
    if (locateMeButton) {
        locateMeButton.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('Geolocalização não suportada pelo seu navegador.');
                return;
            }
            locateMeButton.disabled = true;
            locateMeButton.textContent = 'Localizando...';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 15);
                    L.marker([latitude, longitude], { icon: customIcon }).addTo(map)
                        .bindPopup('Você está aqui!').openPopup();
                    locateMeButton.disabled = false;
                    locateMeButton.textContent = 'Localizar-me';
                },
                (error) => {
                    alert('Não foi possível obter sua localização.');
                    locateMeButton.disabled = false;
                    locateMeButton.textContent = 'Localizar-me';
                }
            );
        });
    }
});