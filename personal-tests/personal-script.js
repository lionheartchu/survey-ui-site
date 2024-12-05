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
            text: "Sitting by a calm lake, you start snapping photos and taking a few selfies to capture the moment. Do you save personal images in a private folder, or are most of them stored in a public library on your device?",
            leftLabel: "Mostly in a public library",
            rightLabel: "Separated Private Folder",
            dataType: "Visual  Data"
        },
        {
            text: "Sitting by the fire, you casually reach for your phone. How often do you share updates with friends or family via messaging apps?",
            leftLabel: "Every single moment!",
            rightLabel: "Rarely during the trip",
            dataType: "Communication data"
        },
        {
            text: "Staying alone stirs up memories and personal reflections. Do you typically keep milestones or updates (like birthdays or achievements) private, or share them openly on social media?",
            leftLabel: "I enjoy sharing everything",
            rightLabel: "I usually keep them private",
            dataType: "Personal Data"
        },
        {
            text: "Feeling ready to explore this new place, you ponder your options. Would you rather search for others’ recommendations first, or discover them yourself?",
            leftLabel: "Look up recommendations",
            rightLabel: "Explore on my own",
            dataType: "Cognitive  Data"
        },
        {
            text: "Alone in this quiet spot, it’s just you, the nature sounds, and your phone. Do you feel comfortable speaking aloud whatever you want to say?",
            leftLabel: "Totally comfortable!",
            rightLabel: "Not really...",
            dataType: "Audio  Data"
        },
        {
            text: "After the trip, a travel app you didn’t open during your trip asks about your experience in the area. How would you feel about this request?",
            leftLabel: "That’s quite sweet!",
            rightLabel: "That's scary",
            dataType: "Geolocation  Data"
        },
        {
            text: "After a long day of hiking, you check your step count. Do you find comfort in tracking your physical activity, or do you prefer not to keep tabs on it?",
            leftLabel: "I enjoy keep tracking",
            rightLabel: "Prefer not to monitor it",
            dataType: "Biometric  Data"
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
    if (currentQuestionIndex >= 3 && currentQuestionIndex <= 4 ) {
        body.style.backgroundImage = "url('hike.jpg')";
    } else if (currentQuestionIndex >= 1 && currentQuestionIndex <= 2) {
        body.style.backgroundImage = "url('fire.jpg')";
    } else if (currentQuestionIndex == 0 ) {
        body.style.backgroundImage = "url('lake.jpg')";
    } else if (currentQuestionIndex > 4 ) {
        body.style.backgroundImage = "url('hammock.jpeg')";
    } else {
        body.style.backgroundImage = "url('def.jpg')"; // Default background image
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
