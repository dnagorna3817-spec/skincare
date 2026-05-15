const nav = document.querySelector(".nav");
const navLinks = [...document.querySelectorAll(".nav nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = document.querySelectorAll(".reveal");
const buttons = document.querySelectorAll(".button-animated, .product-card button, .arrow");
const productCards = [...document.querySelectorAll(".product-card")];
const carouselButtons = document.querySelectorAll("[data-carousel]");

const setActiveProduct = (index) => {
  productCards.forEach((card, cardIndex) => {
    card.classList.toggle("is-active", cardIndex === index);
  });
};

let activeProduct = productCards.findIndex((card) => card.classList.contains("is-active"));
if (activeProduct < 0) activeProduct = 0;

setActiveProduct(activeProduct);

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 24);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 55, 260)}ms`;
  revealObserver.observe(item);
});

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-42% 0px -48% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");

    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    button.appendChild(ripple);

    window.setTimeout(() => {
      ripple.remove();
    }, 700);
  });
});

carouselButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.carousel === "next" ? 1 : -1;
    activeProduct = (activeProduct + direction + productCards.length) % productCards.length;
    setActiveProduct(activeProduct);
  });
});

productCards.forEach((card, index) => {
  card.addEventListener("mouseenter", () => {
    activeProduct = index;
    setActiveProduct(activeProduct);
  });
});

document.querySelectorAll(".product-card button").forEach((button) => {
  button.addEventListener("click", () => {
    const originalText = button.textContent;

    button.textContent = "Added";
    button.disabled = true;

    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1200);
  });
});
