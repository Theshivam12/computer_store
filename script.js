
// ===============================
// BYTEKART COMPUTER STORE
// Frontend interactions
// ===============================

// Change this to your real WhatsApp number.
// Use country code + number without +, spaces or dashes.
const SHOP_WHATSAPP_NUMBER = "0000000000";

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

// Current year in footer
document.getElementById("year").textContent =
    new Date().getFullYear();

// Mobile navigation
menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close mobile menu when a navigation link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    });
});

// Accessible legal modals
let previouslyFocusedElement = null;

function openModal(modal) {
    if (!modal) return;

    previouslyFocusedElement = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const closeButton = modal.querySelector(".modal-close");
    if (closeButton) closeButton.focus();
}

function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    const anyModalOpen = document.querySelector(".modal.is-open");
    if (!anyModalOpen) {
        document.body.classList.remove("modal-open");
    }

    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }
}

// Open privacy policy or terms
document.querySelectorAll("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => {
        const modalId = button.getAttribute("data-modal");
        openModal(document.getElementById(modalId));
    });
});

// Close using close button or clicking outside the dialog
document.querySelectorAll(".modal").forEach((modal) => {
    modal.querySelector(".modal-close").addEventListener("click", () => {
        closeModal(modal);
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});

// Close popup with Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const openModalElement = document.querySelector(".modal.is-open");

        if (openModalElement) {
            closeModal(openModalElement);
        }
    }
});

// Contact form: validate, then prepare WhatsApp message.
// No form information is stored by this static website.
contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    if (!contactForm.reportValidity()) {
        return;
    }

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value.trim();
    const consent = document.getElementById("consent").checked;

    // Basic phone-number validation. This does not verify ownership.
    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        formStatus.textContent =
            "Please enter a valid phone number.";
        return;
    }

    if (!consent) {
        formStatus.textContent =
            "Please agree before continuing.";
        return;
    }

    // Build plain text only. User input is never inserted as HTML.
    const whatsappMessage = [
        "Hello ByteKart Computers!",
        "",
        "I would like to make an enquiry.",
        "Name: " + name,
        "Phone: " + phone,
        "Service: " + service,
        "Message: " + (message || "No additional message")
    ].join("\n");

    const whatsappURL =
        "https://wa.me/" +
        SHOP_WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(whatsappMessage);

    // Opens WhatsApp in a new tab/window.
    const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

    if (!whatsappWindow) {
        formStatus.textContent =
            "Your browser blocked the WhatsApp window. " +
            "Please allow pop-ups and try again.";
        return;
    }

    formStatus.textContent =
        "WhatsApp opened. Review your message and send it to the store.";
});
