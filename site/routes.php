<?php

function arrayToObject($arr, $keyField) {
  $keys = array_map(function($item) use ($keyField) {
    return $item->{$keyField};
  }, $arr);
  return array_combine($keys, $arr);
}

function mergeArrayOfSimilarObjects($baseArr, $additionalArr, $keyField = 'id') {
  // use a field to identify objects that should be merged.
  // Transform each array into a keyed array using that identifier as the key.
  $keyedBaseArr = arrayToObject($baseArr, $keyField);
  $keyedAdditionalArr = arrayToObject($additionalArr, $keyField);

  $allKeys = array_unique(
    array_merge(
      array_keys($keyedBaseArr), array_keys($keyedAdditionalArr)
      )
    );
  $merged = [];
  foreach ($allKeys as $key) {
    $baseItem = (array_key_exists($key, $keyedBaseArr)) ? $keyedBaseArr[$key] : [];
    $additionalItem = (array_key_exists($key, $keyedAdditionalArr)) ? $keyedAdditionalArr[$key] : [];
    $merged[] = (object)array_merge((array)$baseItem, (array)$additionalItem);
  }

  return $merged;

}

function extractFields($arr, $source) {
  $extracted = [];
  foreach ($arr as $key) {
    if (array_key_exists($key, $source)) {
      $exctracted[$key] = $source[$key];
    } else {
      $exctracted[$key] = null;
    }
  }
  return $exctracted;
}

function visibleNews() {
  return kirby()->site()->pages()->findBy('slug', 'news')->children()->visible()->flip();
}

function visibleProjects() {
  return kirby()->site()->pages()->findBy('slug', 'projects')->children()->flip()->children()->visible();
}

function getSourceItems($section) {
  $getSource = [
    'projects' => 'visibleProjects',
    'news' => 'visibleNews'
  ];
  if (!array_key_exists($section, $getSource)) return false;
  return $getSource[$section]();
}


function getItems($section, $page = 1, $paginate = 12) {
  $sourceItems = getSourceItems($section);
  if (!$sourceItems) return $sourceItems;
  $items = [];
  if ($paginate) $sourceItems = $sourceItems->slice($paginate * ($page - 1), $paginate);
  foreach ($sourceItems as $sourceItem) {
    array_push($items, $sourceItem->getInitialContent());
  }

  return $items;
}

function getItemBySlug($section, $slug) {
  $sourceItems = getSourceItems($section);
  if (!$sourceItems) return $sourceItems;
  $item = $sourceItems->findBy('slug', $slug);
  if ($item) return $item->getFullContent();
  return false;
}


function getIndices() {
  $cacheID = 'indices';
	$cacheContent = kirby()->cache()->get($cacheID);

	if ($cacheContent) {
		return $cacheContent;
	}

  $indices = new StdClass();
  $indices->projects = [];
  foreach (getItems('projects', null, false) as $sourceProject) {
    $project = extractFields(['id', 'slug', 'sort', 'title', 'year', 'type', 'displayYear', 'categories'], $sourceProject);
    array_push($indices->projects, $project);
  }
  $indices->news = [];
  foreach (getItems('news', null, false) as $sourceNewsItem) {
    $newsItem = extractFields(['id', 'slug', 'sort', 'title', 'year', 'pinned', 'type', 'pubDate', 'categories'], $sourceNewsItem);
    array_push($indices->news, $newsItem);
  }
  kirby()->cache()->set($cacheID, $indices);
  return $indices;
};


$routes = array(

  array(
    'method' => 'GET',
    'pattern' => 'api/flushcache',
    'action' => function() {
      $cleared = kirby()->cache()->flush(true);
      return response::json(json_encode($cleared));
    }
  ),

  // array(
  //   'method' => 'GET',
  //   'pattern' => 'api/fix',
  //   'action' => function () {
  //     $news = kirby()->site()->pages()->findBy('slug', 'news')->children()->flip();;
  //     foreach($news as $newsItem) {
  //       $fixedCategories = strToLower(str_replace(', ', ',', (string)$newsItem->categories()));
  //       $newsItem->update(array(
  //         'categories' => $fixedCategories,
  //       ));
  //     }
  //   }
  // ),

  array(
    'method' => 'GET',
    'pattern' => 'api/initial',
    'action' => function() {
      $content = new StdClass();
      $content->home = kirby()->site()->pages()->find('home')->getInitialContent();
      $content->indices = getIndices();
      $content->infoPages = [];
      foreach(kirby()->site()->pages()->filterBy('intendedtemplate', 'info')->visible() as $infoPage) {
        array_push($content->infoPages, $infoPage->getFullContent());
      };

      $get = kirby()->request()->get();
      if (array_key_exists('with', $get)) {
        $additionalRequests = $get['with'];
        if (!is_array($additionalRequests)) $additionalRequests = explode(',', $additionalRequests);
        foreach($additionalRequests as $path) {
          $newRoute = kirby()->router()->run('api' . $path);
          $result = call($newRoute->action(), $newRoute->arguments());
          $result = (array)json_decode($result);
          $existingContent = (array)$content;

          // if any of the properties of the result already exist, merge them into one result object.
          // (for instance, get all of the '/news' results and also '/news/news-item')
          foreach ($result as $property => $value) {
            if (array_key_exists($property, $existingContent) && gettype($value) === 'array') {
              $result[$property] = mergeArrayOfSimilarObjects($existingContent[$property], $value);
            }
            $content->{$property} = $result[$property];

          }
          // shallow merge in the new result
          // $content = (object)array_merge($existingContent, $result);
        }

      };

      return response::json(json_encode($content));
    }
  ),

  array(
    'method' => 'GET',
    'pattern' => 'api/(:any)',
    'action' => function($section) {
      $response = new StdClass();
      $response->{$section} = getItems($section);
      return response::json(json_encode($response));
    }
  ),

  array(
    'method' => 'GET',
    'pattern' => 'api/(:any)/(:any)',
    'action' => function($section, $param = 1) {
      $response = new StdClass();
      if (is_numeric($param)) {
        $page = $param;
        $response->{$section} = getItems($section, $page);
      } else if ($param === 'all') {
        $response->{$section} = getItems($section, null, false);
      } else {
        $slug = $param;
        $item = getItemBySlug($section, $slug);
        if ($item) {
          $response->{$section} = [];
          array_push($response->{$section}, $item);
        }
      }
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
