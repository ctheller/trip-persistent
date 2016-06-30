var express = require('express');
var router = express.Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Day = require('../../models/day');
var Promise = require('bluebird');

//Return selected Day
router.get('/:id', function(req,res,next){
	Day.findAll({where: {id: req.params.id}})
	.then(function(resultDays){
		res.send(resultDays);
	})
	.catch(next);
})

//Return all Days
router.get('/', function(req,res,next){
	Day.findAll({order:[['number', 'ASC']]})
	.then(function(resultDays){
		res.send(resultDays);
	})
	.catch(next);
})

//Add a restaurant to Day
router.post('./:id/restaurants', function(req,res,next){
	Day.findOne({where: {id:req.params.id}})
	.then(function(day){
		if (day.getRestaurants.length > 2){
			return res.send("Cannot Add!");
		}
		day.addRestaurant(req.body)
		.then(function(result){
			res.send(result);
		})
		.catch(next);
	})
	.catch(next);
})

//Add a Hotel to Day
router.post('./:id/hotels', function(req,res,next){
	Day.findOne({where: {id:req.params.id}})
	.then(function(day){
		if (day.hotelId){
			return res.send("Cannot Add!");
		}
		day.hotelId = (req.body.id);
		res.send(day);
	})
	.catch(next);
})

//Create a Day
router.post("/:number", function(req,res,next){
	Day.create({number: req.params.number})
	.then(function(createdDay){
		res.send(createdDay);
	})
	.catch(next);
})

//Delete a Day
router.delete("/:number", function(req,res,next){
	Day.destroy({where: {number: req.params.number}})
	.then(function(result){
		res.send("Deleted");
	})
	.catch(next);
})




module.exports = router;
