// Dialogue script with typewriter effect
const dialogues = [
    "You're awake! Welcome.",
    "We are at the sublayer below the digital ocean.",
    "Up there, data floats vulnerable. Down here, we embed it in living skin.",
    "We call it: Data Skin.",
    "It's time to scan yours."
  ];
  
  document.addEventListener('DOMContentLoaded', function() {
    let index = 0;
    const textEl = document.getElementById('dialogueText');
    const button = document.getElementById('nextBtn');
    const initializeBtn = document.getElementById('initializeBtn');
    const wakeOverlay = document.querySelector('.wake-overlay');
    const initializeContainer = document.querySelector('.initialize-container');
    let typing = false;

    // Hide the wake animation and dialogue initially
    document.querySelector('.dialogue-box').style.display = 'none';

    // Initialize button click starts the sequence
    initializeBtn.addEventListener('click', function() {
      // Use a different sound for initialization
      const initSound = new Audio('sound/soft-activation.mp3');
      initSound.volume = 0.8;
      initSound.play();
      
      // Add a pause before hiding the initialize button
      setTimeout(() => {
        // Hide the initialize button container
        initializeContainer.style.display = 'none';
        
        // Show the wake overlay after the pause
        wakeOverlay.style.display = 'flex';
        
        // Start BGM with a slight delay
        setTimeout(() => {
          if (!window.bgm) {
            window.bgm = new Audio('sound/bgm1.mp3');
            window.bgm.loop = true;
            window.bgm.volume = 0.5;
            window.bgm.play().catch(err => console.log("Error playing BGM:", err));
          }
        }, 1000);
        
        // Wait for boot animation to complete before showing dialogue
        setTimeout(() => {
          document.querySelector('.dialogue-box').style.display = 'flex';
          // Delay before typing starts
          setTimeout(() => {
            typeWriter(dialogues[index], textEl);
          }, 500);
        }, 3000);
        
      }, 600);
      
      // Create bubbles immediately for background effect
      for (let i = 0; i < 40; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = Math.random() * 100 + 'vw';
        bubble.style.animationDuration = 4 + Math.random() * 4 + 's';
        bubble.style.width = bubble.style.height = 6 + Math.random() * 6 + 'px';
        document.body.appendChild(bubble);
      }
    });

    function typeWriter(text, element, delay = 30) {
        let i = 0;
        typing = true;
        element.textContent = '';
        
        // Play typing sound once for the whole sentence
        const typingSound = new Audio('sound/typing.mp3');
        typingSound.volume = 0.5;
        typingSound.play();

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, delay);
            } else {
                typing = false;
                typingSound.pause();
                typingSound.currentTime = 0;
            }
        };
        type();
    }

    button.addEventListener('click', () => {
        if (typing) return;
        if (index < dialogues.length - 1) {
            index++;
            typeWriter(dialogues[index], textEl);
        } else {
            // Store both playing state AND current position
            sessionStorage.setItem('bgmPlaying', 'true');
            sessionStorage.setItem('bgmPosition', window.bgm.currentTime);
            window.location.href = "overview.html";
        }
    });

    // Modify the scan button click handler to stop music
    document.querySelector('.scan-btn')?.addEventListener('click', () => {
        if (window.bgm) {
            window.bgm.pause();
            window.bgm.currentTime = 0;
        }
    });
  });