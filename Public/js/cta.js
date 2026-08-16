const cta = document.querySelector(".cta");

const ctaObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            cta.classList.add("show");

        }

    });

},{
    threshold:.2
});

if(cta){
    ctaObserver.observe(cta);
}