/* global describe beforeEach it expect fail waitsFor runs done */
/* eslint func-names: "off" */

'use strict'

// Original const fs = require('fs')
const rewire = require('rewire')
const persistence = require('../modules/persistence')
const AsyncSpec = require('node-jasmine-async');
const auth = rewire('../modules/authorisation')
const books = rewire('../bookshop.js')

const zero = 0
const one = 1
const waitMiliSeconds = 60000
let flag = false
let testReturn = null

const setFlagAsTrue = () => {
	flag = true;
}

const resolvedPromise = () => {
    return Promise.resolve('Test')
}

const asyncFunc = async (asyncResource) => {
    await resolvedPromise()
    await asyncResource.fetchItem()
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
                done()
            })
        })
   });

	describe('search for books', () => {

		async.it(
            'search for a recognised topic', done => {
			try {
                flag = false

                books.search({
                    params: {
                        q: 'Security'
                    }
                }, (err, data) => {
                    expect(err).toBe(null)
                    expect(data.books.length).toBeGreaterThan(zero)
                    setFlagAsTrue()
                })

                waitsFor(() => flag, 'Wait for flag', waitMiliSeconds)
			} catch (err) {
				fail('error should not be thrown')
			} finally {
                done()
            }
		})
        
		async.it(
            'search for an unrecognised topic', done => {
			try {
                flag = false

                books.search({
                    params: {
                        q: 'abcdefgfedcba'
                    }
                }, (err, data) => {
                    expect(err).toBe(null)
                    expect(data.books.length).toBe(zero)
                    setFlagAsTrue()
                })

                waitsFor(() => flag, 'Wait for flag', waitMiliSeconds)
			} catch (err) {
				fail('error should not be thrown')
			} finally {
                done()
            }
		})

		async.it(
            'add to Cart', done => {
			try {
                flag = false

                books.addToCart({
                    authorization: {
                        basic: {
                            username: 'testuser',
                            password: "p455w0rd"
                        }
                    },
                    bookId: "bookId1",
                    bookName: "bookName1"
                }, (err, data) => {
                    expect(err).toBe(null)
                    expect(data.account).toBe('testuser')
                    expect(data.title).toBe('bookName1')
                    expect(data.bookId).toBe('bookId1')
                    console.log(data)
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
            'add to Cart missing bookname', done => {
			try {
                flag = false

                books.addToCart({
                    authorization: {
                        basic: {
                            username: 'testuser',
                            password: "p455w0rd"
                        }
                    },
                    bookId: "bookId2"
                }, (err, data) => {
                    expect(err.message).toBe('missing book info in request body {bookId: "", bookName: ""}')
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
            'add to Cart missing bookId', done => {
			try {
                flag = false

                books.addToCart({
                    authorization: {
                        basic: {
                            username: 'testuser',
                            password: "p455w0rd"
                        }
                    },
                    bookName: "bookName2"
                }, (err, data) => {
                    expect(err.message).toBe('missing book info in request body {bookId: "", bookName: ""}')
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