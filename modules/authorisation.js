
'use strict'

const bcrypt = require('bcryptjs')
const persistence = require('./persistence')
const saltNumber = 10

/* eslint no-unused-vars: "off" */
exports.clearAccounts = callBack => new Promise((resolve, reject) => {
	persistence.clearAccounts().
	then(count => {
		if (typeof callBack !== 'undefined') {
			callBack(count)
		}
		resolve()
	})
})

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

exports.hashPassword = credentials => new Promise((resolve, reject) => {
	if (typeof resolve === 'undefined') {
		reject(new Error('hashPassword error'))
	}
  const salt = bcrypt.genSaltSync(saltNumber)

  credentials.password = bcrypt.hashSync(credentials.password, salt)
  resolve(credentials)
})

exports.checkPassword = (provided, stored) => new Promise((resolve, reject) => {
  if (!bcrypt.compareSync(provided, stored)) {
		reject(new Error('invalid password'))
	}
  resolve()
})
