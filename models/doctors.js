const { Sequelize, DataTypes, HasMany, BelongsTo } = require('sequelize');
const connection = require("./connection");
const sequelize = connection.sequelize;
// console.log(connection.sequelize);
 
 const slotSchema = sequelize.define("slotSchema", {
    time: {
      type: DataTypes.STRING
    },
    isBooked: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    }
 });

 const dateSchedule = sequelize.define("dateSchedule", {
    date: {
      type: DataTypes.STRING
    }
 });

 dateSchedule.hasMany(slotSchema);


  const doctorSchema = sequelize.define("doctorSchema", {
    username: {
      type: DataTypes.STRING
   },
   password:{
        type:DataTypes.STRING
    },
    name:{
        type:DataTypes.STRING
    },
    email:{
       type:DataTypes.STRING
   },
     phoneNumber:{
        type:DataTypes.STRING
   },
   specialization:{
       type:DataTypes.STRING
    },
   feesPerSession:{
       type:DataTypes.STRING
   }
   
 });

 doctorSchema.hasMany(dateSchedule)


 
 sequelize.sync().then(() => {
    console.log('Doctor table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });
 