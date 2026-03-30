document.addEventListener('DOMContentLoaded', function() {
    // ===== РЕНДЕРИНГ ДАННЫХ =====
    
    // Render services
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid && siteData.services) {
        servicesGrid.innerHTML = siteData.services.map(service => `
            <div class="service-card">
                <div class="service-card__icon">🦷</div>
                <h3 class="service-card__title">${service.name}</h3>
                <p class="service-card__price">${service.price}</p>
                <p class="service-card__desc">${service.desc}</p>
                <a href="#form" class="service-card__link">Записаться →</a>
            </div>
        `).join('');
        
        // Добавляем факты к услугам
        const cards = document.querySelectorAll('.service-card');
        cards.forEach((card, index) => {
            if (siteData.services[index] && siteData.services[index].fact) {
                const factDiv = document.createElement('div');
                factDiv.className = 'service-card__fact';
                factDiv.textContent = siteData.services[index].fact;
                card.appendChild(factDiv);
            }
        });
    }

    // Render doctors
    const doctorsGrid = document.getElementById('doctors-grid');
    if (doctorsGrid && siteData.doctors) {
        doctorsGrid.innerHTML = siteData.doctors.map(doctor => `
            <div class="doctor-card">
                <div class="doctor-card__photo">🦷</div>
                <h3 class="doctor-card__name">${doctor.name}</h3>
                <p class="doctor-card__spec">${doctor.spec}</p>
            </div>
        `).join('');
    }

    // Render prices
    const pricesGrid = document.getElementById('prices-grid');
    if (pricesGrid && siteData.prices) {
        pricesGrid.innerHTML = siteData.prices.map(price => `
            <div class="price-item">
                <span class="price-item__name">${price.name}</span>
                <span class="price-item__value">${price.price} ₽</span>
            </div>
        `).join('');
        
        // Добавляем факты к ценам
        const priceItems = document.querySelectorAll('.price-item');
        priceItems.forEach((item, index) => {
            if (siteData.prices[index] && siteData.prices[index].fact) {
                const factDiv = document.createElement('div');
                factDiv.className = 'price-item__fact';
                factDiv.textContent = siteData.prices[index].fact;
                item.appendChild(factDiv);
            }
        });
    }

    // Render addresses
    const addressesDiv = document.getElementById('addresses');
    if (addressesDiv && siteData.contacts.addresses) {
        addressesDiv.innerHTML = siteData.contacts.addresses.map(addr => `
            <p><strong>${addr.city}</strong>: ${addr.street}<br>${addr.hours}</p>
        `).join('');
    }

    // Render phones
    const phonesDiv = document.getElementById('phones');
    if (phonesDiv && siteData.contacts.phones) {
        phonesDiv.innerHTML = siteData.contacts.phones.map((phone, i) => `
            <p><a href="tel:${siteData.contacts.phonesRaw[i]}">${phone}</a></p>
        `).join('');
    }

    // Render socials
    const socialsDiv = document.getElementById('socials');
    if (socialsDiv && siteData.contacts.socials) {
        const s = siteData.contacts.socials;
        socialsDiv.innerHTML = `
            <a href="${s.vk}" target="_blank">📘</a>
            <a href="${s.telegram}" target="_blank">📱</a>
            <a href="${s.whatsapp}" target="_blank">💬</a>
        `;
    }

    // ===== АНИМИРОВАННЫЕ СЧЁТЧИКИ =====
    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 20);
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const yearsEl = document.getElementById('counter-years');
                const patientsEl = document.getElementById('counter-patients');
                const priceEl = document.getElementById('counter-price');
                if (yearsEl) animateCounter(yearsEl, siteData.clinic.years);
                if (patientsEl) animateCounter(patientsEl, siteData.clinic.patientsPerMonth);
                if (priceEl) animateCounter(priceEl, siteData.clinic.avgPrice);
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });
    
    const counterSection = document.querySelector('.counter-section');
    if (counterSection) observer.observe(counterSection);

    // ===== ИНТЕРАКТИВНЫЙ ФОН (слежение за курсором) =====
    const bg = document.querySelector('.interactive-bg');
    if (bg) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            bg.style.setProperty('--x', `${x}%`);
            bg.style.setProperty('--y', `${y}%`);
        });
    }

    // ===== ПЛАВНЫЙ СКРОЛЛ =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#privacy') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== МОДАЛЬНОЕ ОКНО =====
    const modal = document.getElementById('privacy-modal');
    const privacyLinks = document.querySelectorAll('.privacy-link');
    const closeBtn = document.querySelector('.modal__close');
    
    function openModal() {
        if (modal) modal.style.display = 'block';
    }
    function closeModalFunc() {
        if (modal) modal.style.display = 'none';
    }
    
    privacyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
    
    if (closeBtn) closeBtn.addEventListener('click', closeModalFunc);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunc();
    });
    
    // ===== МИКРО-АНИМАЦИЯ ДЛЯ ССЫЛОК =====
    const footerLinks = document.querySelectorAll('.footer a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            e.target.style.transform = 'translateX(4px)';
            e.target.style.transition = 'transform 0.2s';
        });
        link.addEventListener('mouseleave', (e) => {
            e.target.style.transform = 'translateX(0)';
        });
    });
    
    // ===== ПАРАЛЛАКС ДЛЯ HERO =====
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        const hero = document.querySelector('.hero');
        if (hero && scrollPos < 600) {
            hero.style.transform = `translateY(${scrollPos * 0.2}px)`;
        }
    });
});
