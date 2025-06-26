// ===================
// 1. Año actual
// ===================
document.getElementById('currentYear').textContent = new Date().getFullYear();

// ===================
// 2. Hora local dinámica
// ===================
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    const gmtOffset = -(now.getTimezoneOffset() / 60);
    const gmtString = `(GMT ${gmtOffset >= 0 ? '+' : ''}${gmtOffset})`;

    const timeElements = document.querySelectorAll('.current-time');
    timeElements.forEach(el => {
        el.textContent = `${timeString} ${gmtString}`;
    });
}
setInterval(updateTime, 1000);
updateTime();

// ===================
// 3. Custom cursor
// ===================
const cursor = document.querySelector('.cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
}

// ===================
// 4. Menú overlay
// ===================
const menuBtn = document.getElementById('menuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenu = document.getElementById('closeMenu');
const menuLinks = document.querySelectorAll('.menu-links a');

if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.add('active');
    });
}
if (closeMenu && menuOverlay) {
    closeMenu.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
    });
}
if (menuLinks && menuOverlay) {
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
        });
    });
}

// ===================
// 5. Smooth scroll
// ===================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================
// 6. Carga dinámica de proyectos
// ===================
const PROJECTS_LIMIT_INDEX = 4;

// Render para index.html (2 columnas, con categoría)
function renderProjectIndex(project, i) {
    return `
        <div class="col-md-6 project-item">
            <div class="project-card">
                <img src="${project.image}" alt="${project.title}" class="project-img">
                <div class="project-info">
                    <div class="project-number">/${String(i+1).padStart(3, '0')}</div>
                    <h3 class="mt-2">${project.title}</h3>
                    <p class="mb-1"><strong>${project.category || ''}</strong></p>
                    <p>${project.description}</p>
                    ${project.url ? `<a href="${project.url}" class="btn btn-custom">Ver Detalles <i class="fas fa-arrow-right ms-2"></i></a>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Render para proyectos.html (3 columnas, sin categoría)
function renderProjectCard(project, i) {
    return `
        <div class="col-md-6 col-lg-4 project-item" data-category="${project.category || ''}">
            <div class="project-card">
                <img src="${project.image}" alt="${project.title}" class="project-img">
                <div class="project-info">
                    <div class="project-number">/${String(i+1).padStart(3, '0')}</div>
                    <h3 class="mt-2">${project.title}</h3>
                    <p>${project.description}</p>
                    ${project.url ? `<a href="${project.url}" class="btn btn-custom">Ver Detalles <i class="fas fa-arrow-right ms-2"></i></a>` : ''}
                </div>
            </div>
        </div>
    `;
}

async function loadProjects({limit = null, filter = null} = {}) {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        let projects = data.projects;

        // Filtrado por categoría si aplica
        if (filter && filter.toLowerCase() !== 'todos' && filter !== 'all') {
            projects = projects.filter(p => {
                const cat = (p.category || '').replace(/\s+/g, '').toLowerCase();
                const fil = filter.replace(/\s+/g, '').toLowerCase();
                return cat === fil;
            });
        }

        // Limitar cantidad si aplica
        if (limit) {
            projects = projects.slice(0, limit);
        }

        const container = document.getElementById('projects-container');
        if (!container) return;
        container.innerHTML = '';
        const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
        projects.forEach((project, i) => {
            container.innerHTML += isIndex
                ? renderProjectIndex(project, i)
                : renderProjectCard(project, i);
        });
        // Animación de proyectos al hacer scroll
        revealProjectsOnScroll();
    } catch (err) {
        console.error('Error cargando proyectos:', err);
    }
}

// ===================
// 7. Filtros de proyectos (solo en proyectos.html)
// ===================
function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                loadProjects({filter});
            });
        });
    }
}

// ===================
// 8. Animación de proyectos al hacer scroll
// ===================
function revealProjectsOnScroll() {
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (itemTop < windowHeight - 150) {
            item.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealProjectsOnScroll);
window.addEventListener('load', revealProjectsOnScroll);

// ===================
// 9. Inicialización según página
// ===================
document.addEventListener('DOMContentLoaded', () => {
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const isProyectos = window.location.pathname.endsWith('proyectos.html');

    if (isIndex) {
        loadProjects({limit: PROJECTS_LIMIT_INDEX});
    } else if (isProyectos) {
        loadProjects();
        setupProjectFilters();
    }
});