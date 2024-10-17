const image = document.getElementById('image'); 
const popup1 = document.getElementById('popup 1');
const popup2 = document.getElementById('popup 2');
const popup3 = document.getElementById('popup 3');
const audio = document.getElementById('background-audio'); // Get the audio element
let isDragging = false;
let lastX = 0;
let lastY = 0;
let rotateX = 0;
let rotateY = 0;
let scale = 1; // Initialize scale variable
let zTranslate = 0; // Z-axis movement
const minDistance = 150; // Minimum distance between the popup and the spinning image
let autoRotateSpeedY = 2; // Increased speed of horizontal spin (Y-axis) 2x faster
let autoRotateSpeedX = 0; // Increased speed of vertical spin (X-axis) 2x faster
let zAxisMovementSpeed = 0.1; // Increased speed of movement along Z-axis for helicoidal effect 2x faster

// Play audio when the page loads
window.addEventListener('load', () => {
    audio.play().catch(error => {
        console.log("Audio playback failed:", error); // Handle playback error
    });
});

// Start dragging
image.addEventListener('mousedown', (event) => {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    event.preventDefault(); // Prevent text selection
});

// Stop dragging
window.addEventListener('mouseup', () => {
    isDragging = false; // Just stop dragging
});

// Dragging the image
window.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;

    rotateY += deltaX * 1; // Increase sensitivity of Y rotation
    rotateX -= deltaY * 1; // Increase sensitivity of X rotation

    // Apply the rotation, scale, and Z-axis translation
    image.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(${zTranslate}px) scale(${scale})`;

    lastX = event.clientX;
    lastY = event.clientY;
});

// Zoom functionality
window.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent default scrolling
    scale += event.deltaY * -0.001; // Adjust scale based on wheel movement
    scale = Math.min(Math.max(0.5, scale), 2); // Limit scale between 0.5 and 2
    image.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(${zTranslate}px) scale(${scale})`;
});

// Function to check if the popup position is too close to the spinning image
function isTooClose(popupX, popupY) {
    const imageRect = image.getBoundingClientRect();
    const popupRect = { left: popupX, top: popupY, width: 400, height: 400 }; // Popup dimensions

    const dx = Math.max(imageRect.left - (popupRect.left + popupRect.width), popupRect.left - (imageRect.left + imageRect.width));
    const dy = Math.max(imageRect.top - (popupRect.top + popupRect.height), popupRect.top - (imageRect.top + imageRect.height));
    return Math.sqrt(dx * dx + dy * dy) < minDistance; // Calculate distance and check if too close
}

// Function to show popup image at random positions
function showRandomImage() {
    const popupClone = Math.random() < 0.5 ? popup1.cloneNode() : (Math.random() < 0.5 ? popup2.cloneNode() : popup3.cloneNode()); // Randomly select a popup to clone
    document.body.appendChild(popupClone); // Append the clone to the body

    let x, y;

    // Generate random positions until the popup is not too close to the spinning image
    do {
        // Random x position in the left or right third of the screen
        const side = Math.random() < 0.5 ? 'left' : 'right';
        if (side === 'left') {
            x = Math.random() * (window.innerWidth / 3); // Random x position in the left third
        } else {
            x = Math.random() * (window.innerWidth / 3) + (2 * window.innerWidth / 3); // Random x position in the right third
        }
        y = Math.random() * (window.innerHeight - 400); // Random y position considering the height of 400px
    } while (isTooClose(x, y)); // Check for proximity

    popupClone.style.left = `${x}px`;
    popupClone.style.top = `${y}px`;
    popupClone.style.display = 'block'; // Show the popup image

    // Fade in effect
    setTimeout(() => {
        popupClone.style.opacity = 1; // Set opacity to 1 for fade-in
    }, 10);

    // Fade out effect and remove after 3 seconds
    setTimeout(() => {
        popupClone.style.opacity = 0; // Set opacity to 0 for fade-out
        setTimeout(() => {
            popupClone.remove(); // Remove the clone after fade out
        }, 500); // Wait for fade-out transition to complete
    }, 2500); // Keep visible for 2.5 seconds
}

// Randomly show the popup image at random intervals
function randomInterval() {
    const interval = Math.random() * (1000 - 300) + 300; // Random interval between 0.3 to 1 seconds
    showRandomImage(); // Show the image immediately
    setTimeout(randomInterval, interval); // Schedule the next appearance
}

randomInterval(); // Start the random interval function

// Automatic faster helicoidal spin effect
function animate() {
    if (!isDragging) {
        rotateY += autoRotateSpeedY; // Rotate horizontally (Y-axis) faster
        rotateX += autoRotateSpeedX; // Rotate vertically (X-axis) faster
        zTranslate += Math.sin(rotateY * Math.PI / 180) * zAxisMovementSpeed; // Move along Z-axis faster based on rotation

        // Apply the helicoidal motion: Rotation + translation on Z-axis
        image.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(${zTranslate}px) scale(${scale})`;
    }
    requestAnimationFrame(animate); // Call animate function recursively
}

animate(); // Start the animation
