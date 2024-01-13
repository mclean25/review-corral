export const assertVarExists = <T extends string | number = string>(
  variable: string
): T => {
  if (process.env[variable]) {
    return process.env[variable] as T;
  }

  throw new Error(`Environment variable '${variable}' is not set`);
};
