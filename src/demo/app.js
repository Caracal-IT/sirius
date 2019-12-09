const errorMsg = document.querySelector("#errorMsg");
const errorStack = document.querySelector("#errorStack");
const clearErrorsButton = document.querySelector("#clearErrorsButton");
const defaultWfButton = document.querySelector("#defaultWfButton");
const workflow = document.querySelector("#workflow");

const wf = document.querySelector("sirius-wf");
const processDef = document.querySelector("#processDef");
const loadProcessButton = document.querySelector("#loadProcessButton");

wf.addEventListener("wfError", (event) => {           
    errorMsg.innerText = event.detail.message;
    errorStack.innerText = event.detail.stack;
});

clearErrorsButton.addEventListener('click', () => {
    errorMsg.innerText = "";
    errorStack.innerText = "";
});

loadProcessButton.addEventListener("click", async () => {      
    const process = await wf.parse(processDef.value);

    if(!process)
    return;
    
    wf.loadProcess(process);        
})    

defaultWfButton.addEventListener("click", async () => {
    if(workflow.value === "-1") {
    processDef.value = "";
    wf.loadProcess({}); 
    return;
    }

    fetch("wf/" + workflow.value)
    .then(response => response.text())
    .then(data => {  
        
        processDef.value = data;
        
        wf.parse(data).then(process => {
        if(!process)
        return;
    
        wf.loadProcess(process); 
        });         
    });
});