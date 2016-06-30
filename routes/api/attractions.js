var express = require('express');
var router = express.Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Place = require('../../models/place');
var Promise = require('bluebird');

router.get("/hotel/:id", function(req,res,next){
	Hotel.findOne({where: {id: req.params.id}})
	.then(function(hotel){
		res.send(hotel);
	})
	.catch(next);
})

router.get("/hotel", function(req,res,next){
	Hotel.findAll({
        include: [Place]
    })
	.then(function(hotels){
		res.send(hotels);
	})
	.catch(next);
})

router.get("/restaurant/:id", function(req,res,next){
	Restaurant.findOne({where: {id: req.params.id}, include: [Place]
    })
	.then(function(restaurant){
		res.send(restaurant);
	})
	.catch(next);
})

router.get("/restaurant", function(req,res,next){
	Restaurant.findAll({
        include: [Place]
    })
	.then(function(hotels){
		res.send(hotels);
	})
	.catch(next);
})

router.get("/activity/:id", function(req,res,next){
	Activity.findOne({where: {id: req.params.id}, include: [Place]
    })
	.then(function(activity){
		res.send(activity);
	})
	.catch(next);
})

router.get("/activity", function(req,res,next){
	Activity.findAll({
        include: [Place]
    })
	.then(function(hotels){
		res.send(hotels);
	})
	.catch(next);
})

router.use('/days', require('./days'));

module.exports = router;

