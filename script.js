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
    .replace(/\bbad\b/gi, "problematic");

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

    return line;
  });

  return withTransitions.join(" ");
}

humanizeBtn.addEventListener("click", () => {
  const source = inputText.value.trim();
  if (!source) {
    outputText.value = "Please paste your text first.";
    return;
  }

  outputText.value = humanizeText(source);
});

clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  inputText.focus();
});
