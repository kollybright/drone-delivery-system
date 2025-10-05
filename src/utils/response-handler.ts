export function successHandler(
  message: string,
  data: unknown,
  statusCode: number = 200,
) {
  return {
    success: true,
    message: message,
    data,
  };
}

export function errorHandler(message: string, statusCode: number = 500) {
  return {
    success: false,
    error: message,
    documentation: "/api/docs",
  };
}
