$(function () {

	//Fills in all initial options	

	$.get('/api/restaurants', function (restaurants) {
  		fillInOptions(restaurants, $('#restaurant-choices'));
	})
	.fail( console.error.bind(console) );

	$.get('/api/hotels', function (hotels) {
  		fillInOptions(hotels, $('#hotel-choices'));
	})
	.fail( console.error.bind(console) );

	$.get('/api/activities', function (activities) {
  		fillInOptions(activities, $('#activity-choices'));
	})
	.fail( console.error.bind(console) );


    function fillInOptions(collection, $selectElement) {
        collection.forEach(function (item) {
            $selectElement.append('<option value="' + item.id + '">' + item.name + '</option>');
        });
    }


})