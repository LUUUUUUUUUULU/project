/* global describe expect fail waitsFor */
/* eslint func-names: "off" */

'use strict'

// Original const fs = require('fs')
const rewire = require('rewire')
const AsyncSpec = require('node-jasmine-async');
const auth = rewire('../modules/authorization')
const books = rewire('../bookshop.js')

const one = 1
const two = 2
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
                    console.log('creating user failed')
                    console.log(err.message)
                }
                console.log(data)
                expect(data).toBeDefined()
                books.register({
                    body: {
                        username: 'testuser1',
                        password: 'p455w0rd'
                    }
                }, (err1, data1) => {
                    if (err1) {
                        console.log('creating user failed')
                        console.log(err1.message)
                    }
                    expect(data1).toBeDefined()
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
                        price: 2,
                        quantity: 2
                    }
            }, (err3, data3) => {
                if (err3) {
                    console.log('creating book store failed')
                    console.log(err3.message)
                }
                expect(data3).toBeDefined()
                done()
            })
                })
            })
        })
   });

	describe('Order', () => {

		async.it(
            'create order', done => {
			try {
                flag = false

                books.addOrder({
                    authorization: {
                        basic: {
                            username: 'testuser1',
                            password: 'p455w0rd'
                        }
                    },
                    params: {
                        bookId: 'bookId1',
                        bookName: 'bookName1',
                        storeOwner: 'testuser',
                        quantity: 1
                    }
                }, (err, data) => {
                    expect(err).toBe(null)
                    console.log(data)
                    expect(data.totalPrice).toBe(two)
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
            'create order missing bookname', done => {
			try {
                flag = false

                books.addToShopStock({
                    authorization: {
                        basic: {
                            username: 'testuser1',
                            password: 'p455w0rd'
                        }
                    },
                    params: {
                        bookId: 'bookId1',
                        storeOwner: 'testuser',
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
            'create order missing bookId', done => {
			try {
                flag = false

                books.addToShopStock({
                    authorization: {
                        basic: {
                            username: 'testuser1',
                            password: 'p455w0rd'
                        }
                    },
                    params: {
                        bookName: 'bookName1',
                        storeOwner: 'testuser',
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
            'create order missing quantity', done => {
			try {
                flag = false

                books.addToShopStock({
                    authorization: {
                        basic: {
                            username: 'testuser1',
                            password: 'p455w0rd'
                        }
                    },
                    params: {
                        bookId: 'bookId1',
                        bookName: 'bookName1',
                        storeOwner: 'testuser'
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
            'create order missing storeOwner', done => {
			try {
                flag = false

                books.addToShopStock({
                    authorization: {
                        basic: {
                            username: 'testuser1',
                            password: 'p455w0rd'
                        }
                    },
                    params: {
                        bookId: 'bookId1',
                        bookName: 'bookName1',
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
