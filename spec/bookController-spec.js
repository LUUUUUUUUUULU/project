/* global describe xit expect */
/* eslint no-underscore-dangle: ["error", {"allow": ["books", "__set__"]}] */

const fs = require('fs')
const rewire = require('rewire')
const pageOk = 200
const badRequestCode = 400
const pageNotFoundCode = 404
const bookSize = 3

// Original var bookController = rewire("../modules/bookController")
const books = rewire('../modules/books')

const setData = file => {
	books.__set__('apiCall', (search, callback) => {
		const data = fs.readFileSync('spec/data/' + file, 'utf8')

		callback(null, JSON.parse(data))
	})
}

describe('Book Controller', () => {
	
	describe('search for a book', () => {
		
		xit('search for a recognised topic', done => {
			setData('javascript.json')
			/* eslint id-length: "off" */
			const req = {
				params: {q: 'javascript'},
				headers: {'x-forwarded-proto': 'https'}
			}

			books.search(req, data => {
				expect(data.code).toEqual(pageOk)
				expect(data.contentType).toEqual('application/json')
				const currentBooks = data.response

				expect(currentBooks).toBeDefined()
				expect(currentBooks.length).toBe(bookSize)
				done()
			})
		})
		
		xit('search for an unknown topic', done => {
			setData('unknown.json')
			/* eslint id-length: "off" */
			const req = {
				params: {q: 'dgfuhalgux'},
				headers: {'x-forwarded-proto': 'https'}
			}

			books.search(req, data => {
				expect(data.code).toEqual(pageNotFoundCode)
				expect(data.contentType).toEqual('application/json')
				expect(data.response).toEqual('No Books Found')
				done()
			})
		})
		
		xit('search with a missing query', done => {
			setData('missing.json')
			const req = {
				params: {},
				headers: {'x-forwarded-proto': 'https'}
			}

			books.search(req.params.q, data => {
				expect(data.code).toEqual(badRequestCode)
				expect(data.contentType).toEqual('application/json')
				expect(data.response).toEqual('Missing Query Parameter')
				done()
			})
		})
		
	})
	
	/* eslint no-empty-function: "off" */
	describe('register a user', () => {
		
	})
	
	/* eslint no-empty-function: "off" */
	describe('add a book to favourites', () => {
		
	})
	
	/* eslint no-empty-function: "off" */
	describe('retrieve favourites', () => {
		
	})
	
})
