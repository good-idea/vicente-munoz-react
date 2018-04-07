<?php
header("Access-Control-Allow-Origin: *");

/*

---------------------------------------
License Setup
---------------------------------------

Please add your license key, which you've received
via email after purchasing Kirby on http://getkirby.com/buy

It is not permitted to run a public website without a
valid license key. Please read the End User License Agreement
for more information: http://getkirby.com/license

*/

c::set('license', '37d474b51839a56e679d52d03b8f9d09');
c::set('debug', true);
c::set('panel.stylesheet', '/assets/css/panel.css');

/*

---------------------------------------
Kirby Configuration
---------------------------------------

By default you don't have to configure anything to
make Kirby work. For more fine-grained configuration
of the system, please check out http://getkirby.com/docs/advanced/options

*/

c::set('panel.install', true);

c::set('cache', true);
c::set('cache.driver', 'memcached');

c::set('thumbs.driver', 'im');

require_once(dirname(__FILE__) . DS . '..' . DS . 'routes.php');

/**
 * Panel Hooks
 */


kirby()->hook(['panel.page.update'], function ($page) {
	$page->flushCache();
	$page->getInitialContent();
	kirby()->cache()->remove('initial');
});

/**
 * Custom Cache
 */


/**
 * Helper Functions
 */



