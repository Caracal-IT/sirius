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
        const wf = document.querySelector("sirius-wf");
        wf.addActivity(AlertActivity.type, AlertActivity.create);
    });
