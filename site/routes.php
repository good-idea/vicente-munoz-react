<?php

$routes = array(

  array(
    'method' => 'GET',
    'pattern' => 'api/initial',
    'action' => function() {
      $content = new StdClass();
      try {
        $site = kirby()->site();
        $content->sections = [];
        foreach($site->pages()->filterBy('intendedtemplate', 'group') as $group) {
          $content->sections[] = $group->getContent(2);
        }
        $content->home = $site->pages()->find('home')->getContent();
				$content->infoPages = [];
				foreach($site->pages()->filterBy('intendedtemplate', 'info') as $page) {
					$content->infoPages[] = $page->getContent();
				}
        return response::json(json_encode($content));
      } catch (Exception $e) {
        consoleLog($e->getMessage());
        return response::json(json_encode($e->getMessage()), 400);
      }
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
