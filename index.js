const express = require('express');
const app = express();
app.use(express.json());
const mysql = require('mysql');
const cors = require('cors');
const patientsRouter = require('./routes/patients');
const doctorsRotuer = require('./routes/doctors');
const appointmentRouter = require('./routes/appointments');



app.use(cors(
    {
        origin: "*", // allow the server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    }
));

app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRotuer);
app.use('/appointments', appointmentRouter);


const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"anuragmysql",
    database:"FakeDatabase",

});

app.listen(5001,()=>{
    console.log(`Listening on port 5000`)
});