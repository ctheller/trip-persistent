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
		Promise.each(resultDays, function(day){
			promiseForHotel = day.getHotel();
			promiseForRestaurants = day.getRestaurants();
			promiseForActivities = day.getActivities();
			Promise.all([promiseForHotel, promiseForRestaurants, promiseForActivities])
			.spread(function(hotel, restaurants, activities){
				console.log("hotel: "+ hotel);
				console.log("restaurants: "+restaurants); ////ADD functionality that returns these
				console.log("activities: "+activities);
			})
		})
		return resultDays
	})
	.then(function(resultDays){
		res.send(resultDays);
	})
	.catch(next);
});

//Add a restaurant to Day
router.post('/:number/restaurant/:id', function(req,res,next){
	var dayNumber = parseInt(req.params.number);
	var id = parseInt(req.params.id);
	Day.findOne({where: {number: dayNumber}})
	.then(function(day){
		day.addRestaurant(id)
		.then(function(result){
			res.send(result);
		})
		.catch(next);
	})
	.catch(next);
})

//Add a restaurant to Day
router.post('/:number/activity/:id', function(req,res,next){
	var dayNumber = parseInt(req.params.number);
	var id = parseInt(req.params.id);
	Day.findOne({where: {number: dayNumber}})
	.then(function(day){
		day.addActivity(id)
		.then(function(result){
			res.send(result);
		})
		.catch(next);
	})
	.catch(next);
})

//Add a Hotel to Day
router.post('/:number/hotel/:id', function(req,res,next){
	var dayNumber = parseInt(req.params.number);
	Day.findOne({where: { number: dayNumber} })
	.then(function(day){
		if (day.hotelId){
			return res.send("Cannot Add!");
		}
		day.setHotel(req.params.id);
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
