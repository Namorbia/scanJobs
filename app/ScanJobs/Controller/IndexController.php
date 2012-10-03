<?PHP
namespace ScanJobs\Controller;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Silex\ControllerCollection;

class IndexController implements ControllerProviderInterface
{	
	protected $app;

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


	protected function getIndex($cityName='')
	{
		// This is an ugly hack
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
			$payload=array('message'=>'','results'=>array('cityName'=>$_SESSION['cityName']));
			unset($_SESSION['cityName']);
		} else {
			$payload=array('results'=>array(),'message'=>'No city stored');
		}
		return $this->app->json($payload,200);
	}

}
