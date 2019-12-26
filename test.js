require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URI || 'mongodb://localhost/exercise-track', { useNewUrlParser: true });

const Users = require('./models/users');
const Exercises = require('./models/exercises');

// // Using more recent Mongo driver
// Users.deleteOne({userId: 'R1jWATf3'}, (err, user) => {
//   if(err) console.log(err);

//   console.log(user)
// });

// console.log(new Date('6/13/2018').toDateString())

// Exercises.deleteMany({userId: 'nBuiQarw'}, (err, exercises) => {
//   if (err) console.log(err);

//   console.log(exercises)
// });
