// Dialogue script with typewriter effect
const dialogues = [
    "You're awake! Welcome.",
    "We are at the sublayer below the digital ocean.",
    "Up there, data floats vulnerable. Down here, we embed it in living skin.",
    "We call it: Data Skin.",
    "It's time to scan yours."
  ];
  
  let index = 0;
  const textEl = document.getElementById('dialogueText');
  const button = document.getElementById('nextBtn');
  let typing = false;
  
  function typeWriter(text, element, delay = 30) {
    let i = 0;
    typing = true;
    element.textContent = '';
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, delay);
      } else {
        typing = false;
      }
    };
    type();
  }
  
  button.addEventListener('click', () => {
    if (typing) return; // Prevent skipping during typing
    if (index < dialogues.length - 1) {
      index++;
      typeWriter(dialogues[index], textEl);
    } else {
      window.location.href = "overview.html";
    }
  });
  
  typeWriter(dialogues[index], textEl);
  
  // Bubble animation
  for (let i = 0; i < 40; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.left = Math.random() * 100 + 'vw';
    bubble.style.animationDuration = 4 + Math.random() * 4 + 's';
    bubble.style.width = bubble.style.height = 6 + Math.random() * 6 + 'px';
    document.body.appendChild(bubble);
  }