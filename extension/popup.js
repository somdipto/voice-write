document.addEventListener('DOMContentLoaded', () => {
    const startStopButton = document.getElementById('startStopButton');
    let isRecording = false;
    let recognition;

    startStopButton.textContent = 'Start Speech to Text';

    startStopButton.addEventListener('click', () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    });

    function startRecording() {
        isRecording = true;
        startStopButton.textContent = 'Stop Speech to Text';

        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition is not supported in your browser. Try using Chrome.");
            return;
        }

        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log("Speech recognition started");
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log("Transcript:", transcript);
            insertText(transcript);
        };

        recognition.onerror = function(event) {
            console.error("Speech recognition error", event.error);
            stopRecording();
        };

        recognition.onend = function() {
            console.log("Speech recognition ended");
            stopRecording();
        };

        recognition.start();
    }

    function stopRecording() {
        isRecording = false;
        startStopButton.textContent = 'Start Speech to Text';
        if (recognition) {
            recognition.stop();
            recognition = null;
        }
    }

    function insertText(text) {
        browser.tabs.query({active: true, currentWindow: true})
        .then(tabs => {
            browser.tabs.sendMessage(tabs[0].id, {command: 'insertText', text: text});
        }).catch(error => {
            console.error("Error sending message to content script", error);
        });
    }
});
