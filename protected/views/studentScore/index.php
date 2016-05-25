<?php
/* @var $this StudentScoreController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Student Scores',
);

$this->menu=array(
	array('label'=>'Create StudentScore', 'url'=>array('create')),
	array('label'=>'Manage StudentScore', 'url'=>array('admin')),
);
?>

<h1>Student Scores</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
