<?PHP
require_once __DIR__.'/../vendor/autoload.php';

use ScanJobs\Controller;
use CalEvans\Google\Geocode as Geocode;

$app = require '../app/Bootstrap.php';
$geocoder = new Geocode();

/*
 * Build the routes 
 */
$cityController = new Controller\CityController();
$cityController->addGeocoder($geocoder);

$app->mount('/jobs/', new Controller\JobsController());
$app->mount('/cities/', $cityController);
$app->mount('/companies/', new Controller\CompanyController());
$app->mount('/', new Controller\IndexController());

/*
 * Do the deed
 */
$app->run();

