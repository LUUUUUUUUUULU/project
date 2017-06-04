
'use strict'

// Import the mongoose package
const mongoose = require('mongoose')

const defaultMONGOPort = 64299
const username = process.env.MONGO_USER || 'testuser'
const password = process.env.MONGO_PASS || 'password'
const host = process.env.MONGO_HOST || 'ds064299.mlab.com'
const port = process.env.MONGO_PORT || defaultMONGOPort
const database = process.env.MONGO_DB || 'bookshop'

mongoose.connect(
	`mongodb://${username}:${password}@${host}:${port}/${database}`)
mongoose.Promise = global.Promise
const {Schema} = mongoose.Schema

// Create a schema
const userSchema = new Schema({
	name: String,
	username: String,
	password: String
})

// Create a model using the schema
exports.User = mongoose.model('User', userSchema)

// Create a schema
const bookSchema = new Schema({
  account: String,
	title: String,
	authors: String,
	description: String,
  bookID: String
})

// Create a model using the schema
exports.Book = mongoose.model('Book', bookSchema)

