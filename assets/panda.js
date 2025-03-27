// Panda follower animation script

document.addEventListener('DOMContentLoaded', function() {
    // Create panda element
    const panda = document.createElement('div');
    panda.className = 'panda-follower';
    
    // Create panda inner elements
    const pandaHead = document.createElement('div');
    pandaHead.className = 'panda-head';
    
    const pandaEarLeft = document.createElement('div');
    pandaEarLeft.className = 'panda-ear panda-ear-left';
    
    const pandaEarRight = document.createElement('div');
    pandaEarRight.className = 'panda-ear panda-ear-right';
    
    const pandaFace = document.createElement('div');
    pandaFace.className = 'panda-face';
    
    const pandaEyeLeft = document.createElement('div');
    pandaEyeLeft.className = 'panda-eye panda-eye-left';
    
    const pandaEyeRight = document.createElement('div');
    pandaEyeRight.className = 'panda-eye panda-eye-right';
    
    const pandaNose = document.createElement('div');
    pandaNose.className = 'panda-nose';

    // Append elements
    pandaFace.appendChild(pandaEyeLeft);
    pandaFace.appendChild(pandaEyeRight);
    pandaFace.appendChild(pandaNose);
    
    pandaHead.appendChild(pandaEarLeft);
    pandaHead.appendChild(pandaEarRight);
    pandaHead.appendChild(pandaFace);
    
    panda.appendChild(pandaHead);
    
    // Add to body
    document.body.appendChild(panda);
    
    // Initialize position
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let offsetX = -50;
    let offsetY = -50;
    let isResting = false;
    let restTimer = null;
    let blinkInterval = null;
    
    // Get existing cursor elements
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    
    // Track mouse position
    document.addEventListener('mousemove', function(e) {
        targetX = e.clientX;
        targetY = e.clientY;
        
        // Reset resting state when user moves mouse
        if (isResting) {
            isResting = false;
            clearTimeout(restTimer);
            
            // Wake up animation
            pandaHead.style.transform = 'scale(1.15)';
            setTimeout(() => {
                pandaHead.style.transform = '';
            }, 300);
        }
        
        // Schedule resting state after no movement
        clearTimeout(restTimer);
        restTimer = setTimeout(() => {
            isResting = true;
            startBlinking();
        }, 5000);
        
        // Add some slight delay to panda movement for natural effect
        setTimeout(() => {
            offsetX = -70 + Math.random() * 40; // Random offset for natural movement
            offsetY = -80 + Math.random() * 20;
        }, 100);
    });
    
    // Set up regular blinking
    function startBlinking() {
        if (blinkInterval) clearInterval(blinkInterval);
        
        blinkInterval = setInterval(() => {
            if (!isResting && Math.random() > 0.7) return; // Less frequent blinking when active
            
            pandaEyeLeft.classList.add('panda-blink');
            pandaEyeRight.classList.add('panda-blink');
            
            setTimeout(() => {
                pandaEyeLeft.classList.remove('panda-blink');
                pandaEyeRight.classList.remove('panda-blink');
            }, 200);
        }, isResting ? 2000 : 4000);
    }
    
    startBlinking();
    
    // Detect page scrolling for animation
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        if (st > lastScrollTop) {
            // Scrolling down
            panda.classList.add('panda-bounce');
            setTimeout(() => {
                panda.classList.remove('panda-bounce');
            }, 500);
        }
        
        lastScrollTop = st <= 0 ? 0 : st;
    }, false);
    
    // Add interaction with page elements
    const interactiveElements = document.querySelectorAll('a, button, .nav__link, .change-theme');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            pandaEyeLeft.style.transform = 'scale(1.2) rotate(-15deg)';
            pandaEyeRight.style.transform = 'scale(1.2) rotate(15deg)';
            panda.classList.add('active');
            
            // Show happiness when hovering on interactive elements
            pandaHead.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', () => {
            pandaEyeLeft.style.transform = 'rotate(-15deg)';
            pandaEyeRight.style.transform = 'rotate(15deg)';
            panda.classList.remove('active');
            
            // Return to normal position
            pandaHead.style.transform = '';
        });
    });
    
    // Smooth follow animation
    function animatePanda() {
        // Calculate distance
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        
        // If resting and not moving much, make small idle movements
        if (isResting && Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            if (Math.random() < 0.01) {
                offsetX = -70 + Math.random() * 40;
                offsetY = -80 + Math.random() * 20;
            }
        }
        
        // Smooth movement with easing
        const easing = isResting ? 0.03 : 0.1;
        currentX += dx * easing;
        currentY += dy * easing;
        
        // Apply position with offset for following behind cursor
        panda.style.left = `${currentX + offsetX}px`;
        panda.style.top = `${currentY + offsetY}px`;
        
        // Apply subtle rotation based on movement direction
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const rotateAmount = Math.min(Math.max(angle * 0.05, -5), 5); // Limit rotation
            panda.style.transform = `translate(-50%, -50%) rotate(${rotateAmount}deg)`;
            
            // Occasional blinking
            if (Math.random() < 0.005) {
                pandaEyeLeft.classList.add('panda-blink');
                pandaEyeRight.classList.add('panda-blink');
                
                setTimeout(() => {
                    pandaEyeLeft.classList.remove('panda-blink');
                    pandaEyeRight.classList.remove('panda-blink');
                }, 200);
            }
        }
        
        requestAnimationFrame(animatePanda);
    }
    
    // Start animation with a slight delay
    setTimeout(() => {
        animatePanda();
        
        // Initial cute animation
        pandaHead.style.transform = 'scale(0)';
        setTimeout(() => {
            pandaHead.style.transform = 'scale(1.2)';
            setTimeout(() => {
                pandaHead.style.transform = 'scale(1)';
                
                // Blink after appearing
                setTimeout(() => {
                    pandaEyeLeft.classList.add('panda-blink');
                    pandaEyeRight.classList.add('panda-blink');
                    
                    setTimeout(() => {
                        pandaEyeLeft.classList.remove('panda-blink');
                        pandaEyeRight.classList.remove('panda-blink');
                    }, 200);
                }, 300);
            }, 200);
        }, 100);
    }, 500);
    
    // Easter egg - panda does a flip when clicked
    panda.addEventListener('click', function() {
        panda.style.pointerEvents = 'none';
        panda.classList.add('panda-flip');
        
        setTimeout(() => {
            panda.classList.remove('panda-flip');
            panda.style.pointerEvents = 'auto';
        }, 1000);
    });
    
    // Enable panda interaction on mobile
    panda.style.pointerEvents = 'auto';
    
    // Disable panda animation on mobile devices, but keep it visible
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    if (isMobile) {
        // Make panda visible but fixed position on mobile
        panda.style.top = '80%';
        panda.style.left = '80%';
        panda.style.transform = 'translate(-50%, -50%)';
        panda.style.pointerEvents = 'auto';
        
        // Add small bouncing animation for mobile
        setInterval(() => {
            pandaHead.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                pandaHead.style.transform = '';
            }, 500);
        }, 5000);
        
        // Don't run the animation loop on mobile
        animatePanda = function() {};
    }
}); 