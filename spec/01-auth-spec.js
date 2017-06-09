/* global describe beforeEach it expect fail waitsFor runs done */
/* eslint func-names: "off" */

'use strict'

// Original const fs = require('fs')
const rewire = require('rewire')
const persistence = require('../modules/persistence')
const AsyncSpec = require('node-jasmine-async');

const auth = rewire('../modules/authorisation')

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

describe('Auth Model', function () {
    /* eslint no-invalid-this: "off" */
    const async = new AsyncSpec(this)

    /* eslint prefer-arrow-callback: "off" */
    async.beforeEach(done => {
        auth.clearAccounts(() => {
            done()
        })
    });

	describe('create accounts', () => {
		async.it(
            'create a single valid account', done => {
			try {
				testReturn = {data: null}
                flag = false

				auth.createAccount({
					username: 'testuser',
					password: 'p455w0rd'
				}, userInfo => {
                    testReturn.data = userInfo
                    setFlagAsTrue()
                    expect(testReturn.data.username).toEqual('testuser')
                    expect(testReturn.data).toEqual({
                        status: 'success',
                        username: 'testuser'
                    })
                })
                waitsFor(() => flag, 'Wait for flag', waitMiliSeconds)
			} catch (err) {
				fail('error should not be thrown')
			} finally {
                done()
            }
		})

		async.it(
            'should prevent duplicate usernames  from being inserted', function (done) {
                done()
		})

		async.it(
            'should throw an error if missing username', function (done) {
			try {
				testReturn = {data: null}
                flag = false

                let foundError = false
				auth.createAccount({
					password: 'p455w0rd'
				}, userInfo => {
                    testReturn.data = userInfo
                    expect(testReturn.data.username).toEqual('testuser')
                    expect(testReturn.data).toEqual({
                        status: 'success',
                        username: 'testuser'
                    })
                }).
                catch(e => {
                    foundError = true
                    expect(e.message).toBe('missing account info to create!')
                    setFlagAsTrue()
                    done()
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
    	
	describe('getHeaderCredentials', () => {
		async.it('throw error if missing request', function(done) {
            let errCounter = 0

            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials().
                then(() => {

                }).
                catch (err => {
                    expect(err.message).toBe('authorization header missing')
                    errCounter++
                    done()
                })
            })
		})

		async.it('throw error if missing authorization', function(done) {
            let errCounter = 0

            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({authorization: ''}).
                then(() => {

                }).
                catch (err => {
                    expect(err.message).toBe('authorization header missing')
                    errCounter++
                    done()
                })
            })
		})

		async.it('throw error if missing authorization', function(done) {
            let errCounter = 0

            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({}).
                then(() => {

                }).
                catch (err => {
                    expect(err.message).toBe('authorization header missing')
                    errCounter++
                    done()
                })
            })
		})

		async.it('throw error if missing authorization.basic', function(done) {
            let errCounter = 0

            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({authorization: {}}).
                then(() => {

                }).
                catch (err => {
                    expect(err.message).toBe('authorization header missing')
                    errCounter++
                    done()
                })
            })
		})

		async.it('throw error if missing username', function(done) {
            let errCounter = 0

            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({authorization: {basic: {}}}).
                then(() => {

                }).
                catch (err => {
                    expect(err.message).toBe('missing username / password')
                    errCounter++
                    done()
                })
            })
		})

		async.it('throw error if missing password', function(done) {
            let errCounter = 0

            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({authorization: {basic: {username: 'testuser'}}}).
                then(() => {

                }).
                catch (err => {
                    expect(err.message).toBe('missing username / password')
                    errCounter++
                    done()
                })
            })
		})

		async.it('get the header credential info', function(done) {
            let errCounter = 0

            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({
                    authorization: {
                        basic: {
                            username: 'testuser',
                            password: "p455w0rd"
                        }
                    }
                }).
                then((userInfo) => {
                    expect(userInfo.username).toBe('testuser')
                    expect(userInfo.password).toBe('p455w0rd')
                    console.log(userInfo)
                    done()
                }).
                catch (err => {
                    fail('should not reach here')
                })
            })
		})
	})

})
