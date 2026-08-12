/* ==========================================================================
   DAWSON LANDSCAPING & MAINTENANCE - INTERACTIVE LOGIC & TAB ROUTER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initBeforeAfterSlider();
    initCalculator();
});

// Navigation Switcher & Smooth Tab Router
function switchTab(event, targetSectionId) {
    if (event) event.preventDefault();

    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    // Highlight clicked link
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Smooth scroll to section
    const targetElement = document.getElementById(targetSectionId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Close mobile nav if open
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
}

// Mobile Navigation Toggle
function initMobileNav() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }
}

// Interactive Before & After Slider Logic
function initBeforeAfterSlider() {
    const slider = document.getElementById('baSlider');
    const afterContainer = document.getElementById('baAfterContainer');
    const handle = document.getElementById('baHandle');

    if (!slider || !afterContainer || !handle) return;

    let isDragging = false;

    const moveSlider = (x) => {
        const rect = slider.getBoundingClientRect();
        let posX = x - rect.left;
        if (posX < 0) posX = 0;
        if (posX > rect.width) posX = rect.width;

        const percentage = (posX / rect.width) * 100;
        afterContainer.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
    };

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e.clientX);
    });

    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        moveSlider(e.touches[0].clientX);
    });
}

// Calculator Logic
let calcState = {
    basePrice: 4500,
    multiplier: 1
};

function selectCalcOption(element, category, name, value) {
    const parent = element.parentElement;
    parent.querySelectorAll('.calc-option-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');

    if (category === 'type') {
        calcState.basePrice = value;
    } else if (category === 'size') {
        calcState.multiplier = value;
    }

    updatePriceDisplay();
}

function updatePriceDisplay() {
    const priceDisplay = document.getElementById('calcPriceDisplay');
    if (!priceDisplay) return;

    const minEstimate = Math.round(calcState.basePrice * calcState.multiplier);
    const maxEstimate = Math.round(minEstimate * 1.35);

    priceDisplay.textContent = `$${minEstimate.toLocaleString()} - $${maxEstimate.toLocaleString()} AUD`;
}

// Modal Handlers
function openQuoteModal(serviceName = 'General Inquiry') {
    const modal = document.getElementById('quoteModal');
    const modalTitle = document.getElementById('modalTitle');
    const serviceInput = document.getElementById('modal-service-name');

    if (modal) {
        modal.style.display = 'flex';
        if (modalTitle) modalTitle.textContent = `Get Quote: ${serviceName}`;
        if (serviceInput) serviceInput.value = serviceName;
        trackGAEvent('open_quote_modal', serviceName);
    }
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (modal) modal.style.display = 'none';
}

// Form Submission & GA4 Conversion Tracking Simulation
function handleFormSubmit(event, formName) {
    event.preventDefault();

    trackGAEvent('generate_lead', formName);
    closeQuoteModal();
    showToast('Thank You! Quote Request Received', 'Our Perth team will call you back within 2 hours with your free quote.');
    event.target.reset();
}

function showToast(title, message) {
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMsg = document.getElementById('toastMessage');

    if (toast && toastTitle && toastMsg) {
        toastTitle.textContent = title;
        toastMsg.textContent = message;
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 5000);
    }
}

// GA4 Tracking Simulation
function trackGAEvent(eventName, label) {
    console.log(`[GA4 Event Fired]: Event = ${eventName}, Label = ${label}`);

    if (typeof gtag === 'function') {
        gtag('event', eventName, {
            'event_category': 'Engagement',
            'event_label': label,
            'value': 1
        });
    }
}
