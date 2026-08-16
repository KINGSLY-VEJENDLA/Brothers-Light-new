const visionCards = document.querySelectorAll(".vision-card");

const visionObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{threshold:0.2});

visionCards.forEach(card=>{

    visionObserver.observe(card);

});