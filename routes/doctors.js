
const { Sequelize, DataTypes, HasMany, BelongsTo } = require('sequelize');
const connection = require("../models/connection");
const sequelize = connection.sequelize;
const express = require('express');
const app = express();
const doctors = require('../models/doctors.js');
const jwt = require('jsonwebtoken');
const appointment = require('../models/appointments.js');
const {Doctors,Slot,DateSchedule} = doctors;
const {Appointment} = appointment;
const bcrypt = require('../bcrypt/bcrypt');
app.use(bodyParser.json());


function createDate(date){
    sequelize.sync().then(async () => {
        await DateSchedule.create({
            date:date,
            Slot:[
                new Slot({
                    time: "09:00:00",
                    isBooked: false,
                }),
                new Slot({
                    time: "12:00:00",
                    isBooked: false,
                }),
                new Slot({
                    time: "15:00:00",
                    isBooked: false,
                })
            ]
        })
        console.log('Successfully added a new student!')
    }).catch((error) => console.log('Failed to synchronize with the database:', error))
}
// createDate("28-08-2023");

app.get("/",(req,res)=>{
    Doctors.findAll.then((doctors=>res.json(doctors)));
})

app.post("/doctor",function(req,res){
    Doctors.create({doctor:req.body.doctor}).then(function(doctor){
        res.json(doctor);
    })
})

app.put("/doctor/:id",function(req,res){
    Doctors.findByPk(req.params.id).then(function(doctor){
        doctor.update({
            doctor:req.body.doctor
        }).then((doctor)=>{
            res.json(doctor);
        });
    });
});

app.delete("/doctor/:id",function(req,res){
    Doctors.findByPk(req.params.id).then(function(doctor){
        doctor.destroy();
    }).then((doctor)=>{
        res.sendStatus(200);
    })
})

app.post('/login',(req,res)=>{
    try{
    const username = req.body.username;
    const plainTextPassword = req.body.password;
    const passwordSalt = process.env.PASSWORD_SALT;
    const encryptedPassword = bcrypt.hash(plainTextPassword, passwordSalt);
    const doctor = Doctors.find({
        username: username,
		password: encryptedPassword
    });

    console.log(doctor);
    if (doctor === null) {
        return res.status(201).json({ message: "wrong username or password" });
    }

    const token = jwt.sign(
        JSON.stringify(doctor),
        process.env.KEY, 
        {
            algorithm: process.env.ALGORITHM,
        }
    );

    return res.status(200).json({ token: token.toString() });
    }
    catch(err){
        console.log(err);
		return res.status(400).json(err);
    }
})

app.post("/get-slots",async(req,res)=>{
    try{
    const id = req.body.doctorId; 
	const date = req.body.date; 
    const doctor = await Doctor.findByPk({ _id: id });
    if (doctor === null) {
		console.log("Doctor not found in the database!");
		return res.status(201).json({
			message: "Doctor not found in the database!",
		});
	}

    let count = 0;
		for (const i of doctor.dates) {
			if (i.date === date) {
				return res.status(200).json(i);
			}
			count++;
		}

	const oldLength = count;
    const dateSchedule = createDate(date);
	const updatedDoctor = await Doctors.findOneUpdate(
			{ _id: doctor._id },
			{ $push: { dates: dateSchedule } },
			{ new: true }
	);

	if (updatedDoctor) {
		return res.status(200).json(updatedDoctor.dates[oldLength]);
	} else {
		const err = { err: "an error occurred!" };
		throw err;
	}
}
catch (err) {
    console.log(err);
    return res.status(400).json({
        message: err,
    });
}

})


app.post("/book-slot",(req,res)=>{
    const patientId = req.body.googleId; 
	const patientName = req.body.patientName; 
	const doctorId = req.body.doctorId; 
	const slotId = req.body.slotId; 
	const dateId = req.body.dateId; 
	const meetLink = "";

    Doctor.findOne({ _id: doctorId }).then((doctor) => {
		const date = doctor.dates.id(dateId);
		const slot = date.slots.id(slotId);
		slot.isBooked = true;
		doctor
			.save()
			.then(() => {
				// Create an entry in the appointment database
				const newAppointment = new Appointment({
					doctorId,
					dateId,
					slotId,
					patientId,
					date: date.date,
					slotTime: slot.time,
					doctorName: doctor.name,
					doctorEmail: doctor.email,
					patientName: patientName,
					googleMeetLink: meetLink
				});

				console.log(newAppointment);

				newAppointment
					.save()
					.then((appointment) => {
						return res.status(200).json(appointment);
					})
					.catch((err) => {
						console.log(err);
						res.status(400).json(err);
					});
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json({
					message: `An error occurred : ${err}`,
				});
			});
	});

});

app.post("/appointments",async(req,res)=>{
    try {
		const doctorId = req.body.doctorId;
		const appointments = await Appointment.find({
			doctorId: doctorId,
		});
		const sortedAppointments = appointments.sort((a, b) => {
			return (
				Date.parse(b.date + "T" + b.slotTime) -
				Date.parse(a.date + "T" + a.slotTime)
			);
		});

		res.status(200).json(sortedAppointments);
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
})

app.get("/appointment/:id",async (req, res) => {
	try {
		const appointmentId = req.params.id;
		const appointment = await Appointment.findOne({
			_id: appointmentId,
		});

		res.status(200).json(appointment);
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
});

app.listen(3004,function(){
    console.log("Server listening on port:3004");
});

module.exports = app;