const serviceCards = document.querySelectorAll(".service-card");

const serviceObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show-service");

        }

    });

}, {
    threshold: 0.2
});

serviceCards.forEach((card) => {
    serviceObserver.observe(card);
});

serviceCards.forEach(card => {

    card.addEventListener("mousemove",(e)=>{

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--x",`${x}px`);
        card.style.setProperty("--y",`${y}px`);

    });

});

serviceCards.forEach((card,index)=>{

    card.style.transitionDelay=`${index*120}ms`;

});