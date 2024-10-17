function errorHandler(err, req, res, next) {
    console.log("error handler");
    
    console.error(err.stack); // Log the error stack
    res.status(err.status || 500); // Set the response status code
    res.json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
}

module.exports = errorHandler