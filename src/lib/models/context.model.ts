import { ConfigService } from "../services/config.service";
import { HttpService } from "../services/http.service";

export interface Context {
    container: HTMLElement;

    http: HttpService;
    config: ConfigService;
}