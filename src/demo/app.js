const errorMsg = document.querySelector("#errorMsg");
const errorStack = document.querySelector("#errorStack");
const clearErrorsButton = document.querySelector("#clearErrorsButton");
const defaultWfButton = document.querySelector("#defaultWfButton");
const workflow = document.querySelector("#workflow");

const wf = document.querySelector("sirius-wf:first-of-type");
const wf2 = document.querySelector("sirius-wf:last-of-type");
const processDef = document.querySelector("#processDef");
const loadProcessButton = document.querySelector("#loadProcessButton");
const loadingPanel = document.querySelector("#loadingPanel");

wf.addEventListener("wfMessage", error => {
    const msg = error.detail;

    switch (msg.messageType) {
        case "ERROR": return showErrorMessage(msg);
        case "START_LOADING": return showLoading(msg);
        case "END_LOADING": return hideLoading(msg);
    }    
});

wf2.addEventListener("wfMessage", error => {
    const msg = error.detail;

    switch (msg.messageType) {
        case "ERROR": return showErrorMessage(msg);
        case "START_LOADING": return showLoading(msg);
        case "END_LOADING": return hideLoading(msg);
    }    
});

function showErrorMessage(msg) {    
    errorMsg.innerText = msg.description;
    errorStack.innerText = msg.stack;
    hideLoading();
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