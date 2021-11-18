import { HttpError } from 'http-json-errors';

const enum ErrorCode {
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export const NotFoundError = (message = ''): void => {
  throw new HttpError(404, {
    message,
    title: ErrorCode.NOT_FOUND_ERROR,
    body: {
      error_code: ErrorCode.NOT_FOUND_ERROR,
      error_text: message,
    },
  });
};

export const InternalServerError = (message = ''): void => {
  throw new HttpError(500, {
    message,
    title: ErrorCode.INTERNAL_SERVER_ERROR,
    body: {
      error_code: ErrorCode.INTERNAL_SERVER_ERROR,
      error_text: message,
    },
  });
};
