document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector(".hero");
    const scene = document.querySelector("#frameScene");
    const frames = document.querySelectorAll(".website-frame");

    if (!hero || !scene || frames.length === 0) {
        console.error("3D hero elements not found");
        return;
    }

    console.log("✅ Brothers Light 3D Hero Ready");

    /*
    ==========================================
    BASE FRAME POSITIONS
    ==========================================
    */

    const frameData = [
        {
            x: -240,
            y: 20,
            z: -180,
            ry: 25,
            rz: -5,
            scale: 0.82
        },

        {
            x: -120,
            y: 0,
            z: -80,
            ry: 15,
            rz: -3,
            scale: 0.92
        },

        {
            x: 0,
            y: 0,
            z: 0,
            ry: 0,
            rz: 0,
            scale: 1
        },

        {
            x: 120,
            y: 0,
            z: -80,
            ry: -15,
            rz: 3,
            scale: 0.92
        },

        {
            x: 240,
            y: 20,
            z: -180,
            ry: -25,
            rz: 5,
            scale: 0.82
        }
    ];


    /*
    ==========================================
    MOUSE
    ==========================================
    */

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;


    hero.addEventListener("pointermove", (e) => {

        const rect = hero.getBoundingClientRect();

        targetX =
            ((e.clientX - rect.left) / rect.width - 0.5) * 2;

        targetY =
            ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    });


    hero.addEventListener("pointerleave", () => {

        targetX = 0;
        targetY = 0;

    });


    /*
    ==========================================
    ANIMATION
    ==========================================
    */

    function animate() {

        currentX +=
            (targetX - currentX) * 0.07;

        currentY +=
            (targetY - currentY) * 0.07;


        frames.forEach((frame, index) => {

            const base = frameData[index];

            if (!base) return;


            /*
            ====================================
            SIDE SPREAD
            ====================================
            */

            const side =
                index - 2;


            /*
            The farther from center,
            the stronger the movement.
            */

            const strength =
                Math.abs(side) * 1.4 + 1;


            /*
            ====================================
            HORIZONTAL MOVEMENT
            ====================================
            */

            const spread =
                currentX * 65 * strength;


            /*
            ====================================
            VERTICAL MOVEMENT
            ====================================
            */

            const vertical =
                currentY * 35;


            /*
            ====================================
            DEPTH
            ====================================
            */

            let depth = 0;

            if (index === 2) {

                // Main card comes forward

                depth =
                    Math.abs(currentX) * 55;

            } else {

                // Side cards move backward

                depth =
                    -Math.abs(currentX) * 25;
            }


            /*
            ====================================
            ROTATION X
            ====================================
            */

            const rotateX =
                currentY * -10;


            /*
            ====================================
            ROTATION Y
            ====================================
            */

            const rotateY =
                base.ry +
                currentX * 18 * strength;


            /*
            ====================================
            ROTATION Z
            ====================================
            */

            const rotateZ =
                base.rz +
                currentX * 4 * side;


            /*
            ====================================
            APPLY
            ====================================
            */

            frame.style.transform = `
                translate(-50%, -50%)
                translate3d(
                    ${base.x + spread}px,
                    ${base.y + vertical}px,
                    ${base.z + depth}px
                )
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                rotateZ(${rotateZ}deg)
                scale(${base.scale})
            `;

        });


        requestAnimationFrame(animate);

    }


    animate();

});