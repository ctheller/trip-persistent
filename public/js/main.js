$(function () {
     //Load Day Buttons:


    var map = initializeMap();
    var $addItemButton = $('#options-panel').find('button');

    var $listGroups = {
        hotel: $('#hotel-list').children('ul'),
        restaurant: $('#restaurant-list').children('ul'),
        activity: $('#activity-list').children('ul')
    };

    // var collections = {
    //     hotel: hotels,
    //     restaurant: restaurants,
    //     activity: activities
    // };

    var $itinerary = $('#itinerary');

    var $addDayButton = $('#day-add');
    var $dayTitle = $('#day-title').children('span');
    var $removeDayButton = $('#day-title').children('button');
    var $dayButtonList = $('.day-buttons');

    var currentDay;

    var currentDayNum = 1;

    /*
    --------------------------
    END VARIABLE DECLARATIONS
    --------------------------
     */

     ////

    ////

    ////Render Day Buttons:
    var RenderDayButtons = function(){
        $addDayButton.siblings().remove();
        $.get('api/days', function(dayArray){
            dayArray.forEach(function(day){
                var $newDayButton = createDayButton(day.number);
                $addDayButton.before($newDayButton);
            })
            //Select Current-Day
        })
        .fail(console.error.bind(console));
    } 
    ////Initialize:
    RenderDayButtons();  
    ////


    ////Remove Day Button:
    $removeDayButton.on('click', function () {
        $.ajax({
            url: '/api/days/'+currentDayNum,
            type: 'DELETE',
            success: function(result) {
                RenderDayButtons();
            }
        })
        .fail(console.error.bind(console));
    });
    ////

    ////Add Day Button:
    $addDayButton.on('click', function () {
        var newDayNum = parseInt($addDayButton.prev().text())+1;
        console.log(newDayNum);
        $.post('/api/days/'+newDayNum, function (data) {
            console.log('POST response data', data);
            RenderDayButtons(); 
        })
        .fail( console.error.bind(console) );
    });
    ////

    // $addDayButton.on('click', function () {
    //     var newDayNum = days.length + 1;
    //     var $newDayButton = createDayButton(newDayNum);
    //     days.push([]);
    //     $addDayButton.before($newDayButton);
    //     switchDay(newDayNum);
    // });


    //// Add Item To Day:
    $addItemButton.on('click', function () {
        var $this = $(this);
        var $select = $this.siblings('select');
        var sectionName = $select.attr('data-type');
        var itemId = parseInt($select.val(), 10);
        var $list = $listGroups[sectionName];
        //Go get the item to be added from the database.
        console.log(sectionName, itemId);
        $.get('/api/'+sectionName+"/"+itemId, function(item){
            console.log(item);

            $list.append(create$item(item));

            $.post('/api/days/'+currentDayNum+'/'+sectionName+"/"+itemId, function(data){
                console.log("added to day!");
            })
            .fail( console.error.bind(console) );
        })
        .fail( console.error.bind(console) );

        //var marker = drawMarker(map, sectionName, item.place.location);

    });
    ////


    // $addItemButton.on('click', function () {

    //     var $this = $(this);
    //     var $select = $this.siblings('select');
    //     var sectionName = $select.attr('data-type');
    //     var itemId = parseInt($select.val(), 10);
    //     var $list = $listGroups[sectionName];
    //     var collection = collections[sectionName];
    //     var item = findInCollection(collection, itemId);

    //     var marker = drawMarker(map, sectionName, item.place.location);

    //     $list.append(create$item(item));

    //     days[currentDayNum - 1].push({
    //         item: item,
    //         marker: marker,
    //         type: sectionName
    //     });

    //     mapFit();

    // });

    $itinerary.on('click', 'button.remove', function () {

        var $this = $(this);
        var $item = $this.parent();
        var itemName = $item.children('span').text();
        currentDay.restaurants.forEach(function(restaurant){
            if (restaurant.name === itemName) {
                $.ajax({
                    url: '/api/days/'+currentDayNum+'/restaurant/'+restaurant.id,
                    type: 'DELETE',
                    success: function(result) {
                        console.log("deleted");
                    }
                })
                .fail(console.error.bind(console));  
            }
        })
        currentDay.activities.forEach(function(activity){
            if (activity.name === itemName) {
                $.ajax({
                    url: '/api/days/'+currentDayNum+'/activity/'+activity.id,
                    type: 'DELETE',
                    success: function(result) {
                        console.log("deleted");
                    }
                })
                .fail(console.error.bind(console));  
            }
        })

        if (currentDay.hotel && currentDay.hotel.name === itemName) {
            $.ajax({
                url: '/api/days/'+currentDayNum+'/hotel',
                type: 'DELETE',
                success: function(result) {
                    console.log("deleted");
                }
            })
            .fail(console.error.bind(console));  
        }

        renderDay(currentDayNum);



        // itemOnDay.marker.setMap(null);
        // $item.remove();

        // mapFit();

    });


    $dayButtonList.on('click', '.day-btn', function () {
        var dayNumberFromButton = parseInt($(this).text(), 10);
        switchDay(dayNumberFromButton);
    });

    // $removeDayButton.on('click', function () {

    //     wipeDay();
    //     days.splice(currentDayNum - 1, 1);

    //     if (days.length === 0) {
    //         days.push([]);
    //     }

    //     reRenderDayButtons();
    //     switchDay(1);

    // });


    /*
    --------------------------
    END NORMAL LOGIC
    --------------------------
     */

    // Create element functions ----

    function create$item(item) {

        var $div = $('<div />');
        var $span = $('<span />').text(item.name);
        var $removeButton = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>');

        $div.append($span).append($removeButton);

        return $div;

    }

    function createDayButton(number) {
        return $('<button class="btn btn-circle day-btn">' + number + '</button>');
    }

    // End create element functions ----

    function switchDay(dayNum) {
        wipeDay();
        currentDayNum = dayNum;
        renderDay(dayNum);
        $dayTitle.text('Day ' + dayNum);
        mapFit();
    }
    ////initialize
    // switchDay(1);
    ////

    ////RenderDayInfo:
    var renderDay = function(num){        
        $dayButtonList
                .children('button')
                .eq(currentDayNum-1)
                .addClass('current-day');
        $.get('/api/days/'+num, function(data){
            if (data.hotel) {
                $listGroups.hotel.append(create$item(data.hotel))
            }
            if (data.restaurants) {
                data.restaurants.forEach(function(restaurant){
                    $listGroups.restaurant.append(create$item(restaurant))

                })
            }
            if (data.activities) {
                data.activities.forEach(function(activity){
                    $listGroups.activity.append(create$item(activity))
                })
            }
            currentDay = data;
            console.log(currentDay);
        })
        .fail(console.error.bind(console));
    }

    switchDay(currentDayNum);
    ////


    // function renderDay() {

    //     var currentDay = days[currentDayNum - 1];

    //     $dayButtonList
    //         .children('button')
    //         .eq(currentDayNum - 1)
    //         .addClass('current-day');

    //     currentDay.forEach(function (attraction) {
    //         var $listToAddTo = $listGroups[attraction.type];
    //         $listToAddTo.append(create$item(attraction.item));
    //         attraction.marker.setMap(map);
    //     });

    // }

    function wipeDay() {

        $dayButtonList.children('button').removeClass('current-day');

        Object.keys($listGroups).forEach(function (key) {
           $listGroups[key].empty();
        });

    }

    // function reRenderDayButtons() {

    //     var numberOfDays = days.length;

    //     $dayButtonList.children('button').not($addDayButton).remove();

    //     for (var i = 0; i < numberOfDays; i++) {
    //         $addDayButton.before(createDayButton(i + 1));
    //     }

    // }

    function mapFit() {

        // var currentDay = currentDay.day;
        // var bounds = new google.maps.LatLngBounds();

        // currentDay.forEach(function (attraction) {
        //     bounds.extend(attraction.marker.position);
        // });

        // map.fitBounds(bounds);

    }

    // Utility functions ------

    function findInCollection(collection, id) {
        return collection.filter(function (item) {
            return item.id === id;
        })[0];
    }

    function findIndexOnDay(day, itemName) {
        for (var i = 0; i < day.length; i++) {
            if (day[i].item.name === itemName) {
                return i;
            }
        }
        return -1;
    }

    // End utility functions ----

});
