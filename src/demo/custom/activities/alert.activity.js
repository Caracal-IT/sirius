class AlertActivity {
    static type = "alert-activity";

    static create(act) {
        return Object.assign(new AlertActivity(), act);
    }

    type = AlertActivity.type;
    execute = (context) => alert(this.message);
    
  }

customElements
    .whenDefined("sirius-wf")
    .then(() => {
        const wfs = document.querySelectorAll("sirius-wf");

        for(const wf of wfs)
            wf.addActivity(AlertActivity.type, AlertActivity.create);
    });
