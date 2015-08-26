var logger = require('../logger/logger');

exports.handleResponseError = function(res, statusCode, err) {
      logger.error(err);
      return res.status(statusCode).send(err);
};

exports.handleSocketError = function(socket, err, type) {
      return socket.io.emit('error:' + (type || ''), err);
};