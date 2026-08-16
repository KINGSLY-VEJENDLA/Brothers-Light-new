const contactBanner = document.querySelector(".contact-banner");

if(contactBanner){

    const contactBannerObserver = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                contactBanner.classList.add("show");

            }

        });

    },{

        threshold:.2

    });

    contactBannerObserver.observe(contactBanner);

}