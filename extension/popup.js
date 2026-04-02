console.log("popup loaded");

const RING_COLORS = {
  danger:     "#E24B4A",
  concerning: "#EF9F27",
  moderate:   "#378ADD",
  good:       "#1D9E75",
  excellent:  "#639922",
};

const LABEL_COLORS = {
  danger:     "#A32D2D",
  concerning: "#854F0B",
  moderate:   "#185FA5",
  good:       "#0F6E56",
  excellent:  "#3B6D11",
};

function labelKey(label) {
  return (label || "").toLowerCase().replace(/\s+/g, "");
}

function ringDash(rating) {
  const circ = 2 * Math.PI * 22;
  const filled = (rating / 10) * circ;
  return `${filled.toFixed(1)} ${(circ - filled).toFixed(1)}`;
}

function buildResult(data) {
  const key    = labelKey(data.rating_label);
  const color  = RING_COLORS[key]  || "#888";
  const tcolor = LABEL_COLORS[key] || "#333";
  const dash   = ringDash(data.rating);

  const flagsHTML = (data.critical_flags || []).map(f => `
    <div class="flag ${f.severity}">
      <div class="flag-dot"></div>
      <div>
        <div class="flag-title">${f.title}</div>
        <div class="flag-detail">${f.detail}</div>
      </div>
    </div>
  `).join("");

  return `
    <div class="rating-row">
      <div class="ring-wrap">
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="22" fill="none" stroke="#e8e8e8" stroke-width="4"/>
          <circle cx="26" cy="26" r="22" fill="none"
            stroke="${color}" stroke-width="4"
            stroke-dasharray="${dash}"
            stroke-dashoffset="34"
            stroke-linecap="round"/>
        </svg>
        <div class="ring-number">${data.rating}</div>
      </div>
      <div>
        <div class="rating-label" style="color:${tcolor}">${data.rating_label}</div>
        <div class="rating-desc">${ratingDesc(data.rating)}</div>
      </div>
    </div>

    <div class="section-title">Summary</div>
    <div class="summary-text">${data.summary}</div>

    ${flagsHTML ? `<div class="section-title">Flags</div><div class="flags">${flagsHTML}</div>` : ""}
  `;
}

function ratingDesc(rating) {
  if (rating <= 2) return "Very dangerous — avoid this service.";
  if (rating <= 4) return "Concerning — read carefully before agreeing.";
  if (rating <= 6) return "Moderate — some areas need attention.";
  if (rating <= 8) return "Good — mostly fair with minor issues.";
  return "Excellent — this policy is user-friendly.";
}

function showError(msg) {
  const el = document.getElementById("error");
  el.textContent = msg;
  el.style.display = "block";
}

function hideError() {
  document.getElementById("error").style.display = "none";
}

addEventListener("DOMContentLoaded", () => {
  const btn     = document.getElementById("analyzeButton");
  const loading = document.getElementById("loading");
  const result  = document.getElementById("result");

  btn.addEventListener("click", () => {
    hideError();
    result.style.display  = "none";
    loading.style.display = "block";
    btn.disabled = true;
    btn.textContent = "Analyzing…";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, (response) => {
        if (chrome.runtime.lastError) {
          loading.style.display = "none";
          btn.disabled = false;
          btn.textContent = "Analyze this page";
          showError("Could not read page content. Try refreshing the page.");
          return;
        }

        if (!response || !response.text) {
          loading.style.display = "none";
          btn.disabled = false;
          btn.textContent = "Analyze this page";
          showError("No text found on this page.");
          return;
        }

        chrome.runtime.sendMessage({ action: "analyze", text: response.text }, (data) => {
          loading.style.display = "none";
          btn.disabled = false;
          btn.textContent = "Analyze again";

          if (!data || data.error) {
            showError("Analysis failed. Check your internet connection and try again.");
            return;
          }

          result.innerHTML    = buildResult(data);
          result.style.display = "block";
        });
      });
    });
  });
});
