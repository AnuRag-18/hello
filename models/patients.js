const { Sequelize, DataTypes, HasMany, BelongsTo } = require('sequelize');
const connection = require("./connection");
const sequelize = connection.sequelize;

const patientSchema = sequelize.define("patientSchema", {
    googleId: {
      type: DataTypes.STRING,
      require:true,
      unique:true
    },
    email: {
      type: DataTypes.STRING
    },
    name:{
        type:DataTypes.STRING
    },
    picture:{
        type:DataTypes.STRING
    },
    phoneNumber:{
        type:DataTypes.STRING
    }
 });

 sequelize.sync().then(() => {
  console.log('Patient table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});