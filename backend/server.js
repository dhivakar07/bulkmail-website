const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URL);
  isConnected = true;
  console.log("Connected to DB");
}

const Credential = mongoose.model(
  "credential",
  new mongoose.Schema({}, { strict: false }),
  "bulkmail",
);
const Login = mongoose.model(
  "login",
  new mongoose.Schema({}, { strict: false }),
  "admin",
);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  Login.find().then((data) => {
    const adminrec = data[0].toJSON();
    if (email === adminrec.email && pass === adminrec.pass) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});
app.post("/sendmail", (req, res) => {
  const sub = req.body.sub;
  const msg = req.body.msg;
  const emails = req.body.emailList;

  Credential.find().then((data) => {
    console.log(data[0].toJSON());
    const creds = data[0].toJSON();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: creds.user,
        pass: creds.pass,
      },
    });

    new Promise(async (resolve, reject) => {
      try {
        for (var i = 0; i < emails.length; i++) {
          await transporter.sendMail({
            from: "dhivakar782001@gmail.com",
            to: emails[i],
            subject: sub,
            text: msg,
          });
        }
        resolve("Success");
      } catch (err) {
        reject("Failed");
      }
    })
      .then(() => {
        res.send(true);
      })
      .catch(() => {
        res.send(false);
      });
  });
});

module.exports = app;
