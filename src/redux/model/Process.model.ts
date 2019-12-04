import { Page } from "puppeteer";

export class Process {
    name: string;
    activities: Array<Page|any>
}