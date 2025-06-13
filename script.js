// Configuration for image detection
const imageConfig = {
    roll1: {
        folder: 'images/roll1/',
        extensions: ['jpg'] // 'jpeg', 'png', 'gif', 'webp']
    },
    roll2: {
        folder: 'images/roll2/',
        extensions: ['jpg'] //, 'jpeg', 'png', 'gif', 'webp']
    },
    roll3: {
        folder: 'images/roll3/',
        extensions: ['jpg'] //, 'jpeg', 'png', 'gif', 'webp']
    }
};

// Function to detect images in a folder
async function detectImagesInFolder(rollId) {
    const config = imageConfig[rollId];
    const detectedImages = [];
    
    // Common image naming patterns to try
    const namingPatterns = [
        // Numbered patterns
        (i) => `image${i}`,
        (i) => `img${i}`,
        (i) => `photo${i}`,
        (i) => `pic${i}`,
        (i) => `achievement${i}`,
        (i) => `student${i}`,
        (i) => `chess${i}`,
        (i) => `trophy${i}`,
        (i) => `medal${i}`,
        (i) => `winner${i}`,
        // Zero-padded patterns
        (i) => `image${String(i).padStart(2, '0')}`,
        (i) => `img${String(i).padStart(2, '0')}`,
        (i) => `photo${String(i).padStart(2, '0')}`,
        // Three digit patterns
        (i) => `image${String(i).padStart(3, '0')}`,
        (i) => `img${String(i).padStart(3, '0')}`,
    ];

    // Try different naming patterns and extensions
    for (let i = 1; i <= 50; i++) { // Check up to 50 images
        for (const pattern of namingPatterns) {
            for (const ext of config.extensions) {
                const filename = `${pattern(i)}.${ext}`;
                const imagePath = `${config.folder}${filename}`;
                
                if (await imageExists(imagePath)) {
                    detectedImages.push(imagePath);
                    break; // Found this number, move to next
                }
            }
            if (detectedImages.length > 0 && detectedImages[detectedImages.length - 1].includes(String(i))) {
                break; // Found this number with some pattern, move to next number
            }
        }
    }

    // Also try some common standalone names
    const commonNames = [
        'champion', 'winner', 'trophy', 'medal', 'achievement', 'success',
        'tournament', 'chess', 'student', 'victory', 'award', 'certificate',
        'competition', 'master', 'grandmaster', 'checkmate', 'king', 'queen'
    ];

    for (const name of commonNames) {
        for (const ext of config.extensions) {
            const imagePath = `${config.folder}${name}.${ext}`;
            if (await imageExists(imagePath)) {
                detectedImages.push(imagePath);
            }
        }
    }

    return detectedImages;
}

// Function to check if an image exists
function imageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

// Alternative method using fetch (more reliable but slower)
async function imageExistsWithFetch(imagePath) {
    try {
        const response = await fetch(imagePath, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// Load all detected images into rolls
async function loadAllRollingImages() {
    console.log('Starting image detection...');
    
    for (const rollId of Object.keys(imageConfig)) {
        console.log(`Detecting images for ${rollId}...`);
        
        const images = await detectImagesInFolder(rollId);
        console.log(`Found ${images.length} images in ${rollId}:`, images);
        
        if (images.length > 0) {
            const rollTrack = document.getElementById(rollId);
            if (rollTrack) {
                // Create images twice for seamless loop
                const doubledImages = [...images, ...images];
                
                rollTrack.innerHTML = doubledImages.map(src => 
                    `<img src="${src}" alt="Student Achievement" loading="lazy">`
                ).join('');
            }
        } else {
            console.warn(`No images found for ${rollId}`);
            // Load placeholder if no images found
            loadPlaceholderImages(rollId);
        }
    }
    
    console.log('Image detection completed');
}

// Fallback: Load placeholder images if no real images found
function loadPlaceholderImages(rollId) {
    const rollTrack = document.getElementById(rollId);
    if (rollTrack) {
        const placeholders = [
            `https://via.placeholder.com/300x200/f39c12/ffffff?text=${rollId.toUpperCase()}+Achievement+1`,
            `https://via.placeholder.com/300x200/e74c3c/ffffff?text=${rollId.toUpperCase()}+Achievement+2`,
            `https://via.placeholder.com/300x200/27ae60/ffffff?text=${rollId.toUpperCase()}+Achievement+3`,
            `https://via.placeholder.com/300x200/3498db/ffffff?text=${rollId.toUpperCase()}+Achievement+4`
        ];
        
        const doubledPlaceholders = [...placeholders, ...placeholders];
        rollTrack.innerHTML = doubledPlaceholders.map(src => 
            `<img src="${src}" alt="Achievement Placeholder" loading="lazy">`
        ).join('');
    }
}

// Image modal functionality
function createImageModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="" alt="Achievement" id="modal-image">
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close-modal').onclick = () => {
        modal.style.display = 'none';
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };

    return modal;
}

// Add click handlers for images
function addImageClickHandlers() {
    const modal = createImageModal();
    const modalImage = document.getElementById('modal-image');

    // Use event delegation for dynamically loaded images
    document.addEventListener('click', (e) => {
        if (e.target.matches('.roll-track img')) {
            modalImage.src = e.target.src;
            modal.style.display = 'flex';
        }
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing Chess Academy website...');
    
    // Load all rolling images
    await loadAllRollingImages();
    
    // Add image click handlers
    addImageClickHandlers();

    // Mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    console.log('Website initialization completed');
});

document.addEventListener('DOMContentLoaded', async function() {
    // ... your existing code ...

    // Start Your Journey button functionality
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    const coursesSection = document.getElementById('courses');
    
    if (startJourneyBtn && coursesSection) {
        startJourneyBtn.addEventListener('click', () => {
            coursesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // ... rest of your existing code ...
});

