document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.getElementById("navbar");
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    // ==========================================
    // Navbar Scroll Background Effect
    // ==========================================
    function handleScroll() {
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // ==========================================
    // Mobile Hamburger Menu Toggle
    // ==========================================
    if (menuBtn && mobileMenu) {

        menuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            menuBtn.classList.toggle("active");
            mobileMenu.classList.toggle("active");
        });

        // Close when clicking outside navbar / mobile menu
        document.addEventListener("click", function (e) {
            if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                menuBtn.classList.remove("active");
                mobileMenu.classList.remove("active");
            }
        });

        // Close when clicking any menu item
        const links = mobileMenu.querySelectorAll("a");
        links.forEach(link => {
            link.addEventListener("click", function () {
                menuBtn.classList.remove("active");
                mobileMenu.classList.remove("active");
            });
        });

        // Close on window resize if larger than tablet
        window.addEventListener("resize", function () {
            if (window.innerWidth > 992) {
                menuBtn.classList.remove("active");
                mobileMenu.classList.remove("active");
            }
        });
    }

});