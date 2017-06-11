
'use strict'

const request = require('request');
const jsdom = require('jsdom');
const JSDOM = jsdom;

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
