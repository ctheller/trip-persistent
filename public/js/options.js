$(function () {

	//Fills in all initial options	

	$.get('/api/restaurant', function (restaurants) {
  		fillInOptions(restaurants, $('#restaurant-choices'));
	})
	.fail( console.error.bind(console) );

	$.get('/api/hotel', function (hotels) {
  		fillInOptions(hotels, $('#hotel-choices'));
	})
	.fail( console.error.bind(console) );

	$.get('/api/activity', function (activities) {
  		fillInOptions(activities, $('#activity-choices'));
	})
	.fail( console.error.bind(console) );


    function fillInOptions(collection, $selectElement) {
        collection.forEach(function (item) {
            $selectElement.append('<option value="' + item.id + '">' + item.name + '</option>').data(item);
        });
    }


})