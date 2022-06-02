// Script to mass upload catalog mushroom posts by csv
// Path to csv, change to your desired csv
const csvFilePath='./Sample_data.csv'
const csv = require('csvtojson')
const mongoose = require('mongoose');
const dotenv = require("dotenv"); 
const Mushrooms = require('../models/mushroomModel');
dotenv.config({path:'../.env'})

// Database connection 
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log(err);
  });

csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    Mushrooms.insertMany(jsonObj).then( () => { 
        console.log("Inserted")
        process.exit(0)
    }).catch((error) => {  
        console.log(error) 
        process.exit(1) });
})