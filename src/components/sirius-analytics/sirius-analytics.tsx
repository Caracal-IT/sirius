import { Component, Listen } from "@stencil/core";
import { AnalyticsService } from "../../services/analytics.service";

@Component({
    tag: "sirius-analytics"
  })
  export class SiriusAnalytics {
    static analyticsService: AnalyticsService = new AnalyticsService();
   
    @Listen('click', { target: 'document' })
    async analyticsHandler(event: any){
        const wfElement =  event.path.find((i: HTMLElement) => i.hasAttribute && i.hasAttribute("wf-element"));

        if(!wfElement)
          return;

        event.path[0].addEventListener("blur", this.onBlur);        
        SiriusAnalytics.analyticsService.send("click", event);
    }    

    @Listen('wfMessage', { target: 'document' })
    wfMessage(event){
      SiriusAnalytics.analyticsService.sendMessage(event);
    }

    onBlur(event: any) {
        event.target.removeEventListener("blur", this.onBlur);
        SiriusAnalytics.analyticsService.send("blur", event);
    }

    /*
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
    */
  }