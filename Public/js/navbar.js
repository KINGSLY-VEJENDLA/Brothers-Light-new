const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 80);
});

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if(menuBtn && navLinks){
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuBtn.classList.toggle("active");
    });
}



const lightSections = document.querySelectorAll(".light-section");

const Observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navbar.classList.add("navbar-light");
        } else {
            navbar.classList.remove("navbar-light");
        }
    });
}, {
    threshold: 0.3
});
Observer.observe(navbar);

lightSections.forEach(section => Observer.observe(section));


const sections = document.querySelectorAll("section");

function updateNavbar() {

    const navbarHeight = navbar.offsetHeight;
    const checkPoint = navbarHeight + 20;

    sections.forEach(section => {

        const rect = section.getBoundingClientRect();

        if (rect.top <= checkPoint && rect.bottom >= checkPoint) {

            if (section.classList.contains("light-section")) {

                navbar.classList.add("navbar-light");

            } else {

                navbar.classList.remove("navbar-light");

            }

        }

    });

}

window.addEventListener("scroll", updateNavbar);
window.addEventListener("load", updateNavbar);