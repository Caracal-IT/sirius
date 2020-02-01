import { Component, Listen } from "@stencil/core";
import { AnalyticsService } from "../../services/analytics.service";

@Component({
    tag: "sirius-analytics"
  })
  export class SiriusAnalytics {
    static lastPath: any = [null];
    static analyticsService: AnalyticsService = new AnalyticsService();

    @Listen('click', { target: 'document' })
    async analyticsHandler(event: any) {
        const path = SiriusAnalytics.analyticsService.getPath(event);

        if(SiriusAnalytics.lastPath[0] === path[0])
          return;
 
        SiriusAnalytics.lastPath = path;

        const wfElement =  path.find((i: HTMLElement) => i.hasAttribute && i.hasAttribute("wf-element"));

        if(!wfElement) 
          return;

        path[0].addEventListener("blur", this.onBlur);        
        SiriusAnalytics.analyticsService.send("click", path);
    }    

    @Listen('wfMessage', { target: 'document' })
    wfMessage(event: any){
      SiriusAnalytics.analyticsService.sendMessage(event);
    }

    onBlur(event: Event) {
        SiriusAnalytics.analyticsService.send("blur", SiriusAnalytics.lastPath);
        event.target.removeEventListener("blur", this.onBlur);
    }
  }