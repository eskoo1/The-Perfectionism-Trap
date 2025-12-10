// Game variables
let stress = 0;
let questionIndex = 0;
let time = 20;
let timer;
let gameCompleted = false;
let questionsAnswered = 0;
const totalQuestions = 15;

// Extended question array
const questions = [
    {
        q: "There's an important test tomorrow. Do you decide to review the material once more?",
        choices: [
            {text:"Do everything perfectly ✍️", stress:+8},
            {text:"Review the main topics 😴", stress:+3},
            {text:"Relax and rest 🧘", stress:-4}
        ]
    },
    {
        q:"In a group project, you're offered to take the difficult part",
        choices:[
            {text:"Do everything yourself 💪", stress:+12},
            {text:"Distribute tasks equally 🤝", stress:+4},
            {text:"Discuss the distribution 🗣️", stress:-2}
        ]
    },
    {
        q:"You got 4 instead of 5. What are your thoughts?",
        choices:[
            {text:"Could have done better 😣", stress:+10},
            {text:"Learning from mistakes 🙂", stress:+2},
            {text:"Good result! 🎉", stress:-3}
        ]
    },
    {
        q:"The project is almost ready, but details can be improved",
        choices:[
            {text:"Bring to perfection 🔥", stress:+9},
            {text:"Improve important moments ✅", stress:+3},
            {text:"Good enough as is 🚀", stress:-4}
        ]
    },
    {
        q:"A colleague praises your work, but you see flaws",
        choices:[
            {text:"Point out the mistakes 📝", stress:+7},
            {text:"Thank them and take note 🤫", stress:+2},
            {text:"Accept the compliment 😊", stress:-5}
        ]
    },
    {
        q:"Urgent task due in one hour instead of three",
        choices:[
            {text:"Do it perfectly 🕐", stress:+15},
            {text:"Do it with quality ⚡", stress:+5},
            {text:"Discuss deadlines 🤝", stress:+1}
        ]
    },
    {
        q:"Manager praises work but asks for revisions",
        choices:[
            {text:"Redo completely 🔄", stress:+8},
            {text:"Make necessary edits ✏️", stress:+3},
            {text:"Suggest an alternative 💡", stress:+1}
        ]
    },
    {
        q:"You're 5 minutes late for a meeting",
        choices:[
            {text:"Apologize several times 😰", stress:+6},
            {text:"Apologize once 🙏", stress:+2},
            {text:"Don't emphasize it 😐", stress:-2}
        ]
    },
    {
        q:"Email contains a small error",
        choices:[
            {text:"Rewrite completely ✍️", stress:+7},
            {text:"Fix the error ✅", stress:+1},
            {text:"Leave as is 📧", stress:-3}
        ]
    },
    {
        q:"Presentation is 90% ready",
        choices:[
            {text:"Bring to 100% 🔥", stress:+9},
            {text:"Leave as is 🎯", stress:+2},
            {text:"Ask colleagues' opinion 👥", stress:+1}
        ]
    },
    {
        q:"Free evening after work",
        choices:[
            {text:"Learn something new 📚", stress:+5},
            {text:"Relax with family 👨‍👩‍👧", stress:-3},
            {text:"Do a hobby 🎨", stress:-4}
        ]
    },
    {
        q:"Notice a mistake in colleague's report",
        choices:[
            {text:"Point out all mistakes 🎯", stress:+6},
            {text:"Point out the main thing 📌", stress:+2},
            {text:"Praise the work 🌟", stress:-2}
        ]
    },
    {
        q:"You're offered a promotion with more workload",
        choices:[
            {text:"Take all tasks immediately 🚀", stress:+12},
            {text:"Discuss gradual increase 🤝", stress:+4},
            {text:"Take time to think ⏰", stress:-1}
        ]
    },
    {
        q:"Project completed ahead of schedule",
        choices:[
            {text:"Find something to improve 🔍", stress:+7},
            {text:"Rest until deadline 🛋️", stress:-4},
            {text:"Announce readiness 📢", stress:+1}
        ]
    },
    {
        q:"Colleague does work faster but less qualitatively",
        choices:[
            {text:"Do my part perfectly ✨", stress:+10},
            {text:"Balance speed and quality ⚖️", stress:+3},
            {text:"Accept different approaches 🌈", stress:-3}
        ]
    }
];

// Question loading function
function loadQuestion() {
    console.log("Loading question:", questionIndex);
    
    // Check if game is completed
    if (questionIndex >= questions.length) {
        console.log("Game completed, calling finishGame");
        finishGame();
        return;
    }
    
    if (gameCompleted) {
        console.log("Game already completed");
        return;
    }

    // Get current question
    const currentQuestion = questions[questionIndex];
    console.log("Current question:", currentQuestion.q);
    
    // Set question text
    const questionElement = document.getElementById("question");
    if (questionElement) {
        questionElement.textContent = currentQuestion.q;
    } else {
        console.error("Question element not found!");
        return;
    }

    // Update progress
    updateProgress();

    // Create answer choice buttons
    const choicesDiv = document.getElementById("choices");
    if (!choicesDiv) {
        console.error("Choices element not found!");
        return;
    }
    
    // Clear previous choices
    choicesDiv.innerHTML = "";
    
    // Create buttons for each answer choice
    const letters = ['A', 'B', 'C'];
    currentQuestion.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        
        button.innerHTML = `
            <span class="choice-letter">${letters[index]}</span>
            <span class="choice-text">${choice.text}</span>
        `;
        
        // Add click handler
        button.onclick = function() {
            console.log("Answer selected:", choice.text, "stress:", choice.stress);
            selectAnswer(choice.stress);
        };
        
        choicesDiv.appendChild(button);
    });

    // Start timer
    startTimer();
    
    // Save game state
    saveGameState();
}

// Answer selection function
function selectAnswer(stressChange) {
    console.log("Answer selected, stress change:", stressChange);
    
    if (gameCompleted) return;
    
    // Show feedback
    showFeedback(stressChange);
    
    // Update counters
    questionsAnswered++;
    stress += stressChange;
    
    // Limit stress between 0 and 100
    if (stress < 0) stress = 0;
    if (stress > 100) stress = 100;
    
    console.log("New stress level:", stress);
    
    // Update UI
    updateUI();
    
    // Shake animation for high stress
    if (stress > 85) {
        document.body.classList.add("shake");
        setTimeout(() => {
            document.body.classList.remove("shake");
        }, 500);
    }
    
    // Move to next question
    questionIndex++;
    
    // Small delay before loading next question
    setTimeout(() => {
        loadQuestion();
    }, 800);
}

// Progress update function
function updateProgress() {
    const progressFill = document.getElementById("progress-fill");
    const progressText = document.getElementById("progress-text");
    
    if (progressFill && progressText) {
        const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;
        progressFill.style.width = `${progressPercent}%`;
        progressText.textContent = `Question ${questionIndex + 1}/${totalQuestions}`;
    }
}

// Feedback display function
function showFeedback(stressChange) {
    const feedback = document.getElementById("feedback");
    if (!feedback) return;
    
    let message = "";
    let color = "";
    let emoji = "";
    
    if (stressChange > 8) {
        message = `+${stressChange} stress`;
        color = "#ff4444";
        emoji = "😫";
    } else if (stressChange > 3) {
        message = `+${stressChange} stress`;
        color = "#ff9800";
        emoji = "😟";
    } else if (stressChange > 0) {
        message = `+${stressChange} stress`;
        color = "#ffb74d";
        emoji = "😐";
    } else if (stressChange < 0) {
        message = `${stressChange} stress`;
        color = "#4CAF50";
        emoji = "😊";
    } else {
        message = `${stressChange} stress`;
        color = "#cccccc";
        emoji = "😶";
    }
    
    feedback.innerHTML = `<span style="font-size: 1.3em">${emoji}</span><br>${message}`;
    feedback.style.cssText = `
        color: ${color};
        background: ${color}15;
        border: 2px solid ${color};
        opacity: 1;
        animation: floatUp 1.2s ease-out forwards;
        box-shadow: 0 10px 30px ${color}30;
    `;
    
    setTimeout(() => {
        feedback.style.opacity = "0";
    }, 1000);
}

// UI update function
function updateUI() {
    console.log("Updating UI, stress:", stress);
    
    // Update stress bar
    const stressBar = document.getElementById("stress-bar");
    const stressValue = document.getElementById("stress-value");
    
    if (stressBar) {
        stressBar.style.width = `${stress}%`;
    }
    
    if (stressValue) {
        stressValue.textContent = `${stress}%`;
    }
    
    // Update mood
    const moodElement = document.getElementById("mood");
    if (moodElement) {
        let moodText = "";
        let moodColor = "";
        let moodEmoji = "";
        
        if (stress < 20) {
            moodText = "Calm";
            moodColor = "#4CAF50";
            moodEmoji = "😊";
        } else if (stress < 40) {
            moodText = "Balanced";
            moodColor = "#8BC34A";
            moodEmoji = "🙂";
        } else if (stress < 60) {
            moodText = "Tense";
            moodColor = "#FFC107";
            moodEmoji = "😐";
        } else if (stress < 80) {
            moodText = "Anxious";
            moodColor = "#FF9800";
            moodEmoji = "😬";
        } else {
            moodText = "Panicked";
            moodColor = "#F44336";
            moodEmoji = "😨";
        }
        
        moodElement.innerHTML = `${moodEmoji} ${moodText}`;
        moodElement.style.color = moodColor;
    }
}

// Timer start function
function startTimer() {
    console.log("Starting timer");
    
    // Reset time
    time = 20;
    updateTimer();
    
    // Clear previous timer
    if (timer) {
        clearInterval(timer);
    }
    
    // Start new timer
    timer = setInterval(() => {
        time--;
        updateTimer();
        
        if (time <= 0) {
            clearInterval(timer);
            console.log("Time's up!");
            stress += 4; // Penalty for slowness
            if (stress > 100) stress = 100;
            updateUI();
            questionIndex++;
            loadQuestion();
        }
    }, 1000);
}

// Timer update function
function updateTimer() {
    const timerElement = document.getElementById("timer");
    const timerCircle = document.getElementById("timer-circle");
    
    if (!timerElement || !timerCircle) return;
    
    timerElement.textContent = time;
    
    // Update timer circle
    const circumference = 2 * Math.PI * 27;
    const offset = circumference - (time / 20) * circumference;
    timerCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    timerCircle.style.strokeDashoffset = offset;
    
    // Change color based on remaining time
    let timerColor = "#4CAF50";
    if (time <= 7) {
        timerColor = "#F44336";
        timerElement.classList.add("pulse");
    } else if (time <= 14) {
        timerColor = "#FF9800";
        timerElement.classList.remove("pulse");
    } else {
        timerElement.classList.remove("pulse");
    }
    
    timerCircle.style.stroke = timerColor;
    timerElement.style.color = timerColor;
}

// Game completion function
function finishGame() {
    console.log("Finishing game");
    
    gameCompleted = true;
    clearInterval(timer);
    
    const choicesDiv = document.getElementById("choices");
    const questionElement = document.getElementById("question");
    
    if (!choicesDiv || !questionElement) return;
    
    // Clear answer choices
    choicesDiv.innerHTML = "";
    
    // Determine result
    let resultTitle = "";
    let resultClass = "";
    let advice = "";
    
    if (stress > 80) {
        resultTitle = "🚨 High burnout risk";
        resultClass = "burnout";
        advice = "Your perfectionism may lead to chronic stress. Try practicing the 'good enough' technique.";
    } else if (stress > 60) {
        resultTitle = "⚠ Elevated stress";
        resultClass = "tense";
        advice = "You tend to take on too much responsibility. Learn to delegate and set boundaries.";
    } else if (stress > 40) {
        resultTitle = "⚖ Moderate tension";
        resultClass = "balanced";
        advice = "You're on the path to good balance. Continue working on mindful choices.";
    } else if (stress > 20) {
        resultTitle = "✅ Good balance";
        resultClass = "balanced";
        advice = "You manage your priorities well. Keep it up!";
    } else {
        resultTitle = "🌟 Excellent result!";
        resultClass = "excellent";
        advice = "You're a stress management master! You understand the importance of work-life balance.";
    }
    
    // Calculate average stress
    const avgStress = questionsAnswered > 0 ? (stress / questionsAnswered).toFixed(1) : "0";
    
    // Show results
    questionElement.innerHTML = `
        <div class="${resultClass}">
            <h2>🎮 Game completed!</h2>
            <h3>${resultTitle}</h3>
            <p><strong>${advice}</strong></p>
            
            <div class="result-stats">
                <p>📊 Final stress level: <strong>${stress}%</strong></p>
                <p>❓ Questions answered: <strong>${questionsAnswered}/${totalQuestions}</strong></p>
                <p>📈 Average stress per answer: <strong>${avgStress}%</strong></p>
            </div>
            
            <div class="advice-box">
                <p>💡 Remember: Perfection is an illusion, while health and well-being are real values.</p>
            </div>
            
            <button onclick="restartGame()" class="restart-btn">🔄 Play again</button>
        </div>
    `;
    
    // Save result
    saveResult();
}

// Result saving function
function saveResult() {
    try {
        const results = JSON.parse(localStorage.getItem('perfectionismResults') || '[]');
        results.push({
            date: new Date().toLocaleString(),
            stress: stress,
            questionsAnswered: questionsAnswered,
            totalQuestions: totalQuestions
        });
        
        if (results.length > 20) {
            results.shift();
        }
        
        localStorage.setItem('perfectionismResults', JSON.stringify(results));
        console.log("Result saved");
    } catch (error) {
        console.error("Error saving result:", error);
    }
}

// Game state saving function
function saveGameState() {
    try {
        const gameState = {
            stress: stress,
            questionIndex: questionIndex,
            questionsAnswered: questionsAnswered
        };
        localStorage.setItem('perfectionismGameState', JSON.stringify(gameState));
    } catch (error) {
        console.error("Error saving game state:", error);
    }
}

// Game state loading function
function loadGameState() {
    try {
        const savedState = localStorage.getItem('perfectionismGameState');
        if (savedState) {
            const state = JSON.parse(savedState);
            stress = state.stress || 0;
            questionIndex = state.questionIndex || 0;
            questionsAnswered = state.questionsAnswered || 0;
            
            console.log("State loaded:", state);
            updateUI();
            updateProgress();
        }
    } catch (error) {
        console.error("Error loading game state:", error);
    }
}

// Game restart function
function restartGame() {
    console.log("Restarting game");
    
    stress = 0;
    questionIndex = 0;
    questionsAnswered = 0;
    gameCompleted = false;
    
    if (timer) {
        clearInterval(timer);
    }
    
    const questionElement = document.getElementById("question");
    const choicesDiv = document.getElementById("choices");
    
    if (questionElement) {
        questionElement.innerHTML = "";
        questionElement.className = "";
    }
    
    if (choicesDiv) {
        choicesDiv.innerHTML = "";
    }
    
    updateUI();
    updateProgress();
    loadQuestion();
}

// Game initialization on page load
window.onload = function() {
    console.log("Page loaded, initializing game...");
    
    // Load saved state
    loadGameState();
    
    // Load first question
    loadQuestion();
    
    // Add autosave handler
    window.addEventListener('beforeunload', saveGameState);
    
    // Add keyboard handlers
    document.addEventListener('keydown', function(event) {
        // If game completed, R restarts
        if (gameCompleted && (event.key === 'r' || event.key === 'R')) {
            restartGame();
            return;
        }
        
        // If game not completed, A/B/C select answers
        if (!gameCompleted) {
            const choices = document.querySelectorAll('#choices button');
            if (choices.length === 0) return;
            
            if (event.key === 'a' || event.key === 'A' || event.key === '1') {
                choices[0].click();
            } else if (event.key === 'b' || event.key === 'B' || event.key === '2') {
                choices[1].click();
            } else if (event.key === 'c' || event.key === 'C' || event.key === '3') {
                choices[2].click();
            } else if (event.key === 'Enter') {
                // Random choice for demonstration
                const randomIndex = Math.floor(Math.random() * choices.length);
                choices[randomIndex].click();
            }
        }
    });
    
    console.log("Game ready!");
};

// Simple debug function
function debugGame() {
    console.log("=== DEBUG INFORMATION ===");
    console.log("questionIndex:", questionIndex);
    console.log("stress:", stress);
    console.log("questionsAnswered:", questionsAnswered);
    console.log("gameCompleted:", gameCompleted);
    console.log("questions length:", questions.length);
    console.log("======================");
}