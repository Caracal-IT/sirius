import { ConfigService } from "../services/config.service";
import { HttpService } from "../services/http.service";
import { MessageService } from "../services/message.service";
import { ModelService } from "../services/model.service";
import { WorkflowService } from "../services/workflow.service";

export interface Context {
    container: HTMLElement;

    http: HttpService;
    config: ConfigService;
    model: ModelService;
    message: MessageService;
    wf: WorkflowService;
}