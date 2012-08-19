#!/usr/bin/env php

<?php
require_once __DIR__.'/../vendor/autoload.php'; 

use CalEvans\Command;
use CalEvans\Google\Geocode as Geocode;
use Knp\Provider\ConsoleServiceProvider;

$app = require 'Bootstrap.php';

$app->register(new ConsoleServiceProvider(),
                array('console.name'              => 'Console',
                      'console.version'           => '1.0.0',
                      'console.project_directory' => __DIR__.'/..'));
$application = $app['console'];
$x = new Command\ScanJobsCommand();
$x->addGeocodeer(new Geocode());
$application->add($x);
$application->add(new Command\NewDatabaseCommand());
$application->run();