// Instead, wait for the Firebase initialization to complete
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
                    name: "Instagram"
                },
                right: {
                    icon: "../images/facebook-icon.png",
                    name: "Facebook"
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
                    name: "WhatsApp"
                },
                right: {
                    icon: "../images/imessage-icon.svg",
                    name: "iMessage"
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
                    name: "Facebook"
                },
                right: {
                    icon: "../images/linkedin-icon.png",
                    name: "LinkedIn"
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
                    icon: "../images/facebook-icon.png",
                    name: "Facebook"
                },
                right: {
                    icon: "../images/instagram-icon.png",
                    name: "Instagram"
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
                    name: "Siri"
                },
                right: {
                    icon: "../images/google-assistant-icon.png",
                    name: "Google Assistant"
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
                    name: "Google Maps"
                },
                right: {
                    icon: "../images/instagram-icon.png",
                    name: "Instagram"
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
                    icon: "../images/apple-pay-icon.png",
                    name: "Apple Pay"
                },
                right: {
                    icon: "../images/boa-icon.png",
                    name: "Mobile Banking Apps"
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
        justify-content: space-around;
        align-items: end;
        width: 40%;
        margin: 10px auto;
        padding: 5px;
        opacity: 0; // Initially hidden
        transition: opacity 0.5s ease;
    `;

    // Create "for example:" text
    const exampleText = document.createElement('span');
    exampleText.textContent = "for example:";
    exampleText.style.cssText = `
        font-size: 0.8em;
        color: #666;
        margin-right: 5px;
        margin-left: 70px;
    `;

    // Create left app container
    const leftApp = document.createElement('div');
    leftApp.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-right: -25px;
        margin-left: -25px;
    `;

    // Create right app container
    const rightApp = document.createElement('div');
    rightApp.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    `;

    // Create app icons
    const leftIcon = document.createElement('img');
    leftIcon.style.cssText = `
        height: 35px;
        border-radius: 8px;
        margin-bottom: 3px;
    `;

    const rightIcon = document.createElement('img');
    rightIcon.style.cssText = `
        height: 35px;
        border-radius: 8px;
        margin-bottom: 3px;
    `;

    // Assemble the elements
    leftApp.appendChild(leftIcon);
    rightApp.appendChild(rightIcon);
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
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(10, 25, 50, 0.9);
        color: rgb(0, 240, 255);
        z-index: 100;
        font-family: "Orbitron", sans-serif;
        padding: 20px;
    `;
    
    // Create typing text element
    const typingText = document.createElement('div');
    typingText.className = 'typing-text';
    typingText.style.cssText = `
        font-size: 1.5em;
        margin-bottom: 30px;
        min-height: 1.5em;
        text-align: center;
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
    
    // Hide the narrative section initially
    narrativeSection.style.display = 'none';
    
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
    
    // Handle tap to begin
    tapToBeginBtn.addEventListener('click', () => {
        scannerIntro.style.opacity = '0';
        scannerIntro.style.transition = 'opacity 0.7s ease';
        
        setTimeout(() => {
            scannerIntro.style.display = 'none';
            narrativeSection.style.display = 'block';
            
            // Fade in the narrative
            narrativeSection.style.opacity = '0';
            narrativeSection.style.transition = 'opacity 0.7s ease';
            
            setTimeout(() => {
                narrativeSection.style.opacity = '1';
            }, 100);
        }, 700);
    });

    // Start the journey and show the first question
    startJourneyBtn.addEventListener('click', () => {
        document.querySelector('.background').classList.add('hidden');
        questionSection.classList.remove('hidden');
        appSection.style.opacity = '1'; // Show the app section
        showQuestion();
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
        
        // Your existing window communication code
        const costumeSiteUrl = 'https://lionheartchu.github.io/costume-display/';
        const costumeUrlWithSession = `${costumeSiteUrl}?session=${sessionId}`;
        
        if (!costumeWindow || costumeWindow.closed) {
            console.log("Opening new costume window with session:", sessionId);
            costumeWindow = window.open(costumeUrlWithSession, 'costumeDisplay');
            
            setTimeout(() => {
                try {
                    costumeWindow.postMessage({
                        ...questionData,
                        sessionId: sessionId
                    }, '*');
                    console.log("Sent via newly opened window");
                } catch (e) {
                    console.error("New window send failed:", e);
                }
            }, 1500);
        } else {
            try {
                costumeWindow.postMessage({
                    ...questionData,
                    sessionId: sessionId
                }, '*');
                console.log("Sent via existing window");
            } catch (e) {
                console.error("Existing window send failed:", e);
            }
        }
        
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endJourney();
        }
    });

    // Add this at the start of your file, outside any function
    function updateBackgroundColor(index) {
        // Dark base colors
        const baseColor = {
            r: 15, g: 25, b: 60  // Dark blue-purple (#0f193c)
        };
        
        // Fluorescent accent color
        const accentColor = {r: 0, g: 240, b: 255};  // Cyan (#00f0ff)
        
        // Create a futuristic gradient with glow effect
        document.body.style.background = `
            radial-gradient(
                circle at 60% 40%,
                rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, 0.15) 5%,
                rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 1) 70%
            ),
            linear-gradient(
                135deg,
                rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b}),
                rgb(${baseColor.r + 10}, ${baseColor.g - 5}, ${baseColor.b + 15})
            )
        `;
        document.body.style.backgroundColor = 'transparent';
    }

    // Function to show the current question
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.text;
        sliderLabelLeft.textContent = question.leftLabel;
        sliderLabelRight.textContent = question.rightLabel;

        // Update app icons
        leftIcon.src = question.apps.left.icon; // Assuming you have the app data in your questions array
        rightIcon.src = question.apps.right.icon;

        // Reset slider position and display
        responseSlider.value = 50;
        sliderValueDisplay.textContent = responseSlider.value;
        
        // Reset label font sizes to default
        sliderLabelLeft.style.fontSize = '1em';
        sliderLabelRight.style.fontSize = '1em';

        // Update background color
        updateBackgroundColor(currentQuestionIndex);
    }

    // Add this to ensure background is set on initial load
    document.addEventListener('DOMContentLoaded', () => {
        updateBackgroundColor(0);
    });

    // Global variable to store reference to costume window if opened
    let costumeWindow = null;

    // Function to end the journey
    function endJourney() {
        const { database, ref, set } = window.firebaseDb;
        
        // Calculate the average score
        const totalScore = responses.reduce((sum, response) => sum + parseFloat(response.answer), 0);
        const averageScore = totalScore / questions.length;

        // Find lowest and highest scores
        let lowest = responses[0];
        let highest = responses[0];

        responses.forEach((response) => {
            if (parseFloat(response.answer) < parseFloat(lowest.answer)) {
                lowest = response;
            }
            if (parseFloat(response.answer) > parseFloat(highest.answer)) {
                highest = response;
            }
        });

        // Get data types for lowest and highest
        const weakestDataType = questions[lowest.question - 1].dataType;
        const strongestDataType = questions[highest.question - 1].dataType;
        
        // Define styles with futuristic theme optimized for light background
        const styles = {
            container: 'padding: 30px; border-radius: 15px;', // Removed background color
            title: 'font-size: 1.8em; color: #0f193c; margin-bottom: 15px; text-align: center; text-shadow: 0 0 3px rgba(0, 240, 255, 0.3);',
            divider: 'width: 80%; height: 2px; background: linear-gradient(to right, transparent, #00f0ff, transparent); margin: 20px auto 30px;',
            scoreContainer: 'font-size: 1.4em; color: #1e0f3c; text-align: center; margin: 25px 0; padding: 20px; background: rgba(0, 240, 255, 0.1); border-radius: 10px; border: 1px solid rgba(0, 240, 255, 0.3);',
            score: 'font-size: 1.5em; color: #0f193c; font-weight: bold; text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);',
            dataArea: 'text-align: center; font-size: 1.2em; margin: 10px 0; padding: 15px;',
            weakArea: 'color:rgb(233, 17, 53); font-weight: bold; text-shadow: 0 0 5px rgba(255, 51, 102, 0.3);',
            strongArea: 'color:rgb(12, 101, 142); font-weight: bold; text-shadow: 0 0 5px rgba(0, 238, 255, 0.4);',
            footer: 'margin: 25px 0 10px; font-style: italic; color: #444a7c; text-align: center; font-size: 1.1em;'
        };
        
        // Display the results with futuristic styles
        questionSection.innerHTML = `
            <div style="${styles.container}">
                <h2 style="${styles.title}">Your Digital Privacy Profile</h2>
                <div style="${styles.divider}"></div>
                
                <div style="${styles.scoreContainer}">
                    Your privacy score is: 
                    <span style="${styles.score}">${averageScore.toFixed(1)}</span> out of 100
                </div>

                <div style="${styles.dataArea}">
                    Your most vulnerable area is: 
                    <span style="${styles.weakArea}">${weakestDataType}</span>
                </div>

                <div style="${styles.dataArea}">
                    Your strongest area is: 
                    <span style="${styles.strongArea}">${strongestDataType}</span>
                </div>

                <p style="${styles.footer}">
                    Check your own digital privacy profile and costumes!
                </p>
            </div>
        `;

        // Create a detailed report for Site B
        const surveyDetailedResults = {};
        
        // Organize results by data type
        responses.forEach(response => {
            const questionIndex = response.question - 1;
            const dataType = questions[questionIndex].dataType;
            const score = parseFloat(response.answer);
            
            // Store each score by data type
            surveyDetailedResults[dataType] = score;
        });

        // Save final results to Firebase
        const finalResultsRef = ref(database, `sessions/${sessionId}/finalResults`);
        const finalResults = {
            sessionId: sessionId,
            timestamp: Date.now(),
            averageScore: averageScore,
            weakestDataType: weakestDataType,
            strongestDataType: strongestDataType,
            detailedResults: surveyDetailedResults
        };

        set(finalResultsRef, finalResults)
            .then(() => {
                console.log('Final results saved to Firebase');
            })
            .catch((error) => {
                console.error('Error saving final results:', error);
            });

        // Your existing window communication code...
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

    // Open the costume site in a new window at the beginning to establish communication
    document.addEventListener('DOMContentLoaded', function() {
        // Pre-open the costume site to establish a window reference
        const costumeSiteUrl = 'https://lionheartchu.github.io/costume-display/';
        console.log("Pre-opening costume site window");
        
        // Use a button to open the window (to avoid popup blockers)
        const openWindowBtn = document.createElement('button');
        openWindowBtn.textContent = 'Connect To Costume Display';
        openWindowBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 240, 255, 0.2);
            color: white;
            border: 1px solid rgba(0, 255, 240, 0.8);
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        `;
        
        openWindowBtn.onclick = function() {
            costumeWindow = window.open(costumeSiteUrl, 'costumeDisplay');
            console.log("Costume site window opened");
            this.textContent = 'Connected';
            this.disabled = true;
            this.style.opacity = '0.5';
        };
        
        document.body.appendChild(openWindowBtn);
    });
});