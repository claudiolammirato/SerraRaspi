
require('dotenv').config()
dbPassword = process.env.DB_HOST_ONLINE;

module.exports = {
    mongoURI: dbPassword
};
