import { SettingsAggregate } from "../domain/SettingsAggregate";
import { SettingsCommand } from "../domain/commands";

export interface SettingsRepositoryPort {
  load(): Promise<SettingsAggregate>;
  save(settings: SettingsAggregate): Promise<void>;
  onSettingsChange(handler: (command: SettingsCommand) => Promise<void>): void;
}
