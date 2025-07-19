
export type SettingType = 'string' | 'bool' | 'int';

export interface Setting {
    value: any;
    type: SettingType;
    section: string;
    public: boolean;
    label: string;
    description?: string;
    secure?: boolean;
}

export interface SettingsPort {
    registerTestConnectionCommand(callback: () => void): Promise<void>;
    registerSection(name: string, options: any): Promise<void>;
    registerSettings(settings: Record<string, Setting>): Promise<void>;
    displayMessageBox(message: string): Promise<void>;
}
