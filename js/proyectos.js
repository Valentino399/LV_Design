document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    initializeFilters();
    initializeAnimations();
});

// === CARGAR PROYECTOS DESDE JSON ===
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Soportar tanto "projects" como "Projects" (Netlify CMS usa mayúscula)
        const projects = data.Projects || data.projects || [];
        
        if (projects.length === 0) {
            console.warn('No se encontraron proyectos en el JSON');
            showEmptyState();
            return;
        }
        
        renderProjects(projects);
        updateFilterCounts(projects);
        
        // Mostrar proyectos con animación
        setTimeout(() => {
            document.querySelectorAll('.project-item').forEach((item, index) => {
                setTimeout(() => item.classList.add('visible'), index * 100);
            });
        }, 200);
        
    } catch (error) {
        console.error('Error cargando proyectos:', error);
        showErrorState();
    }
}

// === RENDERIZAR PROYECTOS ===
function renderProjects(projects) {
    const container = document.getElementById('projectsContainer');
    
    if (!container) {
        console.error('Container #projectsContainer no encontrado');
        return;
    }
    
    container.innerHTML = projects.map((project, index) => `
        <div class="col-md-6 col-lg-4 project-item" data-category="${project.category}">
            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link-wrapper">
                <div class="project-card-cyber">
                    <div class="p-img">
                        <img src="${project.image}" alt="${project.title}" loading="lazy">
                    </div>
                    <div class="p-info">
                        <span class="text-tech-visible">/ ${String(index + 1).padStart(3, '0')} - ${project.categoryLabel || project.category.toUpperCase()}</span>
                        <h3>${project.title}</h3>
                        <p class="project-category" style="display:none;">${project.category}</p>
                        <p class="project-id" style="display:none;">${project.id}</p>
                        <p class="project-desc">${project.description}</p>
                        <p class="project-tags">${(project.tags || []).join(' | ')}</p>
                        <span class="p-link">Ver Detalles ↗</span>

                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// === ACTUALIZAR CONTADORES DE FILTROS ===
function updateFilterCounts(projects) {
    const counts = {
        all: projects.length,
        'ux-research': projects.filter(p => p.category === 'ux-research').length,
        'ui-design': projects.filter(p => p.category === 'ui-design').length,
        'web-design': projects.filter(p => p.category === 'web-design').length
    };
    
    const countAll = document.getElementById('count-all');
    const countResearch = document.getElementById('count-research');
    const countUi = document.getElementById('count-ui');
    const countWeb = document.getElementById('count-web');
    
    if (countAll) countAll.textContent = counts.all;
    if (countResearch) countResearch.textContent = counts['ux-research'];
    if (countUi) countUi.textContent = counts['ui-design'];
    if (countWeb) countWeb.textContent = counts['web-design'];
}

// === INICIALIZAR FILTROS ===
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn-cyber');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Actualizar botón activo
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrar proyectos
            filterProjects(filter);
        });
    });
    
    // Botón de empty state
    const emptyStateBtn = document.querySelector('#emptyState .btn-custom-cyber');
    if (emptyStateBtn) {
        emptyStateBtn.addEventListener('click', () => {
            filterBtns[0].click(); // Click en "Todos"
        });
    }
}

// === FILTRAR PROYECTOS ===
function filterProjects(filter) {
    const projectItems = document.querySelectorAll('.project-item');
    const emptyState = document.getElementById('emptyState');
    let visibleCount = 0;
    
    projectItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => item.classList.add('visible'), 100);
            visibleCount++;
        } else {
            item.classList.remove('visible');
            setTimeout(() => item.style.display = 'none', 300);
        }
    });
    
    // Mostrar empty state si no hay resultados
    if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

// === MENÚ TOGGLE ===
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('menuOverlay');

if (menuBtn && closeBtn && overlay) {
    menuBtn.addEventListener('click', () => overlay.classList.add('active'));
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => overlay.classList.remove('active'));
    });
}

// === RELOJ ===
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        const now = new Date();
        clockElement.innerHTML = now.toLocaleTimeString('es-AR') + ' (GMT-3)';
    }
}

updateClock();
setInterval(updateClock, 1000);

// === ESTADO DE ERROR ===
function showErrorState() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-12">
            <div class="empty-state" style="display: block;">
                <div class="text-center py-5">
                    <p class="text-tech-visible mb-3">// ERROR_LOADING</p>
                    <h3 class="text-white mb-3">No se pudieron cargar los proyectos</h3>
                    <p class="text-muted-ux">Verifica que el archivo data/projects.json exista y esté bien formateado</p>
                    <button class="btn-custom-cyber mt-4" onclick="location.reload()">Reintentar</button>
                </div>
            </div>
        </div>
    `;
}

// === ESTADO VACÍO ===
function showEmptyState() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-12">
            <div class="empty-state" style="display: block;">
                <div class="text-center py-5">
                    <p class="text-tech-visible mb-3">// NO_PROJECTS</p>
                    <h3 class="text-white mb-3">No hay proyectos disponibles</h3>
                    <p class="text-muted-ux">Los proyectos se mostrarán aquí una vez que se agreguen al CMS</p>
                </div>
            </div>
        </div>
    `;
}

// === SMOOTH SCROLL PARA ANCLAS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Debug: Log cuando el script se carga
console.log('✅ Proyectos.js cargado correctamente');