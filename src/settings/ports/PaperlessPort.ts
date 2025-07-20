export type ConnectionErrorType =
  | "MissingSettings"
  | "InvalidToken"
  | "NetworkError"
  | "UnknownServerError";

export type SuccessResult = { status: "success" };
export type ErrorResult = {
  status: "error";
  errorType: ConnectionErrorType;
  details?: string;
};
export type ConnectionResult = SuccessResult | ErrorResult;

export interface PaperlessPort {
  authenticate(params: {
    url: string;
    token: string;
  }): Promise<ConnectionResult>;
}
