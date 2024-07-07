document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');

    // Function to generate gallery items
    function generateGalleryItems(items) {
        galleryContainer.innerHTML = ''; // Clear existing items
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'grid-item card';

            const front = document.createElement('div');
            front.className = 'card-front';
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;
            img.loading = 'lazy';
            front.appendChild(img);

            const back = document.createElement('div');
            back.className = 'card-back';
            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = item.title;
            back.appendChild(title);

            card.appendChild(front);
            card.appendChild(back);
            galleryContainer.appendChild(card);

            card.addEventListener('click', () => {
                card.classList.add('flipped');
                setTimeout(() => {
                    card.classList.remove('flipped');
                }, 3000); // 5 seconds timer to flip back
            });
        });
    }

    // Fetch gallery data from JSON file
    fetch('assets/js/galleryData.json')
        .then(response => response.json())
        .then(data => {
            generateGalleryItems(data);
        })
        .catch(error => console.error('Error loading gallery data:', error));
});
