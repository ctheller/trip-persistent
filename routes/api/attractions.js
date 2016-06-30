var express = require('express');
var router = express.Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Place = require('../../models/place');
var Promise = require('bluebird');

router.get("/hotels", function(req,res,next){
	Hotel.findAll()
	.then(function(hotels){
		res.send(hotels);
	})
	.catch(next);
})

router.get("/restaurants", function(req,res,next){
	Restaurant.findAll()
	.then(function(hotels){
		res.send(hotels);
	})
	.catch(next);
})

router.get("/activities", function(req,res,next){
	Activity.findAll()
	.then(function(hotels){
		res.send(hotels);
	})
	.catch(next);
})

module.exports = router;

