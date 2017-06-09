/* global describe expect fail waitsFor */
/* eslint func-names: "off" */

'use strict'

const rewire = require('rewire')
const AsyncSpec = require('node-jasmine-async');

const auth = rewire('../modules/authorization')

const waitMiliSeconds = 60000
let flag = false
let testReturn = null

const setFlagAsTrue = () => {
	flag = true;
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
            'should prevent duplicate usernames  from being inserted',
            function (done) {
                done()
		})

		async.it(
            'should throw an error if missing username', function (done) {
			try {
				testReturn = {data: null}
                flag = false

				auth.createAccount({password: 'p455w0rd'}, userInfo => {
                    testReturn.data = userInfo
                    expect(testReturn.data.username).toEqual('testuser')
                    expect(testReturn.data).toEqual({
                        status: 'success',
                        username: 'testuser'
                    })
                }).
                catch(err => {
                    expect(err.message).toBe('missing account info to create!')
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
		async.it('throw error if missing request', done => {
            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials().
                catch(err => {
                    expect(err.message).toBe('authorization header missing')
                    done()
                })
            })
		})

		async.it('throw error if missing authorization', done => {
            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({authorization: ''}).
                catch(err => {
                    expect(err.message).toBe('authorization header missing')
                    done()
                })
            })
		})

		async.it('throw error if missing authorization', done => {
            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({}).
                catch(err => {
                    expect(err.message).toBe('authorization header missing')
                    done()
                })
            })
		})

		async.it('throw error if missing authorization.basic', done => {
            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({authorization: {}}).
                catch(err => {
                    expect(err.message).toBe('authorization header missing')
                    done()
                })
            })
		})

		async.it('throw error if missing username', done => {
            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({authorization: {basic: {}}}).
                catch(err => {
                    expect(err.message).toBe('missing username / password')
                    done()
                })
            })
		})

		async.it('throw error if missing password', done => {
            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({
                    authorization: {
                        basic:
                        {username: 'testuser'}
                    }
                }).
                catch(err => {
                    expect(err.message).toBe('missing username / password')
                    done()
                })
            })
		})

		async.it('get the header credential info', done => {
            auth.createAccount({
                username: 'testuser',
                password: 'p455w0rd'
            }).
            then(() => {
                auth.getHeaderCredentials({
                    authorization: {
                        basic: {
                            username: 'testuser',
                            password: 'p455w0rd'
                        }
                    }
                }).
                then(userInfo => {
                    expect(userInfo.username).toBe('testuser')
                    expect(userInfo.password).toBe('p455w0rd')
                    console.log(userInfo)
                    done()
                }).
                catch(err => {
                    console.log(err.message)
                    fail('should not reach here')
                })
            })
		})
	})

})
