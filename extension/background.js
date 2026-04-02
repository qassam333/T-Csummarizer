chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    
    if (msg.action === "analyze") {
        
        fetch("https://t-csummarizer.onrender.com/analyze", {
            method: "POST",                                   
            headers: { "Content-Type": "application/json" },     body: JSON.stringify({ text: msg.text })           // convert the text to JSON string
        })
        .then(res => res.json())        
        .then(data => sendResponse(data)) 
        .catch(err => sendResponse({ error: err.message })); }
    
    return true; });