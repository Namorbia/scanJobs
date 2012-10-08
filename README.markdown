# ScanJobs #

## Purpose ##
This is the sample code from my CodeWorks 2012 talk.
It is a simple web application based on the Silex framework that will scan the jobs from careers.stackoverflow.com, store them in a database and plot them on a Google Map.

## Installing ##
### Prerequisites ###
* Apache Web Server. 

  This code SHOULD work with any web server that supports PHP but the re-write rules provided are for Apache.

* PHP 5.4+ (Web & CLI support)
* SQLite support built into PHP
* composer.phar http://getcomposer.org


### Instructions ###
1. Unpack the files into a directory on your web server.
2. Configure Apache to use /path/to/directory/public as the document root.
3. In the project root (the directory with the composer.json file) run the command 

    	$ composer.phar update

4. Create a directory named config in your application root directory.	
5. Get a Google Maps API key and put it in the appropriate place in make_dev.php and make_prod.php.
	https://developers.google.com/maps/signup
6. From within the scripts directory, execute the following command

		$ php make_dev.php
	
7. Make sure that app/console.sh has execute privileges.
8. Execute the following commands.

    	$ app/console.sh makeDatabase
    	$ app/console.sh scan

9. Point a browser to the IP address or domain name you configured the web server to respond to. To show a localized version specify a city, state after the IP address. 
	http://127.0.0.1/Nashville, TN

If any of these steps fail, stop because the rest won't work either.

Periodically run the scan command to gather data on new jobs.

In the scripts directory there is a file that can be executed as a cron job. Modify it to point to the right script and then call it from your cron. Given the frequency of updates for Careers.stackoverflow.com, calling it at two hour intervals is sufficient. Four hour intervals would also be acceptable.

