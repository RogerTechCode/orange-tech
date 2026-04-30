document.addEventListener('DOMContentLoaded', () => {
    // ... existing scroll and menu logic ... (mantido como estava no seu código)
    initApp();
});

async function initApp() {
    setupHeader();
    await renderSponsors();
    await renderNews();
    await initCarousels();
    setupScrollReveal(); // Esta função deve ser chamada APÓS os carrosséis serem populados
}

async function initCarousels() {
    // Equipe Carousels
    if (document.querySelector('.splide-diretoria')) {
        await renderDiretoriaCarousel();
    }
    if (document.querySelector('.splide-comissao')) {
        await renderComissaoCarousel();
    }
    // Localização Carousel (Static HTML already in place, just mount Splide)
    if (document.querySelector('.splide-localizacao')) {
        new Splide('.splide-localizacao', {
            type: 'loop',
            perPage: 1,
            gap: '2rem',
            arrows: true,
            pagination: true,
        }).mount();
    }

    // Estrutura Carousels
    const structureOptions = {
        type: 'loop',
        perPage: 1,
        autoplay: true,
        interval: 4000,
        pauseOnHover: true,
        arrows: true,
        pagination: true,
    };

    if (document.querySelector('.splide-estrutura')) {
        new Splide('.splide-estrutura', structureOptions).mount();
    }
    if (document.querySelector('.splide-lapp')) {
        new Splide('.splide-lapp', structureOptions).mount();
    }
    if (document.querySelector('.splide-candeias')) {
        new Splide('.splide-candeias', structureOptions).mount();
    }
    if (document.querySelector('.splide-belogol')) {
        new Splide('.splide-belogol', structureOptions).mount();
    }
}

async function renderDiretoriaCarousel() {
    let managers = await Storage.get('managers');
    const track = document.querySelector('.splide-diretoria .splide__list');
    if (!track) {
        console.warn("Elemento '.splide-diretoria .splide__list' não encontrado para a diretoria.");
        return;
    }

    if (managers.length === 0) {
        const section = track.closest('.mb-24'); // Assumindo que a seção pai tem essa classe
        if (section) section.style.display = 'none';
        return;
    }

    track.innerHTML = managers.map(m => createTeamMemberSlide(m)).join('');

    const container = document.querySelector('#diretoria-slides'); // O container para ajustes de estilo
    if (container && managers.length > 0 && managers.length < 4) {
        container.style.maxWidth = window.innerWidth >= 1024 ? `${managers.length * 28}%` : '100%';
        container.style.margin = '0 auto';
    }

    new Splide('.splide-diretoria', getTeamSplideOptions(managers.length)).mount();
    // Re-observar elementos após a renderização, se necessário
    // setupScrollReveal(); // Descomente se os slides do Splide também usam a classe 'reveal' e precisam ser observados
}

async function renderComissaoCarousel() {
    let coaches = await Storage.get('coaches');
    const track = document.querySelector('.splide-comissao .splide__list');
    if (!track) {
        console.warn("Elemento '.splide-comissao .splide__list' não encontrado para a comissão.");
        return;
    }

    if (coaches.length === 0) {
        const section = track.closest('.mb-24'); // Assumindo que a seção pai tem essa classe
        if (section) section.style.display = 'none';
        return;
    }

    track.innerHTML = coaches.map(m => createTeamMemberSlide(m)).join('');

    const container = document.querySelector('#comissao-slides'); // O container para ajustes de estilo
    if (container && coaches.length > 0 && coaches.length < 4) {
        container.style.maxWidth = window.innerWidth >= 1024 ? `${coaches.length * 28}%` : '100%';
        container.style.margin = '0 auto';
    }

    new Splide('.splide-comissao', getTeamSplideOptions(coaches.length)).mount();
    // Re-observar elementos após a renderização, se necessário
    // setupScrollReveal(); // Descomente se os slides do Splide também usam a classe 'reveal' e precisam ser observados
}

function createTeamMemberSlide(m) {
    return `
        <li class="splide__slide p-4">
            <div class="bg-slate-900 rounded-3xl overflow-hidden glass-card group flex-1">
                <div class="relative h-96 overflow-hidden bg-slate-800">
                    <img src="${m.imageUrl || 'https://images.unsplash.com/photo-1519085185758-20ddbbd2ba09?w=600&h=800&fit=crop'}" 
                         class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                         alt="${m.name}"
                         onerror="this.style.opacity='0.3';">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent text-white p-6 flex flex-col justify-end">
                        <span class="text-orange-primary text-xs font-bold uppercase tracking-widest mb-1 bg-white/10 px-3 py-1 rounded-full w-fit">${m.position || m.specialty || 'Membro'}</span>
                        <h3 class="text-2xl font-bold font-poppins team-name-shadow">${m.name}</h3>
                    </div>
                </div>
            </div>
        </li>
    `;
}

function getTeamSplideOptions(itemCount = 0) {
    return {
        type: itemCount > 4 ? 'loop' : 'slide',
        perPage: Math.min(4, Math.max(1, itemCount || 4)),
        focus: (itemCount > 0 && itemCount < 4) ? 'center' : 0,
        gap: '1.5rem',
        arrows: itemCount > 4,
        pagination: itemCount > 4,
        drag: itemCount > 4,
        breakpoints: {
            1024: {
                perPage: 3,
                arrows: itemCount > 3,
                pagination: itemCount > 3,
                drag: itemCount > 3
            },
            768: {
                perPage: 2,
                arrows: itemCount > 2,
                pagination: itemCount > 2,
                drag: itemCount > 2
            },
            640: {
                perPage: 1,
                arrows: itemCount > 1,
                pagination: itemCount > 1,
                drag: itemCount > 1
            },
        },
    };
}

// function renderLocalizacaoCarousel() { ... removed for static HTML version ... }

function setupHeader() {
    const header = document.querySelector('header');
    const topBanner = document.getElementById('top-banner');
    const navBar = document.getElementById('nav-bar');
    const logoContainer = document.getElementById('logo-container');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Scroll effect — original inline-style approach with rAF throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (!topBanner) { ticking = false; return; }
                const isScrolled = window.scrollY > 80;
                const headerEl = document.querySelector('header');
                if (isScrolled) {
                    if (headerEl) headerEl.classList.add('header-scrolled');
                    if (logoContainer) logoContainer.classList.add('logo-shrink');
                } else {
                    if (headerEl) headerEl.classList.remove('header-scrolled');
                    if (logoContainer) logoContainer.classList.remove('logo-shrink');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Active link highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('text-orange-primary', 'font-bold');
        }
    });
}

async function renderSponsors() {
    let sponsors = await Storage.get('sponsors');
    const sponsorsGrid = document.getElementById('sponsors-grid');
    if (!sponsorsGrid) return;

    sponsorsGrid.innerHTML = sponsors.map(s => `
        <div class="p-6 hover:scale-110 transition-all flex items-center justify-center aspect-[2/1]">
            <img src="${s.imageUrl}" alt="${s.name}" class="max-w-full max-h-full object-contain filter drop-shadow-lg">
        </div>
    `).join('');
}

async function renderNews() {
    let news = await Storage.get('news');
    const newsHome = document.getElementById('index-news-list');
    const newsGrid = document.getElementById('news-grid');
    const newsFeatured = document.getElementById('featured-news-list');

    // Featured news for carousel
    const featuredItems = news.filter(n => n.isFeatured);

    // Dominant Carousel on news page
    if (newsFeatured) {
        if (featuredItems.length === 0) {
            // fallback if no featured items
            newsFeatured.innerHTML = `<li class="splide__slide p-2"><div class="news-featured-card bg-slate-900 flex items-center justify-center h-[400px] text-white">Nenhuma notícia em destaque no momento.</div></li>`;
        } else {
            newsFeatured.innerHTML = featuredItems.map(n => `
                <li class="splide__slide">
                    <div class="news-featured-card group cursor-pointer h-[750px] bg-slate-900 shadow-2xl overflow-hidden relative" onclick="window.location.href='noticia-detail.html?id=${n.id}'">
                        <img src="${n.imageUrl}" class="news-featured-img group-hover:scale-110 opacity-70 group-hover:opacity-90 transition-all duration-1000 w-full h-full object-cover" alt="${n.title}" decoding="async">
                        <div class="absolute inset-0 editorial-gradient flex flex-col justify-end p-8 md:p-16 lg:p-24">
                            <div class="editorial-badge mb-6 w-fit scale-125 origin-left">EM DESTAQUE</div>
                            <h2 class="text-5xl md:text-8xl editorial-title text-white mb-8 group-hover:text-orange-primary transition-colors leading-[0.9] drop-shadow-2xl max-w-5xl">${n.title}</h2>
                            <p class="text-slate-300 text-xl md:text-2xl mb-10 line-clamp-2 max-w-4xl font-medium">${n.excerpt}</p>
                            <div class="flex items-center gap-6 text-white font-black uppercase tracking-[0.2em] text-sm group-hover:gap-10 transition-all">
                                <span class="border-b-4 border-orange-primary pb-2">Ler Reportagem Completa</span>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" class="transform group-hover:translate-x-4 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </div>
                        </div>
                    </div>
                </li>
            `).join('');

            new Splide('#news-carousel', {
                type: 'fade',
                rewind: true,
                perPage: 1,
                gap: 0,
                padding: 0,
                arrows: true,
                pagination: true,
                autoplay: true,
                interval: 5000,
                speed: 1000,
                pauseOnHover: false,
                pauseOnFocus: false,
            }).mount();
        }
    }

    if (newsGrid) {
        // Show all news in grid, maybe excluding featured if desired, but usually grid shows all
        newsGrid.innerHTML = news.map(n => {
            const dateObj = new Date(n.date);
            const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

            return `
            <div class="nautical-card group cursor-pointer reveal" onclick="window.location.href='noticia-detail.html?id=${n.id}'">
                <div class="card-image">
                    <img src="${n.imageUrl}" alt="${n.title}" loading="lazy" decoding="async">
                    ${n.isFeatured ? '<div class="absolute top-4 right-4 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase shadow-lg">Destaque</div>' : ''}
                </div>
                <div class="card-content">
                    <span class="card-date">${formattedDate}</span>
                    <h3 class="card-title">${n.title}</h3>
                </div>
            </div>
            `;
        }).join('');
    }
}

function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
}