document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const buttons = document.querySelectorAll('.gallery-buttons button');
    let galleryItems = [];

    // Colors array and current index
    const colors = ['primary', 'secondary', 'tertiary', 'gray'];
    let colorIndex = 0;

    // Function to shuffle colors
    function shuffleColors(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Initial shuffle
    shuffleColors(colors);

    // Function to generate gallery items
    function generateGalleryItems(items) {
        galleryContainer.innerHTML = ''; // Clear existing items
        colorIndex = 0; // Reset color index
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'grid-item card fade-in';
            card.dataset.category = item.category; // Set the category as a data attribute

            const front = document.createElement('div');
            front.className = 'card-front';
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.client;
            img.loading = 'lazy';
            front.appendChild(img);

            const back = document.createElement('div');
            back.className = `card-back ${colors[colorIndex]}`; // Assign a non-repeating color class
            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = item.title;
            const client = document.createElement('div');
            client.className = 'client';
            client.textContent = `(${item.client})`;
            back.appendChild(title);
            back.appendChild(client);

            card.appendChild(front);
            card.appendChild(back);
            galleryContainer.appendChild(card);

            // Add click event to flip the card
            card.addEventListener('click', () => {
                card.classList.add('flipped');
                setTimeout(() => {
                    card.classList.remove('flipped');
                }, 5000); // 5 seconds timer to flip back
            });

            // Update color index and shuffle if all colors are used
            colorIndex++;
            if (colorIndex >= colors.length) {
                colorIndex = 0;
                shuffleColors(colors);
            }
        });
    }

    // Function to filter gallery items
    function filterGalleryItems(category) {
        galleryContainer.classList.add('fade-out'); // Add fade-out class
        setTimeout(() => {
            const filteredItems = galleryItems.filter(item => category === 'all' || item.category === category);
            generateGalleryItems(filteredItems);
            galleryContainer.classList.remove('fade-out'); // Remove fade-out class
        }, 300); // Duration of fade-out animation
    }

    // Fetch gallery data from JSON file
    fetch('assets/js/galleryData.json')
        .then(response => response.json())
        .then(data => {
            galleryItems = data;
            generateGalleryItems(galleryItems); // Generate all items initially
        })
        .catch(error => console.error('Error loading gallery data:', error));

    // Add event listeners to buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            filterGalleryItems(filter);
        });
    });

    // Floating button and info panel functionality
    const floatingButton = document.getElementById('floating-button');
    const infoPanel = document.getElementById('info-panel');

    floatingButton.addEventListener('click', () => {
        infoPanel.classList.toggle('active');
    });
});
