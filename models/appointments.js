const { Sequelize, DataTypes, HasMany, BelongsTo } = require('sequelize');
const connection = require("./connection");
const sequelize = connection.sequelize;

const appointmentSchema = sequelize.define("appointmentSchema", {
    doctorId: {
      type: DataTypes.STRING
    },
    dateId:{
        type:DataTypes.STRING,
        require:true
    },
    slotId:{
        type:DataTypes.STRING,
        require:true
    },
    patientId:{
        type:DataTypes.STRING,
        require:true
    },
    date:{
        type:DataTypes.STRING
    },
    slotTime:{
        type:DataTypes.STRING
    },
    doctorName:{
        type:DataTypes.STRING
    },
    doctorEmail:{
        type:DataTypes.STRING
    },
    patientName:{
        type:DataTypes.STRING
    },
    googleMeetLink:{
        type:DataTypes.STRING
    }
 });

 sequelize.sync().then(() => {
    console.log('Appointment table created successfully!');
  }).catch((error) => {
    console.error('Unable to create table : ', error);
  });