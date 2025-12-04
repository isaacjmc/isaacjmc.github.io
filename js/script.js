let currentLang = 'es';
let allData = {};

const staticTranslations = {
    es: {
        nav: {
            profile: "Perfil",
            experience: "Experiencia",
            skills: "Habilidades",
            projects: "Proyectos",
            education: "Educación",
            contact: "Contacto"
        },
        hero: {
            role: "Desarrollador & Analista de Datos",
            bio: "Profesional proactivo y adaptable, con una sólida aptitud para el aprendizaje continuo. Poseo experiencia en el desarrollo backend con Node.js y la manipulación de bases de datos relacionales y no relacionales. Me desenvuelvo bien en entornos colaborativos y dinámicos, siempre buscando adquirir nuevas habilidades.",
            button: "Ver Proyectos",
            contact: "Contáctame"
        }
    },
    en: {
        nav: {
            profile: "Profile",
            experience: "Experience",
            skills: "Skills",
            projects: "Projects",
            education: "Education",
            contact: "Contact"
        },
        hero: {
            role: "Developer & Data Analyst",
            bio: "Proactive and adaptable professional with a strong aptitude for continuous learning. I have experience in backend development with Node.js and handling relational and non-relational databases. I thrive in collaborative and dynamic environments, always seeking to acquire new skills.",
            button: "View Projects",
            contact: "Contact Me"
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('lang-toggle');
    const lightbox = document.getElementById('lightbox');
    const closeLightbox = document.querySelector('.close-lightbox');

    // Cambiar Idioma
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        langToggle.textContent = currentLang === 'es' ? 'EN' : 'ES';
        updateLanguage();
    });

    // Cerrar Lightbox
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });

    // Cargar Datos
    // Cargar Datos
    const loadStaticData = fetch('proyectos.json').then(response => response.json());

    // Cargar proyectos desde la API de PythonAnywhere
    const loadApiData = fetch('https://isaacjm.pythonanywhere.com/api/proyectos')
        .then(response => response.json())
        .catch(error => {
            console.error('Error al cargar API:', error);
            return { elementos: [] }; // Fallback si falla la API
        });

    Promise.all([loadStaticData, loadApiData])
        .then(([staticData, apiData]) => {
            allData = staticData;

            // Si la API trajo proyectos, usamos esos. Si no, se quedan los del json (si hubiera)
            if (apiData && apiData.elementos && apiData.elementos.length > 0) {
                console.log("Cargados " + apiData.elementos.length + " proyectos desde la API");
                allData.elementos = apiData.elementos;
            }

            updateLanguage(); // Initial render
        })
        .catch(error => {
            console.error('Error crítico al cargar datos:', error);
        });
});

function updateLanguage() {
    // Combine static translations with loaded data
    // Note: JSON keys are 'ES' and 'EN', static are 'es' and 'en'.
    const jsonLangKey = currentLang === 'es' ? 'ES' : 'EN';
    const jsonData = allData[jsonLangKey] || {};
    const staticData = staticTranslations[currentLang];

    const data = { ...staticData, ...jsonData };

    // Update static text
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = data;

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                value = null;
                break;
            }
        }

        if (value) {
            element.innerHTML = value;
        }
    });

    // Render Dynamic Sections if data exists in JSON
    if (data.Experiencia) renderExperience(data.Experiencia);
    if (data.skills) renderSkills(data.skills);
    if (data.education) renderEducation(data.education);

    // Render Projects (using global 'elementos' array)
    if (allData.elementos) {
        renderProjects(allData.elementos);
    }
}

function renderExperience(experienceData) {
    const container = document.getElementById('experience-timeline');
    if (!container || !experienceData) return;
    container.innerHTML = '';

    experienceData.forEach(job => {
        const item = document.createElement('div');
        item.className = 'timeline-item';

        let descHtml = '';
        if (job.descripcion) {
            // Handle if description is object with lang keys or direct string/array
            let descContent = job.descripcion;
            if (typeof job.descripcion === 'object' && !Array.isArray(job.descripcion)) {
                descContent = job.descripcion[currentLang] || job.descripcion['es'];
            }

            if (Array.isArray(descContent)) {
                descHtml = `<ul>${descContent.map(li => `<li>${li}</li>`).join('')}</ul>`;
            } else {
                descHtml = `<p>${descContent}</p>`;
            }
        }

        item.innerHTML = `
            <div class="timeline-date">${job.fecha}</div>
            <div class="timeline-content">
                <h3>${job.Titulo}</h3>
                ${descHtml}
            </div>
        `;
        container.appendChild(item);
    });
}

function renderSkills(skillsData) {
    const container = document.getElementById('skills-grid');
    if (!container || !skillsData) return;
    container.innerHTML = '';

    const createCategory = (key, title, items) => {
        const div = document.createElement('div');
        div.className = 'skill-category';
        div.innerHTML = `
            <h3>${title}</h3>
            <div class="skill-tags">
                ${items.map(skill => `<span>${skill}</span>`).join('')}
            </div>
        `;
        container.appendChild(div);
    };

    if (skillsData.backend) createCategory('backend', skillsData.backend.titulo, skillsData.backend.skills);
    if (skillsData.frontend) createCategory('frontend', skillsData.frontend.titulo, skillsData.frontend.skills);
    if (skillsData.data) createCategory('data', skillsData.data.titulo, skillsData.data.skills);
    if (skillsData.soft) createCategory('soft', skillsData.soft.titulo, skillsData.soft.skills);
}

function renderEducation(educationData) {
    const container = document.getElementById('education-grid');
    if (!container || !educationData) return;
    container.innerHTML = '';

    // Handle structure: { title: "...", degree: [{ Titulo: "...", Fecha: "...", Institucion: "..." }] }
    if (educationData.degree && Array.isArray(educationData.degree)) {
        educationData.degree.forEach(degree => {
            const card = document.createElement('div');
            card.className = 'education-card';
            card.innerHTML = `
                <h3>${degree.Titulo}</h3>
                <p>${degree.Institucion}</p>
                <span class="education-date">${degree.Fecha}</span>
             `;
            container.appendChild(card);
        });
    } else if (educationData.degree) {
        // Fallback for old object structure if needed, or just ignore
        Object.values(educationData.degree).forEach(degree => {
            const card = document.createElement('div');
            card.className = 'education-card';
            card.innerHTML = `<h3>${degree}</h3>`;
            container.appendChild(card);
        });
    }
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = '';

    const categoryOrder = ['python', 'power bi', 'excel', 'sql server'];
    const projectsByType = {};

    projects.forEach(project => {
        const type = project.tipo.toLowerCase();
        if (!projectsByType[type]) {
            projectsByType[type] = [];
        }
        projectsByType[type].push(project);
    });

    categoryOrder.forEach(type => {
        if (projectsByType[type]) {
            renderCategory(type, projectsByType[type], container);
        }
    });

    Object.keys(projectsByType).forEach(type => {
        if (!categoryOrder.includes(type)) {
            renderCategory(type, projectsByType[type], container);
        }
    });
}

function renderCategory(type, projects, container) {
    const categorySection = document.createElement('div');
    categorySection.className = 'category-block';

    const title = type.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    categorySection.innerHTML = `
        <h3 class="category-title">${title}</h3>
        <div class="projects-grid">
            ${projects.map(project => createProjectCard(project)).join('')}
        </div>
    `;

    container.appendChild(categorySection);
}

function createProjectCard(project) {
    const jsonLangKey = currentLang === 'es' ? 'ES' : 'EN';
    let btnText = "Ver Proyecto";

    if (allData[jsonLangKey] && allData[jsonLangKey].projects && allData[jsonLangKey].projects.viewProject) {
        btnText = allData[jsonLangKey].projects.viewProject;
    } else if (staticTranslations[currentLang].projects && staticTranslations[currentLang].projects.viewProject) {
        // Fallback if we had it in static, but we didn't put projects in static.
        // Let's just default to "Ver Proyecto" / "View Project" based on lang
        btnText = currentLang === 'es' ? "Ver Proyecto" : "View Project";
    }

    let description = project.descripcion;
    if (typeof project.descripcion === 'object') {
        description = project.descripcion[currentLang] || project.descripcion['es'];
    }

    return `
        <article class="project-card">
            <img src="${project.urlImagen}" alt="${project.nombreP}" class="project-image" onclick="openLightbox('${project.urlImagen}')" onerror="this.src='https://via.placeholder.com/400x200?text=${encodeURIComponent(project.nombreP)}'">
            <div class="project-info">
                <h3>${project.nombreP}</h3>
                <p>${description}</p>
                <span class="project-tag">${project.tipo}</span>
                <div class="project-actions">
                    <a href="${project.urlProyecto || '#'}" class="btn-project" target="_blank">${btnText}</a>
                </div>
            </div>
        </article>
    `;
}

function openLightbox(imgUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightbox.style.display = "block";
    lightboxImg.src = imgUrl;
}
