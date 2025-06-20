document.addEventListener('DOMContentLoaded', () => {
    // Funcionalidades do menu mobile
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            mobileMenuButton.classList.toggle('active');
        });

        // Fecha o menu ao clicar fora dele
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.nav-menu') && !event.target.closest('.mobile-menu-button')) {
                navMenu.classList.remove('active');
                mobileMenuButton.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });

        // Fecha o menu quando a janela é redimensionada para o tamanho desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileMenuButton.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // dados dos ecopontos
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

    // inicialização do mapa
    const mapContainer = document.getElementById('map');
    let map; // Variável do mapa
    if (mapContainer) {
        mapContainer.classList.add('loading');
        map = L.map('map', {
            zoomControl: true,
            scrollWheelZoom: false // Desabilitar zoom com a roda do mouse para melhor UX
        }).setView([-20.5407, -47.4005], 12);

        // Adicionar camada de tile do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map).on('load', () => {
            mapContainer.classList.remove('loading');
        });

        // Ícone personalizado para marcadores
        const customIcon = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            shadowSize: [41, 41],
            shadowAnchor: [12, 41]
        });

        // Controles do mapa
        const showLocationsButton = document.getElementById('showLocations');
        const resetMapButton = document.getElementById('resetMap');
        let markersLayer = L.layerGroup().addTo(map);

        function showEcopoints() {
            try {
                markersLayer.clearLayers();
                ecopontos.forEach(ecoponto => {
                    const marker = L.marker([ecoponto.lat, ecoponto.lng], { 
                        icon: customIcon,
                        keyboard: true // Habilitar navegação por teclado
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

    // Botão "Voltar ao Topo"
    const backToTopBtn = document.getElementById('backToTopBtn');
    let scrollTimeout;

    if (backToTopBtn) {
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
    }

    // Funcionalidade do modal
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

    // Funcionalidade do carrossel
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = document.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        
        let currentSlide = 0;
        const slideCount = slides.length;

        // Inicializa o carrossel
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

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

        // Auto-avançar slides a cada 5 segundos (5000ms)
        let slideInterval = setInterval(nextSlide, 5000);

        // Não pausar autoplay ao clicar nos botões
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
            });
        }
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
            });
        }

        // Suporte a toque para dispositivos móveis
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (carousel) {
            carousel.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            carousel.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
            }
        }

        // Inicializa o primeiro slide
        goToSlide(0);
    }

    // Destaque do link de navegação ativo
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.endsWith(linkPath)) {
            link.classList.add('active');
        }
    });

    // Smooth scroll para links âncora
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

    // === INÍCIO DA CORREÇÃO PARA IMAGEM INVISÍVEL ===
    // Adicionar animação de carregamento para imagens
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Função para tornar a imagem visível
        const showImage = () => {
            img.style.opacity = '1';
        };

        // Define o estilo inicial
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        // Verifica se a imagem já foi carregada (do cache)
        if (img.complete) {
            showImage();
        } else {
            // Se não, adiciona o event listener para quando ela carregar
            img.addEventListener('load', showImage);
            // Adiciona um event listener de erro para o caso da imagem não ser encontrada
            img.addEventListener('error', () => {
                console.error(`Erro ao carregar a imagem: ${img.src}`);
                img.style.opacity = '1'; // Torna o ícone de imagem quebrada visível
            });
        }
    });


    // Bairros de Franca
    const collectionData = [
        { neighborhood: "BELVEDERE BANDEIRANTE", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "CABCEIRA DAS CANDEIAS", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "CENTRO (VOLUNTARIOS DA FRANCA SENTIDO CHAMPAGNAT)", day: "TER/ QUI/ SAB - NOITE" },
        { neighborhood: "CENTRO (VOLUNTARIOS DA FRANCA SENTIDO MAJOR NICÁCIO)", day: "SEG/ QUA/ SEX - NOITE" },
        { neighborhood: "CHÁCARA ESPRAIADO", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "CHÁCARA RES. ANA DOROTHÉIA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "CHÁCARA SANTO ANTONIO", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "CHÁCARA VALE BELO", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "CHÁCARAS SÃO PAULO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "CIDADE NOVA", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "CITY PETRÓPOLIS", day: "SÁBADO - DIA" },
        { neighborhood: "COND. IVAN POLO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "COND. RES. ROYAL PARK", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "COND. RES. SPAZIO VITTA BLUB", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "COND. VILLAGIO DA COLINA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "CONJ. HAB.  OCTAVIO CILURZO", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "CONJ. HAB. COSTA E SILVA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "CONJ. HAB. CURTUMEIROS", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "CONJ. HAB. ESTANLSAU JOSÉ CARETA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "CONJ. VEREADOR ANT. MARCOS KALUF", day: "SÁBADO - DIA" },
        { neighborhood: "CONS. RES. BERNARINO PUCCI", day: "SÁBADO - NOITE" },
        { neighborhood: "DES. JD. DAS CANDEIAS", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "DES. JD. DAS CANDEIAS II", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "DES. ROBERTO MARCANTONIO", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "DIST. IND. ANTONIO DELLA TORRE", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "DIST. IND. ONOFRE JACOMETTI", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "ESP. PRIMO MENEGHETTI", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "ESP. PRIMO MENEGHETTI II", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "ESTAÇÃO", day: "SEG/ QUA/ SEX - NOITE" },
        { neighborhood: "FRANCA POLO CLUBE", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "JD NOÊMIA (CHAFIC FACURY SENTIDO PESQUE PAGUE)", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "JD.  PALESTINA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD.  PAULISTA", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "JD. ADELINHA", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "JD. AEROPORTO I", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "JD. AEROPORTO II", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "JD. AEROPORTO III", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "JD. AEROPORTO IV", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "JD. ALVORADA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "JD. ANGELA ROSA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. ANITA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. AVIAÇÃO", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "JD. BARÃO", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. BETHÂNIA", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "JD. BOA ESPERANÇA", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "JD. BONSUCESSO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. BRASIL", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. BRASILÂNDIA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. BUENO", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "JD. CALIFÓRNIA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. CAMBUÍ", day: "SÁBADO - DIA" },
        { neighborhood: "JD. CASTELO SOBERANO", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "JD. CÉLIO CERQUEIRA", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "JD. CENTENÁRIO", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. CONCEIÇÃO LEITE", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. CONSOLAÇÃO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. COPACABANA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. DERMÍNIO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. DO ÉDEN", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. DO LÍBANO", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. DR. ANTONIO PETRAGLIA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. ELDORADO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. ELISA", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "JD. ESPRAIADO", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "JD. FLORIDA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "JD. FREITAS DINIZ", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. GUANABARA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. INDEPENDÊNCIA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. INTEGRAÇÃO", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. IPANEMA", day: "SÁBADO - DIA" },
        { neighborhood: "JD. JACINTHO NERY", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. JOÃO LIPORONI", day: "QUINTA-FEIRA - NOITE" },
        { neighborhood: "JD. LIMA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. LUIZA I", day: "SÁBADO - DIA" },
        { neighborhood: "JD. LUIZA II", day: "SÁBADO - DIA" },
        { neighborhood: "JD. MARAMBAIA", day: "SÁBADO - DIA" },
        { neighborhood: "JD. MARIA GABRIELA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. MARIA ROSA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. MARILIA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. MARTINS", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. MILENA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. MIRON", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. MONTE CARLO", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. NOÊMIA (CHAFIC FACURY SENTIDO JAIME TELINI)", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. PAINEIRAS", day: "SÁBADO - DIA" },
        { neighborhood: "JD. PALMA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. PALMEIRAS", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. PANORAMA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. PARATY", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. PAULISTANO", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. PAULO ARCHETTI", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. PETRAGLIA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. PINHEIROS I", day: "SÁBADO - DIA" },
        { neighborhood: "JD. PIRATININGA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. PIRATININGA II", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "JD. PLANALTO", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. PORTINARI", day: "SÁBADO - DIA" },
        { neighborhood: "JD. PULICANO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. REDENTOR", day: "SÁBADO - NOITE" },
        { neighborhood: "JD. REGINA HELENA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. RIVIEIRA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. ROSELÂNDIA I", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. ROSELÂNDIA II", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. SAMELLO IV", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "JD. SAMELLO V", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. SAMELLO WOODS", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "JD. SANTA BÁRBARA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "JD. SANTA EFIGÊNIA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. SANTA EUGÊNIA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "JD. SANTA LÚCIA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "JD. SANTANA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. SANTO AGOSTINHO", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "JD. SÃO FRANCISCO", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. SÃO GABRIEL", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. SÃO LUIZ I", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. SÃO LUIZ II", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. SÃO PAULO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. SÃO VICENTE", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. SEMINÁRIO", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "JD. SIMÕES", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "JD. TANGARÁ", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. TRÊS COLINAS", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "JD. TROPICAL I", day: "QUINTA-FEIRA - NOITE" },
        { neighborhood: "JD. TROPICAL II", day: "QUINTA-FEIRA - NOITE" },
        { neighborhood: "JD. VENEZA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "JD. VERA CRUZ I", day: "SÁBADO - DIA" },
        { neighborhood: "JD. VERA CRUZ II", day: "SÁBADO - DIA" },
        { neighborhood: "JD. VERA CRUZ III", day: "SÁBADO - DIA" },
        { neighborhood: "JD. ZELINDA", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "JESUS MARIA JOSÉ", day: "TER/ QUI/ SAB - NOITE" },
        { neighborhood: "LEPORACE V", day: "SÁBADO - DIA" },
        { neighborhood: "MIRAMONTES", day: "SÁBADO - DIA" },
        { neighborhood: "MORADA DO SOL", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "MORADA DO VERDE", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "NOVO CENTRO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "NÚCLEO AGRICOLA  ALPHA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "POLO IND.  ABILLO NOGUEIRA", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "POLO IND. AMAZONAS", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "POLO IND. SÃO BERNARDO", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "PQ. ALVORADA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PQ. BOA VISTA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PQ. CASTELO", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "PQ. CONTINENTAL", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PQ. DAS ACÁCIAS", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "PQ. DAS ÁRVORES", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "PQ. DAS ESMERALDAS", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "PQ. DO HORTO MIGUEL SABIO DE MELLO FILHO", day: "SÁBADO - NOITE" },
        { neighborhood: "PQ. DOM PEDRO I", day: "SÁBADO - NOITE" },
        { neighborhood: "PQ. DOS LIMA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PQ. DOS MUTIRANTES", day: "SÁBADO - NOITE" },
        { neighborhood: "PQ. DOS PINHAIS", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PQ. DOS YPÊS", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "PQ. DR. CARRÃO", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PQ. FLORESTAL", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "PQ. FRANCAL", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PQ. FRANVILLE", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "PQ. FREMONT", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "PQ. JARDIM PROGRESSO (LOCALIZA SENTIDO MACRO)", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PQ. JOÃO LEITE", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PQ. MOEMA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PQ. MUNDO NOVO", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "PQ. PRIMAVERA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "PQ. PROGRESSO (LOCALIZA SENTIDO TRAVESSIA)", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "PQ. RES. SANTA MARIA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PQ. SANTA ADÉLIA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PQ. SANTA HILDA", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "PQ. SÃO JORGE", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PQ. TRÊS COLINAS", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "PQ. UNIVERSITÁRIO", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "PQ. VICENTE LEPORACE I (AV. ABRAÃO BRICKMAN SENTIDO TROPICAL)", day: "QUINTA-FEIRA - NOITE" },
        { neighborhood: "PQ. VICENTE LEPORACE I (AV. ABRAÃO BRICKMAN SENTIDO VERA CRUZ)", day: "SÁBADO - DIA" },
        { neighborhood: "PQ. VICENTE LEPORACE II", day: "SÁBADO - DIA" },
        { neighborhood: "PQ. VICENTE LEPORACE III (AV. ABRAÃO BRICKMAN SENTMANHãOIDO TROPICAL)", day: "QUINTA-FEIRA - NOITE" },
        { neighborhood: "PQ. VILA IZABEL", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "PQ. VITÓRIA RÉGIA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PROL VILA SANTA TEREZINHA", day: "SÁBADO - NOITE" },
        { neighborhood: "PROL. AEROPORTO I", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "PROL. JD. AEROPORTO II", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "PROL. JD. ANGELA ROSA I", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "PROL. JD. ANGELA ROSA II", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "PROL. JD. BRASILÂNDIA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "PROL. JD. CONSOLAÇÃO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PROL. JD. DO ÉDEN", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "PROL. JD. DR. ANTONIO PETRAGLIA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PROL. JD. FLORIDA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "PROL. JD. FRANCANO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PROL. JD. FRANCANO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PROL. JD. LINA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PROL. JD. MARTINS", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "PROL. JD. SANTA BÁRBARA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "PROL. PAULISTA", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "PROL. PQ. DAS ESMERALDAS", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "PROL. PQ. VILA IZABEL", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "PROL. RES. ANA DOROTHÉIA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "PROL. RES. ELIMAR", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "PROL. SÃO JOSE", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "PROL. SÃO JOSÉ", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "PROL. VILA APARECIDA", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "PROL. VILA CHICO JÚLIO", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PROL. VILA DUQUE DE CAXIAS", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "PROL. VILA HÍPICA", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "PROL. VILA IMPERADOR", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PROL. VILA INDUSTRIAL", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "PROL. VILA SAMELLO", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "PROL. VILA SANTA CRUZ", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "PROL. VILA SANTA CRUZ", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "PROL. VILA SANTA TEREZA", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "PROL. VILA SANTOS DUMONT", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "PROL. VILA SCARABUCI", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "RECANTO CAMPESTRE OURO VERDE", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "RECANTO DO ITABÉM", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "RECANTO ELIMAR", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "RECANTO ELIMAR II", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "RECANTO FORTUNA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "RECANTO HELIODORO", day: "SÁBADO - DIA" },
        { neighborhood: "RECREIO CAMPO BELO", day: "SÁBADO - NOITE" },
        { neighborhood: "RES. ADRIANO FERREIRA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "RES. ALTO DA VILA APARECIDA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "RES. AMAZONAS", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "RES. ANA DOROTHÉIA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "RES. ANA TERRA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "RES. BALDASSARI", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "RES. CHICO NECA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "RES. COLINA DO ESPRAIADO", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "RES. DOM BOSCO", day: "SÁBADO - DIA" },
        { neighborhood: "RES. DORA MARIA", day: "SÁBADO - DIA" },
        { neighborhood: "RES. DOURADO", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "RES. ENGENHO QUEIMADO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "RES. FERRACINI", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "RES. FLAMBOYANT", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "RES. GRAMADOS I", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "RES. GRAMADOS II", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "RES. ITAPUÃ", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "RES. JD. CANADÁ", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "RES. JOSÉ DE CARLOS", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "RES. JOVITA DE MELO", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "RES. MEIRELLES", day: "QUINTA-FEIRA - NOITE" },
        { neighborhood: "RES. MESTRE TOM JOBIM", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "RES. MOREIRA JUNIOR", day: "SÁBADO - DIA" },
        { neighborhood: "RES. NOSSO LAR", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "RES. NOVA FRANCA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "RES. OLAVO PINHEIRO", day: "SÁBADO - DIA" },
        { neighborhood: "RES. PALERMO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "RES. PALERMO CITY", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "RES. PARAÍSO I", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "RES. PERES ELIAS", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "RES. PÉROLA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "RES. PORTO DOS SONHOS", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "RES. PQ. DOS PÁSSAROS", day: "SÁBADO - DIA" },
        { neighborhood: "RES. RODRIGO SALLOUM", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "RES. RUBI", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "RES. SAN DIEGO", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "RES. SANTA EMÍLIA", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "RES. SÃO DOMINGOS", day: "SÁBADO - DIA" },
        { neighborhood: "RES. SÃO JERÔNIMO", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "RES. SÃO TOMAZ", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "RES. SÃO VICENTE", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "RES. VEREDAS DI FRANCA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "RES. VILA LOBOS", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "RES. VILA TOTOLI", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "RES. ZANETTI", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "RESIDENCIAL OLIVITO", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "SAMEL PARK", day: "SÁBADO - NOITE" },
        { neighborhood: "SÃO JOAQUIM", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "SÃO JOSÉ (R. JOSÉ RODRIGUES SENTIDO AV. SETE DE SETEMBRO)", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "SÃO JOSÉ (R. JOSÉ RODRIGUES SENTIDO LANCHÃO)", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "VALE DA LUA AZUL", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "VILA  REAL", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "VILA BENELLI", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "VILA CARRENHO", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "VILA CEL. ANTONIO JACINTHO SOBRINHO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "VILA CEL. ANTONIO JACINTHO SOBRINHO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "VILA CHAMPGANAT", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "VILA CHICO JÚLIO", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "VILA DA MARTA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "VILA DUQUE DE CAXIAS", day: "SEG/ QUA/ SEX - NOITE" },
        { neighborhood: "VILA EUROPA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "VILA EXPOSIÇÃO", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "VILA FLORES", day: "TER/ QUI/ SAB - NOITE" },
        { neighborhood: "VILA FORMOSA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "VILA FRANÇA", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "VILA GOSUEN", day: "SÁBADO - NOITE" },
        { neighborhood: "VILA HÍPICA", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "VILA INDUSTRIAL", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "VILA MARTA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "VILA MONTE VERDE", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "VILA MONTEIRO", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "VILA NICÁCIO", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "VILA NOSSA SENHORA DAS GRAÇAS", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "VILA NOSSA SENHORA DE FÁTIMA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "VILA PANDOLFO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "VILA PASQUALINO", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "VILA PATRÍCIO", day: "SEXTA-FEIRA - NOITE" },
        { neighborhood: "VILA PEDIGONE", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "VILA PLEMONTE I", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "VILA PLEMONTE II", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "VILA RAYCOS", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "VILA REAL", day: "SEGUNDA-FEIRA - NOITE" },
        { neighborhood: "VILA REGINA", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "VILA REZENDE", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "VILA SAMELLO", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "VILA SANTA CRUZ", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "VILA SANTA GIANNA", day: "QUARTA-FEIRA - DIA" },
        { neighborhood: "VILA SANTA HELENA", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "VILA SANTA LUZIA", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "VILA SANTA MARIA DO CARMO", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "VILA SANTA RITA", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "VILA SANTO ANTONIO", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "VILA SANTO DUMONT", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "VILA SÃO SEBASTIÃO", day: "TERÇA-FEIRA -  DIA" },
        { neighborhood: "VILA SÃO VICENTE", day: "QUARTA-FEIRA - NOITE" },
        { neighborhood: "VILA SCARABUCI", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "VILA TEIXEIRA", day: "SEXTA-FEIRA - DIA" },
        { neighborhood: "VILA TOSCANA", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "VILA TOTOLI", day: "QUINTA-FEIRA - DIA" },
        { neighborhood: "VILLAGE STA. GEORGINA", day: "TERÇA-FEIRA - NOITE" },
        { neighborhood: "VILLAGIO DI FIRENZE", day: "SEGUNDA-FEIRA - DIA" },
        { neighborhood: "VILLAGIO MUNDO NOVO", day: "TERÇA-FEIRA -  DIA" },
    ];

    // Coletar dados por bairro
    const neighborhoodInput = document.getElementById('neighborhood-input');
    const searchButton = document.getElementById('search-button');
    const resultArea = document.getElementById('result-area');

    if (neighborhoodInput && searchButton && resultArea) {
        searchButton.addEventListener('click', () => {
            const searchTerm = neighborhoodInput.value.trim().toUpperCase();
            const result = collectionData.find(item => item.neighborhood.toUpperCase() === searchTerm);

            if (result) {
                resultArea.innerHTML = `<p>O dia de coleta no bairro <strong>${result.neighborhood}</strong> é: <strong>${result.day}</strong></p>`;
            } else {
                resultArea.innerHTML = '<p>Bairro não encontrado. Por favor, verifique o nome digitado.</p>';
            }
        });

        // Permitir pesquisa pressionando Enter no campo de entrada
        neighborhoodInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                searchButton.click();
            }
        });
    }
});