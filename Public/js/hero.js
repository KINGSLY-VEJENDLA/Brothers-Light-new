const cards = document.querySelectorAll(".floating-card");

document.addEventListener("mousemove",(e)=>{

const x=(window.innerWidth/2-e.clientX)/35;
const y=(window.innerHeight/2-e.clientY)/35;

cards.forEach(card=>{

card.style.transform=`translate(${x}px,${y}px)`;

});

});