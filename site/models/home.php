<?php

class HomePage extends Page {
	public function getContent($withChildren = false) {
		$content = parent::getContent($withChildren);
		$content['warpImage'] = buildImage($this->images()->find((string)$this->cover_image()));
		$content['signature'] = buildImage($this->images()->find((string)$this->signature()));

		return $content;
	}
}

?>
