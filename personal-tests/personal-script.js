// Add global costumeWindow variable declaration
let costumeWindow = null;

// Add global BGM variable at the top of the file (line 1)
let bgm;

// Create audio context for iOS compatibility
let audioContext = null;
try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
    console.log('Web Audio API not supported');
}

// Function to initialize and play BGM
function initBGM() {
    if (!bgm) {
        bgm = new Audio('../sound/bgm2.mp3');
        bgm.loop = true;
        bgm.volume = 0.12;
        
        // Resume audio context if it was suspended (iOS requirement)
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Play with user interaction
        const playPromise = bgm.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.log("Error playing BGM:", err);
                // If autoplay fails, set up interaction-based playback
                document.addEventListener('click', function initAudio() {
                    bgm.play();
                    document.removeEventListener('click', initAudio);
                }, { once: true });
            });
        }
    }
}

// Move canvas code inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Get Firebase functions from window.firebaseDb
    const { database, ref, push, set, onValue } = window.firebaseDb;

    // Generate a session ID based on timestamp and random string
    function generateSessionId() {
        const timestamp = new Date().getTime();
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${timestamp}-${randomStr}`;
    }

    // Store the session ID globally
    const sessionId = generateSessionId();
    console.log("Session ID:", sessionId);

    // Initialize BGM
    initBGM();

    // Immediately store a timestamp at the session root
    const sessionRootRef = ref(database, `sessions/${sessionId}`);
    set(sessionRootRef, {
        timestamp: Date.now()
    });
    
    // Function to save data to Firebase
    function saveToFirebase(questionData) {
        const sessionsRef = ref(database, `sessions/${sessionId}/questions`);
        
        return push(sessionsRef, {
            questionIndex: questionData.questionIndex,
            score: questionData.score,
            dataType: questionData.dataType,
            timestamp: Date.now()
        }).then(() => {
            console.log('Data saved successfully to Firebase');
        }).catch((error) => {
            console.error('Error saving to Firebase:', error);
        });
    }

    const startJourneyBtn = document.getElementById('startJourney');
    const questionSection = document.getElementById('questionSection');
    const questionText = document.getElementById('questionText');
    const responseSlider = document.getElementById('responseSlider');
    const sliderValueDisplay = document.getElementById('sliderValue');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const narrativeSection = document.querySelector('.narrative');
    
    // Slider labels
    const sliderLabelLeft = document.getElementById('sliderLabelLeft');
    const sliderLabelRight = document.getElementById('sliderLabelRight');

    // Questions array with updated text and labels
    const questions = [
        {
            text: "When saving or sharing personal images through apps, you usually…",
            leftLabel: "Keep them as-is without adjusting settings",
            rightLabel: "Add privacy controls like folders or app restrictions",
            dataType: "Visual Data",
            apps: {
                left: {
                    icon: "../images/instagram-icon.png",
                    name: "Instagram",
                    example: "posting on Instagram"
                },
                right: {
                    icon: "../images/photo-icon.svg",
                    name: "Photos",
                    example: "saving in secure folders"
                }
            }
        },
        {
            text: "When sending messages with sensitive info, you usually…",
            leftLabel: "Send normally without extra steps",
            rightLabel: "Use basic protection like disappearing messages or app locks",
            dataType: "Communication Data",
            apps: {
                left: {
                    icon: "../images/whatsapp-icon.png",
                    name: "WhatsApp",
                    example: "texting private details"
                },
                right: {
                    icon: "../images/imessage-icon.svg",
                    name: "iMessage",
                    example: "using disappearing messages"
                }
            }
        },
        {
            text: "When creating accounts or filling out profiles, you usually…",
            leftLabel: "Fill everything and leave defaults",
            rightLabel: "Choose what to share and what to hide",
            dataType: "Personal Data",
            apps: {
                left: {
                    icon: "../images/facebook-icon.png",
                    name: "Facebook",
                    example: "signing up"
                },
                right: {
                    icon: "../images/linkedin-icon.png",
                    name: "LinkedIn",
                    example: "customizing privacy settings"
                }
            }
        },
        {
            text: "When apps track your activity to give suggestions, you…",
            leftLabel: "Allow tracking for convenience",
            rightLabel: "Limit what's collected in settings",
            dataType: "Cognitive Data",
            apps: {
                left: {
                    icon: "../images/youtube-icon.png",
                    name: "YouTube",
                    example: "getting video recommendations"
                },
                right: {
                    icon: "../images/amazon-icon.png",
                    name: "Amazon",
                    example: "limiting product tracking"
                }
            }
        },
        {
            text: "When using voice features or assistants, you usually…",
            leftLabel: "Leave audio access on by default",
            rightLabel: "Review or restrict what gets recorded",
            dataType: "Audio Data",
            apps: {
                left: {
                    icon: "../images/siri-icon.png",
                    name: "Siri",
                    example: "using for reminders"
                },
                right: {
                    icon: "../images/google-assistant-icon.png",
                    name: "Google Assistant",
                    example: "restricting recordings"
                }
            }
        },
        {
            text: "When an app asks to access your location, you usually…",
            leftLabel: "Allow all the time",
            rightLabel: "Allow only when needed",
            dataType: "Geolocation Data",
            apps: {
                left: {
                    icon: "../images/google-maps-icon.png",
                    name: "Google Maps",
                    example: "always sharing location"
                },
                right: {
                    icon: "../images/instagram-icon.png",
                    name: "Instagram Stories",
                    example: "tagging places selectively"
                }
            }
        },
        {
            text: "When using your fingerprint or face to log in, you usually…",
            leftLabel: "Just turn it on without checking anything",
            rightLabel: "Make sure it's stored and used securely",
            dataType: "Biometric Data",
            apps: {
                left: {
                    icon: "../images/faceid-icon.png",
                    name: "Face ID",
                    example: "unlocking your phone"
                },
                right: {
                    icon: "../images/chase-icon.png",
                    name: "Banking Apps",
                    example: "checking security policies"
                }
            }
        }
    ];

    let currentQuestionIndex = 0;

    // Display initial slider value
    sliderValueDisplay.textContent = responseSlider.value;

    // Create app section globally
    const appSection = document.createElement('div');
    appSection.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80%;
        margin: 0 auto 8px; /* Reduced bottom margin to move it up */
        padding: 0; /* Remove padding completely */
        opacity: 0; /* Initially hidden */
        transition: opacity 0.5s ease;
    `;

    // Create "for example:" text
    const exampleText = document.createElement('span');
    exampleText.textContent = "for example:";
    exampleText.style.cssText = `
        font-size: 0.8em;
        color: rgba(0, 240, 255, 0.8);
        margin-right: 8px;
        font-style: italic;
        line-height: 1;
    `;

    // Create left app container
    const leftApp = document.createElement('div');
    leftApp.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin: 0 6px; /* Closer spacing */
        padding: 0; /* Remove padding */
        background: transparent; /* Remove background */
        border: none; /* Remove border */
    `;

    // Create right app container
    const rightApp = document.createElement('div');
    rightApp.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin: 0 6px; /* Closer spacing */
        padding: 0; /* Remove padding */
        background: transparent; /* Remove background */
        border: none; /* Remove border */
    `;

    // Create app icons
    const leftIcon = document.createElement('img');
    leftIcon.style.cssText = `
        height: 30px;
        margin-bottom: 2px;
    `;

    const rightIcon = document.createElement('img');
    rightIcon.style.cssText = `
        height: 30px;
        margin-bottom: 2px;
    `;

    // Create text elements for app descriptions
    const leftAppText = document.createElement('span');
    leftAppText.style.cssText = `
        font-size: 0.75em; /* Smaller text */
        color: rgba(255, 255, 255, 0.9);
        margin-top: 2px;
        max-width: 110px;
        text-align: center;
        line-height: 1.2; /* Reduced line height */
    `;

    const rightAppText = document.createElement('span');
    rightAppText.style.cssText = `
        font-size: 0.75em; /* Smaller text */
        color: rgba(255, 255, 255, 0.9);
        margin-top: 2px;
        max-width: 100px;
        text-align: center;
        line-height: 1.2; /* Reduced line height */
    `;

    // Assemble the elements
    leftApp.appendChild(leftIcon);
    rightApp.appendChild(rightIcon);
    leftApp.appendChild(leftAppText);
    rightApp.appendChild(rightAppText);
    appSection.appendChild(exampleText); // Add "for example:" text
    appSection.appendChild(leftApp);
    appSection.appendChild(rightApp);

    // Insert app section above the slider
    const sliderContainer = document.querySelector('.slider-container'); // Assuming you have a slider container
    sliderContainer.parentNode.insertBefore(appSection, sliderContainer);

    // Create scanner intro elements
    const scannerIntro = document.createElement('div');
    scannerIntro.className = 'scanner-intro';
    scannerIntro.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(10, 25, 50, 0.95);
        color: rgb(0, 240, 255);
        z-index: 1000;
        font-family: "Orbitron", sans-serif;
        padding: 20px;
        overflow: hidden;
        box-sizing: border-box;
    `;
    
    // Create typing text element
    const typingText = document.createElement('div');
    typingText.className = 'typing-text';
    typingText.style.cssText = `
        font-size: 1.5em;
        margin-bottom: 30px;
        min-height: 1.5em;
        text-align: center;
        max-width: 90%;
        position: relative;
        z-index: 1010;
    `;
    
    // Create loading bar container
    const loadingBarContainer = document.createElement('div');
    loadingBarContainer.style.cssText = `
        width: 80%;
        max-width: 400px;
        height: 20px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 40px;
        border: 2px solid rgba(0, 240, 255, 0.4);
    `;
    
    // Create loading bar
    const loadingBar = document.createElement('div');
    loadingBar.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, rgba(0, 240, 255, 0.7), rgba(115, 255, 254, 0.9));
        border-radius: 8px;
        transition: width 0.1s ease;
    `;
    loadingBarContainer.appendChild(loadingBar);
    
    // Create tap to begin button
    const tapToBeginBtn = document.createElement('button');
    tapToBeginBtn.textContent = '[ Tap to Begin ]';
    tapToBeginBtn.id = 'startJourney';
    tapToBeginBtn.style.cssText = `
        background: transparent;
        color: rgb(115, 255, 254);
        border: 2px solid rgb(115, 255, 254);
        padding: 10px 25px;
        font-size: 1.2em;
        border-radius: 5px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.5s ease, transform 0.3s ease;
        font-family: "Orbitron", sans-serif;
        transform: scale(0.9);
        display: none;
    `;
    
    tapToBeginBtn.onmouseover = () => {
        tapToBeginBtn.style.transform = 'scale(1.05)';
        tapToBeginBtn.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
    };
    
    tapToBeginBtn.onmouseout = () => {
        tapToBeginBtn.style.transform = 'scale(1)';
        tapToBeginBtn.style.backgroundColor = 'transparent';
    };
    
    // Assemble scanner intro
    scannerIntro.appendChild(typingText);
    scannerIntro.appendChild(loadingBarContainer);
    scannerIntro.appendChild(tapToBeginBtn);
    
    // Add scanner intro to the document
    document.querySelector('.container').appendChild(scannerIntro);
    
    // Type animation function
    function typeText(text, element, callback, speed = 40) {
        let i = 0;
        element.textContent = '';
        
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
                if (callback) callback();
            }
        }, speed);
    }
    
    // Loading bar animation function
    function animateLoadingBar(duration, callback) {
        let progress = 0;
        const interval = 20; // Update interval in ms
        const increment = interval / duration * 100;
        
        const loading = setInterval(() => {
            progress += increment;
            loadingBar.style.width = `${Math.min(progress, 100)}%`;
            
            if (progress >= 100) {
                clearInterval(loading);
                if (callback) callback();
            }
        }, interval);
    }
    
    // Start the animations when page loads
    setTimeout(() => {
        typeText("Getting ready to scan your Digital Self...", typingText, () => {
            setTimeout(() => {
                animateLoadingBar(2000, () => {
                    tapToBeginBtn.style.display = 'block';
                    setTimeout(() => {
                        tapToBeginBtn.style.opacity = '1';
                    }, 200);
                });
            }, 500);
        });
    }, 500);
    
    // Handle tap to begin (startJourney) button
    tapToBeginBtn.addEventListener('click', () => {
        // Resume audio context on user interaction
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Start BGM only after user interaction
        if (!bgm || bgm.paused) {
            initBGM();
        }
        
        // Play start sound at normal volume
        const startAudio = new Audio('../sound/start.mp3');
        startAudio.volume = 1.0;
        startAudio.play().catch(err => console.error("Error playing start sound:", err));

        // Add a 0.5s pulse effect before showing questions
        tapToBeginBtn.style.transform = 'scale(1.12)';
        tapToBeginBtn.style.boxShadow = '0 0 24px #00f0ff, 0 0 40px #00f0ff44';
        setTimeout(() => {
            tapToBeginBtn.style.transform = '';
            tapToBeginBtn.style.boxShadow = '';
            scannerIntro.style.opacity = '0';
            scannerIntro.style.transition = 'opacity 0.7s ease';
            setTimeout(() => {
                scannerIntro.style.display = 'none';
                questionSection.classList.remove('hidden');
                appSection.style.opacity = '1'; // Show the app section
                showQuestion();
            }, 700);
        }, 500);
    });

    // Update the slider value display
    responseSlider.addEventListener('input', () => {
        const sliderValue = parseFloat(responseSlider.value);
        sliderValueDisplay.textContent = sliderValue.toFixed(1);

        // Adjust these values to start from the default size
        const maxFontSize = 1.4; // Reduced from 1.4
        const minFontSize = 0.9; // Reduced from 1.0

        // Calculate font size based on slider value
        const leftFontSize = maxFontSize - (sliderValue / 100) * (maxFontSize - minFontSize);
        const rightFontSize = minFontSize + (sliderValue / 100) * (maxFontSize - minFontSize);

        // Apply font sizes to labels
        sliderLabelLeft.style.fontSize = `${leftFontSize}em`;
        sliderLabelRight.style.fontSize = `${rightFontSize}em`;
    });
    

    // Show the next question on button click
    nextQuestionBtn.addEventListener('click', () => {
        const revealAudio = new Audio('../sound/reveal.mp3');
        revealAudio.volume = 0.3;
        revealAudio.play();

        // Add a 0.5s pulse effect before showing the next question or results
        nextQuestionBtn.style.transform = 'scale(1.10)';
        nextQuestionBtn.style.boxShadow = '0 0 18px #00f0ff, 0 0 30px #00f0ff44';
        setTimeout(() => {
            nextQuestionBtn.style.transform = '';
            nextQuestionBtn.style.boxShadow = '';

            saveAnswer(responseSlider.value);

            const score = parseFloat(responseSlider.value);
            const questionData = {
                type: 'questionCompleted',
                questionIndex: currentQuestionIndex,
                score: score,
                dataType: questions[currentQuestionIndex].dataType,
                sessionId: sessionId
            };

            // Save to Firebase
            saveToFirebase(questionData);

            // Log the data but don't open a window
            console.log("Data saved for question", currentQuestionIndex, "with score:", score);

            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                endJourney();
            }
        }, 500);
    });

    // Function to show the current question
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.text;
        sliderLabelLeft.textContent = question.leftLabel;
        sliderLabelRight.textContent = question.rightLabel;

        // Update app icons and text
        leftIcon.src = question.apps.left.icon;
        rightIcon.src = question.apps.right.icon;
        leftAppText.textContent = question.apps.left.example;
        rightAppText.textContent = question.apps.right.example;

        // Reset slider position and display
        responseSlider.value = 50;
        sliderValueDisplay.textContent = responseSlider.value;
        
        // Reset label font sizes to default
        sliderLabelLeft.style.fontSize = '1em';
        sliderLabelRight.style.fontSize = '1em';
    }

    // Function to end the journey
    function endJourney() {
        const { database, ref, set } = window.firebaseDb;
        
        // Calculate the average score
        const totalScore = responses.reduce((sum, response) => sum + parseFloat(response.answer), 0);
        const averageScore = totalScore / questions.length;

        // Prepare detailed results by data type
        const surveyDetailedResults = {};
        questions.forEach((q, idx) => {
            // Find the response for this question
            const resp = responses.find(r => r.question === idx + 1);
            if (resp) {
                surveyDetailedResults[q.dataType] = parseFloat(resp.answer);
            }
        });

        // --- Sci-fi Progress Bar Helper ---
        function getProgressBar(score) {
            // Score is 0-100
            const percent = Math.max(0, Math.min(100, score));
            // Use a blue-cyan gradient for all bars
            const barColor = 'linear-gradient(90deg, #00f0ff 0%, #0070ff 100%)';
            return `
            <div style="
                width: 100%;
                background: rgba(20,30,60,0.7);
                border-radius: 8px;
                margin: 8px 0 20px 0;
                box-shadow: 0 0 8px #00f0ff33, 0 0 1px #fff inset;
                height: 10px;
                overflow: hidden;
                position: relative;
            ">
                <div style="
                    width: ${percent}%;
                    height: 100%;
                    background: ${barColor};
                    box-shadow: 0 0 12px #00f0ff, 0 0 2px #fff inset;
                    border-radius: 8px 0 0 8px;
                    transition: width 0.7s cubic-bezier(.4,2,.6,1);
                    position: absolute;
                    left: 0; top: 0;
                "></div>
                <span style="
                    position: absolute;
                    right: 12px; top: 0; height: 100%;
                    display: flex; align-items: center;
                    color: #fff; font-family: 'Orbitron', monospace;
                    font-size: 1em; text-shadow: 0 0 4px #00f0ff;
                    letter-spacing: 1px;
                ">${percent.toFixed(1)}</span>
            </div>
            `;
        }

        // --- Build the detailed results section ---
        let detailsHTML = '';
        Object.entries(surveyDetailedResults).forEach(([dataType, score]) => {
            detailsHTML += `
                <div style="margin-bottom: 10px;">
                    <span style="font-family:'Orbitron',sans-serif; color:ghostwhite; font-size:0.9em; letter-spacing:1px;">
                        ${dataType}
                    </span>
                    ${getProgressBar(score)}
                </div>
            `;
        });

        // --- Styles ---
        const styles = {
            container: 'padding: 10px; border-radius: 15px;',
            title: `font-size: 1.8em; color: #00f9ff; margin-bottom: 15px; margin-top: 10px; text-align: center; text-shadow: 0 0 3px rgba(0, 240, 255, 0.3);font-family: 'Orbitron', sans-serif;`,
            divider: 'width: 75%; height: 2px; background: linear-gradient(to right, transparent, #00f0ff, transparent); animation: glowPulse 4s infinite;margin: 15px auto 25px;',
            scoreContainer: 'font-size: 1.2em; color: ghostwhite; text-align: center; margin: 20px 0 10px 0; padding: 16px; background: rgba(0, 240, 255, 0.1); border-radius: 10px; border: 1px solid rgba(0, 240, 255, 0.3);',
            score: 'font-size: 1.4em; color: #00f9ff; font-weight: bold; text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);',
            footer: 'margin: 20px 0 10px; font-style: italic; color: #444a7c; text-align: center; font-size: 1.1em;',
            // New: scrollable bar section
            barSection: `
                margin: 20px 0 5px 0;
                max-height: 200px;
                overflow-y: auto;
                background: rgba(10, 30, 60, 0.18);
                border-radius: 12px;
                box-shadow: 0 0 12px #00f0ff22;
                padding: 18px 18px 8px 18px;
                scrollbar-width: thin;
                scrollbar-color: #00f0ff #001a2e;
            `
        };

        // --- Display the results with progress bars in a scrollable section ---
        questionSection.innerHTML = `
            <div style="${styles.container}">
                <h2 style="${styles.title}">Your Digital Privacy Profile</h2>
                <div style="${styles.divider}"></div>
                
                <div style="${styles.scoreContainer}">
                    Your privacy score is: 
                    <span style="${styles.score}">${averageScore.toFixed(1)}</span> out of 100
                </div>

                <div style="margin: 30px 0 0px 0;">
                    <span style="font-family:'Orbitron',sans-serif; color:#00f0ff; font-size:1.1em;">
                        Detailed Results by Data Type
                    </span>
                    <div style="${styles.barSection}">
                        ${detailsHTML}
                    </div>
                </div>

                <p style="${styles.footer}">
                    Check your own digital privacy profile and costumes!
                </p>
                <button id="restartBtn" style="
                    margin-top: 20px;
                    background: transparent;
                    color: #00f0ff;
                    border: 2px solid #00f0ff;
                    padding: 10px 28px;
                    font-size: 1.1em;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.3s, color 0.3s;
                    font-family: 'Orbitron', sans-serif;
                    box-shadow: 0 0 8px rgba(0,240,255,0.15);
                ">Restart</button>
            </div>
        `;

        // Optionally, add custom scrollbar styling for Webkit browsers
        const style = document.createElement('style');
        style.textContent = `
            .question-section div[style*="overflow-y: auto"]::-webkit-scrollbar {
                width: 7px;
                background: #001a2e;
                border-radius: 8px;
            }
            .question-section div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
                background: #00f0ff;
                border-radius: 8px;
            }
        `;
        document.head.appendChild(style);

        // Save final results to Firebase
        const finalResultsRef = ref(database, `sessions/${sessionId}/finalResults`);
        const finalResults = {
            sessionId: sessionId,
            timestamp: Date.now(),
            averageScore: averageScore,
            detailedResults: surveyDetailedResults
        };

        set(finalResultsRef, finalResults)
            .then(() => {
                console.log('Final results saved to Firebase');
            })
            .catch((error) => {
                console.error('Error saving final results:', error);
            });

        // Add event listener for the Restart button
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                // Play sound effect at lower volume
                const audio = new Audio('../sound/restart.mp3');
                audio.volume = 0.45;
                audio.play().catch(err => console.error("Error playing restart sound:", err));

                // Stop the BGM
                if (bgm) {
                    bgm.pause();
                    bgm.currentTime = 0;
                }

                // Use relative path to fix navigation error
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            });
        }
    }

    // Function to save answers
    let responses = [];
    function saveAnswer(value) {
        responses.push({ 
            question: currentQuestionIndex + 1, 
            answer: value,
            // Add stage calculation here
            stage: mapScoreToStage(parseFloat(value))
        });
        console.log(`Question ${currentQuestionIndex + 1} answer: ${value}, stage: ${mapScoreToStage(parseFloat(value))}`);
    }

    // Helper function to map scores to stages (1-4)
    function mapScoreToStage(score) {
        if (score <= 25) return 1;        // Warning state (0-25)
        else if (score <= 50) return 2;   // Caution state (26-50)
        else if (score <= 75) return 3;   // Secure state (51-75)
        else return 4;                    // Optimal state (76-100)
    }
});
// Canvas code should be inside here
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 0.4 + 0.1,
        angle: Math.random() * 2 * Math.PI,
        opacity: Math.random() * 0.3 + 0.2
    }));

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        for (const p of particles) {
            ctx.fillStyle = `rgba(0,255,255,${p.opacity})`;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle); // 让每个菱形角度不同
            
            const size = p.radius * 2.2; // 菱形尺寸（根据原始 radius 放大点）
    
            ctx.beginPath();
            ctx.moveTo(0, -size);       // 上
            ctx.lineTo(size, 0);        // 右
            ctx.lineTo(0, size);        // 下
            ctx.lineTo(-size, 0);       // 左
            ctx.closePath();
            ctx.fill();
    
            ctx.restore();
    
            // 移动粒子
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
    
            // Wrap around screen edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        }
        requestAnimationFrame(drawParticles);
    }
    drawParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}