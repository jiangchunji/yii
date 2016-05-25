<?php
/* @var $this StudentScoreController */
/* @var $model StudentScore */

$this->breadcrumbs=array(
	'Student Scores'=>array('index'),
	$model->Id,
);

$this->menu=array(
	array('label'=>'List StudentScore', 'url'=>array('index')),
	array('label'=>'Create StudentScore', 'url'=>array('create')),
	array('label'=>'Update StudentScore', 'url'=>array('update', 'id'=>$model->Id)),
	array('label'=>'Delete StudentScore', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->Id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage StudentScore', 'url'=>array('admin')),
);
?>

<h1>View StudentScore #<?php echo $model->Id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'Id',
		'chinese',
		'score',
	),
)); ?>
