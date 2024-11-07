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
            leftLabel: "No, I’ll manage manually",
            rightLabel: "Sure, it’s convenient"
        },
        {
            text: "The quiet setting helps you feel more at ease. Do you record personal information, like mood or stress levels, in health-tracking apps?",
            leftLabel: "No, I keep those private",
            rightLabel: "Yes, to track my progress"
        },
        {
            text: "You approach cave walls marked with familiar patterns. Would you your first response be analyzing them yourself, or look them up online?",
            leftLabel: "Do it by myself",
            rightLabel: "Search online"
        },
        {
            text: "You hear soft echoes in the cave, like the hum of a distant song. Do you feel comfortable with wellness apps tracking sound to analyze stress levels?",
            leftLabel: "Not necessarily",
            rightLabel: "Sounds pretty helpful!"
        },
        {
            text: "The water surface looks so clear that you can see the reflection of your own face. Do you often use face capture on your devices for unlocking?",
            leftLabel: "Try to avoid",
            rightLabel: "Yes, that’s convenient"
        },
        {
            text: "A subtle pulse in the water draws your attention, and you capture the rhythm with your device. How often do you share updates about daily exercise or wellness progress with others?",
            leftLabel: "Rarely, only when needed",
            rightLabel: "Regularly to stay connected"
        },
        {
            text: "The water surface looks so clear that you can see the reflection of your own face. Do you often use face capture on your devices for unlocking?",
            leftLabel: "That's scary",
            rightLabel: "That seems helpful"
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
        sliderValueDisplay.textContent = responseSlider.value;
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

        responseSlider.value = 3; // Reset slider position
        sliderValueDisplay.textContent = responseSlider.value; // Reset slider display
    }

    // Function to end the journey (replace with actual ending logic)
    function endJourney() {
        questionSection.innerHTML = "<h2>Thank you for completing the journey :) Check your costume and security level!</h2>";
        // Send responses as JSON to Site A
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
