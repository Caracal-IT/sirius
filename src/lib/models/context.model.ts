import { ConfigService } from "../services/config.service";
import { HttpService } from "../services/http.service";
import { ModelService } from "../services/model.service";
import { WorkflowService } from "../services/workflow.service";

export interface Context {
    container: HTMLElement;

    http: HttpService;
    config: ConfigService;
    model: ModelService;
    wf: WorkflowService;
}