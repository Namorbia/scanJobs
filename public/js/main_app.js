		function initalize()
		{

			$(document).data('dayList',new Array());

        	$.ajax({url: "/stored/",
                    cache: false,
                    dataType: 'json'})
                .success(function (data) {
                    $(document).data('storedCity',data);
                    displayMap();

                })
                .fail(function (data) {
                    $(document).data('storedCity',null);
                	displayMap();
			});
		}


		function displayMap() 
		{
			storedCity = $(document).data('storedCity');
			if ((storedCity.message != "No city stored")) {
				var latLong = new google.maps.LatLng(storedCity.results.latitude, storedCity.results.longitude);
				var mapZoom = 7;
			} else {
				// US 		
				var latLong = new google.maps.LatLng(37.090240, -95.7128910);
				var mapZoom = 5;
			}
			var mapOptions = {
				center: latLong,
				zoom: mapZoom,
			 mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById("map_canvas"),
				mapOptions);

           $(document).data('map',map);
		   /*
		    * Kickoff the data loading process.
			*/
			fetchCityList();
			return;
		}

		
		function fetchCityList()
		{
        	$.ajax({url: "/cities/",
                    cache: false,
                    dataType: 'json'})
                .success(function (data) {
                    holding = {};
                    for(lcvA = 0;lcvA<data.results.length;lcvA++) {
                        holding[data.results[lcvA].name] = new CityPoint(data.results[lcvA],$(document).data('map'));
                    }

                    $(document).data('cityList',holding);
                    fetchJobs();

                })
                .fail(function (data) {
                    alert("I'm sorry, we ran into a problem fetching some of the data. Error: 3")});

		}


		function fetchJobs()
		{
	        $.ajax({
	                url: "/jobs/",
	                cache: false,
	                dataType: 'json'})
	           .success(function (data){ 
	                    dayList = $(document).data('dayList');
	                    for(key=0;key<data.results.length;key++) {
		                    dayList.push(data.results[key]);
	                    }
	                    // put it back
	                    $(document).data('dayList',dayList);
	                    startPlot();
	                    return;
	           })
	           .fail(function (data) {
	                alert("I'm sorry, we ran into a problem fetching some of the data. Error: 2")});

			return;
		}


		function startPlot()
		{
			timer = setInterval(plotJobs,10)
			$(document).data('jobPlotTimer',timer);
			return;
		}


		function plotJobs()
		{
			var dayList = $(document).data('dayList');
			
			if (dayList.length>0) {
				var thisJob = dayList.shift();
				var cityList = $(document).data('cityList');
					cityList[thisJob.city_name].addJob(thisJob);
				$(document).data('cityList',cityList);					
				$(document).data('dayList',dayList);
			} else {
				clearInterval($(document).data('jobPlotTimer'));	
				console.log('Plotting complete');
			}
			return;
	
		}
