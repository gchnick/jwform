export function NoIntegrityForm(message: string): Error {
  return new Error(message);
}

export function SetDrawTextOptionsFail(message: string): Error {
  return new Error(message);
}

export function FileNotFound(message: string): Error {
  return new Error(message);
}
