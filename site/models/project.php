<?php

class ProjectPage extends Page {
	public function getContent($withChildren = false) {
		$content = parent::getContent($withChildren);
		$content['protected'] = (string)$this->parent()->protected() === 'true';
		$content['section'] = (string)$this->parent()->slug();
		// consoleLog((string)$this->parent()->protected());
		return $content;
	}
}

?>
