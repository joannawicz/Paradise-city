
var modal = {};

modal.showModal = function() {
// when we click on the show button
// we want to show the modal box
	$('.show-button').on('click', function() {
		$('.modal-container').addClass('show');
	});
};


modal.closeModal = function () {
// when you click on the x, or close button
// hide the modal box
	$('.close-button').on('click', function() {
		$('.modal-container').removeClass('show');
	});
};

modal.init = function() {
	this.showModal();
	this.closeModal();
};

var app = {};
//GEOLOCATOR to grab users location in ll
app.init = function() {
navigator.geolocation.getCurrentPosition(function(success) {
		app.latitude = success.coords.latitude;
		app.longitude = success.coords.longitude;
	}); //end of GEOLOCATOR 

};//end of init	

//Grab the values submitted by the user and save them
//Store these values as a variable that will then be used as a query parameter in the ajax call
$('.theChoices').on('submit', function(e){
	e.preventDefault();
    var choiceString = "";
	$('.theChoices input[type=checkbox]:checked').each(function(){
		var choice = this.value;
		choiceString += choice + " ";
		
	});
	if (choiceString == "") {
		alert("Tell me what you're looking for!");
	} else {
	//Calling out GEOLOCATOR and checked values	
	app.getOasis(app.latitude, app.longitude, choiceString);
	}
});


//----AJAX CALL----
//-----------------
// Use FoursquareAPI to search for an Oasis within the parameters we set
app.getOasis = function(latitude, longitude, choiceString) {
	console.log(latitude, longitude, choiceString);
	$.ajax({
		url: 'https://api.foursquare.com/v2/venues/explore',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			client_id: '5BRBSE10VUNQH4VWZKE4OWCE0L4OM22RSDLV4NAXJ3VQMUB2',
			client_secret: 'KF1EXJNCJOFXPCDSIWOUMYKRHZKMRZOHKWLICN4V5BTTQI1R',
			v: '201507128',
			ll: latitude + ',' + longitude,
			query: choiceString,
			limit: 8,
			radius: 10000,
			sortByDistance: 1,
			openNow: true,
		},
		success: function(results) {
			console.log(results);
			app.displayOasis(results);

		} // End of success
	});  // End of ajax calll
	};  // End of .getOasis

//Start function to display oasisResults in html

app.displayOasis = function(results) {
//Clear old results
$('#results').empty();
//Create variable to store narrowed in oasisResults (Get rid of all the #%&)
var places = results.response.groups[length].items;
	//console.log(places);
	//If the search yields no results then... 
	if (places.length === 0) {
		var shitOutOfLuck = $('<h3>').text("Uh oh. It looks there aren't any places near you that have fun.")
		$('#results').show();
		$('#results').append(shitOutOfLuck);
		//console.log(shitOutOfLuck);
	} else {

	//Create a function that will display the box holding the map on load
		var showResults = $('<h3>').text("Looks like you found some places to beat the heat.")
		$('#results').append(showResults);
		$('#results').show();
		$('#map').show();

	L.mapbox.accessToken = 'pk.eyJ1Ijoiam9hbm5hc3RlY2V3aWN6IiwiYSI6IjIzNmNhNjJmNzgxMjhkMzI3M2ZhYjU2Yjk1YmNlZWZmIn0.rA-ceyz6zzzlwCw0Hv0CMQ';
		var map = L.mapbox.map('map', 'mapbox.emerald')
		   .setView([app.latitude, app.longitude], 11);
		   map.scrollWheelZoom.disable();

	};	
 
	




	//For loop function will go through the results
	for (var i = 0; i < places.length; i++) {
		//Console.log('the current index is: ' + i);
		// console.log("the name is " + places[i].venue.name);
		// console.log("the rating is " + places[i].venue.rating);
		// console.log("the address is " + places[i].venue.location.address);
		// console.log("================================");
		//create an empty div that will store results
		var results =$('<h2>').addClass('heading').text('Beat at the heat at any one these places.');
		
		var div =$('<div>').addClass('places');
		$('#results').append(div);
		//Call and store Venue details
		var title = $('<h2>').text(places[i].venue.name);
		$(div).append(title);
		var rating = $('<p>').text('Rated ' + places[i].venue.rating + ' stars!');
		$(div).append(rating);
		var address = $('<p>').text(places[i].venue.location.address);
		$(div).append(address);
		var linkPrefix = "https://foursquare.com/v/" + places[i].venue.id;
		var webLink = $("<a href='" + linkPrefix + "'target='_blank'>").html('<i class="fa fa-foursquare"></i>' + 'See Foursquare');
		$(div).append(webLink);

		//Setup Mapbox to display plots for locations
		L.marker([places[i].venue.location.lat,places[i].venue.location.lng]).addTo(map).bindPopup(places[i].venue.name + ":" + "<br>" + places[i].venue.location.address);


	}	
		// Create a button that will reload the page for a new search
		var refreshResults = $("<button>").text('Refresh and search again');
		$(refreshResults).on('click', function refreshPage(){
			window.location.reload();
		});	
		$('#results').append(refreshResults);
	

};

//Load on document ready
$(function() {
	app.init();
	modal.init();
});
