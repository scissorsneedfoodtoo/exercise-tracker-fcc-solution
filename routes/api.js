const Users = require('../models/users');
const Exercises = require('../models/exercises');

const router = require('express').Router();

router.post('/new-user', (req, res, next) => {
  const user = new Users(req.body)
  user.save((err, savedUser) => {
    if(err) {
      if(err.code == 11000) {
        // uniqueness error (no custom message)
        return next({
          status: 400,
          message: 'Username already taken'
        })
      } else {
        return next(err)
      }
    }

    res.json({
      username: savedUser.username,
      userId: savedUser._id
      // userId: savedUser.userId
    })
  })
})

router.post('/add', (req, res, next) => {
  Users.findById(req.body.userId, (err, user) => {
    if(err) return next(err)
    if(!user) {
      return next({
        status: 400,
        message: 'Unknown userId'
      })
    }
    const exercise = new Exercises(req.body)
    exercise.username = user.username
    exercise.save((err, savedExercise) => {
      if(err) return next(err)
      savedExercise = savedExercise.toObject()
      delete savedExercise.__v
      delete savedExercise._id
      savedExercise.date = (new Date(savedExercise.date)).toDateString()
      res.json(savedExercise)
    })
  })
})

router.get('/users', (req, res, next) => {
  Users.find({}, (err, data) => {
    res.json(data)
  })
})
router.get('/log', (req, res, next) => {
  const from = new Date(req.query.from)
  const to = new Date(req.query.to)
  // console.log(req.query.userId)
  // console.log(from.toISOString(), to.toISOString())
  Users.findById(req.query.userId, (err, user) => {
    if(err) return next(err);
    if(!user) {
      return next({status:400, message: 'Unknown userId'})
    }
    // console.log(user)
    Exercises.find({
      userId: req.query.userId,
        date: {
          // $lte: to != 'Invalid Date' ? to.getDate() : Date.now() ,
          // $gte: from != 'Invalid Date' ? from.getTime() : 0
          $lte: to != 'Invalid Date' ? to.toISOString() : Date.now() ,
          $gte: from != 'Invalid Date' ? from.toISOString() : 0
        }
      }, {
        __v: 0,
        _id: 0
      })
    .sort('-date')
    .limit(parseInt(req.query.limit))
    .exec((err, exercises) => {
      if(err) return next(err)
      const out = {
          userId: req.query.userId,
          username: user.username,
          from : from != 'Invalid Date' ? from.toDateString() : undefined,
          to : to != 'Invalid Date' ? to.toDateString(): undefined,
          count: exercises.length,
          log: exercises.map(e => ({
            description : e.description,
            duration : e.duration,
            date: e.date.toDateString()
          })
        )
      }
      res.json(out)
    })
  })
})

module.exports = router
