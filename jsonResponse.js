function jsonResponse (data, code, message = null, error = false, validation_errors = []) {
  return {
    status: {
      code: code,
      message: message || (code === 200 ? 'success' : 'error'),
      error: error,
      validation_errors: validation_errors
    },
    data: data
  }
}

module.exports = jsonResponse
