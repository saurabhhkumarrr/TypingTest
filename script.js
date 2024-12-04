const sentences = [
    "After all, you're only an immortal until someone manages to kill you. We were like deaf people trying to dance to a beat we couldn't hear. Time plays like an accordion in the way it can stretch out and compress itself in a thousand melodic ways. Life is beautiful, as long as it consumes you. When it is rushing through you, destroying you, life is glorious. As long as people have been on this earth, the moon has been a mystery to us.",
   
];

const msg = document.getElementById('msg');
const typedWords = document.getElementById('mywords');
const btn = document.getElementById('btn');
const downloadBtn = document.getElementById('downloadCertificate');
const userNameInput = document.getElementById('username');
const timeSelect = document.getElementById('timeSelect');
const timerDisplay = document.getElementById('timerDisplay');

let startTime, originalText, userName, timerInterval;
let isTyping = false;
let totalTime = 0; // Total time in seconds

const playGame = () => {
    userName = userNameInput.value.trim();
    if (!userName) return alert("Please enter your name!");

    originalText = sentences[0].split(" ");
    msg.innerHTML = originalText.map(word => `<span>${word}</span>`).join(" ");
    typedWords.value = "";
    typedWords.disabled = false;
    btn.innerText = "Done";
    timerDisplay.innerText = `Time: 0:00`;

    totalTime = parseInt(timeSelect.value);

    typedWords.addEventListener('input', startTimerOnce);
}

const startTimerOnce = () => {
    if (!isTyping) {
        isTyping = true;
        startTimer();
        typedWords.removeEventListener('input', startTimerOnce);
    }
    updateTyping();
}

const startTimer = () => {
    let elapsed = 0;
    timerInterval = setInterval(() => {
        elapsed++;
        const remainingTime = totalTime - elapsed;
        timerDisplay.innerText = `Time: ${Math.floor(remainingTime / 60)}:${('0' + (remainingTime % 60)).slice(-2)}`;

        if (remainingTime <= 0 || isTextComplete()) {
            endGame();
        }
    }, 1000);
}

const endGame = () => {
    clearInterval(timerInterval);
    const typedText = typedWords.value.trim().split(/\s+/);
    let correctWords = 0, mistakes = 0;

    typedText.forEach((word, index) => {
        if (word === originalText[index]) {
            correctWords++;
        } else {
            mistakes++;
        }
    });

    msg.innerText = `You typed ${correctWords} words correctly with ${mistakes} mistakes.`;
    typedWords.disabled = true;
    btn.innerText = "Start";
    downloadBtn.classList.add('show');
    downloadBtn.onclick = () => generatePDF(correctWords, mistakes);

    isTyping = false;
}

const isTextComplete = () => {
    return typedWords.value.trim() === originalText.join(" ");
}

const updateTyping = () => {
    const typedText = typedWords.value.trim().split(/\s+/);
    const spans = msg.querySelectorAll('span');
    
    typedText.forEach((word, index) => {
        if (spans[index]) {
            if (word === originalText[index]) {
                spans[index].classList.add('highlighted');
            } else if (word) {
                spans[index].classList.remove('highlighted');
            }
        }
    });

    if (isTextComplete()) {
        endGame();
    }
}

btn.onclick = () => btn.innerText === 'Start' ? playGame() : endGame();

/*const generatePDF = (correctWords, mistakes) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(22).text('Typing Test Certificate', 20, 30);
    doc.setFontSize(16).text(`Name: ${userName}`, 20, 50)
        .text(`Correct Words: ${correctWords}`, 20, 70)
        .text(`Mistakes: ${mistakes}`, 20, 90)
        .text(`Total Time: ${timeSelect.value / 60} minutes`, 20, 110);
    doc.save('TypingTestCertificate.pdf');
}*/
const generatePDF = (correctWords, mistakes) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Typing Test completed | " + new Date().toLocaleDateString() + " | Typing Master", 20, 20);

    // Title
    doc.setFontSize(16);
    doc.text("TYPING TEST - " + (correctWords / originalText.length >= 0.75 ? "PASSED" : "NOT PASSED"), 20, 30);

    // User Info
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`User: ${userName}`, 20, 40);
    doc.text("Test name: Custom Typing Test", 20, 50);
    doc.text("Date: " + new Date().toLocaleString(), 20, 60);

    // Test Results
    doc.setFont("Helvetica", "bold");
    doc.text("TEST RESULTS", 20, 80);
    doc.setFont("Helvetica", "normal");
    const grossSpeed = Math.round((correctWords + mistakes) / (totalTime / 60));
    const netSpeed = Math.round(correctWords / (totalTime / 60));
    const accuracy = Math.round((correctWords / (correctWords + mistakes)) * 100);

    doc.text(`Duration: ${totalTime / 60} min. of total ${totalTime / 60} min.`, 20, 90);
    doc.text(`Gross speed: ${grossSpeed} wpm`, 20, 100);
    doc.text(`Net speed: ${netSpeed} wpm`, 20, 110);
    doc.text(`Accuracy: ${accuracy}%`, 20, 120);
    doc.text(`Correct Words: ${correctWords}`, 20, 130);
    doc.text(`Mistakes: ${mistakes}`, 20, 140);

    // Footer
    doc.setFont("Helvetica", "italic");
    doc.text("Generated using Typing Speed Test App", 20, 160);

    doc.save('TypingTestCertificate.pdf');
};

