interface WorkflowLoader {
    load(processName: string): Promise<object>;
    loadSettings(url: string|null): Promise<void>;
}