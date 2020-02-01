import { Component, Listen } from "@stencil/core";
import { AnalyticsService } from "../../services/analytics.service";

@Component({
    tag: "sirius-analytics"
  })
  export class SiriusAnalytics {
    static analyticsService: AnalyticsService = new AnalyticsService();

    static lastEvent: any;

    @Listen('click', { target: 'document' })
    async analyticsHandler(event: any) {
        if(SiriusAnalytics.lastEvent && SiriusAnalytics.lastEvent.path[0] === event.path[0])
          return;

        SiriusAnalytics.lastEvent = event; 

        const wfElement =  event.path.find((i: HTMLElement) => i.hasAttribute && i.hasAttribute("wf-element"));

        if(!wfElement) 
          return;

        event.path[0].addEventListener("blur", this.onBlur);        
        SiriusAnalytics.analyticsService.send("click", event);
    }    

    @Listen('wfMessage', { target: 'document' })
    wfMessage(event: any){
      SiriusAnalytics.analyticsService.sendMessage(event);
    }

    onBlur(event: Event) {
        SiriusAnalytics.analyticsService.send("blur", SiriusAnalytics.lastEvent);
        SiriusAnalytics.lastEvent = null;
        event.target.removeEventListener("blur", this.onBlur);
    }
  }