<?php

$routes = array(

  array(
    'method' => 'GET',
    'pattern' => 'api/initial',
    'action' => function() {
      $response = new StdClass();
      return response::json(json_encode($response));
    }
  ),

  array(
    'method' => 'GET',
    'pattern' => 'api/(:any)',
    'action' => function($section) {
      $response = new StdClass();
      return response::json(json_encode($response));
    }
  ),

  array(
    'method' => 'GET',
    'pattern' => 'api/(:any)/(:any)',
    'action' => function($section, $param = 1) {
      $response = new StdClass();
      return response::json(json_encode($response));
    }
  ),

  array(
    'method' => 'GET',
    'pattern' => '(:any)/(:all)',
    'action' => function($section, $uid) {
      $page = page($section . '/' . $uid);
      if (!$page && $section === 'projects') {
        $page = site()->pages()->find('projects')->index()->findBy('uid', $uid);
      }
      if (!$page) $page = site()->pages()->find('home');

      return site()->visit($page);
    }
  )
);

c::set('routes', $routes);

 ?>
