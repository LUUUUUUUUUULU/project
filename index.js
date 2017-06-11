
'use strict'

/**
 * Index Module.
 * @module index
 */

/** This global restify will be used for helping http requests */
const restify = require('restify')

/** This global server is the nodejs server */
const server = restify.createServer()

/** Updating the server uses from restify */
server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.queryParser())
server.use(restify.authorizationParser())

/** This is the booksshop handler */
const bookshop = require('./bookshop.js')

/** This is the http return code */
const status = {
	ok: 200,
	added: 201,
	badRequest: 400
}

/** This is the default port for this server */
const defaultPort = 8080

/** Redirects the root request to /books */
server.get('/', (req, res, next) => {
	res.redirect('/books', next)
})

/**
 * @api {get} /books Request a list of available books
 * @apiGroup Books
 * @apiParam {String} qry Query string
 */
server.get('/books', (req, res) => {
	bookshop.search(req, (err, data) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			res.send(status.ok, data)
		}
		res.end()
	})
})

/**
 * @api {post} /cart Adding book into cart
 * @apiGroup Books
 * @apiParam {Json} Book information
 */
server.post('/cart', (req, res) => {
	bookshop.addToCart(req, (err, data) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			
			res.send(status.added, {book: data})
		}
		res.end()
	})
})

/**
 * @api {post} /bookstore Adding book into book store
 * @apiGroup Books
 * @apiParam {Json} Book information
 */
server.post('/bookstore', (req, res) => {
	bookshop.addToShopStock(req, (err, data) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			
			res.send(status.added, {book: data})
		}
		res.end()
	})
})

/**
 * @api {post} /order Creating order
 * @apiGroup Books
 * @apiParam {Json} Book information
 */
server.post('/order', (req, res) => {
	bookshop.addOrder(req, (err, data) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			
			res.send(status.added, {book: data})
		}
		res.end()
	})
})

/**
 * @api {post} /login Login the server
 * @apiGroup Books
 * @apiParam {Json} Login information
 */
server.post('/login', (req, res) => {
	bookshop.login(req, (err, data) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			res.send(status.ok, {userInfo: data})
		}
		res.end()
	})
})


/**
 * @api {post} /register Adding new user into system
 * @apiGroup Books
 * @apiParam {Json} Account information
 */
server.post('/register', (req, res) => {
	bookshop.register(req, (err, data) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			res.send(status.ok, {userInfo: data})
		}
		res.end()
	})
})

/** Updates the port for access */
const port = process.env.PORT || defaultPort

/** Starts the server */
server.listen(port, err => {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})
