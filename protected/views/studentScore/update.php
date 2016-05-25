<?php
/* @var $this StudentScoreController */
/* @var $model StudentScore */

$this->breadcrumbs=array(
	'Student Scores'=>array('index'),
	$model->Id=>array('view','id'=>$model->Id),
	'Update',
);

$this->menu=array(
	array('label'=>'List StudentScore', 'url'=>array('index')),
	array('label'=>'Create StudentScore', 'url'=>array('create')),
	array('label'=>'View StudentScore', 'url'=>array('view', 'id'=>$model->Id)),
	array('label'=>'Manage StudentScore', 'url'=>array('admin')),
);
?>

<h1>Update StudentScore <?php echo $model->Id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>