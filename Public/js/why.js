const whyCards = document.querySelectorAll(".why-card");

const whyObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:.2
});

whyCards.forEach((card,index)=>{

    card.style.transitionDelay=`${index*100}ms`;

    whyObserver.observe(card);

});