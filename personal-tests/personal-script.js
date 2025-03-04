document.addEventListener('DOMContentLoaded', () => {
    const startJourneyBtn = document.getElementById('startJourney');
    const questionSection = document.getElementById('questionSection');
    const questionText = document.getElementById('questionText');
    const responseSlider = document.getElementById('responseSlider');
    const sliderValueDisplay = document.getElementById('sliderValue');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    
    // Slider labels
    const sliderLabelLeft = document.getElementById('sliderLabelLeft');
    const sliderLabelRight = document.getElementById('sliderLabelRight');

    // Questions array with labels for each question
    const questions = [
        {
            text: "When posting personal photos on social media, you prefer:",
            leftLabel: "Use default open-to-all settings",
            rightLabel: "Customize privacy controls",
            dataType: "Visual Data",
            apps: {
                left: {
                    icon: "../images/instagram-icon.png", // Updated path with ..
                    name: "Instagram"
                },
                right: {
                    icon: "../images/facebook-icon.png", // Updated path with ..
                    name: "Facebook"
                }
            }
        },
        {
            text: "When sending personal messages on Apps, you prefer:",
            leftLabel: "Keep auto-save and default chat history",
            rightLabel: "Use apps with self-destruct options",
            dataType: "Communication Data",
            apps: {
                left: {
                    icon: "../images/whatsapp-icon.png", // Updated path with ..
                    name: "WhatsApp"
                },
                right: {
                    icon: "../images/imessage-icon.svg", // Updated path with ..
                    name: "iMessage"
                }
            }
        },
        {
            text: "When creating personal profiles on social platforms, you prefer:",
            leftLabel: "Share all the info by default",
            rightLabel: "Manage what's visible selectively",
            dataType: "Personal Data",
            apps: {
                left: {
                    icon: "../images/facebook-icon.png", // Updated path with ..
                    name: "Facebook"
                },
                right: {
                    icon: "../images/linkedin-icon.png", // Updated path with ..
                    name: "LinkedIn"
                }
            }
        },
        {
            text: "When apps analyze your data to suggest interests, you prefer:",
            leftLabel: "Allow full tracking for convenience",
            rightLabel: "Limit data collection for privacy",
            dataType: "Cognitive Data",
            apps: {
                left: {
                    icon: "../images/facebook-icon.png", // Updated path with ..
                    name: "Facebook"
                },
                right: {
                    icon: "../images/instagram-icon.png", // Updated path with ..
                    name: "Instagram"
                }
            }
        },
        {
            text: "When using voice assistants, you prefer:",
            leftLabel: "Keep default recording settings",
            rightLabel: "Opt for enhanced privacy controls",
            dataType: "Audio Data",
            apps: {
                left: {
                    icon: "../images/siri-icon.png", // Updated path with ..
                    name: "Siri"
                },
                right: {
                    icon: "../images/google-assistant-icon.png", // Updated path with ..
                    name: "Google Assistant"
                }
            }
        },
        {
            text: "When using apps that track your locations for social features, you prefer:",
            leftLabel: "Enable continuous location sharing",
            rightLabel: "Share location only when needed",
            dataType: "Geolocation Data",
            apps: {
                left: {
                    icon: "../images/google-maps-icon.png", // Updated path with ..
                    name: "Google Maps"
                },
                right: {
                    icon: "../images/instagram-icon.png", // Updated path with ..
                    name: "Instagram"
                }
            }
        },
        {
            text: "When using biometric login to access personal accounts, you prefer:",
            leftLabel: "Accept the default setup",
            rightLabel: "Verify secure handling of your biometric data",
            dataType: "Biometric Data",
            apps: {
                left: {
                    icon: "../images/apple-pay-icon.png", // Updated path with ..
                    name: "Apple Pay"
                },
                right: {
                    icon: "../images/boa-icon.png", // Updated path with ..
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
        saveAnswer(responseSlider.value); // Save the current answer
        
        // Send message to Site B that this question was completed
        const score = parseFloat(responseSlider.value);
        const questionData = {
            type: 'questionCompleted',
            questionIndex: currentQuestionIndex,
            score: score,
            dataType: questions[currentQuestionIndex].dataType
        };
        
        // Log attempt
        const costumeSiteUrl = 'https://lionheartchu.github.io/costume-display/';
        console.log("Attempting to send data to:", costumeSiteUrl, questionData);
        
        // Try different methods for sending
        // 1. Direct window communication if we have a reference
        if (costumeWindow && !costumeWindow.closed) {
            try {
                costumeWindow.postMessage(questionData, '*');  // Use * during testing
                console.log("Sent via direct window reference");
            } catch (e) {
                console.error("Direct window send failed:", e);
            }
        } 
        // 2. Try parent if in iframe
        else if (window.parent && window.parent !== window) {
            try {
                window.parent.postMessage(questionData, '*');  // Use * during testing
                console.log("Sent via parent frame");
            } catch (e) {
                console.error("Parent frame send failed:", e);
            }
        }
        // 3. If all else fails, open a new window with URL params
        else {
            console.log("No existing communication channel found, trying broadcast");
            // Try a broadcast message first
            try {
                window.postMessage(questionData, '*');
            } catch (e) {
                console.error("Broadcast failed:", e);
            }
        }
        
        // Move to next question
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

        // Prepare data for Site B
        const surveyData = {
            type: 'surveyResults',
            responses: responses.map(response => ({
                ...response,
                dataType: questions[response.question - 1].dataType
            })),
            averageScore: averageScore,
            weakestDataType: weakestDataType,
            strongestDataType: strongestDataType
        };
        
        // Send the data to Site B
        const costumeSiteUrl = 'https://lionheartchu.github.io/costume-display/';
        console.log("Sending final survey results to:", costumeSiteUrl, surveyData);
        
        // Try different methods to send the data
        // 1. Direct window communication if we have a reference
        if (costumeWindow && !costumeWindow.closed) {
            try {
                costumeWindow.postMessage(surveyData, '*');  // Use * during testing
                console.log("Survey results sent via direct window reference");
            } catch (e) {
                console.error("Direct window send failed:", e);
            }
        } 
        // 2. Try parent if in iframe
        else if (window.parent && window.parent !== window) {
            try {
                window.parent.postMessage(surveyData, '*');  // Use * during testing
                console.log("Survey results sent via parent frame");
            } catch (e) {
                console.error("Parent frame send failed:", e);
            }
        }
        // 3. Open a new window as last resort
        else {
            console.log("No existing communication channel, opening new window");
            const params = new URLSearchParams();
            params.append('surveyData', JSON.stringify(surveyData));
            costumeWindow = window.open(`${costumeSiteUrl}?${params.toString()}`, '_blank');
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

    // Open the costume site in a new window at the beginning to establish communication
    document.addEventListener('DOMContentLoaded', function() {
        // Optional: Pre-open the costume site to establish a window reference
        // Uncomment if you want to open the window immediately on page load
        /*
        const costumeSiteUrl = 'https://lionheartchu.github.io/costume-display/';
        costumeWindow = window.open(costumeSiteUrl, 'costumeDisplay');
        console.log("Pre-opened costume site window");
        */
    });
});
