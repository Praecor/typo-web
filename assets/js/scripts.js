document.addEventListener( 'DOMContentLoaded', async () => {
    /*==================== Constants ====================*/
    const FLIP_DURATION = 3000; // Duration (ms) for card flip animation
    const TYPING_SPEED = 100; // Typing speed (ms) per character
    const TYPING_DELAY = 1000; // Initial delay (ms) before typing starts
    const TYPING_FINISH_DELAY = 700; // Delay (ms) after typing finishes

    /*==================== DOM Elements ====================*/
    const galleryContainer = document.getElementById( 'gallery-container' );
    const filterButtons = document.querySelectorAll( '.gallery-buttons button' );
    const floatingButton = document.getElementById( 'floating-button' );
    const infoPanel = document.getElementById( 'info-panel' );
    const typedTagline = document.getElementById( 'typed-tagline' );

    /*==================== State ====================*/
    let galleryItems = [];
    const colorClasses = [ 'primary', 'accent', 'anthracite', 'blue' ];
    let currentColorIndex = 0;

    /*==================== Utility Functions ====================*/

    /**
     * Shuffles an array in place
     * @param {Array} array - The array to shuffle.
     */
    const shuffleArray = ( array ) => {
        for ( let i = array.length - 1; i > 0; i-- ) {
            const j = Math.floor( Math.random() * ( i + 1 ) );
            [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
        }
    };

    /**
     * Creates and returns a DOM element with specified attributes and children.
     * @param {string} tag - The HTML tag name.
     * @param {Object} attributes - Key-value pairs of attributes.
     * @param  {...any} children - Child nodes or strings.
     * @returns {HTMLElement} The created DOM element.
     */
    const createElement = ( tag, attributes = {}, ...children ) => {
        const element = document.createElement( tag );
        for ( const [ attr, value ] of Object.entries( attributes ) ) {
            if ( attr.startsWith( 'data-' ) ) {
                element.dataset[ attr.slice( 5 ) ] = value;
            } else if ( attr === 'className' ) {
                element.className = value;
            } else {
                element.setAttribute( attr, value );
            }
        }
        children.forEach( child => {
            if ( typeof child === 'string' ) {
                element.appendChild( document.createTextNode( child ) );
            } else if ( child instanceof HTMLElement ) {
                element.appendChild( child );
            }
        } );
        return element;
    };

    /**
     * Delays execution for a specified number of milliseconds.
     * @param {number} ms - Milliseconds to sleep.
     * @returns {Promise} A promise that resolves after the delay.
     */
    const sleep = ( ms ) => new Promise( resolve => setTimeout( resolve, ms ) );

    /*==================== Core Functions ====================*/

    /**
     * Generates and appends gallery card elements based on provided items.
     * @param {Array} items - Array of gallery item objects.
     */
    const generateGallery = ( items ) => {
        galleryContainer.innerHTML = '';
        currentColorIndex = 0;

        items.forEach( item => {
            const card = createGalleryCard( item );
            addCardEventListeners( card );
            galleryContainer.appendChild( card );

            currentColorIndex++;
            if ( currentColorIndex >= colorClasses.length ) {
                currentColorIndex = 0;
                shuffleArray( colorClasses );
            }
        } );
    };

    /**
     * Creates a gallery card element for a given item.
     * @param {Object} item - The gallery item data.
     * @returns {HTMLElement} The gallery card element.
     */
    const createGalleryCard = ( item ) => {
        const cardFront = createElement( 'div', { className: 'card-front' },
            createElement( 'img', { src: item.image, alt: item.title, loading: 'lazy' } )
        );

        const cardBack = createElement( 'div', { className: `card-back ${colorClasses[ currentColorIndex ]}` },
            createElement( 'div', { className: 'title' }, item.title ),
            createElement( 'div', { className: 'client' }, item.client )
        );

        const cardInner = createElement( 'div', { className: 'card-inner' }, cardFront, cardBack );

        const card = createElement( 'div', {
            className: 'grid-item card',
            tabindex: '0',
            role: 'button',
            'aria-label': `Podrobnosti ${item.title}`,
            'data-category': item.category
        }, cardInner );

        return card;
    };

    /**
     * Adds event listeners to a gallery card for flip interaction.
     * @param {HTMLElement} card - The gallery card element.
     */
    const addCardEventListeners = ( card ) => {
        let flipTimer;

        const flipCard = () => {
            if ( card.classList.contains( 'flipped' ) ) {
                // If card is flipped, turn it back immediately
                card.classList.remove( 'flipped' );
                clearTimeout( flipTimer );
            } else {
                // If card is not flipped, flip it and set a timer
                card.classList.add( 'flipped' );
                flipTimer = setTimeout( () => {
                    card.classList.remove( 'flipped' );
                }, FLIP_DURATION );
            }
        };

        card.addEventListener( 'click', flipCard );
        card.addEventListener( 'keydown', ( e ) => {
            if ( e.key === 'Enter' || e.key === ' ' ) {
                e.preventDefault();
                flipCard();
            }
        } );
    };

    /**
     * Filters gallery items based on category and regenerates the gallery.
     * @param {string} category - The category to filter by.
     */
    const filterGallery = ( category ) => {
        const filteredItems = galleryItems.filter( item => category === 'all' || item.category === category );
        generateGallery( filteredItems );
    };

    /**
     * Types out a given text into the typedTagline element with a typewriter effect.
     * @param {string} text - The text to type out.
     */
    const typeWriterEffect = async ( text ) => {
        for ( let i = 0; i <= text.length; i++ ) {
            typedTagline.innerHTML = `${text.substring( 0, i )}<span aria-hidden="true"></span>`;
            await sleep( TYPING_SPEED );
        }
        await sleep( TYPING_FINISH_DELAY );
    };

    /**
     * Initiates the typewriter effect with the predefined tagline.
     */
    const startTypewriter = async () => {
        const tagline = "... igriv dizajn z domišljijo...";
        await typeWriterEffect( tagline );
    };

    /**
     * Toggles the expansion state of the floating button and its info panel.
     */
    const toggleFloatingButton = () => {
        infoPanel.classList.toggle( 'active' );
        floatingButton.classList.toggle( 'expanded' );
    };

    /**
     * Attempts to open the LinkedIn app if installed, otherwise falls back to the web URL.
     * @param {Event} event - The click event.
     */
    const openLinkedInApp = ( event ) => {
        event.preventDefault();
        const appUrl = "linkedin://profile/sanjahadjur";
        const webUrl = "https://si.linkedin.com/in/sanjahadjur";

        // Try to open the app
        window.location.href = appUrl;

        // Fallback to web URL after a short delay
        setTimeout(() => {
            window.location.href = webUrl;
        }, 500);
    };

    /*==================== Event Listeners ====================*/

    // Handle filter button clicks
    filterButtons.forEach( button => {
        button.addEventListener( 'click', () => {
            // Remove 'active' class from all buttons and add to the clicked one
            filterButtons.forEach( btn => btn.classList.remove( 'active' ) );
            button.classList.add( 'active' );

            // Filter gallery items based on the selected category
            const filterCategory = button.getAttribute( 'data-filter' );
            filterGallery( filterCategory );
        } );
    } );

    // Handle floating button interactions
    floatingButton.addEventListener( 'click', toggleFloatingButton );
    floatingButton.addEventListener( 'keydown', ( e ) => {
        if ( e.key === 'Enter' || e.key === ' ' ) {
            e.preventDefault();
            toggleFloatingButton();
        }
    } );

    // Add event listener to LinkedIn link
    document.getElementById('linkedin-link').addEventListener('click', openLinkedInApp);

    /*==================== Initialization ====================*/
    try {
        // Shuffle color classes to randomize card backgrounds
        shuffleArray( colorClasses );

        // Fetch gallery data and generate gallery
        const response = await fetch( 'assets/js/galleryData.json' );
        if ( !response.ok ) throw new Error( `HTTP error! Status: ${response.status}` );
        galleryItems = await response.json();
        generateGallery( galleryItems );

        // Start the typewriter effect after a delay
        await sleep( TYPING_DELAY );
        await startTypewriter();
    } catch ( error ) {
        console.error( 'Initialization Error:', error );
    }
} );