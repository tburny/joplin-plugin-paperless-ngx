import { ConnectionResult, PaperlessPort } from "../ports/PaperlessPort";

export class PaperlessAdapter implements PaperlessPort {
  async authenticate(params: {
    url: string;
    token: string;
  }): Promise<ConnectionResult> {
    const { url, token } = params;

    if (!url || !token) {
      return { status: "error", errorType: "MissingSettings" };
    }

    try {
      const response = await fetch(`${url.replace(/\/$/, "")}/api/users/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.status === 401)
        return { status: "error", errorType: "InvalidToken" };
      if (!response.ok)
        return {
          status: "error",
          errorType: "UnknownServerError",
          details: `Status: ${response.status}`,
        };

      return { status: "success" };
    } catch (error) {
      return {
        status: "error",
        errorType: "NetworkError",
        details: error.message,
      };
    }
  }
}
