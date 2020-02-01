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
    const process = await wf2.parse(processDef.value);

    if(!process)
    return;
    
    wf2.loadProcess({...process});        
})    

defaultWfButton.addEventListener("click", async () => {
    if(workflow.value === "-1") {
        processDef.value = "";
        wf.loadProcess({}); 
        return;
    }

    showLoading();

    fetch("wf/" + workflow.value)
        .then(response => response.text())
        .then(data => {          
            processDef.value = data;
        
            wf.parse(data)
              .then(process => {
                if(!process)
                    return;
    
                wf.loadProcess(process); 
                hideLoading()
            });         
    });
});

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
    if (!event.data || !event.data.path)
        return;
    
    if(analyticsMsg.innerText.length > 999999)
        analyticsMsg.innerText = "";
    
    analyticsMsg.innerText += `\n\r${JSON.stringify(event.data)}`     
}