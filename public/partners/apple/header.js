// header-loader.js - Fixed version with working mobile submenus

function loadHeader() {
    // Header CSS Styles
    const headerCSS = `
        <style>
        /* General Body Style */
        body {
            font-family: sans-serif;
            padding-top: 90px;
        }

        /* --- HEADER & NAVIGATION BAR --- */
        header {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            height: 90px;
        }

        .navbar {
            height: 90px;
            padding: 0;
        }

        .navbar-brand img {
            max-height: 55px;
            width: auto;
        }

        /* --- DESKTOP NAVIGATION --- */
        @media (min-width: 992px) {
            .desktop-nav {
                display: flex !important;
            }

            .mobile-nav-toggler,
            .offcanvas {
                display: none !important;
            }

            .desktop-nav .nav-link {
                text-transform: capitalize;
                font-size: 1.1rem;
                padding: 1rem 1.2rem;
            }

            /* Main Dropdown Container */
            .desktop-nav .dropdown {
                position: relative;
            }

            .desktop-nav .dropdown-menu {
                display: block;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
                top: 100%;
                border-top: 0.3rem solid #E31922;
                margin-top: 0;
                width: 230px;
            }

            /* Show dropdown on hover */
            .desktop-nav .dropdown:hover>.dropdown-menu {
                opacity: 1;
                visibility: visible;
            }

            .dropdown-item {
                padding: 0.6rem 1.2rem !important;
                font-size: 1.05rem !important;
                white-space: normal;
            }

            /* Nested Submenu */
            .submenu {
                position: absolute;
                left: 100%;
                top: -0.3rem;
                display: block;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .has-submenu {
                position: relative;
            }

            /* Show submenu on hover */
            .has-submenu:hover>.submenu {
                opacity: 1;
                visibility: visible;
            }

            .has-submenu>.dropdown-item::after {
                content: '›';
                font-size: 1.3rem;
                position: absolute;
                top: 50%;
                right: 12px;
                transform: translateY(-50%);
            }
        }

        /* --- MOBILE NAVIGATION --- */
        @media (max-width: 991.98px) {
            .desktop-nav {
                display: none !important;
            }

            .navbar-brand img {
                max-height: 45px;
            }

            .mobile-nav-toggler {
                display: block !important;
            }

            .offcanvas {
                display: block !important;
            }

            .offcanvas-body .nav-link,
            .offcanvas-body .dropdown-item {
                font-size: 1.1rem;
                padding-top: 0.8rem;
                padding-bottom: 0.8rem;
            }

            .offcanvas-body .dropdown-menu {
                border: none;
                box-shadow: none;
                background-color: transparent;
                padding-left: 1.5rem;
            }

            .offcanvas-body .dropdown-menu .dropdown-item {
                font-size: 1rem;
            }

            .offcanvas-body .dropdown-toggle::after {
                transition: transform 0.3s ease;
            }

            .offcanvas-body .dropdown-toggle[aria-expanded="true"]::after {
                transform: rotate(90deg);
            }

            .offcanvas-header {
                height: 90px;
            }
        }

        /* --- TABLET RESPONSIVENESS --- */
        @media (min-width: 768px) and (max-width: 991.98px) {
            .navbar-brand img {
                max-height: 50px;
            }
        }

        /* --- SMALL MOBILE RESPONSIVENESS --- */
        @media (max-width: 76px) {
            header {
                height: 70px;
            }
            
            .navbar {
                height: 70px;
            }
            
            body {
                padding-top: 70px;
            }
            
            .navbar-brand img {
                max-height: 35px;
            }
            
            .offcanvas-header {
                height: 70px;
            }

            .container {
                padding-left: 10px;
                padding-right: 10px;
            }
        }
            /* Remove blue blink (focus/active state) on submenu items */
.desktop-nav .dropdown-item:focus,
.desktop-nav .dropdown-item:active,
.desktop-nav .nav-link:focus,
.desktop-nav .nav-link:active {
    outline: none;
    background-color: white;;
    box-shadow: none;
}
    .nav-link:focus,
.nav-link:active,
.dropdown-item:focus,
.dropdown-item:active {
    outline: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
    color: inherit !important;
}

/* Optional: for mobile dropdown toggle arrows */
.dropdown-toggle:focus,
.dropdown-toggle:active {
    outline: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
}

        </style>
    `;

    // Header HTML
    const headerHTML = `
        <!-- HEADER START -->
        <header>
            <nav class="navbar navbar-expand-lg navbar-light w-100">
                <div class="container">
                    <!-- Brand Logos -->


<a href="index.html">
    <img src="assets/images/download-1.png" style="height: 75px;" alt="Sniper System Logo">
</a>

<a class="navbar-brand">
    <img src="assets/images/Apple_logo.svg" alt="Apple Authorized Reseller" style="height: 45px; margin-left: 10px;">
</a>


                    <!-- Mobile Menu Toggle Button -->
                    <button class="navbar-toggler mobile-nav-toggler" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <!-- Desktop Navigation -->
                    <div class="desktop-nav d-none d-lg-flex flex-grow-1 align-items-center justify-content-end">
                        <ul class="navbar-nav gap-2 align-items-center">
                            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>

                            <!-- Products Dropdown -->
                            <li class="nav-item dropdown">
                                <a class="nav-link" href="#">Products</a>
                                <ul class="dropdown-menu">
                                    <li class="has-submenu">
                                        <a class="dropdown-item" href="#">iPhone</a>
                                        <ul class="dropdown-menu submenu">
                                            <li><a class="dropdown-item" href="ipone17_pro.html">iPhone 17 Pro</a></li>
                                            <li><a class="dropdown-item" href="iphone17_air.html">iPhone 17 Air</a></li>
                                            <li><a class="dropdown-item" href="iphone17.html">iPhone 17</a></li>
                                            <li><a class="dropdown-item" href="iPhone-16/index.html">iPhone 16</a></li>
                                            <li><a class="dropdown-item" href="iPhone-16e/index.html">iPhone 16e</a></li>
                                        </ul>
                                    </li>
                                    <li class="has-submenu">
                                        <a class="dropdown-item" href="#">Mac</a>
                                        <ul class="dropdown-menu submenu">
                                         <li><a class="dropdown-item" href="MacBook-Air-M4/mac-book-M4.html">MacBook Air M4</a></li>
                                            <li><a class="dropdown-item" href="Macbook_pro_M5.html">MacBook Pro M5</a></li>
                                            
                                            <li><a class="dropdown-item" href="iMac/index.html">iMac</a></li>
                                            <li><a class="dropdown-item" href="Mac-Mini/mac-mini.html">Mac mini</a></li>
                                            <li><a class="dropdown-item" href="Mac-Studio/max-studio.html">Mac Studio</a></li>
                                        </ul>
                                    </li>
                                    <li class="has-submenu">
                                        <a class="dropdown-item" href="#">iPad</a>
                                        <ul class="dropdown-menu submenu">
                                            <li><a class="dropdown-item" href="ipad_pro_m5.html">iPad Pro M5</a></li>
                                            <li><a class="dropdown-item" href="iPad-air/ipad-air.html">iPad Air M3</a></li>
                                            <li><a class="dropdown-item" href="ipad-A16/ipad-A16.html">iPad</a></li>
                                            <li><a class="dropdown-item" href="iPad-mini/ipad-mini.html">iPad mini</a></li>
                                        </ul>
                                    </li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="apple-care-plus.html">Apple Care +</a></li>
                                    <li><a class="dropdown-item" href="apple-care-plus-enterprise.html">Apple Care for Enterprise</a></li>
                                </ul>
                            </li>

                            <!-- Services Dropdown -->
                            <li class="nav-item dropdown">
                                <a class="nav-link" href="#">Services</a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="deployment-page.html">Deployment Services</a></li>
                                    <li><a class="dropdown-item" href="lifecycle-management.html">Life Cycle Management</a></li>
                                    <li><a class="dropdown-item" href="business-manager.html">Apple Business Manager</a></li>
                                    <li class="has-submenu">
                                        <a class="dropdown-item" href="#">Value Added Services</a>
                                        <ul class="dropdown-menu submenu">
                                            <li><a class="dropdown-item" href="service & deployment-bundles.html">Service & Deployment Bundles</a></li>
                                            <li><a class="dropdown-item" href="fusion-combos.html">Fusion Combo</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>

                            <!-- Programs Dropdown -->
                            <li class="nav-item dropdown">
                                <a class="nav-link" href="#">Programs</a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="start-up-program.html">Mac for Startups</a></li>
                                    <li><a class="dropdown-item" href="switcher-program.html">Switch to Mac</a></li>
                                    <li><a class="dropdown-item" href="developer-program.html">Mac for Developers</a></li>
                                    <li><a class="dropdown-item" href="refresh-program.html">Refresh Program</a></li>
                                </ul>
                            </li>

                            <li class="nav-item"><a class="nav-link" href="apple-smartEPP.html">Smart EPP</a></li>
                            <li class="nav-item"><a class="nav-link" href="https://sniperindia.com/contact/">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <!-- Mobile Offcanvas Navigation -->
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                <div class="offcanvas-header">
                <a href="index.html">
    <img src="assets/images/download-1.png" style="height: 75px;" alt="Sniper System Logo">
</a>

<a class="navbar-brand">
    <img src="assets/images/Apple_logo.svg" alt="Apple Authorized Reseller" style="height: 45px;">
</a>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li class="nav-item">
                            <a class="nav-link" href="index.html">Home</a>
                        </li>
                        
                        <!-- Products Mobile Dropdown -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" aria-expanded="false">
                                Products
                            </a>
                            <ul class="dropdown-menu">
                                <li class="dropdown">
                                    <a class="dropdown-item dropdown-toggle" href="#" role="button" aria-expanded="false">
                                        iPhone
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="ipone17_pro.html">iPhone 17 Pro</a></li>
                                            <li><a class="dropdown-item" href="iphone17_air.html">iPhone 17 Air</a></li>
                                            <li><a class="dropdown-item" href="iPhone-16e/index.html">iPhone 17</a></li>
                                            <li><a class="dropdown-item" href="iPhone-16/index.html">iPhone 16</a></li>
                                            <li><a class="dropdown-item" href="iPhone-16e/index.html">iPhone 16e</a></li>
                                    </ul>
                                </li>
                                <li class="dropdown">
                                    <a class="dropdown-item dropdown-toggle" href="#" role="button" aria-expanded="false">
                                        Mac
                                    </a>
                                    <ul class="dropdown-menu">
                                         <li><a class="dropdown-item" href="MacBook-Air-M4/mac-book-M4.html">MacBook Air M4</a></li>
                                            <li><a class="dropdown-item" href="Macbook_pro_M5.html">MacBook Pro M5</a></li>
                                            
                                            <li><a class="dropdown-item" href="iMac/index.html">iMac</a></li>
                                            <li><a class="dropdown-item" href="Mac-Mini/mac-mini.html">Mac mini</a></li>
                                            <li><a class="dropdown-item" href="Mac-Studio/max-studio.html">Mac Studio</a></li>
                                    </ul>
                                </li>
                                <li class="dropdown">
                                    <a class="dropdown-item dropdown-toggle" href="#" role="button" aria-expanded="false">
                                        iPad
                                    </a>
                                    <ul class="dropdown-menu">
                                         <li><a class="dropdown-item" href="ipad_pro_m5.html">iPad Pro M5</a></li>
                                            <li><a class="dropdown-item" href="iPad-air/ipad-air.html">iPad Air M3</a></li>
                                            <li><a class="dropdown-item" href="ipad-A16/ipad-A16.html">iPad</a></li>
                                            <li><a class="dropdown-item" href="iPad-mini/ipad-mini.html">iPad mini</a></li>
                                    </ul>
                                </li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="apple-care-plus.html">Apple Care +</a></li>
                                <li><a class="dropdown-item" href="apple-care-plus-enterprise.html">Apple Care for Enterprise</a></li>
                            </ul>
                        </li>

                        <!-- Services Mobile Dropdown -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" aria-expanded="false">
                                Services
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="deployment-page.html">Deployment Services</a></li>
                                <li><a class="dropdown-item" href="lifecycle-management.html">Life Cycle Management</a></li>
                                <li><a class="dropdown-item" href="business-manager.html">Apple Business Manager</a></li>
                                <li class="dropdown">
                                    <a class="dropdown-item dropdown-toggle" href="#" role="button" aria-expanded="false">
                                        Value Added Services
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="service & deployment-bundles.html">Service & Deployment Bundles</a></li>
                                        <li><a class="dropdown-item" href="fusion-combos.html">Fusion Combo</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        <!-- Programs Mobile Dropdown -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" aria-expanded="false">
                                Programs
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="start-up-program.html">Mac for Startups</a></li>
                                <li><a class="dropdown-item" href="switcher-program.html">Switch to Mac</a></li>
                                <li><a class="dropdown-item" href="developer-program.html">Mac for Developers</a></li>
                                <li><a class="dropdown-item" href="refresh-program.html">Refresh Program</a></li>
                            </ul>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="apple-smartEPP.html">Smart EPP</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="https://sniperindia.com/contact/">Contact Us</a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
        <!-- HEADER END -->
    `;

    // Insert CSS into head
    document.head.insertAdjacentHTML('beforeend', headerCSS);

    // Insert Header HTML at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // CRITICAL: Initialize mobile menu functionality AFTER HTML is inserted
    initializeMobileMenu();
}

// Mobile menu functionality - FIXED VERSION
function initializeMobileMenu() {
    // Wait a bit to ensure HTML is fully rendered
    setTimeout(function () {
        document.querySelectorAll('.offcanvas-body .dropdown-toggle').forEach(function (dropdownToggle) {
            dropdownToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                // The submenu to be toggled
                const submenu = this.nextElementSibling;

                // The direct parent <li> of the clicked toggle
                const parentLi = this.parentElement;

                // The parent <ul> containing the parent <li>
                const parentMenu = parentLi.parentElement;

                // Find all sibling <li> elements within the same parent <ul>
                // and close their submenus if they are not the one being opened.
                Array.from(parentMenu.children).forEach(function (li) {
                    if (li !== parentLi && li.classList.contains('dropdown')) {
                        const openSubmenu = li.querySelector('.dropdown-menu.show');
                        if (openSubmenu) {
                            openSubmenu.classList.remove('show');
                            const toggle = li.querySelector('.dropdown-toggle');
                            if (toggle) {
                                toggle.setAttribute('aria-expanded', 'false');
                            }
                        }
                    }
                });

                // Finally, toggle the current submenu
                if (submenu && submenu.classList.contains('dropdown-menu')) {
                    submenu.classList.toggle('show');
                    this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
                }
            });
        });
    }, 100); // Small delay to ensure DOM is ready
}

// Load header when page loads
document.addEventListener('DOMContentLoaded', loadHeader);