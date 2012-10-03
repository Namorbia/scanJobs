<?PHP
namespace ScanJobs\Controller;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;

class CityController implements ControllerProviderInterface
{   
    protected $app;
	protected $geocoder;

	public function addGeocoder($geocoder)
	{
		$this->geocoder = $geocoder;
	}


    public function connect(Application $app)
    {  
        $this->app = $app;

        $getCityList = function() 
        {   
            return $this->getCityList();
        };   
		
		$geocodeCity = function($cityName) 
		{	
			return $this->geocodeCity($cityName);
		};

        $controller = $app['controllers_factory'];
		$controller->get('/geocode/{cityName}',$geocodeCity);
		$controller->get('/',$getCityList);

        return $controller;
    }   


	protected function getCityList()
	{
		$country='US'; //parameterize this
		$db = $this->app['db'];
		$sql = 'SELECT c.id, 
					   c.name,
					   c.latitude,
					   c.longitude,
					   c.country	
				  FROM city c
				 WHERE c.country=?
				 ORDER BY name';
        $results = $db->executeQuery($sql,array($country))
		              ->fetchAll();
		$payload = array('results' => $results);
		return $this->app->json($payload,200);
	}


	protected function geocodeCity($cityName) 
	{

        $db = $this->app['db'];
		$cityName = urldecode($cityName);
		$cityName = filter_var($cityName, FILTER_SANITIZE_STRING);
        $results = $db->executeQuery("select name, latitude, longitude from city where name=?",array($cityName))
                     ->fetchAll();

        if (count($results)<1) {
            $results = $this->geocoder->fetchGeocode($cityName);
			$payload = array('results'=>array());
            
			if ($results->status==="OK") {
				
                $payload['results']['latitude']  = $results->results[0]->geometry->location->lat;
                $payload['results']['longitude'] = $results->results[0]->geometry->location->lng;
                $payload['results']['name']      = $cityName;
            }   
        } else {
			$payload['results']['latitude']  = $results[0]['latitude'];
			$payload['results']['longitude'] = $results[0]['longitude'];
			$payload['results']['name']      = $results[0]['name'];
		}
	
		return $this->app->json($payload,200);
	}

}

