/*
 * We really aren't plotting jobs, we are plotting cities.
 * So we create one object for each city. The radius starts
 * off small and grows with each new job added. So we are
 * changing the workflow a bit. now we will first fetch a
 * list of cities and create the points for them. Then
 * we fetch a list of jobs, same way we are doing it now,
 * one day's worth at a time - for no other reason than 
 * I like doing it that way - and stuff them into a SINGLE
 * array, not a group of arrays.
 *
 * Finally, we plot each job on a .5 second timer. We
 * find the cityPoint in the array and add a job. the 
 * cityPoint then either displays itself or updates 
 * itself and sets a timer to slowly fade the color.
 *
 * I've decided that the circle size won't reduce, only expand.
 */
function CityPoint(data, map)
{
	"use strict";
    /*
     * Initialalize properties
     */
	this.id_city       = data.id;
	this.city_name     = data.name;
    this.point         = new google.maps.LatLng(data.latitude,data.longitude);
    this.circleOptions = {'editable'    : false,
                          'clickable'   : true,
                          'strokeWeight':.25,
                          'fillColor'   :'#FF0000',
                          'center'      :this.point,
                          'radius'      :10000,
                          'map'         :map,
                          'visible'     :false};
    this.circle        = new google.maps.Circle(this.circleOptions); 
	this.circle.owner  = this;                     
    this.jobsList      = {};
    this.name          = data.name;
    this.jobCount      = 0;
    this.opacity       = 1.0;
    this.timer         = null;
	this.infoWindow    = null;
	this.map           = map;

	/*
     * Define methods
     */
	this.handleClick = function(ev)
	{
		var self = this;
        $.ajax({
            url: "/companies/city/"+self.owner.id_city,
            cache: false,
            dataType: 'json'})
       .success(function (payload){ 
           var windowContent = "Companies located in "+self.owner.city_name+"<br />\n";
            for(key=0;key<payload.results.length;key++) {
	            windowContent+=payload.results[key].company_name+"<br />\n";
    	    }
       		
			self.owner.infoWindow = new google.maps.InfoWindow({
                        content: windowContent 
                      });
			self.owner.infoWindow.setPosition(self.owner.circle.getCenter());
			self.owner.infoWindow.open(self.owner.map);

       })
       .fail(function (data) {
            alert("I'm sorry, we ran into a problem fetching some of the data. Error: 42")});

    return;

	};

	this.displayCompanies = function (payload)
	{
		var windowContent = "Companies located in "+this.city_name+"\n";
		for(key=0;key<payload.results.length;key++) {
			windowContent+=payload.results[key].company_name
		}
       this.infoWindo = new google.maps.InfoWindow({
                        content: "Companies located in "+this.city_name+"\n" 
                      });

	}
    google.maps.event.addListener(this.circle, 
                                  'click',
                                  this.handleClick);

	this.addJob = function (jobData) 
    {
		var addToRadius = 0;

        this.jobsList[jobData.id] = jobData;
		
		if (this.jobCount<100) {
			addToRadius = (this.jobCount*100);
		}else {
			addToRadius = 20000;
		}

        this.circle.setRadius(this.circleOptions.radius + addToRadius);
        this.jobCount++;
        this.opacity = 1.0;
        this.circle.setOptions({'fillOpacity': this.opacity});

        if (!this.circle.getVisible()) {
	        this.circle.setVisible(true);
        }
        
        if (this.timer === null) {
            this.startTimer();
        }

        return;
    };

    this.startTimer = function()
    {
    	var self = this;
    	var thisCityName = this.name;
        self.timer = setInterval(function() 
        {
        	var cityList = $(document).data('cityList');
        	var thisCity = cityList[thisCityName]
            if (thisCity.opacity > 0.30) {
                thisCity.opacity = thisCity.opacity - 0.025;
                thisCity.circle.setOptions({'fillOpacity':thisCity.opacity});
            } else {
            	console.log('Done with:' + thisCity.name);
                clearInterval(thisCity.timer);
                self.timer = null;
            }
            $(document).data('cityList',cityList);
            return;
    	}, 400,thisCityName); // should decrement every 1 second.
        return;
    };

} // function CityPoint
