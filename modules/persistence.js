
'use strict'

const schema = require('../schema/schema')

const zeroLength = 0
const firstIndex = 0

exports.saveBook = bookDetails => new Promise((resolve, reject) => {
	if (!('title' in bookDetails) &&
		!('authors' in bookDetails) &&
		!('description' in bookDetails)) {
		reject(new Error('invalid book object'))
	}
	const book = new schema.Book(bookDetails)

	book.save((err, bookRow) => {
		if (err) {
			reject(new Error('an error saving book'))
		}
		resolve(bookRow)
	})
})

exports.getAccount = account => new Promise((resolve, reject) => {
	schema.User.find({username: account.username}, (err, docs) => {
		if (err) {
			reject(new Error('error getting account'))
		}
		if (docs.length === zeroLength) {
			reject(new Error(`${account.username} could not be found!`))
		}
		resolve({
			name: docs[firstIndex].name,
			username: docs[firstIndex].username
		})
	})
})

exports.addAccount = details => new Promise((resolve, reject) => {
	if (!('username' in details) &&
		!('password' in details) &&
		!('name' in details)) {
		reject(new Error('invalid user object'))
	}
	const user = new schema.User(details)

	user.save((err, userRow) => {
		if (err) {
			reject(new Error('error creating account'))
		}
		Reflect.deleteProperty(userRow, 'password')
		resolve(userRow)
	})
})

exports.accountExists = account => new Promise((resolve, reject) => {
	schema.User.find({username: account.username}, (err, docs) => {
		if (err) {
			reject(new Error('error checking account'))
		}
		if (docs.length) {
			reject(new Error(`${account.username} already exists`))
		}
		resolve()
	})
})

exports.getCredentials = credentials => new Promise((resolve, reject) => {
	schema.User.find({username: credentials.username}, (err, docs) => {
		if (err) {
			reject(new Error('database error'))
		}
		if (docs.length) {
			resolve(docs)
		}
		reject(new Error('invalid username'))
	})
})

exports.bookExists = (username, book) => new Promise((resolve, reject) => {
	schema.Book.find({
		account: username,
		bookID: book
	}, (err, docs) => {
		if (err) {
			reject(new Error('database error'))
		}
		if (docs.length) {
			reject(new Error('book already in cart'))
		}
		resolve()
	})
})

exports.getBooksInCart = user => new Promise((resolve, reject) => {
	schema.Book.find({account: user}, (err, docs) => {
		if (err) {
			reject(new Error('database error'))
		}
		if (!docs.length) {
			reject(new Error('shopping cart empty'))
		}
		resolve(docs)
	})
})
