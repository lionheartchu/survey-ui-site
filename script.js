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
    let typing = false;

    // Initialize BGM on page load if not already playing
    if (!window.bgm) {
        window.bgm = new Audio('sound/bgm1.mp3');
        window.bgm.loop = true;
        window.bgm.volume = 0.6;
        window.bgm.play().catch(err => console.log("Error playing BGM:", err));
    }

    function typeWriter(text, element, delay = 30) {
        let i = 0;
        typing = true;
        element.textContent = '';
        
        // Play typing sound once for the whole sentence
        const typingSound = new Audio('sound/typing.mp3');
        typingSound.volume = 0.4;
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

    // Delay the first typing until after wake animation
    setTimeout(() => {
        typeWriter(dialogues[index], textEl);
    }, 4000); // Match this with the fadeOut animation duration (5s)

    button.addEventListener('click', () => {
        if (typing) return;
        if (index < dialogues.length - 1) {
            index++;
            typeWriter(dialogues[index], textEl);
        } else {
            sessionStorage.setItem('bgmPlaying', 'true');
            window.location.href = "overview.html";
        }
    });

    // Bubble animation
    for (let i = 0; i < 40; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = Math.random() * 100 + 'vw';
        bubble.style.animationDuration = 4 + Math.random() * 4 + 's';
        bubble.style.width = bubble.style.height = 6 + Math.random() * 6 + 'px';
        document.body.appendChild(bubble);
    }

    // Modify the scan button click handler to stop music
    document.querySelector('.scan-btn')?.addEventListener('click', () => {
        if (window.bgm) {
            window.bgm.pause();
            window.bgm.currentTime = 0;
        }
    });
  });