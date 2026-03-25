function getSelectedText(){
    return window.getSelection().toString().trim();
}
function getPageText(){
   const legalKeywords = ['terms', 'privacy', 'policy', 'conditions', 'legal'];
   if(legalKeywords.some(k => window.location.href.toLowerCase().includes(k)))
    return document.body.innerText.trim();
   else return "";
}
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "extractText") {
        const text = getSelectedText() || getPageText() || null;
        sendResponse({ text: text });
    }
    return true;
});