const { Sequelize, DataTypes, HasMany, BelongsTo } = require('sequelize');

const sequelize = new Sequelize(
    'fakerDatabase',
    'root',
    'anuragmysql',
    {
        host:'Madhavarapus-MacBook-Pro.local',
        dialect:'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });


 module.exports = {sequelize};
