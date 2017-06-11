
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
/* eslint prefer-destructuring: "off" */
const Schema = mongoose.Schema

// Create a schema
const userSchema = new Schema({
	name: String,
	username: String,
	password: String
})

// Create a model using the schema
exports.User = mongoose.model('User', userSchema)

// Create a schema
const cartSchema = new Schema({
    account: String,
	title: String,
    bookId: String
})

// Create a model using the schema
exports.Cart = mongoose.model('Cart', cartSchema)

// Create a schema
const bookstockSchema = new Schema({
    account: String,
	title: String,
    bookId: String,
	price: Number,
	quantity: Number
})

// Create a model using the schema
exports.Bookstock = mongoose.model('BookStock', bookstockSchema)

// Create a schema
const orderSchema = new Schema({
    account: String,
	title: String,
    bookId: String,
	price: Number,
	quantity: Number,
	bookOwner: String
})

// Create a model using the schema
exports.Order = mongoose.model('Order', orderSchema)
