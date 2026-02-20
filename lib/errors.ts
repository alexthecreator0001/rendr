export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function apiError(
  status: number,
  message: string,
  code?: string
): Response {
  return Response.json(
    {
      error: {
        code: code ?? "error",
        message,
      },
    },
    { status }
  )
}
