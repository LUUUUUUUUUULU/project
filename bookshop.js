
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

// ------------------ ROUTE FUNCTIONS ------------------

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
