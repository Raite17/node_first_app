const dotenv = require('dotenv');
const path = require('path');
const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

//Экспортируем переменные окружения
module.exports = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    DESTINATION: process.env.DESTINATION
}