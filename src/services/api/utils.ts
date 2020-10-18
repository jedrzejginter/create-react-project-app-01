import type { AxiosResponse } from "axios";

function hasResponse(err: unknown): err is { response?: any } {
  return typeof err === "object" && err !== null && "response" in err;
}

export function isAxiosError(
  err: unknown,
): err is Error & {
  code: string;
  response: AxiosResponse<{ errors?: Record<string | "general", string> }>;
} {
  return err instanceof Error && hasResponse(err) && typeof err.response !== "undefined";
}

export function getErrorMessage(err: unknown, fallbackMessage: string): string {
  if (isAxiosError(err)) {
    if (err.code === "ECONNREFUSED") {
      return "Unable to connect to this endpoint.";
    }

    const res = err.response;

    if (res.data.errors) {
      return res.data.errors.general ?? fallbackMessage;
    }
  }

  return fallbackMessage;
}
