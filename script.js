const yearElement = document.getElementById("year");
yearElement.textContent = new Date().getFullYear();

const buttons = document.querySelectorAll(".btn");
buttons.forEach((button) => {
  button.addEventListener("mousedown", () => {
    button.classList.add("pressed");
  });

  button.addEventListener("mouseup", () => {
    button.classList.remove("pressed");
  });

  button.addEventListener("mouseleave", () => {
    button.classList.remove("pressed");
  });
});

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const humanizeBtn = document.getElementById("humanizeBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const statusText = document.getElementById("statusText");
const timerText = document.getElementById("timerText");

const waitingMessages = [
  "Working on a smoother, more natural rewrite...",
  "Polishing tone and sentence flow — thanks for waiting.",
  "Almost there... refining clarity and readability.",
  "Sorry for the wait — improving your final draft now."
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function humanizeSentence(sentence) {
  const cleaned = sentence.trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return "";
  }

  let result = cleaned
    .replace(/\bvery\b/gi, "quite")
    .replace(/\ba lot of\b/gi, "many")
    .replace(/\bin order to\b/gi, "to")
    .replace(/\bi think\b/gi, "I believe")
    .replace(/\bthings\b/gi, "aspects")
    .replace(/\bgood\b/gi, "effective")
    .replace(/\bbad\b/gi, "problematic")
    .replace(/\bimportant\b/gi, "significant");

  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result;
}

function humanizeText(text) {
  const pieces = text
    .split(/(?<=[.!?])\s+/)
    .map((part) => humanizeSentence(part))
    .filter(Boolean);

  if (pieces.length === 0) {
    return "";
  }

  const withTransitions = pieces.map((line, index) => {
    if (index === 0) {
      return line;
    }

    if (index % 3 === 1) {
      return `Additionally, ${line.charAt(0).toLowerCase()}${line.slice(1)}`;
    }

    if (index % 3 === 2) {
      return `In practice, ${line.charAt(0).toLowerCase()}${line.slice(1)}`;
    }

    return line;
  });

  return withTransitions.join(" ");
}

function setBusy(isBusy) {
  humanizeBtn.disabled = isBusy;
  clearBtn.disabled = isBusy;
  copyBtn.disabled = isBusy;
}

let timerInterval = null;

async function runHumanizeWithTimer(source) {
  const startedAt = Date.now();
  let messageIndex = 0;

  timerInterval = setInterval(() => {
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
    timerText.textContent = `${elapsed}s`;
  }, 100);

  const messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % waitingMessages.length;
    statusText.textContent = waitingMessages[messageIndex];
  }, 1200);

  const simulatedLatency = Math.min(5200, 900 + source.length * 8);
  await sleep(simulatedLatency);
  const result = humanizeText(source);

  clearInterval(timerInterval);
  clearInterval(messageInterval);

  timerText.textContent = `${((Date.now() - startedAt) / 1000).toFixed(1)}s`;
  statusText.textContent = "Done! Your text is ready.";

  return result;
}

humanizeBtn.addEventListener("click", async () => {
  const source = inputText.value.trim();
  if (!source) {
    outputText.value = "Please paste your text first.";
    statusText.textContent = "Add text to begin.";
    timerText.textContent = "0.0s";
    return;
  }

  setBusy(true);
  statusText.textContent = waitingMessages[0];
  timerText.textContent = "0.0s";

  const result = await runHumanizeWithTimer(source);
  outputText.value = result;
  setBusy(false);
});

copyBtn.addEventListener("click", async () => {
  const text = outputText.value.trim();
  if (!text) {
    statusText.textContent = "Nothing to copy yet. Generate output first.";
    return;
  }

  await navigator.clipboard.writeText(text);
  statusText.textContent = "Copied! You can now paste the output anywhere.";
});

clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  statusText.textContent = "Ready to humanize your text.";
  timerText.textContent = "0.0s";
  inputText.focus();
});
