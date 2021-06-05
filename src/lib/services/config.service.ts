export class ConfigService {
    private settings:Map<string, any> = new Map();

    getSetting(key: string) {
        return this.settings.get(key);
    }

    addSetting(key: string, setting: any) {
        if(key.indexOf('[') === -1)
            key = `[${key}]`;

        this.settings.set(key, setting);
    }
}