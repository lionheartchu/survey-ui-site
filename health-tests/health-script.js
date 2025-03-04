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
        saveAnswer(responseSlider.value); // Save answer and calculate garment stage
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

    // Function to save answers with garment stage calculation
    let responses = [];
    function saveAnswer(value) {
        // Calculate garment stage based on slider value
        const stageValue = parseFloat(value);
        let stage;
        
        if (stageValue <= 25) {
            stage = 1;
        } else if (stageValue <= 50) {
            stage = 2;
        } else if (stageValue <= 75) {
            stage = 3;
        } else {
            stage = 4;
        }
        
        // Save response with corresponding stage
        responses.push({ 
            question: currentQuestionIndex + 1, 
            answer: value,
            dataType: questions[currentQuestionIndex].dataType,
            stage: stage
        });
        
        console.log(`Question ${currentQuestionIndex + 1} answer: ${value}, Stage: ${stage}`);
    }

    // Function to end the journey and send data to Site B
    function endJourney() {
        // Calculate average score
        const totalScore = responses.reduce((sum, response) => sum + parseFloat(response.answer), 0);
        const averageScore = totalScore / questions.length;

        // Find lowest and highest scores
        let lowest = responses[0];
        let highest = responses[0];

        responses.forEach(response => {
            if (parseFloat(response.answer) < parseFloat(lowest.answer)) {
                lowest = response;
            }
            if (parseFloat(response.answer) > parseFloat(highest.answer)) {
                highest = response;
            }
        });

        // Get data types for lowest and highest
        const weakestDataType = lowest.dataType;
        const strongestDataType = highest.dataType;
        
        // Prepare data for Site B
        const dataForSiteB = {
            averageScore: averageScore.toFixed(1),
            weakestDataType: weakestDataType,
            strongestDataType: strongestDataType,
            garmentData: responses // Contains all responses with stages already calculated
        };
        
        // Send data to Site B
        console.log("Sending data to Site B:", dataForSiteB);
        
        // Actual API call to Site B
        fetch('https://site-b-endpoint.com/receive-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication headers if needed
                // 'Authorization': 'Bearer YOUR_TOKEN'
            },
            body: JSON.stringify(dataForSiteB)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // Redirect to Site B's display page with a query parameter or session token
            window.location.href = `https://site-b-endpoint.com/display?session=${data.sessionId}`;
        })
        .catch(error => {
            console.error('Error sending data to Site B:', error);
            // Show error message to user
            alert('An error occurred while processing your results. Please try again.');
        });
        
        // Display results on current page while waiting for redirect
        displayResults(averageScore, weakestDataType, strongestDataType);
    }

    // Display results function
    function displayResults(averageScore, weakestDataType, strongestDataType) {
        // Define styles with futuristic theme
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
                    Your results have been used to create a personalized garment based on your security profile.
                </p>
            </div>
        `;
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
