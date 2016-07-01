var express = require('express');
var router = express.Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Day = require('../../models/day');
var Promise = require('bluebird');

//Return selected Day with all attractions
router.get('/:number', function(req,res,next){
	Day.findOne({where: {number: req.params.number}})
	.then(function(currentDay){
		promiseForHotel = currentDay.getHotel();
		promiseForRestaurants = currentDay.getRestaurants();
		promiseForActivities = currentDay.getActivities();
		Promise.all([promiseForHotel, promiseForRestaurants, promiseForActivities])
		.spread(function(hotel, restaurants, activities){
				res.send({day: currentDay, hotel: hotel, restaurants: restaurants, activities: activities});
		})
		.catch(next);
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

//Add an activity to Day
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

//DELETES:


//Remove a restaurant from Day (should work??)
router.delete('/:number/restaurant/:id', function(req,res,next){
	var dayNumber = parseInt(req.params.number);
	var id = parseInt(req.params.id);
	Day.findOne({where: {number: dayNumber}})
	.then(function(day){
		day.removeRestaurant(id)
		.then(function(result){
			res.status(200);
		})
		.catch(next);
	})
	.catch(next);
})

//Remove an activity from Day
router.delete('/:number/activity/:id', function(req,res,next){
	var dayNumber = parseInt(req.params.number);
	var id = parseInt(req.params.id);
	Day.findOne({where: {number: dayNumber}})
	.then(function(day){
		day.removeActivity(id)
		.then(function(result){
			res.status(200);
		})
		.catch(next);
	})
	.catch(next);
})

//Remove a Hotel from Day
router.delete('/:number/hotel', function(req,res,next){
	var dayNumber = parseInt(req.params.number);
	Day.findOne({where: { number: dayNumber} })
	.then(function(day){
		day.setHotel(null)
		.then(function(result){
			res.status(200);
		})
		.catch(next);
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
