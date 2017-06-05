
'use strict'

const bcrypt = require('bcryptjs')
const saltNumber = 10

exports.getHeaderCredentials = request => new Promise((resolve, reject) => {
	if (typeof request.authorization === 'undefined' ||
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
