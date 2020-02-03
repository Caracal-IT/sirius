const urlParams = new URLSearchParams(window.location.search);
const process = urlParams.get('process');
const activity = urlParams.get('activity')||"start";
const sessionId = urlParams.get('sessionId');

const wf0 = document.querySelector("sirius-wf");

if(sessionId !== null)
    wf0.setAttribute("wf-session-id", sessionId);

if(process && activity) {
    customElements
        .whenDefined("sirius-wf")
        .then(() => {
            const wf = document.querySelector("sirius-wf");
            wf.hydrate(process, sessionId, activity);
        });
}