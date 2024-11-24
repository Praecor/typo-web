document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.getElementById('projects-container');

    /*==================== Utility Functions ====================*/

    /**
     * Creates and returns a DOM element with specified attributes and children.
     * @param {string} tag - The HTML tag name.
     * @param {Object} attributes - Key-value pairs of attributes.
     * @param  {...any} children - Child nodes or strings.
     * @returns {HTMLElement} The created DOM element.
     */
    const createElement = (tag, attributes = {}, ...children) => {
        const element = document.createElement(tag);
        for (const [attr, value] of Object.entries(attributes)) {
            if (attr.startsWith('data-')) {
                element.dataset[attr.slice(5)] = value;
            } else if (attr === 'className') {
                element.className = value;
            } else if (attr === 'href' && tag === 'button') {
                element.onclick = () => window.location.href = value;
            } else {
                element.setAttribute(attr, value);
            }
        }
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
        return element;
    };

    /**
     * Creates a project card element for a given project.
     * @param {Object} project - The project data.
     * @returns {HTMLElement} The project card element.
     */
    const createProjectCard = (project) => {
        const card = createElement('div', { className: 'project-card' });

        const imageContainer = createElement('div', { className: 'project-image' },
            createElement('img', { src: project.image, alt: project.title })
        );

        const contentContainer = createElement('div', { className: 'project-content' },
            createElement('h3', { className: 'project-title' }, project.title),
            createElement('p', { className: 'project-content-text' }, project.content),
            createElement('p', { className: 'project-description' }, project.description),
            createElement('p', { className: 'project-hashtags' }, project.hashtags.join(' ')),
            createElement('button', { className: `project-button ${project['button-color']}`, href: project.url }, project.button)
        );

        card.appendChild(imageContainer);
        card.appendChild(contentContainer);

        return card;
    };

    /**
     * Fetches project data from the JSON file.
     * @returns {Promise<Array>} A promise that resolves to an array of project data.
     */
    const fetchProjects = async () => {
        try {
            const response = await fetch('assets/js/project-data.json');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    };

    /**
     * Renders project cards and appends them to the projects container.
     */
    const renderProjects = async () => {
        const projects = await fetchProjects();
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsContainer.appendChild(projectCard);
        });
    };

    renderProjects();
});
