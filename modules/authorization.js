
'use strict'

/**
 * Authorization Module.
 * @module Authorization
 */

const bcrypt = require('bcryptjs')
const persistence = require('./persistence')
const saltNumber = 10

/**
 * Clear all accounts in database
 * @param {Function} callBack - The callback function called after login
 * @returns {Object} Nothing
 */
exports.clearAccounts = callBack => new Promise((resolve, reject) => {
	persistence.clearAccounts().
	then(count => {
		if (typeof callBack !== 'undefined') {
			callBack(count)
		}
		resolve()
	}).
	catch(err => {
		reject(err)
	})
})

/**
 * Creates account
 * @param {Object} request - The request from client
 * @param {Function} callBack - The callback function called after creating
 * @returns {Object} Account info
 */
exports.createAccount = (request, callBack) =>
	new Promise((resolve, reject) => {
	if (typeof request.username === 'undefined' ||
			typeof request.password === 'undefined') {
		reject(new Error('missing account info to create!'))
	}

	const result = {
		status: 'success',
		username: ''
	}

	persistence.addAccount({
		name: request.username,
		username: request.username,
		password: request.password
	}).
	then(userInfo => {
		result.username = userInfo.username
		if (typeof callBack !== 'undefined') {
			callBack(result)
		}
		resolve(result)
	}).
	catch(err => {
		reject(err)
	})
})

/**
 * Gets the login info from header information
 * @param {Object} request - The request from client
 * @param {Function} callback - The callback function called after calling
 * @returns {Object} Nothing
 */
exports.getHeaderCredentials = request => new Promise((resolve, reject) => {
	if (typeof request === 'undefined' ||
		typeof request.authorization === 'undefined' ||
		typeof request.authorization.basic === 'undefined') {
		reject(new Error('authorization header missing'))
	}
	const auth = request.authorization.basic

	if (typeof auth.username === 'undefined' ||
			typeof auth.password === 'undefined') {
		reject(new Error('missing username / password'))
	}
	resolve({
		username: auth.username,
		password: auth.password
	})
})

/**
 * Hashes the password
 * @param {Object} credentials - The account info
 * @returns {Object} The hashed info
 */
exports.hashPassword = credentials => new Promise((resolve, reject) => {
	if (typeof resolve === 'undefined') {
		reject(new Error('hashPassword error'))
	}
  const salt = bcrypt.genSaltSync(saltNumber)

  credentials.password = bcrypt.hashSync(credentials.password, salt)
  resolve(credentials)
})

/**
 * Compares the two password
 * @param {String} provided - The generated password
 * @param {String} stored - The password from database
 * @returns {Object} Nothing
 */
exports.checkPassword = (provided, stored) => new Promise((resolve, reject) => {
  if (!bcrypt.compareSync(provided, stored)) {
		reject(new Error('invalid password'))
	}
  resolve()
})
