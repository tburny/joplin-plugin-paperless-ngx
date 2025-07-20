import { PaperlessPort } from "../ports/PaperlessPort";
import { SettingsRepositoryPort } from "../ports/SettingsRepositoryPort";
import {
  ValidateSettingsQuery,
  GetSettingsQuery,
  ValidateSettingsResult,
  type GetSettingsResult,
} from "../domain/queries";
import { ConnectionResult } from "../ports/PaperlessPort";
import { SettingsAggregate } from "../domain/SettingsAggregate";

export class SettingsQueryHandler {
  constructor(
    private paperlessPort: PaperlessPort,
    private settingsRepository: SettingsRepositoryPort
  ) {}

  public async validateSettings(
    query: ValidateSettingsQuery
  ): Promise<ValidateSettingsResult> {
    const connectionResult = await this.paperlessPort.authenticate({
      url: query.url,
      token: query.token,
    });

    if (connectionResult.status === "success") {
      return { status: "success" };
    }

    // Adapt the port's error result to a domain error result
    return {
      status: "error",
      reason: {
        type: connectionResult.errorType,
        details: connectionResult.details,
      },
    };
  }

  public async getSettings(
    query: GetSettingsQuery
  ): Promise<GetSettingsResult> {
    return this.settingsRepository.load();
  }
}
