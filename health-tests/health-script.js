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
            text: "The glowing crystals draw you in, and you instinctively capture the view with your offline phone. Do you allow multiple apps on your device to access the camera, even if you’re unsure if they need it?",
            rightLabel: "No, I’ll manage manually",
            leftLabel: "Sure, it’s convenient",
            dataType: "Visual  Data"
        },
        {
            text: "The quiet setting helps you feel more at ease. Do you record personal information, like mood or stress levels, in health-tracking apps?",
            rightLabel: "No, I keep those private",
            leftLabel: "Yes, to track my progress",
            dataType: "Personal data"
        },
        {
            text: "You approach cave walls marked with familiar patterns. Would you your first response be analyzing them yourself, or look them up online?",
            rightLabel: "Do it by myself",
            leftLabel: "Search online",
            dataType: "Cognitive  Data"
        },
        {
            text: "You hear soft echoes in the cave, like the hum of a distant song. Do you feel comfortable with wellness apps tracking sound to analyze stress levels?",
            rightLabel: "Not necessarily",
            leftLabel: "Sounds pretty helpful!",
            dataType: "Audio  Data"
        },
        {
            text: "The water surface looks so clear that you can see the reflection of your own face. Do you often use face capture on your devices for unlocking?",
            rightLabel: "Try to avoid",
            leftLabel: "Yes, that’s convenient",
            dataType: "Biometric  Data"
        },
        {
            text: "A subtle pulse in the water draws your attention, and you capture the rhythm with your device. How often do you share updates about daily exercise or wellness progress with others?",
            rightLabel: "Rarely, only when needed",
            leftLabel: "Regularly to stay connected",
            dataType: "Communication  Data"
        },
        {
            text: "As you find your way out, your device suddenly reconnects and pins your location, asking about your experience here. How do you feel about this auto-logging feature?",
            rightLabel: "That's scary",
            leftLabel: "That seems helpful",
            dataType: "Geolocation  Data"
        },
    ];

    let currentQuestionIndex = 0;

    // Display initial slider value
    sliderValueDisplay.textContent = responseSlider.value;

    // Start the journey and show the first question
    startJourneyBtn.addEventListener('click', () => {
        document.querySelector('.background').classList.add('hidden');
        questionSection.classList.remove('hidden');
        showQuestion();
    });

    // Update the slider value display
    responseSlider.addEventListener('input', () => {
        const sliderValue = parseFloat(responseSlider.value);
        sliderValueDisplay.textContent = sliderValue.toFixed(1); // Display slider value
    
        // Dynamically adjust label font sizes
        const maxFontSize = 1.6; // Maximum font size (in `em`)
        const minFontSize = 1.0; // Minimum font size (in `em`)
    
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

        responseSlider.value = 50; // Reset slider position
        sliderValueDisplay.textContent = responseSlider.value; // Reset slider display
        const body = document.body;

        // Change background image for specific questions
    if (currentQuestionIndex >= 2 && currentQuestionIndex <4 ) {
        body.style.backgroundImage = "url('wall.jpg')";
    } else if (currentQuestionIndex == 1) {
        body.style.backgroundImage = "url('quiet.jpg')";
    } else if (currentQuestionIndex == 0 ) {
        body.style.backgroundImage = "url('caaave.png')";
    } else if (currentQuestionIndex >= 4 && currentQuestionIndex <= 5) {
        body.style.backgroundImage = "url('water.jpg')";
    } else if (currentQuestionIndex === questions.length - 1) {
        body.style.backgroundImage = "url('cave-out.jpg')";
    } else {
        body.style.backgroundImage = "url('cavebg.jpg')"; // Default background image
    }
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
    
    // Display the results
    questionSection.innerHTML = `
        <h2>Thank you for completing the journey :)</h2>
        <p style="font-size: 1.4em; color:rgb(10,32,90);text-align: center; margin-bottom:15px;margin-top:15px">Your data security scoring is: <strong style="font-size: 1.5em;color: rgb(120,204,226)">${averageScore.toFixed(1)}</strong> out of 100.</p>
        <p style="text-align: center; font-size: 1.2em;">
            Your weakest data area is: <strong style="color: #E74C3C;">${weakestDataType}</strong>;
        </p>
        <p style="text-align: center; font-size: 1.2em;margin-bottom:20px;">
            Your strongest data area is: <strong style="color: #27AE60;">${strongestDataType}</strong>.
        </p>
        <p style="margin-bottom:15px;font-style: italic;">Check your own costume with your personal data security level !</p>
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
});
