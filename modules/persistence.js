
'use strict'

const schema = require('../schema/schema')

const zeroLength = 0
const firstIndex = 0

exports.clearAccounts = () => new Promise((resolve, reject) => {
	schema.User.count().
	then(count => {
		if (count > zeroLength) {
			try {
				schema.User.find({}).
				remove().
				exec((err, res) => {
					if (err) {
						reject(new Error(err))
					}
					resolve(res)
				})
			} catch (err) {
				reject(new Error(err))
			}
		} else {
			resolve()
		}
	})

})

exports.addAccount = details => new Promise((resolve, reject) => {
	if (typeof details.username === 'undefined' ||
		typeof details.password === 'undefined' ||
		typeof details.name === 'undefined') {
		reject(new Error('invalid user object'))
	}
	const user = new schema.User(details)

	schema.User.find({username: details.username}, (err, docs) => {
		if (err) {
			reject(new Error('error checking account'))
		}
		if (docs.length) {
			reject(new Error(`${details.username} already exists`))
		}
	}).
	then(() => {
		user.save((err, userRow) => {
			if (err) {
				reject(new Error('error creating account'))
			}
			resolve(userRow)
		})
	})


})

exports.saveCart = cartDetails => new Promise((resolve, reject) => {
	if (typeof cartDetails.account === 'undefiled' ||
		typeof cartDetails.title === 'undefined' ||
		typeof cartDetails.bookId === 'undefined') {
		reject(new Error('invalid cart object'))
	}
	const cart = new schema.Cart(cartDetails)

	cart.save((err, cartRow) => {
		if (err) {
			reject(new Error('an error saving cart'))
		}
		resolve({
			account: cartRow.account,
			title: cartRow.title,
			bookId: cartRow.bookId
		})
	})
})

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
