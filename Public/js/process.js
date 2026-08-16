const cards = document.querySelectorAll(".step-card");
const process = document.querySelector(".process");

let current = 0;

process.addEventListener("mousemove", () => {

    if(current < cards.length){

        cards[current].classList.add("show");

        current++;

    }

});