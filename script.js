let totalWorkTimeInput = document.getElementById('total-work-time');
let workIntervalTimeInput = document.getElementById('work-interval-time');
let breakTimeInput = document.getElementById('break-time');
let startButton = document.getElementById('start-button');
let resetButton = document.getElementById('reset-button');
let stopAudioButton = document.getElementById('stop-audio-button');
let totalTimerLabel = document.getElementById('total-timer-label');
let totalTimeDisplay = document.getElementById('total-time-display');
let timerLabel = document.getElementById('timer-label');
let timeDisplay = document.getElementById('time-display');
let earningsDisplay = document.getElementById('earnings-display');

let totalWorkTime = parseInt(totalWorkTimeInput.value) * 60;
let workIntervalTime = parseInt(workIntervalTimeInput.value) * 60;
let breakTime = parseInt(breakTimeInput.value) * 60;
let currentWorkTime = 0;
let isWorkTime = true;
let timeRemaining = workIntervalTime;
let timerInterval;
let earnings = parseFloat(localStorage.getItem('earnings')) || 0;

// Configuração das notificações sonoras
let workEndSound = new Audio('work-end-sound.mp3');
let breakEndSound = new Audio('break-end-sound.mp3');

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
stopAudioButton.addEventListener('click', stopAudio);

function startTimer() {
  clearInterval(timerInterval);
  totalWorkTime = parseInt(totalWorkTimeInput.value) * 60;
  workIntervalTime = parseInt(workIntervalTimeInput.value) * 60;
  breakTime = parseInt(breakTimeInput.value) * 60;
  currentWorkTime = 0;
  timeRemaining = workIntervalTime;
  
  timerInterval = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      if (isWorkTime) {
        totalWorkTime--;
        updateEarnings();
      }
      updateDisplay();
    } else {
      if (isWorkTime) {
        currentWorkTime += workIntervalTime;
        workEndSound.play();
        stopAudioButton.style.display = 'block';

        if (currentWorkTime >= totalWorkTime) {
          clearInterval(timerInterval);
          return;
        }
      } else {
        breakEndSound.play();
        stopAudioButton.style.display = 'block';
      }

      isWorkTime = !isWorkTime;
      timeRemaining = isWorkTime ? workIntervalTime : breakTime;
      timerLabel.textContent = isWorkTime ? 'Tempo de Trabalho' : 'Tempo de Intervalo';
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  isWorkTime = true;
  totalWorkTime = parseInt(totalWorkTimeInput.value) * 60;
  workIntervalTime = parseInt(workIntervalTimeInput.value) * 60;
  breakTime = parseInt(breakTimeInput.value) * 60;
  currentWorkTime = 0;
  timeRemaining = workIntervalTime;
  timerLabel.textContent = 'Tempo de Trabalho';
  totalTimerLabel.textContent = 'Tempo Total Restante';
  updateDisplay();
  stopAudio();
}

function updateDisplay() {
  let totalMinutes = Math.floor(totalWorkTime / 60);
  let totalSeconds = totalWorkTime % 60;
  totalTimeDisplay.textContent = `${totalMinutes < 10 ? '0' : ''}${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;

  let minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining % 60;
  timeDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateEarnings() {
  const earningsPerMinute = 1000 / 60;
  earnings += earningsPerMinute;
  localStorage.setItem('earnings', earnings.toFixed(2));
  earningsDisplay.textContent = earnings.toFixed(2);
}

function stopAudio() {
  workEndSound.pause();
  breakEndSound.pause();
  workEndSound.currentTime = 0;
  breakEndSound.currentTime = 0;
  stopAudioButton.style.display = 'none';
}

// Inicializar a exibição de ganhos
earningsDisplay.textContent = earnings.toFixed(2);
