
'use strict'

/**
 * Persistence Module.
 * @module Persistence
 */

/** The schema handler for database operation */
const schema = require('../schema/schema')

/** These are consts for comparison */
const zeroLength = 0
const firstIndex = 0

/**
 * Adds the book into the book store
 * @param {Json} bookstoreDetails - The account and book information
 * @returns {Object} The cart information
 */
const getBookFromBookStore =
	bookstoreDetails => new Promise((resolve, reject) => {
	if (typeof bookstoreDetails.account === 'undefined' ||
		typeof bookstoreDetails.bookId === 'undefined') {
			console.log(bookstoreDetails)
		reject(new Error('invalid book store object'))
	}
	schema.Bookstock.find(bookstoreDetails, (err, docs) => {
		if (err) {
			reject(new Error('an error getting from book store'))
		}
		if (docs.length === zeroLength) {
			reject(new Error('did not find from book store'))
		}
		resolve(docs[firstIndex])
	}).
	catch(err => {
		console.log(err.message)
	})
})

/**
 * Clear all accounts in database
 * @returns {Object} Nothing
 */
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

/**
 * Creates account according passed account information
 * @param {Json} details - The Json object containing the account information
 * @returns {Object} The newly created account information
 */
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
			resolve({
				username: userRow.username,
				name: userRow.name
			})
		})
	})
})

/**
 * Adds the book into the cart
 * @param {Json} cartDetails - The account and book information
 * @returns {Object} The cart information
 */
exports.saveCart = cartDetails => new Promise((resolve, reject) => {
	if (typeof cartDetails.account === 'undefined' ||
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

/**
 * Adds the book into the book store
 * @param {Json} bookstoreDetails - The account and book information
 * @returns {Object} The cart information
 */
exports.saveBookStore = bookstoreDetails => new Promise((resolve, reject) => {
	if (typeof bookstoreDetails.account === 'undefined' ||
		typeof bookstoreDetails.title === 'undefined' ||
		typeof bookstoreDetails.bookId === 'undefined' ||
		typeof bookstoreDetails.price === 'undefined' ||
		typeof bookstoreDetails.quantity === 'undefined') {
		reject(new Error('invalid book store object'))
	}
	const bookstore = new schema.Bookstock(bookstoreDetails)

	bookstore.save((err, bookstoreRow) => {
		if (err) {
			reject(new Error('an error saving book store'))
		}
		resolve({
			account: bookstoreRow.account,
			title: bookstoreRow.title,
			bookId: bookstoreRow.bookId,
			price: bookstoreRow.price,
			quantity: bookstoreRow.quantity
		})
	})
})

/**
 * Creates order
 * @param {Json} orderDetails - The account and book information
 * @returns {Object} The cart information
 */
exports.saveOrder = orderDetails => new Promise((resolve, reject) => {
	if (typeof orderDetails.account === 'undefined' ||
		typeof orderDetails.title === 'undefined' ||
		typeof orderDetails.bookId === 'undefined' ||
		typeof orderDetails.storeOwner === 'undefined' ||
		typeof orderDetails.quantity === 'undefined') {
		reject(new Error('invalid book store object'))
	}
	const order = new schema.Order(orderDetails)

	order.save((err, orderRow) => {
		if (err || orderRow === null) {
			reject(new Error('an error saving book store'))
		} else {
			getBookFromBookStore({
				account: orderDetails.storeOwner,
				bookId: orderDetails.bookId
			}).
			then(doc => {
				console.log('operating0...')
				console.log(doc)
				console.log('operating1...')
				console.log(orderDetails)
				console.log('operating2...')
					doc.quantity -= orderDetails.quantity
					doc.save((err2, bookstoreRow) => {
						if (err2) {
							reject(err2)
						} else {
			resolve({totalPrice: orderDetails.quantity * bookstoreRow.price})
						}
					})
			}).
			catch(err1 => {
				console.log(err1.message)
			})
		}
	})
})

/**
 * Get account information from database
 * @param {Json} account - The parameter contains the username information
 * @returns {Object} The account information
 */
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

/**
 * If the account already exists reject
 * @param {Json} account - The account informatino
 * @returns {Object} Nothing
 */
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

/**
 * Gets the credential information from database
 * @param {Json} credentials - The account username infromation
 * @returns {Object} The account credential information
 */
exports.getCredentials = credentials => new Promise((resolve, reject) => {
	schema.User.find({username: credentials.username}, (err, docs) => {
		if (err) {
			reject(new Error('database error'))
		}
		if (docs.length) {
			resolve(docs)
		} else {
			reject(new Error('invalid username'))
		}
	})
})
