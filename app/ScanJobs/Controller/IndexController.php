<?PHP
namespace ScanJobs\Controller;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;

class IndexController implements ControllerProviderInterface
{	
	protected $app;
	protected $geocoder;

	public function connect(Application $app)
	{
		$this->app = $app;

		$getIndex = function($cityName='') 
		{
			return $this->getIndex($cityName);
		};	

		$getStoredCity = function() 
        {   
            return $this->getStoredCity();
        };  

		$controller = $app['controllers_factory'];

		$controller->get('/stored/',$getStoredCity);
		$controller->get('/{cityName}',$getIndex);
		$controller->get('/',$getIndex);

		return $controller;
	}

	public function addGeocoder($gc)
	{
		$this->geocoder = $gc;
		return;
	}


	protected function getIndex($cityName='')
	{
		// This is an ugly hack
		$cityName = urldecode($cityName);
		if (!empty($cityName)) {
			$cityName = filter_var($cityName, FILTER_SANITIZE_STRING);
			session_start();
			$_SESSION['cityName'] = $cityName;
		}

		$fileName = $this->app['document_dir'].'/display.html';
		$output   = file_get_contents($fileName);
		return $output;
	}


	protected function getStoredCity()
	{
		session_start();


		if (isset($_SESSION['cityName'])) {
			$cityName = $_SESSION['cityName'];
			unset($_SESSION['cityName']);
	        $db = $this->app['db'];
	        $cityName = urldecode($cityName);
	        $cityName = filter_var($cityName, FILTER_SANITIZE_STRING);
	        $payload  = array('results'=>array());

	        $results  = $db->executeQuery("select name, 
	        	   						   		  latitude, 
	        	   						   		  longitude 
	        	   						   	 from city 
	        	   						   	where name=?",array($cityName))
	                       ->fetchAll();
			
	        if (count($results)<1) {
	            $results = $this->geocoder->fetchGeocode($cityName);
	    
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
	        

		} else {
			$payload=array('results'=>array(),'message'=>'No city stored');
		}
		return $this->app->json($payload,200);
	}

}
