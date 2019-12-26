'use strict'

const shortId = require('shortid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const newId = shortId.generate();

const Users = new Schema({
  username: {
    type: String, 
    required: true,
    unique: true,
    maxlength: [20, 'username too long']
  },
  _id: {
    type: String,
    default: newId
  },
  userId: {
    type: String,
    index: true,
    default: newId
  }
})

module.exports = mongoose.model('Users', Users)