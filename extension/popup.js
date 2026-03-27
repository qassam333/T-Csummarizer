addEventListener("DOMContentLoaded", () => {
    const analyzeButton = document.getElementById("analyzeButton");
    analyzeButton.addEventListener("click", () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "extractText"}, (response) => {
                const resultDiv = document.getElementById("result");
                if (response.text) {
                    chrome.runtime.sendMessage({ action: "analyze", text: response.text }, (result) => {
                        resultDiv.innerHTML = JSON.stringify(result);
                    });
                } else {
                    resultDiv.innerHTML = "No text found";
                }
            });
        });
    });
});