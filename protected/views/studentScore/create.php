<?php
/* @var $this StudentScoreController */
/* @var $model StudentScore */

$this->breadcrumbs=array(
	'Student Scores'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List StudentScore', 'url'=>array('index')),
	array('label'=>'Manage StudentScore', 'url'=>array('admin')),
);
?>

<h1>Create StudentScore</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>