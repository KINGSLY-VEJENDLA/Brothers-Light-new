document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector(".hero");
    const scene = document.querySelector("#frameScene");
    const frames = document.querySelectorAll(".website-frame");

    if (!hero || !scene || frames.length === 0) {
        return;
    }

    /* ==========================================
       BASE CARD CONFIGURATION
    ========================================== */

    const basePositions = [
        { x: -220, y: 15, z: -160, ry: 22, rz: -4, scale: 0.84 },
        { x: -110, y: 0,  z: -70,  ry: 12, rz: -2, scale: 0.92 },
        { x: 0,    y: -8, z: 10,   ry: 0,  rz: 0,  scale: 1.00 },
        { x: 110,  y: 0,  z: -70,  ry: -12,rz: 2,  scale: 0.92 },
        { x: 220,  y: 15, z: -160, ry: -22,rz: 4,  scale: 0.84 }
    ];

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let time = 0;

    function getResponsiveMultiplier() {
        const w = window.innerWidth;
        if (w <= 480) return 0.50;
        if (w <= 768) return 0.65;
        if (w <= 1100) return 0.82;
        return 1.0;
    }

    /* ==========================================
       POINTER & TOUCH INTERACTION
    ========================================== */

    function handlePointer(clientX, clientY) {
        const rect = hero.getBoundingClientRect();
        targetX = ((clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((clientY - rect.top) / rect.height - 0.5) * 2;
    }

    hero.addEventListener("pointermove", (e) => {
        handlePointer(e.clientX, e.clientY);
    });

    hero.addEventListener("pointerleave", () => {
        targetX = 0;
        targetY = 0;
    });

    // Touch support for mobile interaction
    hero.addEventListener("touchmove", (e) => {
        if (e.touches && e.touches[0]) {
            handlePointer(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    hero.addEventListener("touchend", () => {
        targetX = 0;
        targetY = 0;
    });

    /* ==========================================
       ANIMATION LOOP (FLUID FLOATING + 3D PARALLAX)
    ========================================== */

    function animate() {
        time += 0.025;

        // Smooth dampening towards target
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;

        const mult = getResponsiveMultiplier();

        frames.forEach((frame, index) => {
            const base = basePositions[index];
            if (!base) return;

            const side = index - 2; // -2, -1, 0, 1, 2
            const spreadMult = Math.abs(side) * 1.3 + 1;

            // Interactive parallax
            const parallaxX = currentX * 55 * spreadMult * mult;
            const parallaxY = currentY * 30 * mult;
            const parallaxZ = side === 0 ? Math.abs(currentX) * 40 : -Math.abs(currentX) * 20;

            // Organic idle floating wave
            const floatOffset = Math.sin(time + index * 1.1) * (10 + Math.abs(side) * 3);
            const floatRot = Math.cos(time * 0.8 + index * 0.9) * 1.8;

            const posX = (base.x * mult) + parallaxX;
            const posY = (base.y * mult) + parallaxY + floatOffset;
            const posZ = (base.z * mult) + parallaxZ;

            const rotX = (currentY * -12) + (floatOffset * 0.2);
            const rotY = base.ry + (currentX * 16 * spreadMult);
            const rotZ = base.rz + (currentX * 3 * side) + floatRot;

            const scale = base.scale * mult;

            frame.style.transform = `
                translate(-50%, -50%)
                translate3d(${posX.toFixed(2)}px, ${posY.toFixed(2)}px, ${posZ.toFixed(2)}px)
                rotateX(${rotX.toFixed(2)}deg)
                rotateY(${rotY.toFixed(2)}deg)
                rotateZ(${rotZ.toFixed(2)}deg)
                scale(${scale.toFixed(3)})
            `;
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
        targetX = 0;
        targetY = 0;
    });

});