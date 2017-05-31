
'use strict'

const schema = require('../schema/schema')

exports.saveBook = bookDetails => new Promise( (resolve, reject) => {
	if (!'title' in bookDetails && !'authors' in bookDetails && !'description' in bookDetails) {
		reject(new Error('invalid book object'))
	}
	const book = new schema.Book(bookDetails)

	book.save( (err, book) => {
		if (err) {
			reject(new Error('an error saving book'))
		}
		resolve(book)
	})
})

exports.getAccount = account => new Promise( (resolve, reject) => {
	schema.User.find({username: account.username}, (err, docs) => {
		if (docs.length == 0 ) reject(new Error(`${account.username} could not be found!`))
		resolve({name: docs[0].name, username: docs[0].username})
	})
})

exports.addAccount = details => new Promise( (resolve, reject) => {
	if (!'username' in details && !'password' in details && !'name' in details) {
		reject(new Error('invalid user object'))
	}
	const user = new schema.User(details)

	user.save( (err, user) => {
		if (err) {
			reject(new Error('error creating account'))
		}
		delete details.password
		resolve(details)
	})
})

exports.accountExists = account => new Promise( (resolve, reject) => {
	schema.User.find({username: account.username}, (err, docs) => {
		if (docs.length) reject(new Error(`${account.username} already exists`))
		resolve()
	})
})

exports.getCredentials = credentials => new Promise( (resolve, reject) => {
	schema.User.find({username: credentials.username}, (err, docs) => {
		if (err) reject(new Error('database error'))
		if (docs.length) resolve(docs)
		reject(new Error(`invalid username`))
	})
})

exports.bookExists = (username, book) => new Promise( (resolve, reject) => {
	schema.Book.find({account: username, bookID: book}, (err, docs) => {
		if (err) reject(new Error('database error'))
		if (docs.length) reject(new Error('book already in cart'))
		resolve()
	})
})

exports.getBooksInCart = user => new Promise( (resolve, reject) => {
	schema.Book.find({account: user}, (err, docs) => {
		if (err) reject(new Error('database error'))
		if (!docs.length) reject(new Error('shopping cart empty'))
		resolve(docs)
	})
})