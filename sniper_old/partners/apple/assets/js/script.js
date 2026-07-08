// Hero Slider
const sliderContainer = document.getElementById('slider-container');
const sliderDots = document.getElementById('slider-dots').children;
let currentSlide = 0;
const totalSlides = 6;

function updateSlider() {
  sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
  Array.from(sliderDots).forEach((dot, index) => {
    if (index === currentSlide) {
      dot.classList.add('w-8', 'bg-red');
      dot.classList.remove('bg-opacity-50');
    } else {
      dot.classList.remove('w-8', 'bg-red');
      dot.classList.add('bg-opacity-50');
    }
  });
}

document.getElementById('prev-slide').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
});

document.getElementById('next-slide').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
});

Array.from(sliderDots).forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlide = index;
    updateSlider();
  });
});
// Auto-advance slider
setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}, 7000);

// Paths Slider
const pathsSlider = document.getElementById('paths-slider');
const pathDots = document.getElementById('path-dots').children;
let currentPath = 0;
const totalPaths = 4;

function updatePaths() {
  pathsSlider.style.transform = `translateX(-${currentPath * 100}%)`;
  Array.from(pathDots).forEach((dot, index) => {
    if (index === currentPath) {
      dot.classList.add('w-8', 'bg-gray-800');
      dot.classList.remove('bg-gray-300');
    } else {
      dot.classList.remove('w-8', 'bg-gray-800');
      dot.classList.add('bg-gray-300');
    }
  });
}

document.getElementById('prev-path').addEventListener('click', () => {
  currentPath = (currentPath - 1 + totalPaths) % totalPaths;
  updatePaths();
});

document.getElementById('next-path').addEventListener('click', () => {
  currentPath = (currentPath + 1) % totalPaths;
  updatePaths();
});

Array.from(pathDots).forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentPath = index;
    updatePaths();
  });
});

// Auto-advance paths
setInterval(() => {
  currentPath = (currentPath + 1) % totalPaths;
  updatePaths();
}, 7000);

// Mobile Menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'fixed inset-0 z-50 bg-white transform translate-x-full transition-transform duration-300 ease-in-out md:hidden';
document.body.appendChild(mobileMenu);

mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('translate-x-full');
});
mobileMenu.innerHTML = `
    <div class="flex justify-end p-6">
      <button class="text-gray-800 hover:text-gray-600 focus:outline-none" onclick="this.closest('.fixed').classList.add('translate-x-full')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
    <nav class="px-6 py-4 space-y-4">
      <a href="index.html" class="block text-gray-800 font-medium py-2 hover:text-gray-600">Home</a>
      
      <!-- Products Dropdown -->
      <div class="relative">
        <button onclick="toggleDropdown('productsDropdown')" class="flex items-center justify-between w-full text-left text-gray-800 font-medium py-2">
          Products
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        <div id="productsDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
          <!-- iPhone Dropdown -->
          <div class="relative">
            <button onclick="toggleDropdown('productsIphoneDropdown')" class="flex items-center justify-between w-full text-left py-2 text-gray-600 hover:text-gray-900">
              iPhone
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
            <div id="productsIphoneDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
              <a href="ipone17_pro.html" class="block py-2 text-gray-600 hover:text-gray-900">iPhone 17 Pro</a>
              <a href="iphone17_air.html" class="block py-2 text-gray-600 hover:text-gray-900">iPhone 17 Air</a>
              <a href="iphone17.html" class="block py-2 text-gray-600 hover:text-gray-900">iPhone 17</a>
             <a href="iPhone-16/index.html" class="block py-2 text-gray-600 hover:text-gray-900">iPhone 16</a>
             <a href="iPhone-16e/index.html" class="block py-2 text-gray-600 hover:text-gray-900">iPhone 16e</a>
        

             
            </div>
          </div>
          
          <!-- Mac Dropdown -->
          <div class="relative">
            <button onclick="toggleDropdown('productsMacDropdown')" class="flex items-center justify-between w-full text-left py-2 text-gray-600 hover:text-gray-900">
              Mac
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
            <div id="productsMacDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
              <a href="MacBook-Air-M4/mac-book-M4.html" class="block py-2 text-gray-600 hover:text-gray-900">MacBook Air M4</a>
              <a href="Macbook_pro_M5.html" class="block py-2 text-gray-600 hover:text-gray-900">MacBook Pro M5</a>
              <a href="iMac/index.html" class="block py-2 text-gray-600 hover:text-gray-900">iMac</a>
              <a href="Mac-Mini/mac-mini.html" class="block py-2 text-gray-600 hover:text-gray-900">Mac mini</a>
              <a href="Mac-Studio/max-studio.html" class="block py-2 text-gray-600 hover:text-gray-900">Mac Studio</a>
            </div>
          </div>
          
          <!-- iPad Dropdown -->
          <div class="relative">
            <button onclick="toggleDropdown('productsIpadDropdown')" class="flex items-center justify-between w-full text-left py-2 text-gray-600 hover:text-gray-900">
              iPad
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
            <div id="productsIpadDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
              <a href="ipad_pro_m5.html" class="block py-2 text-gray-600 hover:text-gray-900">iPad
                  Pro M5</a>
              <a href="iPad-air/ipad-air.html" class="block py-2 text-gray-600 hover:text-gray-900">iPad
                  Air M3</a>
              <a href="ipad-A16/ipad-A16.html" class="block py-2 text-gray-600 hover:text-gray-900">iPad</a>
              <a href="iPad-mini/ipad-mini.html" class="block py-2 text-gray-600 hover:text-gray-900">iPad mini</a>
            </div>
          </div>
          
          <!-- Accessories Dropdown -->
         
          
          <a href="apple-care-plus.html" class="block py-2 text-gray-600 hover:text-gray-900">Apple Care +</a>
          <a href="apple-care-plus-enterprise.html" class="block py-2 text-gray-600 hover:text-gray-900">Apple Care for Enterprise</a>
        </div>
      </div>
      
      <!-- Services Dropdown -->
      <div class="relative">

        <button onclick="toggleDropdown('servicesDropdown')" class="flex items-center justify-between w-full text-left text-gray-800 font-medium py-2">
          Services
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <div id="servicesDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
          <!-- Value Added Services Dropdown -->
         <a href="deployment-page.html" class="block py-2 text-gray-600 hover:text-gray-900">Deployment Services</a>
          
          
          
          <a href="lifecycle-management.html" class="block py-2 text-gray-600 hover:text-gray-900">Life Cycle Management</a>
          <a href="business-manager.html" class="block py-2 text-gray-600 hover:text-gray-900">Apple Business Manager</a>



<!-- Fusion Combos Dropdown -->
          <div class="relative">
            <button onclick="toggleDropdown('servicesFusionDropdown')" class="flex items-center justify-between w-full text-left py-2 text-gray-600 hover:text-gray-900">
             Value added Service
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
            <div id="servicesFusionDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
             
              <a href="service%20&%20deployment-bundles.html" class="block py-2 text-gray-600 hover:text-gray-900">Service & Deployment bundles</a>
            
              <a href="fusion-combos.html" class="block py-2 text-gray-600 hover:text-gray-900">Fusion Combo</a>
            </div>
          </div>


        </div>
      </div>
      
      <!-- Programs Dropdown -->
      <div class="relative">
        <button onclick="toggleDropdown('programsDropdown')" class="flex items-center justify-between w-full text-left text-gray-800 font-medium py-2">
          Programs
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        <div id="programsDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
          <a href="start-up-program.html" class="block py-2 text-gray-600 hover:text-gray-900">Mac for Startups</a>
          <a href="switcher-program.html" class="block py-2 text-gray-600 hover:text-gray-900">Switchto Mac</a>
          <a href="developer-program.html" class="block py-2 text-gray-600 hover:text-gray-900">Mac for Developers</a>
          <a href="refresh-program.html" class="block py-2 text-gray-600 hover:text-gray-900">Refresh Program</a>
        </div>
      </div>
      
      <a href="apple-smartEPP.html" class="block text-gray-800 font-medium py-2 hover:text-gray-600">Smart EPP</a>
      <a href="https://sniperindia.com/contact/" class="block text-gray-800 font-medium py-2 hover:text-gray-600">Contact Us</a>
    </nav>
`;

// Toggle Function (add below the innerHTML assignment or in a <script> tag)
function toggleDropdown(id) {
  const el = document.getElementById(id);
  el.classList.toggle('hidden');
}



// Image Carousel
let index = 0;
const images = document.querySelectorAll('.carousel-img');
const indicators = document.querySelectorAll('.carousel-indicator');

function updateCarousel() {
  // Update images
  images.forEach((img, i) => {
    if (i === index) {
      img.classList.add('opacity-100', 'scale-100');
      img.classList.remove('opacity-0', 'scale-105');
    } else {
      img.classList.add('opacity-0', 'scale-105');
      img.classList.remove('opacity-100', 'scale-100');
    }
  });

  // Update indicators
  indicators.forEach((indicator, i) => {
    if (i === index) {
      indicator.classList.add('opacity-100');
      indicator.classList.add('bg-red-500');
      indicator.classList.remove('bg-white');
    } else {
      indicator.classList.remove('opacity-100');
      indicator.classList.remove('bg-red-500');
      indicator.classList.add('bg-white');
    }
  });

  index = (index + 1) % images.length;
}

// Add click events to indicators
indicators.forEach((indicator, i) => {
  indicator.addEventListener('click', () => {
    index = i;
    updateCarousel();
  });
});

// Start automatic rotation
setInterval(updateCarousel, 2400);

// Stats Counter Animation
document.addEventListener('DOMContentLoaded', function () {
  const counters = document.querySelectorAll('.timer');

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-to');
    const duration = 2000;
    let startTime = null;

    const animateCounter = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.floor(easedProgress * target);

      counter.innerText = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        counter.innerText = target;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(animateCounter);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
});