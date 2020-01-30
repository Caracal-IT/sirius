class AlertActivity {
    static create(act) {
        return Object.assign(new AlertActivity(), act);
    }

    static get type() {
        return "alert-activity";
    }

    constructor() {
       this.type =  AlertActivity.type;
       this.execute = (context) => alert(this.message);
    }
}
  
customElements
    .whenDefined("sirius-wf")
    .then(() => {
        const wfs = document.querySelectorAll("sirius-wf");

        for(const wf of wfs)
            wf.addActivity(AlertActivity.type, AlertActivity.create);
    });
