
'use strict'

const request = require('request');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const zeroLength = 0
const firstIndex = 0

exports.searchByString = query => new Promise((resolve, reject) => {
	const url = 'https://www.amazon.co.uk/s/ref=nb_sb_noss_2' +
		`?url=search-alias%3Dstripbooks&field-keywords=${query}`;

	request.get(url, (err, res, body) => {
		if (err) {
			reject(Error('failed to make API call'))
		}
		const dom = new JSDOM(body);

		resolve(dom.window);
	})
})

exports.getByISBN = isbn => new Promise((resolve, reject) => {
	const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`

	request.get(url, (err, res, body) => {
		if (err) {
			reject(Error('could not complete request'))
		}
		const json = JSON.parse(body)

		if (json.totalItems === zeroLength) {
			reject(Error('book not found'))
		}
		const data = {
			title: `${json.items[firstIndex].volumeInfo.title}:` +
				` ${json.items[firstIndex].volumeInfo.subtitle}`,
			authors: json.items[firstIndex].volumeInfo.authors[firstIndex],
			description: json.items[firstIndex].volumeInfo.description
		}

		resolve(data)
	})
})

exports.getByID = id => new Promise((resolve, reject) => {
	const url = `https://www.googleapis.com/books/v1/volumes/${id}`

	request.get(url, (err, res, body) => {
		if (err) {
			reject(Error('could not complete request'))
		}
		const json = JSON.parse(body)

		if (json.totalItems === zeroLength) {
			reject(Error('book not found'))
		}
		const data = {
			title: `${json.volumeInfo.title}: ${json.volumeInfo.subtitle}`,
			authors: json.volumeInfo.authors[firstIndex],
			description: json.volumeInfo.description.replace(/<(.|\n)*?>/g, ''),
			bookID: id
		}

		resolve(data)
	})
})
