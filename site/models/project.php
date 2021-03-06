<?php

class ProjectPage extends Page {
	public function getContent($withChildren = false) {
		$content = parent::getContent($withChildren);
		$content['protected'] = (string)$this->parent()->protected() === 'true';
		$content['section'] = (string)$this->parent()->slug();

		$pinnedImageFilenames = explode(',', $this->thumbnails());

		foreach($content['images'] as $image) {
			// consoleLog($image);
			$image->pinned = (in_array( (string)$image->filename, $pinnedImageFilenames));
		}

		unset($content['thumbnails']);

		// if ($this->children()->visible()->count() > 0) {
		// 	$content['altGallery'] = $this->children()->visible()->first()->getContent();
		// }
		// consoleLog((string)$this->parent()->protected());
		return $content;
	}
}

?>
