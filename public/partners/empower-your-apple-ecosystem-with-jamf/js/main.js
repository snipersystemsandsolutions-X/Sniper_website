// main.js
document.addEventListener('DOMContentLoaded', function () {
  // --- Desktop Solutions Dropdown ---
  const solutionsContainer = document.getElementById('solutions-menu-container');
  const solutionsDropdown = document.getElementById('solutions-menu-dropdown');
  let solutionsTimeout;

  if (solutionsContainer && solutionsDropdown) {
    solutionsContainer.addEventListener('mouseenter', () => {
      clearTimeout(solutionsTimeout);
      solutionsDropdown.classList.remove('hidden');
      const button = solutionsContainer.querySelector('button');
      if (button) {
        const icon = button.querySelector('svg');
        if (icon) icon.classList.add('rotate-180');
      }
    });

    solutionsContainer.addEventListener('mouseleave', () => {
      solutionsTimeout = setTimeout(() => {
        solutionsDropdown.classList.add('hidden');
        const button = solutionsContainer.querySelector('button');
        if (button) {
          const icon = button.querySelector('svg');
          if (icon) icon.classList.remove('rotate-180');
        }
      }, 200);
    });
  }

  // --- Mobile Menu ---
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileSolutionsButton = document.getElementById('mobile-solutions-button');
  const mobileSolutionsDropdown = document.getElementById('mobile-solutions-dropdown');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  if (mobileSolutionsButton && mobileSolutionsDropdown) {
    mobileSolutionsButton.addEventListener('click', () => {
      mobileSolutionsDropdown.classList.toggle('hidden');
      // Rotate icon
      const icon = mobileSolutionsButton.querySelector('svg');
      if (icon) {
        icon.classList.toggle('rotate-180');
      }
    });
  }

  // --- Active Nav Link Styling ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('header nav a');

  let isSolutionPage = currentPath.includes('/solutions/');

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    // Clean up hrefs for comparison
    const cleanLinkHref = linkHref.replace('../', '').replace('./', '');
    const cleanCurrentPath = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    if (cleanLinkHref === cleanCurrentPath) {
      link.classList.add('nav-link-active');
    }

    // Special case for home index.html
    if (
      (cleanCurrentPath === 'index.html' || cleanCurrentPath === '') &&
      (cleanLinkHref === 'index.html' || cleanLinkHref === '')
    ) {
      if (link.textContent.trim().toUpperCase() === 'HOME') {
        link.classList.add('nav-link-active');
      }
    }
  });

  if (isSolutionPage) {
    const solutionsButtonDesktop = document.getElementById('solutions-menu-button');
    if (solutionsButtonDesktop) solutionsButtonDesktop.classList.add('nav-link-active');
  }
});
