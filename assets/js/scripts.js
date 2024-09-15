document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const buttons = document.querySelectorAll('.gallery-buttons button');
    let galleryItems = [];

    const colors = ['primary', 'secondary', 'accent', 'gray'];
    let colorIndex = 0;

    function shuffleColors(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleColors(colors);

    function generateGalleryItems(items) {
        galleryContainer.innerHTML = '';
        colorIndex = 0;
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'grid-item card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Poglej podrobnosti projekta ${item.title}`);
            card.dataset.category = item.category;

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;
            img.loading = 'lazy';

            const cardBack = document.createElement('div');
            cardBack.className = `card-back ${colors[colorIndex]}`;

            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = item.title;

            const client = document.createElement('div');
            client.className = 'client';
            client.textContent = item.client;

            cardBack.appendChild(title);
            cardBack.appendChild(client);

            card.appendChild(img);
            card.appendChild(cardBack);
            galleryContainer.appendChild(card);

            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    card.classList.toggle('flipped');
                }
            });

            colorIndex++;
            if (colorIndex >= colors.length) {
                colorIndex = 0;
                shuffleColors(colors);
            }
        });
    }

    function filterGalleryItems(category) {
        const filteredItems = galleryItems.filter(item => category === 'all' || item.category === category);
        generateGalleryItems(filteredItems);
    }

    fetch('assets/js/galleryData.json')
        .then(response => response.json())
        .then(data => {
            galleryItems = data;
            generateGalleryItems(galleryItems);
        })
        .catch(error => console.error('Napaka pri nalaganju galerijskih podatkov:', error));

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            filterGalleryItems(filter);
        });
    });

    const floatingButton = document.getElementById('floating-button');
    const infoPanel = document.getElementById('info-panel');

    floatingButton.addEventListener('click', () => {
        infoPanel.classList.toggle('active');
    });

    floatingButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            infoPanel.classList.toggle('active');
        }
    });
});
