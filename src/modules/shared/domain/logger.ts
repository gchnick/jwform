/* eslint-disable no-console */
export const logger = {
  info: (message: string): void => {
    console.log(message);
  },
  error: (error: unknown): void => {
    console.error(error);
  },
};
