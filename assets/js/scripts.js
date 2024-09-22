document.addEventListener('DOMContentLoaded', async () => {
    // Constants
    const FLIP_DURATION = 5000;
    const TYPING_SPEED = 100;
    const TYPING_DELAY = 1000;
    const TYPING_FINISH_DELAY = 700;

    // DOM Elements
    const galleryContainer = document.getElementById('gallery-container');
    const buttons = document.querySelectorAll('.gallery-buttons button');
    const floatingButton = document.getElementById('floating-button');
    const infoPanel = document.getElementById('info-panel');
    const typedTagline = document.getElementById("typed-tagline");

    // State
    let galleryItems = [];
    const colors = ['primary', 'secondary', 'accent', 'anthracite'];
    let colorIndex = 0;

    // Functions
    const shuffleColors = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const createCardElement = (item) => {
        const card = document.createElement('div');
        card.className = 'grid-item card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Poglej podrobnosti projekta ${item.title}`);
        card.dataset.category = item.category;

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.loading = 'lazy';
        cardFront.appendChild(img);

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

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        return card;
    };

    const addCardEventListeners = (card) => {
        const flipCard = () => {
            if (!card.classList.contains('flipped')) {
                card.classList.add('flipped');
                setTimeout(() => {
                    card.classList.remove('flipped');
                }, FLIP_DURATION);
            }
        };

        card.addEventListener('click', flipCard);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                flipCard();
            }
        });
    };

    const generateGalleryItems = (items) => {
        galleryContainer.innerHTML = '';
        colorIndex = 0;
        items.forEach(item => {
            const card = createCardElement(item);
            addCardEventListeners(card);
            galleryContainer.appendChild(card);

            colorIndex++;
            if (colorIndex >= colors.length) {
                colorIndex = 0;
                shuffleColors(colors);
            }
        });
    };

    const filterGalleryItems = (category) => {
        const filteredItems = galleryItems.filter(item => category === 'all' || item.category === category);
        generateGalleryItems(filteredItems);
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const typeWriter = async (text) => {
        for (let i = 0; i <= text.length; i++) {
            typedTagline.innerHTML = text.substring(0, i) + '<span aria-hidden="true"></span>';
            await sleep(TYPING_SPEED);
        }
        await sleep(TYPING_FINISH_DELAY);
    };

    const startTyping = async () => {
        const tagline = "... igriv dizajn z domišljijo...";
        await typeWriter(tagline);
    };

    // Event Listeners
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            filterGalleryItems(filter);
        });
    });

    const toggleFloatingButton = () => {
        infoPanel.classList.toggle('active');
        floatingButton.classList.toggle('expanded');
    };

    floatingButton.addEventListener('click', toggleFloatingButton);
    floatingButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            toggleFloatingButton();
        }
    });

    // Initialization
    try {
        shuffleColors(colors);

        const response = await fetch('assets/js/galleryData.json');
        galleryItems = await response.json();
        generateGalleryItems(galleryItems);

        await sleep(TYPING_DELAY);
        await startTyping();
    } catch (error) {
        console.error('Napaka pri inicializaciji:', error);
    }
});
