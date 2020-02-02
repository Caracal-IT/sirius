const errorMsg = document.querySelector("#errorMsg");
const errorStack = document.querySelector("#errorStack");
const analyticsMsg = document.querySelector("#analyticsMsg");
const clearErrorsButton = document.querySelector("#clearErrorsButton");
const defaultWfButton = document.querySelector("#defaultWfButton");
const workflow = document.querySelector("#workflow");

const wf = document.querySelector("sirius-wf:first-of-type");
const wf2 = document.querySelector("sirius-wf:last-of-type");
const processDef = document.querySelector("#processDef");
const loadProcessButton = document.querySelector("#loadProcessButton");
const loadingPanel = document.querySelector("#loadingPanel");

wf.addEventListener("wfMessage", wfHandler);
wf2.addEventListener("wfMessage", wfHandler);

function wfHandler(error) {
    const msg = error.detail;

    switch (msg.messageType) {
        case "ERROR": return showMessage(msg);
        case "VALIDATION_ERROR": return showMessage(msg);
        case "START_LOADING": return showLoading(msg);
        case "END_LOADING": return hideLoading(msg);
        case "WORKFLOW_CHANGING": return showMessage(msg);
        case "WORKFLOW_CHANGED": return showMessage(msg);
    }  
}

function showMessage(msg) {     
    errorMsg.innerHTML = `${errorMsg.value}${msg.messageType} - ${msg.description}&#10;`;
    errorStack.innerText = msg.stack; 
}

function showLoading() {
    loadingPanel.classList.remove("hidden");
}

function hideLoading() {
    loadingPanel.classList.add("hidden");
}

clearErrorsButton.addEventListener('click', () => {
    errorMsg.innerText = "";
    errorStack.innerText = "";
});

loadProcessButton.addEventListener("click", async () => {      
    if(processDef.value)
        wf2.loadProcess(processDef.value);        
})    

defaultWfButton.addEventListener("click", async () => {
    if(workflow.value === "-1") {
        processDef.value = "";
        wf.loadProcess({}); 
        return;
    }

    wf.loadUrl(workflow.value)
      .then(process => processDef.value = JSON.stringify(process));
});

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
    if (!event.data || !event.data.path)
        return;
     
    analyticsMsg.innerText += `\n\r${JSON.stringify(event.data)}`     
}