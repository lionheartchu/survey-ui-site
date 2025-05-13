// Global BGM variable
let bgm;
let audioContext = null;
let typingSound = null;

// Function to initialize audio context and sounds
function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    if (!typingSound) {
        typingSound = new Audio('sound/typing.mp3');
        typingSound.volume = 0.4;
        typingSound.load();
    }
}

// Fix the missing setupScanButton function
function setupScanButton() {
    const scanBtn = document.querySelector('.scan-btn');
    if (!scanBtn) return;
    
    // We need to remove any existing listeners to avoid duplicates
    const newScanBtn = scanBtn.cloneNode(true);
    scanBtn.parentNode.replaceChild(newScanBtn, scanBtn);
    
    newScanBtn.addEventListener('click', () => {
        if (bgm) {
            // Don't reset the BGM position to 0, just store current position
            sessionStorage.setItem('bgmPlaying', 'true');
            sessionStorage.setItem('bgmPosition', bgm.currentTime);
            bgm.pause();
        }
        
        const narrativeSessionId = sessionStorage.getItem('narrativeSessionId');
        if (narrativeSessionId && window.firebaseDb) {
            const { database, ref, set } = window.firebaseDb;
            set(ref(database, `status/${narrativeSessionId}`), {
                step: 'start_scan',
                timestamp: Date.now()
            }).then(() => {
                location.href = 'personal-tests/personal-test.html';
            }).catch((err) => {
                console.error("Failed to write to Firebase:", err);
                location.href = 'personal-tests/personal-test.html';
            });
        } else {
            location.href = 'personal-tests/personal-test.html';
        }
    });
}

function waitForFirebaseAndStart() {
  if (
    window.firebaseDb &&
    window.firebaseDb.database &&
    window.firebaseDb.ref &&
    window.firebaseDb.set
  ) {
    setupScanButton();
  } else {
    setTimeout(waitForFirebaseAndStart, 100);
  }
}

// Wait for DOM to load before accessing elements
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize audio on first user interaction
  const initAudioOnInteraction = async () => {
    await initAudio();
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    document.removeEventListener('click', initAudioOnInteraction);
    document.removeEventListener('touchstart', initAudioOnInteraction);
  };
  
  document.addEventListener('click', initAudioOnInteraction);
  document.addEventListener('touchstart', initAudioOnInteraction);
  
  // Modified typing effect for overview page
  async function typeText(element, text) {
    const originalText = text;  // Store the original text
    element.textContent = '';   // Clear the element
    
    // Ensure audio is initialized
    if (!typingSound) {
      await initAudio();
    }
    
    // Resume audio context if it was suspended
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Reset and play typing sound
    typingSound.currentTime = 0;
    const playPromise = typingSound.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log("Error playing typing sound:", err);
        // If autoplay fails, try to play on next interaction
        const handleInteraction = () => {
          typingSound.currentTime = 0;
          typingSound.play();
          document.removeEventListener('click', handleInteraction);
          document.removeEventListener('touchstart', handleInteraction);
        };
        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);
      });
    }
    
    // Type each character with slightly faster timing
    for (let i = 0; i < originalText.length; i++) {
      element.textContent += originalText.charAt(i);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
    
    // Stop sound when sentence is complete
    typingSound.pause();
    typingSound.currentTime = 0;
  }

  const title = document.querySelector('.overview-title');
  const subtitle = document.querySelector('.overview-subtitle');
  const grid = document.querySelector('.overview-grid');
  const typingTexts = document.querySelectorAll('.typing-text');
  
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  
  async function startAnimationSequence() {
    title.classList.remove('hidden');
    title.classList.add('fade-in');
    
    await wait(1000);
    
    subtitle.classList.remove('hidden');
    subtitle.classList.add('fade-in');
    
    for (let i = 0; i < typingTexts.length; i++) {
      const text = typingTexts[i];
      const originalText = text.textContent;  // Store original text before clearing
      text.classList.add('visible');
      await typeText(text, originalText);     // Pass the original text
      await wait(800);
    }
    
    await wait(500);
    grid.classList.remove('hidden');
    grid.classList.add('fade-in');
  }
  
  startAnimationSequence();

  // *** MOVE GLOW FIELD CODE INSIDE DOM READY ***
  const glowField = document.getElementById("glow-field");
  const GLOW_COUNT = 8;
  const existingPositions = [];
  const bodyImage = document.querySelector('.body-image-avoid');
  
  if (glowField && bodyImage) {
    const bodyRect = bodyImage.getBoundingClientRect();
    
    function distance(x1, y1, x2, y2) {
      const dx = x1 - x2;
      const dy = y1 - y2;
      return Math.sqrt(dx * dx + dy * dy);
    }

    for (let i = 0; i < GLOW_COUNT; i++) {
      let attempts = 0;
      let top, left;
      let tooClose = false;

      do {
        tooClose = false;
        top = Math.random() * 90;
        left = Math.random() * 90;
        attempts++;

        // Create virtual DOM space to check position
        const container = glowField.getBoundingClientRect();
        const xPx = container.left + (left / 100) * container.width;
        const yPx = container.top + (top / 100) * container.height;

        // If particle center is in body image area, regenerate
        if (
          xPx > bodyRect.left &&
          xPx < bodyRect.right &&
          yPx > bodyRect.top &&
          yPx < bodyRect.bottom
        ) {
          tooClose = true;
          continue;
        }

        for (const pos of existingPositions) {
          if (distance(left, top, pos.left, pos.top) < 35) {
            tooClose = true;
            break;
          }
        }
      } while (tooClose && attempts < 30);

      existingPositions.push({ top, left });

      const glow = document.createElement("div");
      glow.classList.add("pulse-glow");
      glow.style.top = `${top}%`;
      glow.style.left = `${left}%`;

      const size = 100 + Math.random() * 100;
      glow.style.width = glow.style.height = `${size}px`;
      glow.style.animationDuration = `${35 + Math.random() * 15}s`;
      glow.style.animationDelay = `${Math.random() * 10}s`;

      glowField.appendChild(glow);
    }
  }

  // *** MOVE DOT INTERACTION CODE INSIDE DOM READY ***
  const dots = document.querySelectorAll('.dot');
  const panels = document.querySelectorAll('.info-item');
  const dotSequence = ['brain', 'eyes', 'ears', 'heart', 'skin', 'hands', 'feet'];
  let currentDotIndex = 0;

  // Initially hide all info panels and make all dots grey except the first one
  panels.forEach(panel => {
    panel.style.cssText = `
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
    `;
  });

  // Style for inactive dots
  dots.forEach(dot => {
    if (dot.getAttribute('data-key') !== dotSequence[0]) {
      dot.style.cssText = `
        background: #808080;
        opacity: 0.7;
      `;
      // Change the before pseudo-element color for inactive dots
      dot.style.setProperty('--pulse-color', 'rgba(255, 255, 255, 0.2)');
    }
  });

  let currentlyShownPanel = null;

  // Update the dots click event handler
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const key = dot.getAttribute('data-key');
      
      // Only proceed if this is the current dot in sequence
      if (key === dotSequence[currentDotIndex]) {
        // Remove active-line class from all dots first
        dots.forEach(d => {
          d.classList.remove('active-line');
        });
        
        // Add active-line class to the clicked dot
        dot.classList.add('active-line');
        
        // Hide currently shown panel if it exists
        if (currentlyShownPanel) {
          currentlyShownPanel.style.opacity = '0';
          currentlyShownPanel.style.visibility = 'hidden';
          currentlyShownPanel.style.transform = 'translateY(20px)';
          currentlyShownPanel = null;
        }

        // Show the clicked panel
        panels.forEach(panel => {
          if (panel.getAttribute('data-key') === key) {
            panel.style.opacity = '1';
            panel.style.visibility = 'visible';
            panel.style.transform = 'translateY(0)';
            currentlyShownPanel = panel;
          }
        });

        // Play ping sound
        const clickSound = new Audio('sound/ping.mp3');
        clickSound.volume = 0.3;
        clickSound.play();

        // Check if this was the last dot (feet)
        if (key === 'feet') {
          // Reveal all panels with staggered animation
          setTimeout(() => {
            // Remove all active-line classes first
            dots.forEach(d => {
              d.classList.remove('active-line');  // Remove any existing line
            });
            
            // Make all dots active but WITHOUT showing their lines
            dots.forEach(d => {
              d.style.cssText = `
                background: #00f9ff;
                opacity: 1;
                transition: all 2s ease;
              `;
              d.style.setProperty('--pulse-color', 'rgba(0, 249, 255, 0.3)');
              // Don't add the active-line class here
            });
            
            // Show all panels with staggered animation
            panels.forEach((panel, index) => {
              setTimeout(() => {
                panel.style.cssText = `
                  opacity: 1;
                  visibility: visible;
                  transform: translateY(0);
                  transition: all 2s cubic-bezier(0.25, 0.1, 0.25, 1.0);
                `;
              }, index * 200);
            });
            
            // Play a special reveal sound
            const revealSound = new Audio('sound/ping.mp3');
            revealSound.volume = 0.4;
            revealSound.play();
          }, 1000);
        } else {
          // Not the last dot, continue with sequence
          currentDotIndex++;

          // Update dot colors
          dots.forEach(d => {
            const dotKey = d.getAttribute('data-key');
            if (dotKey === dotSequence[currentDotIndex]) {
              // Next active dot
              d.style.cssText = `
                background: #00f9ff;
                opacity: 1;
              `;
              d.style.setProperty('--pulse-color', 'rgba(0, 249, 255, 0.2)');
            } else if (currentDotIndex > dotSequence.indexOf(dotKey)) {
              // Previously clicked dots - just lower opacity
              d.style.cssText = `
                background: #00f9ff;
                opacity: 0.5;
              `;
              d.style.setProperty('--pulse-color', 'rgba(0, 249, 255, 0.2)');
            } else if (currentDotIndex < dotSequence.indexOf(dotKey)) {
              // Not yet active dots - grey with white pulse
              d.style.cssText = `
                background: #808080;
                opacity: 0.7;
              `;
              d.style.setProperty('--pulse-color', 'rgba(255, 255, 255, 0.2)');
            }
          });
        }
      }
    });
  });

  // Call waitForFirebaseAndStart but remove the duplicate scan button handler
  waitForFirebaseAndStart();
});