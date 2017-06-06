/* global describe xit */
/* eslint no-empty-function: "off" */

'use strict'

// Original var fs = require('fs')
// Original var rewire = require('rewire')

// Original var auth = rewire("../modules/auth")

describe('Favourites Model', () => {
	
	describe('add favourites', () => {
		
		xit('should add valid book to list of registered user', () => {
			
		})
		
		xit('should flag error if user not specified', () => {
			
		})

		/* eslint max-len: ["error", 100] */
		xit('should prevent invalid book being added to list of registered user', () => {
			
		})
		
		xit('should prevent book to list of unregisterd user', () => {
			
		})
		
		xit('should prevent duplicate being added to list', () => {
			
		})
		
	})
	
	describe('retrieving favourites', () => {
		
		xit('should retrieve a list of registered books for valid user', () => {
			
		})
		
		xit('should return an error if unvalid user', () => {
			
		})
		
		xit('should return an error if missing user', () => {
			
		})
		
		xit('should return an error if list empty', () => {
			
		})
		
	})
	
})
