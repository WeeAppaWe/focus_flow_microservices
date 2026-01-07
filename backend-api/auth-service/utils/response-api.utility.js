const response = (res, statusCode = 200, status = 'success', message = 'Operation successful', data = null) => {
    const responsePayload = {
        status,
        message,
    };

    if (data !== null) {
        responsePayload.data = data;
    }

    return res.status(statusCode).json(responsePayload);
};

module.exports = { response };
