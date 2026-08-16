const floatingCards=document.querySelectorAll(".floating-card");

floatingCards.forEach((card,index)=>{

card.style.animationDelay=`${index*0.4}s`;

});

const hero=document.querySelector(".services-hero");

window.addEventListener("mousemove",(e)=>{

const x=(e.clientX/window.innerWidth)-0.5;

const y=(e.clientY/window.innerHeight)-0.5;

hero.style.setProperty("--x",x*20+"px");

hero.style.setProperty("--y",y*20+"px");

});

