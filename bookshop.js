
'use strict'

const auth = require('./modules/authorisation')
const amazon = require('./modules/amazon')
const persistence = require('./modules/persistence')

const defaultHost = 'http://localhost:8080'
const firstIndex = 0
const one = 1

// ------------------ UTILITY FUNCTIONS ------------------

const extractParam = (request, param) => new Promise((resolve, reject) => {
	if (typeof request.params === 'undefined' ||
		typeof request.params[param] === 'undefined') {
		reject(new Error(`${param} parameter missing`))
	}
	resolve(request.params[param])
})

const extractBodyKey = (request, key) => new Promise((resolve, reject) => {
	if (typeof request.body === 'undefined' ||
		typeof request.body[key] === 'undefined') {
		reject(new Error(`missing key ${key} in request body`))
	}
	resolve(request.body[key])
})

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

const removeMongoFields =
	(request, data) => new Promise(resolve => {
	const host = request.host || defaultHost;
	const clean = data.map(element => {
		if (typeof element !== 'undefined') {
			return {
				title: element.title,
				link: `${host}/books/${element.bookID}`
			}
		}
		
		return null
	})

	resolve({books: clean})
})

// ------------------ ROUTE FUNCTIONS ------------------

exports.search = (request, callback) => {
	extractParam(request, 'q').then(query => amazon.searchByString(query)).
	then(data => cleanArray(request, data)).
	then(data => {
		callback(null, data)
	}).
	catch(err => {
		callback(err)
	})
}

exports.addToCartOld = (request, callback) => {
	extractBodyKey(request, 'id').
	then(id => amazon.getByID(id)).
	then(book => persistence.saveBook(book)).
	catch(err => {
		callback(err)
	})
}

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
	then(() => extractBodyKey(request, 'id')).
	then(id => {
		temp.id = id

		return amazon.getByID(id)
	}).
	then(book => {
		temp.book = book

		return persistence.bookExists(temp.username, temp.id)
	}).
	then(book => persistence.saveBook(book)).
	then(book => {
		// Original: delete book.account
		Reflect.deleteProperty(book, 'account')
		callback(null, book)
	}).
	catch(err => {
		callback(err)
	})
}

exports.showCart = (request, callback) => {
	const temp = {
		username: null,
		password: null
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
	then(() => persistence.getBooksInCart(temp.username)).
	then(books => removeMongoFields(request, books)).
	then(books => {
		callback(null, books)
	}).
	catch(err => {
		callback(err)
	})
}

exports.addUser = (request, callback) => {
	let data = null

	auth.getHeaderCredentials(request).
	then(credentials => auth.hashPassword(credentials)).
	then(credentials => {
		data = credentials

		return persistence.accountExists(credentials)
	}).
	then(() => extractBodyKey(request, 'name')).
	then(name => {
		data.name = name

		return persistence.addAccount(data)
	}).
	then(accountInfo => {
		callback(null, accountInfo)
	}).
	catch(err => {
		callback(err)
	})
}

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
