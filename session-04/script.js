const form = document.querySelector("#homeworkForm");
const output = document.querySelector("#output");
const storageKey = "stephen-peace-roles-homework";

function collectAnswers() {
  const data = new FormData(form);
  const answers = {
    submittedAt: new Date().toISOString(),
  };

  for (const [key, value] of data.entries()) {
    answers[key] = value;
  }

  return answers;
}

function formatAnswers() {
  const answers = collectAnswers();
  const lines = [
    "Stephen & Peace - Roles in Marriage Homework",
    `Name: ${answers.name || ""}`,
    `Date completed: ${answers.dateCompleted || ""}`,
    `Exported: ${new Date(answers.submittedAt).toLocaleString()}`,
    "",
  ];

  for (const [key, value] of Object.entries(answers)) {
    if (key === "submittedAt" || key === "name" || key === "dateCompleted") continue;
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
    lines.push(`${label}:`);
    lines.push(value || "(blank)");
    lines.push("");
  }

  return lines.join("\n");
}

function refreshOutput() {
  output.textContent = formatAnswers();
}

function saveAnswers() {
  localStorage.setItem(storageKey, JSON.stringify(collectAnswers()));
  refreshOutput();
  alert("Saved in this browser.");
}

function restoreAnswers() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;

  const answers = JSON.parse(saved);
  for (const [key, value] of Object.entries(answers)) {
    const field = form.elements[key];
    if (field) field.value = value;
  }
  refreshOutput();
}

async function copyAnswers() {
  const text = formatAnswers();
  await navigator.clipboard.writeText(text);
  refreshOutput();
  alert("Answers copied. You can paste them into WhatsApp, email, or Teams.");
}

function downloadAnswers() {
  const text = formatAnswers();
  const name = (form.elements.name.value || "homework").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}-roles-homework.txt`;
  link.click();
  URL.revokeObjectURL(url);
  refreshOutput();
}

document.querySelector("#saveBtn").addEventListener("click", saveAnswers);
document.querySelector("#copyBtn").addEventListener("click", copyAnswers);
document.querySelector("#downloadBtn").addEventListener("click", downloadAnswers);
form.addEventListener("submit", (event) => event.preventDefault());
form.addEventListener("input", refreshOutput);
form.addEventListener("reset", () => {
  localStorage.removeItem(storageKey);
  setTimeout(refreshOutput, 0);
});

restoreAnswers();
refreshOutput();
