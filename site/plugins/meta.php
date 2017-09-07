<?php


function meta($page) {
	$site = kirby()->site();
	$homepageCover = $site->pages()->find('home')->cover();
	$defaultImage = ($homepageCover) ? $homepageCover->url() : '';
	$defaultDescription = ($site->og_description());

	$title = ($page->isHomepage()) ? $site->title() : $page->title() . " | " . $site->title();

	$description = (strlen((string)$page->text()) > 0) ? meta_excerpt($page->text()) : $defaultDescription;

	$description = strip_tags(kirbytext($description));

	$cover = $page->cover();
	$image = ($cover) ? $cover->url() : $defaultImage;

	$image = thumb($image, array('width', 1200), false);

	$str = "<title>" . $title . "</title>";
	$str .= "\n" . '<meta name="description" content="' . $description . '">';
	$str .= "\n" . '<meta property="og:title" content="' . $title . '">';
	$str .= "\n" . '<meta property="og:type" content="website">';
	$str .= "\n" . '<meta property="og:description" content="' . $description . '">';
	$str .= "\n" . '<meta property="og:url" content="' . $page->url() . '">';
	$str .= "\n" . '<meta property="og:image" content="' . $image . '">';

	return($str);
}

function meta_excerpt($string, $chars = 600) {
  if (strlen($string) == 0) return "";
  if (strlen($string) <= $chars) return $string;
  $string = strip_tags($string);
  $string = substr($string, 0, $chars);
  $last_word = strrpos($string, " ");
  $string = substr($string, 0, $last_word);
  return ($string);
}

?>
