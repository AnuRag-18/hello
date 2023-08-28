const express = require('express');
const app = express();
const appointmentImport = require("../models/appointments.js");
const {Appointment} = appointment;

app.put('/add-meet-link',(req, res) => {
    const meetLink = req.body.meetLink;
    const appointmentId = req.body.appointmentId;

    Appointment.findOne({ _id: appointmentId }).then((appointment) => {
        if (appointment) {
            appointment.googleMeetLink = meetLink;
            console.log(`Received meet link : ${meetLink}`);

            appointment.save().then(() => {
                console.log(`Updated the meet link!`);
                res.status(200).json({ message: "Meet link updated!" });
            }).catch((err) => {
                console.log(`Cannot add meet link to the appointment due to ${err}`);
                res.status(400).json({ message: `Cannot add meet link to the appointment due to ${err}` });
            })
        }
    })
})

module.exports = app;