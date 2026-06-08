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
  <a href="#" class="block text-gray-800 font-medium py-2 hover:text-gray-600">Home</a>
  
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
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">iPhone 15 Pro</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">iPhone 15</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">iPhone 14</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">iPhone 13</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">iPhone SE</a>
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
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">MacBook Air</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">MacBook Pro</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">iMac</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Mac mini</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Mac Studio</a>
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
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">iPad Pro</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">iPad Air</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">iPad</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">iPad mini</a>
        </div>
      </div>
      
      <!-- Accessories Dropdown -->
      <div class="relative">
        <button onclick="toggleDropdown('productsAccessoriesDropdown')" class="flex items-center justify-between w-full text-left py-2 text-gray-600 hover:text-gray-900">
          Accessories
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
        <div id="productsAccessoriesDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Apple Watch</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Air pods</a>
        </div>
      </div>
      
      <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Add Apple Care +</a>
      <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">ACE</a>
    </div>
  </div>
  
  <!-- Services Dropdown -->
  <div class="relative">
    <button onclick="toggleDropdown('servicesDropdown')" class="flex items-center justify-between w-full text-left text-gray-800 font-medium py-2">
      Solutions
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
    <div id="servicesDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
      <!-- Value Added Services Dropdown -->
      <div class="relative">
        <button onclick="toggleDropdown('servicesValueDropdown')" class="flex items-center justify-between w-full text-left py-2 text-gray-600 hover:text-gray-900">
          Value Added Services
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
        <div id="servicesValueDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Deployment Service</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Apple Centric Solutions</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Training programs</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">XXXXXXXX</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">XXXXXXXX</a>
        </div>
      </div>
      
      <!-- Fusion Combos Dropdown -->
      <div class="relative">
        <button onclick="toggleDropdown('servicesFusionDropdown')" class="flex items-center justify-between w-full text-left py-2 text-gray-600 hover:text-gray-900">
          Fusion Combos
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
        <div id="servicesFusionDropdown" class="pl-4 border-l-2 border-gray-100 space-y-2 hidden">
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">XXXXXXXX</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">XXXXXXXX</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">XXXXXXXX</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">XXXXXXXX</a>
          <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">XXXXXXXX</a>
        </div>
      </div>
      
      <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Life Cycle Management</a>
      <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Device protection plan</a>
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
      <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Mac for Startups</a>
      <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Switch from PC to Mac</a>
      <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Mac for Developers</a>
      <a href="#" class="block py-2 text-gray-600 hover:text-gray-900">Refresh Program</a>
    </div>
  </div>
  
  <a href="#" class="block text-gray-800 font-medium py-2 hover:text-gray-600">Smart EPP</a>
  <a href="#" class="block text-gray-800 font-medium py-2 hover:text-gray-600">Contact Us</a>
</nav>
`;
// Toggle Function (add below the innerHTML assignment or in a <script> tag)
function toggleDropdown(id) {
  const el = document.getElementById(id);
  el.classList.toggle('hidden');
}