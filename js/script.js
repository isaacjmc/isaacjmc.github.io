const translations = {
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
        },
        experience: {
            title: "Experiencia Laboral",
            jobs: {
                dev: {
                    title: "Desarrollador Web con Vue3 y Nodejs",
                    desc: `
                        <li>Diseño, desarrollo y mantenimiento de aplicaciones web robustas.</li>
                        <li>Implementación de APIs RESTful y servicios web escalables.</li>
                        <li>Colaboración con equipos multidisciplinarios.</li>
                    `
                },
                analyst: {
                    title: "Resource Planner y Analista de Datos",
                    desc: `
                        <li>Planificación y gestión de recursos para proyectos de desarrollo.</li>
                        <li>Análisis de grandes volúmenes de datos para la toma de decisiones.</li>
                        <li>Creación de informes y dashboards interactivos (Power BI).</li>
                    `
                },
                rtqm: {
                    title: "RTQM - 24-7 Intouch",
                    desc: `
                        <li>Responsable del mapeo y programación de horarios.</li>
                        <li>Colaboración en el desarrollo de soluciones para mejora continua.</li>
                        <li>Identificación y resolución de incidencias operativas.</li>
                    `
                }
            }
        },
        skills: {
            title: "Habilidades Técnicas",
            backend: "Backend & DB",
            frontend: "Frontend",
            data: "Análisis de Datos",
            soft: "Habilidades Blandas",
            soft_skills: {
                teamwork: "Trabajo en equipo",
                proactive: "Proactividad",
                learning: "Aprendizaje continuo"
            }
        },
        projects: {
            title: "Mis Proyectos",
            viewProject: "Ver Proyecto"
        },
        education: {
            title: "Educación",
            degree: {
                sysadmin: "Ingeniería en Sistemas",
                hs: "Bachiller Técnico en Computación"
            }
        },
        contact: {
            title: "Contacto"
        },
        footer: {
            rights: "&copy; 2025 Isaac Josue Magana Cano. Todos los derechos reservados."
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
        },
        experience: {
            title: "Work Experience",
            jobs: {
                dev: {
                    title: "Web Developer with Vue3 and Nodejs",
                    desc: `
                        <li>Design, development, and maintenance of robust web applications.</li>
                        <li>Implementation of RESTful APIs and scalable web services.</li>
                        <li>Collaboration with multidisciplinary teams.</li>
                    `
                },
                analyst: {
                    title: "Resource Planner and Data Analyst",
                    desc: `
                        <li>Resource planning and management for development projects.</li>
                        <li>Analysis of large volumes of data for strategic decision-making.</li>
                        <li>Creation of interactive reports and dashboards (Power BI).</li>
                    `
                },
                rtqm: {
                    title: "RTQM - 24-7 Intouch",
                    desc: `
                        <li>Responsible for schedule mapping and programming.</li>
                        <li>Collaboration in developing solutions for continuous improvement.</li>
                        <li>Identification and resolution of operational incidents.</li>
                    `
                }
            }
        },
        skills: {
            title: "Technical Skills",
            backend: "Backend & DB",
            frontend: "Frontend",
            data: "Data Analysis",
            soft: "Soft Skills",
            soft_skills: {
                teamwork: "Teamwork",
                proactive: "Proactivity",
                learning: "Continuous Learning"
            }
        },
        projects: {
            title: "My Projects",
            viewProject: "View Project"
        },
        education: {
            title: "Education",
            degree: {
                sysadmin: "Systems Engineering",
                hs: "Technical Bachelor in Computing"
            }
        },
        contact: {
            title: "Contact"
        },
        footer: {
            rights: "&copy; 2025 Isaac Josue Magana Cano. All rights reserved."
        }
    }
};

let currentLang = 'es';
let allProjects = [];

document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');
    const langToggle = document.getElementById('lang-toggle');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
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

    // Cargar Proyectos
    fetch('proyectos.json')
        .then(response => response.json())
        .then(data => {
            allProjects = data.elementos;
            renderProjects();
        })
        .catch(error => {
            console.error('Error al cargar proyectos:', error);
            projectsContainer.innerHTML = '<p class="error-message">Error al cargar los proyectos. Por favor intenta más tarde.</p>';
        });
});

function updateLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations[currentLang];

        // Navegar por el objeto de traducciones
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

    // Re-renderizar proyectos para actualizar descripciones
    renderProjects();
}

function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = ''; // Limpiar contenido existente

    const categoryOrder = ['python', 'power bi', 'excel', 'sql server'];

    const projectsByType = {};
    allProjects.forEach(project => {
        const type = project.tipo.toLowerCase();
        if (!projectsByType[type]) {
            projectsByType[type] = [];
        }
        projectsByType[type].push(project);
    });

    categoryOrder.forEach(type => {
        if (projectsByType[type]) {
            renderCategory(type, projectsByType[type], projectsContainer);
        }
    });

    Object.keys(projectsByType).forEach(type => {
        if (!categoryOrder.includes(type)) {
            renderCategory(type, projectsByType[type], projectsContainer);
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
    const btnText = translations[currentLang].projects.viewProject;
    // Manejar descripción bilingüe
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
