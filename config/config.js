require('dotenv').config();
module.exports = {
"development": {
    "username": process.env.db_user,
    "password": process.env.db_password,
    "database": process.env.db_name,
    "host": process.env.db_host,
    "dialect": "mysql",
    "migrationStorageTableName": "sequelize_meta"
},
}