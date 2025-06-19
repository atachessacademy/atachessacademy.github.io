document.addEventListener('DOMContentLoaded', async function() {
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
});

