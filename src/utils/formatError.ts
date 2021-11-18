export const formatError = (error) => {
  try {
    error.message = JSON.parse(error.message);
  } catch (e) {
    // Empty
  }
  return {
    ...error,
    message: error.message,
    code: error?.extensions?.exception?.title || 'UNKNOWN',
    locations: error.locations,
    path: error.path,
  };
};
