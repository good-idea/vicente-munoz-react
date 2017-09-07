<?php

function makeExcerpt($string, $chars = 500) {
	if (strlen($string) < $chars) return (string)$string;
	$string = substr((string)$string, 0, $chars);
	$lastSpace = strrpos($string, ' ');
	return substr($string, 0, $lastSpace) . ' ...';
}

function buildImage($imageSource) {
	$imageSizes = [
		'2400' => 2400,
		'1600' => 1600,
		'1200' => 1200,
		'800' => 800,
		'400' => 400,
		'50' => 50
	];
	$image = new StdClass();
	$image->srcset = [];
	$image->url = (string)$imageSource->url();
	$image->meta = $imageSource->meta()->toArray();
	$image->parentTitle = (string)$imageSource->page()->title();
	if (count($image->meta) === 0) $image->meta = new StdClass();
	array_push($image->srcset, array(
		'label' => 'original',
		'width' => $imageSource->width(),
		'height' => $imageSource->height(),
		'url' => $imageSource->url(),
		'isOriginal' => true,
	));
	foreach ($imageSizes as $label => $width) {
		if ($imageSource->width() > $width) {
			$thumbnail = [
				'label' => $label,
				'width' => $width,
				'url' => thumb($imageSource, array('width' => $width), false)];
			array_push($image->srcset, $thumbnail);
		}
	}
	$image->isCover = $imageSource === $imageSource->page()->cover();
	return $image;
}

function makeBoolIfSmellsLikeBool($input) {
	if ($input === 'true') return true;
	if ($input === 'false') return false;
	return $input;
}

function smellsLikeYaml($input) {
	if (gettype($input) !== 'string') return false;
	if (strlen($input) === 0) return false;
	$yamlArray = '/^-\s?\\n\s*[a-z]*:/';
	preg_match($yamlArray, $input, $output);
	return (count($output) > 0);
};

page::$methods['flushCache'] = function($page) {
	$initialCache = 'getInitialContent/' . $page->id();
	kirby()->cache()->remove($initialCache);
	$fullCache = 'getFullContent/' . $page->id();
	kirby()->cache()->remove($fullCache);
};

page::$methods['getFullContent'] = function($page) {
	$cacheID = 'getFullContent/' . $page->id();
	$cacheContent = kirby()->cache()->get($cacheID);

	if ($cacheContent) {
		return $cacheContent;
	}

	$sourceContent = $page->content()->toArray();
	$content = $page->getInitialContent();
	foreach ($sourceContent as $key => $value) {
		$sourceContent[$key] = makeBoolIfSmellsLikeBool($value);
		if (smellsLikeYaml($value)) {
			$sourceContent[$key] = yaml($value);
		}
	}

	$content['images'] = $page->getAllImageURLs();
	$content['text'] = (string)$page->text();
	$content['fullContent'] = true;
	kirby()->cache()->set($cacheID, $content);

	return $content;
};


page::$methods['getInitialContent'] = function($page, $withChildren = false) {
	$cacheID = 'getInitialContent/' . $page->id();
	$cacheContent = kirby()->cache()->get($cacheID);

	if ($cacheContent) {
		return $cacheContent;
	}

	$sourceContent = $page->content()->toArray();
	$content['title'] = (string)$page->title();
	$content['slug'] = (string)$page->uid();
	$content['id'] = (string)$page->id();
	$content['type'] = (string)$page->intendedTemplate();
	$content['sort'] = (int)$page->num();
	$content['visible'] = (bool)$page->isVisible();

	$content['excerpt'] = (strlen($page->excerpt())) ? (string)$page->excerpt() : makeExcerpt($page->text(), 1000);

	if (array_key_exists('categories', $sourceContent)) {
		if (strlen($sourceContent['categories']) === 0) {
			$content['categories'] = ['uncategorized'];
		} else {
			$content['categories'] = explode(',', $sourceContent['categories']);
		}
	}

	if ($page->cover()) {
		$content['cover'] = buildImage($page->cover());
	} else if ($page->images()->sortBy('sort')->count() > 0) {
		$content['cover'] = buildImage($page->images()->sortBy('sort')->first());
		$content['cover']->isCover = true;
	}

	if ($withChildren) {
		$content['children'] = [];
		$children = $page->children()->visible();
		if ($children->count() > 0) {
			foreach ($children as $child) {
				$childContent = $child->getInitialContent($withChildren);
				array_push($content['children'], $childContent);
			}
		}
	}
	if (gettype($withChildren) === 'integer') $withChildren -= 1;

	unset($content['text']);
	kirby()->cache()->set($cacheID, $content);
	return $content;
};


page::$methods['cover'] = function($page) {
	if (!$page->cover_image()->exists()) return false;
	$image_str = (string)$page->cover_image();
	if (null !== $page->files()->find($image_str) && $page->files()->find($image_str)->width() > 0) {
		return $page->files()->find($image_str);
	} else if ($page->images()->sortBy('sort')->count() > 0) {
		return $page->images()->sortBy('sort')->first();
	}
	return false;
};


page::$methods['getAllImageURLs'] = function($page) {

	$images = [];
	if ($page->images()->count() === 0) return $images;
	foreach ($page->images()->sortBy('sort') as $imageSource) {
		array_push($images, buildImage($imageSource));
	}
	if ($page->cover() === false) {
		$images[0]->isCover = true;
	}
	return $images;
};


?>
