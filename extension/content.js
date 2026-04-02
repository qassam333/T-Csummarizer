function getSelectedText() {
  return window.getSelection().toString().trim();
}

function getPageText() {
  const legalKeywords = ["terms", "privacy", "policy", "conditions", "legal", "cookie", "gdpr", "tos", "eula"];
  const urlMatch = legalKeywords.some(k => window.location.href.toLowerCase().includes(k));
  const titleMatch = legalKeywords.some(k => document.title.toLowerCase().includes(k));

  if (urlMatch || titleMatch) {
    return document.body.innerText.trim();
  }

  const candidates = Array.from(document.querySelectorAll("main, article, section, .content, #content, .policy, #policy"));
  if (candidates.length > 0) {
    return candidates.map(el => el.innerText).join("\n").trim();
  }

  return document.body.innerText.trim();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "extractText") {
    const text = getSelectedText() || getPageText() || null;
    sendResponse({ text });
  }
  return true;
});