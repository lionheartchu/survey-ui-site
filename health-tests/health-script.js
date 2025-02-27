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
            text: "When posting health photos on social apps, you prefer:",
            leftLabel: "Use default open settings",
            rightLabel: "Customize privacy controls",
            dataType: "Visual Data",
            example: {
                icon: "../images/instagram-icon.png", // Replace with actual icon path
                text: "workout or meal pics on Instagram"
            }
        },
        {
            text: "When texting health tips or updates to others, you prefer:",
            leftLabel: "Keep default messaging settings",
            rightLabel: "Use apps with extra privacy options",
            dataType: "Communication Data",
            example: {
                icon: "../images/whatsapp-icon.png", // Replace with actual icon path
                text: "with a doctor or support group on WhatsApp"
            }
        },
        {
            text: "When managing your health records, you prefer:",
            leftLabel: "Keep default privacy settings",
            rightLabel: "Adjust settings for more control",
            dataType: "Personal data",
            example: {
                icon: "../images/apple-health-icon.png", // Replace with actual icon path
                text: "Medical history records on Apple Health"
            }
        },
        {
            text: "When health apps track your habits or sleep, you prefer:",
            leftLabel: "Allow full data tracking",
            rightLabel: "Limit data collection",
            dataType: "Cognitive Data",
            example: {
                icon: "../images/apple-health-icon.png", // Replace with actual icon path
                text: "Daily steps on Apple Health"
            }
        },
        {
            text: "When using audio for health consultations, you prefer:",
            leftLabel: "Stick with standard settings",
            rightLabel: "Opt for enhanced privacy options",
            dataType: "Audio Data",
            example: {
                icon: "../images/google-assistant-icon.png", // Replace with actual icon path
                text: "Medical advice from Google Assistant"
            }
        },
        {
            text: "When apps track your workout routes, you prefer:",
            leftLabel: "Enable continuous tracking",
            rightLabel: "Share location selectively",
            dataType: "Geolocation Data",
            example: {
                icon: "../images/google-maps-icon.png", // Replace with actual icon path
                text: "Current and previous locations on Google Maps"
            }
        },
        {
            text: "When using wearables to monitor your health, you prefer:",
            leftLabel: "Accept default biometric setup",
            rightLabel: "Ensure secure data handling",
            dataType: "Biometric Data",
            example: {
                icon: "../images/apple-watch-icon.png", // Replace with actual icon path
                text: "Apple Watch heart rate and sleep data"
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
        align-items: center;
        width: 50%;
        margin: 20px auto;
        padding: 5px;
        
    `;

    // Create "for example:" text
    const exampleText = document.createElement('span');
    exampleText.textContent = "for example:";
    exampleText.style.cssText = `
        font-size: 0.8em;
        color: #666;
        margin-right: 5px;
        margin-left: 20px;
    `;

    // Create app container
    const appContainer = document.createElement('div');
    appContainer.style.cssText = `
        display: flex;
        align-items: center;
        text-align: left;
    `;

    // Create app icon
    const appIcon = document.createElement('img');
    appIcon.style.cssText = `
        height: 35px;
        border-radius: 8px;
        margin-right: 8px;
    `;

    // Create explanation text
    const appExplanation = document.createElement('span');
    appExplanation.style.cssText = `
        font-size: 0.8em;
        color: #666;
        font-style: italic;
        line-height: 1.2;
        text-align: left;
        width: 60%;
    `;

    // Assemble the elements
    appContainer.appendChild(appIcon);
    appContainer.appendChild(appExplanation);
    appSection.appendChild(exampleText);
    appSection.appendChild(appContainer);

    // Insert app section above the slider
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.parentNode.insertBefore(appSection, sliderContainer);

    // Start the journey and show the first question
    startJourneyBtn.addEventListener('click', () => {
        document.querySelector('.background').classList.add('hidden');
        questionSection.classList.remove('hidden');
        showQuestion();
        // Start applying background colors only after clicking start
        updateBackgroundColor(0);
    });

    // Update the slider value display
    responseSlider.addEventListener('input', () => {
        const sliderValue = parseFloat(responseSlider.value);
        sliderValueDisplay.textContent = sliderValue.toFixed(1); // Display slider value
    
        // Dynamically adjust label font sizes
        const maxFontSize = 1.4; // Maximum font size (in `em`)
        const minFontSize = 0.9; // Minimum font size (in `em`)
    
        // Calculate font size based on slider value
        const leftFontSize = maxFontSize - (sliderValue / 100) * (maxFontSize - minFontSize);
        const rightFontSize = minFontSize + (sliderValue / 100) * (maxFontSize - minFontSize);
    
        // Apply font sizes to labels
        sliderLabelLeft.style.fontSize = `${leftFontSize}em`;
        sliderLabelRight.style.fontSize = `${rightFontSize}em`;
    });
    

    // Show the next question on button click
    nextQuestionBtn.addEventListener('click', () => {
        saveAnswer(responseSlider.value); // Function to save the answer if needed
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endJourney();
        }
    });

    // Function to show the current question
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.text;
        sliderLabelLeft.textContent = question.leftLabel;
        sliderLabelRight.textContent = question.rightLabel;

        // Update app icon and explanation
        appIcon.src = question.example.icon;
        appExplanation.textContent = question.example.text;
        
        // Reset slider position and display
        responseSlider.value = 50;
        sliderValueDisplay.textContent = responseSlider.value;
        
        // Reset label font sizes to default
        sliderLabelLeft.style.fontSize = '1.1em';
        sliderLabelRight.style.fontSize = '1.1em';

        // Update background color
        updateBackgroundColor(currentQuestionIndex);
    }

    // Function to end the journey (replace with actual ending logic)
    function endJourney() {
        // Calculate the average score
        const totalScore = responses.reduce((sum, response) => sum + parseFloat(response.answer), 0);
        const averageScore = totalScore / questions.length;

        // Find lowest and highest scores
        let lowest = responses[0];
        let highest = responses[0];

        responses.forEach((response, index) => {
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
        
        // Define styles with futuristic theme (copied from personal-script.js)
        const styles = {
            container: 'padding: 30px; border-radius: 15px;',
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
                <h2 style="${styles.title}">Your Health Data Security Profile</h2>
                <div style="${styles.divider}"></div>
                
                <div style="${styles.scoreContainer}">
                    Your data security score is: 
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
                    Check your own costume with your personal data security level!
                </p>
            </div>
        `;

        // Optional: Send responses as JSON to Site A
        fetch('https://your-site-a.com/receive-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses: responses }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Data sent to Site A:', data);
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
    }

    // Placeholder function for saving answers (for later use)
    let responses = [];
    function saveAnswer(value) {
        responses.push({ question: currentQuestionIndex + 1, answer: value });
        console.log(`Question ${currentQuestionIndex + 1} answer: ${value}`);
    }

    // Background color update function with bluish-purple theme
    function updateBackgroundColor(index) {
        // Dark blue-purple base colors
        const baseColor = {
            r: 26, g: 10, b: 58  // Deep blue-purple (#1a0a3a)
        };
        
        // Brighter indigo/periwinkle accent colors
        const accentColor = {r: 84, g: 56, b: 255};  // Indigo blue (#5438ff)
        const highlightColor = {r: 123, g: 107, b: 255}; // Periwinkle (#7b6bff)
        
        // Create a futuristic bluish-purple gradient with glow effect
        document.body.style.background = `
            radial-gradient(
                circle at 60% 40%,
                rgba(${highlightColor.r}, ${highlightColor.g}, ${highlightColor.b}, 0.15) 5%,
                rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 1) 70%
            ),
            linear-gradient(
                145deg,
                rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b}),
                rgb(${baseColor.r + 32}, ${baseColor.g + 18}, ${baseColor.b + 99})
            )
        `;
        document.body.style.backgroundColor = 'transparent';
    }
});
