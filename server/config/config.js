const { config } = require('dotenv');

config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  redis: {
  	 url: process.env.REDIS_URL,
  	 port: process.env.REDIS_PORT,
  	 password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  email: {
    smtp: {
      service: process.env.SMTP_HOST, // host
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
};
