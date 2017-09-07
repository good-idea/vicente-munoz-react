<?php

function getCommitHash() {
	return trim(exec('git log --pretty="%h" -n1 HEAD'));
}

 ?>
