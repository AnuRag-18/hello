const express = express();
const app = express();
const Patients = require('../models/patients.js');
const appointment = require('../models/appointments.js');
const {Appointment} = appointment;
const jwt = require('jsonwebtoken');

app.get("/",(req,res)=>{
    Patients.findAll.then((patients=>res.json(patients)));
})

app.post("/patient",function(req,res){
    Patients.create({patient:req.body.patient}).then(function(patient){
        res.json(patient);
    })
})

app.put("/patient/:id",function(req,res){
    Patients.findByPk(req.params.id).then(function(patient){
        patient.update({
            patient:req.body.patient
        }).then((patient)=>{
            res.json(patient);
        });
    });
});

app.delete("/patient/:id",function(req,res){
    Patients.findByPk(req.params.id).then(function(patient){
        patient.destroy();
    }).then((patient)=>{
        res.sendStatus(200);
    })
})

module.exports = app;