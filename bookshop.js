
'use strict'

/**
 * Bookshop Module.
 * @module Bookshop
 */

/** This is the authentication handler */
const auth = require('./modules/authorization')

/** This is the 3rd part query module for query books from amazon */
const amazon = require('./modules/amazon')

/** This is the database operation handler */
const persistence = require('./modules/persistence')

/** This is the default host for generating the book access link */
const defaultHost = 'http://localhost:8080'

/** These are consts for logic comparison */
const firstIndex = 0
const one = 1

// ------------------ UTILITY FUNCTIONS ------------------

/**
 * Extracts data from request params
 * @param {Object} request - The request from client
 * @param {String} param - The param key to get
 * @returns {Object} The parameter value from request params
 */
const extractParam = (request, param) => new Promise((resolve, reject) => {
	if (typeof request.params === 'undefined' ||
		typeof request.params[param] === 'undefined') {
		reject(new Error(`${param} parameter missing`))
	}
	resolve(request.params[param])
})

/**
 * Extracts data from request body
 * @param {Object} request - The request from client
 * @param {String} key - The param key to get
 * @returns {Object} The parameter value from request body
 */
const extractBodyKey = (request, key) => new Promise((resolve, reject) => {
	if (typeof request.body === 'undefined' ||
		typeof request.body[key] === 'undefined') {
		reject(new Error(`missing key ${key} in request body`))
	}
	resolve(request.body[key])
})

/**
 * Clean the data from amazon
 * @param {Object} request - The request from client
 * @param {String} data - The data to clean
 * @returns {Object} Cleaned data
 */
const cleanArray = (request, data) => new Promise(resolve => {
	const host = request.host || defaultHost;

	const clean = Array.from(
		data.document.querySelectorAll('div.a-row.a-spacing-none > a')).
			map(element => {
				const href = element.href.split('/ref=')[firstIndex]
				const id = href.substr(href.lastIndexOf('/') + one);
				
				if (element.title !== '') {
					return {
						title: element.title,
						link: `${host}/books/${id}`
					}
				}

				return null
			});

	resolve({books: clean})
})

// ------------------ ROUTE FUNCTIONS ------------------

/**
 * Search api for index.js
 * @param {Object} request - The request from client
 * @param {Function} callback - The callback function called after searching
 * @returns {Object} Nothing
 */
exports.search = (request, callback) => {
	extractParam(request, 'qry').
	then(query => amazon.searchByString(query)).
	then(data => cleanArray(request, data)).
	then(data => {
		callback(null, data)
	}).
	catch(err => {
		callback(err, null)
	})
}

/**
 * Add to cart api for index.js
 * @param {Object} request - The request from client
 * @param {Function} callback - The callback function called after added to cart
 * @returns {Object} Nothing
 */
exports.addToCart = (request, callback) => {
	const temp = {
			username: null,
			password: null,
			id: null
	}

	auth.getHeaderCredentials(request).
	then(credentials => {
		temp.username = credentials.username
		temp.password = credentials.password

		return auth.hashPassword(credentials)
	}).
	then(credentials => persistence.getCredentials(credentials)).
	then(account => {
		const hash = account[firstIndex].password

		return auth.checkPassword(temp.password, hash)
	}).
	then(() => {
		if (typeof request === 'undefined' ||
			typeof request.params === 'undefined' ||
			typeof request.params.bookId === 'undefined' ||
			typeof request.params.bookName === 'undefined') {
			throw new Error(
				'missing book info in request body {bookId: "", bookName: ""}')
		}
		persistence.saveCart({
			account: temp.username,
			title: request.params.bookName,
			bookId: request.params.bookId
		}).then(bookInfo => {
			callback(null, bookInfo)
		})
	}).
	catch(err => {
		callback(err, null)
	})
}

/**
 * Register api for index.js
 * @param {Object} request - The request from client
 * @param {Function} callback - The callback function called after registering
 * @returns {Object} Nothing
 */
exports.register = (request, callback) => {
	const data = {
		name: '',
		username: '',
		password: ''
	}

	extractBodyKey(request, 'username').then(name => {
		data.name = name
		data.username = name

		return extractBodyKey(request, 'password')
	}).
	then(password => {
		data.password = password

		return auth.hashPassword(data)
	}).
	then(credentials => persistence.accountExists(credentials)).
	then(() => persistence.addAccount(data)).
	then(accountInfo => {
		callback(null, accountInfo)
	}).
	catch(err => {
		callback(err)
	})
}

/**
 * Login api for index.js
 * @param {Object} request - The request from client
 * @param {Function} callback - The callback function called after login
 * @returns {Object} Nothing
 */
exports.login = (request, callback) => {
	let data = null

	auth.getHeaderCredentials(request).
	then(credentials => {
		data = {
			username: credentials.username,
			password: credentials.password
		}

		return auth.hashPassword(credentials)
	}).
	then(credentials => persistence.getCredentials(credentials)).
	then(account => {
		const hash = account[firstIndex].password

		return auth.checkPassword(data.password, hash)
	}).
	then(() => persistence.getAccount(data)).
	then(userInfo => {
		callback(null, userInfo)
	}).
	catch(err => {
		callback(err)
	})
}
