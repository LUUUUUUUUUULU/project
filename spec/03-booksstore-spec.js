/* global describe expect fail waitsFor */
/* eslint func-names: "off" */

'use strict'

// Original const fs = require('fs')
const rewire = require('rewire')
const AsyncSpec = require('node-jasmine-async');
const auth = rewire('../modules/authorization')
const books = rewire('../bookshop.js')

const one = 1
const waitMiliSeconds = 60000
let flag = false

const setFlagAsTrue = () => {
	flag = true;
}

describe('Book Model', function () {
    /* eslint no-invalid-this: "off" */
    const async = new AsyncSpec(this)

    /* eslint prefer-arrow-callback: "off" */
    async.beforeEach(done => {
        auth.clearAccounts().
        then(() => {
            books.register({
                body: {
                    username: 'testuser',
                    password: 'p455w0rd'
                }
            }, (err, data) => {
                if (err) {
                    console.log('creating failed')
                    console.log(err.message)
                }
                console.log(data)
                expect(data).toBeDefined()
                done()
            })
        })
   });

	describe('book store', () => {

		async.it(
            'add to Book Store', done => {
			try {
                flag = false

                books.addToShopStock({
                    authorization: {
                        basic: {
                            username: 'testuser',
                            password: 'p455w0rd'
                        }
                    },
                    params: {
                        bookId: 'bookId1',
                        bookName: 'bookName1',
                        price: 1,
                        quantity: 1
                    }
                }, (err, data) => {
                    expect(err).toBe(null)
                    expect(data.account).toBe('testuser')
                    expect(data.title).toBe('bookName1')
                    expect(data.bookId).toBe('bookId1')
                    expect(data.price).toBe(one)
                    expect(data.quantity).toBe(one)
                    setFlagAsTrue()
                })

                waitsFor(() => flag, 'Wait for flag', waitMiliSeconds)
			} catch (err) {
                console.log(err)
				fail('error should not be thrown')
			} finally {
                done()
            }
		})

		async.it(
            'add to Book Store missing bookname', done => {
			try {
                flag = false

                books.addToShopStock({
                    authorization: {
                        basic: {
                            username: 'testuser',
                            password: 'p455w0rd'
                        }
                    },
                    params: {
                        bookId: 'bookId2',
                        price: 1,
                        quantity: 1
                    }
                }, (err, data) => {
                    expect(err.message).
                    toBe(
    'missing book info in request body ' +
    '{bookId: "", bookName: "", price: 0, quantity: 0}'
                    )
                    expect(data).toBeNull()
                    setFlagAsTrue()
                })

                waitsFor(() => flag, 'Wait for flag', waitMiliSeconds)
			} catch (err) {
                console.log(err)
				fail('error should not be thrown')
			} finally {
                done()
            }
		})

		async.it(
            'add to Book Store missing bookId', done => {
			try {
                flag = false

                books.addToShopStock({
                    authorization: {
                        basic: {
                            username: 'testuser',
                            password: 'p455w0rd'
                        }
                    },
                    params: {
                        bookName: 'bookName2',
                        price: 1,
                        quantity: 1
                    }
                }, (err, data) => {
                    expect(err.message).
                    toBe(
    'missing book info in request body ' +
    '{bookId: "", bookName: "", price: 0, quantity: 0}'
                    )
                    expect(data).toBeNull()
                    setFlagAsTrue()
                })

                waitsFor(() => flag, 'Wait for flag', waitMiliSeconds)
			} catch (err) {
                console.log(err)
				fail('error should not be thrown')
			} finally {
                done()
            }
		})

		async.it(
            'add to Book Store missing quantity', done => {
			try {
                flag = false

                books.addToShopStock({
                    authorization: {
                        basic: {
                            username: 'testuser',
                            password: 'p455w0rd'
                        }
                    },
                    params: {
                        bookName: 'bookName2',
                        bookId: 'bookId2',
                        price: 1
                    }
                }, (err, data) => {
                    expect(err.message).
                    toBe(
    'missing book info in request body ' +
    '{bookId: "", bookName: "", price: 0, quantity: 0}'
                    )
                    expect(data).toBeNull()
                    setFlagAsTrue()
                })

                waitsFor(() => flag, 'Wait for flag', waitMiliSeconds)
			} catch (err) {
                console.log(err)
				fail('error should not be thrown')
			} finally {
                done()
            }
		})

		async.it(
            'add to Book Store missing price', done => {
			try {
                flag = false

                books.addToShopStock({
                    authorization: {
                        basic: {
                            username: 'testuser',
                            password: 'p455w0rd'
                        }
                    },
                    params: {
                        bookName: 'bookName2',
                        bookId: 'bookId2',
                        quantity: 1
                    }
                }, (err, data) => {
                    expect(err.message).
                    toBe(
    'missing book info in request body ' +
    '{bookId: "", bookName: "", price: 0, quantity: 0}'
                    )
                    expect(data).toBeNull()
                    setFlagAsTrue()
                })

                waitsFor(() => flag, 'Wait for flag', waitMiliSeconds)
			} catch (err) {
                console.log(err)
				fail('error should not be thrown')
			} finally {
                done()
            }
		})

    })
})
