<?php $form = $this->beginWidget('CActiveForm'); ?>
<?php echo CHtml::checkBoxList('Authority[method]', null, array('1' => '增加', '3' => '修改', '2' => '删除', '4' => '查询', '5' => '高级查询', '6' => '导入', '10' => '自定义'), array('separator' => '')) ?>
<br/><br/>
<span>操作请求</span>
<?php echo CHtml::textField('Authority[custom_method]') ?><br/><br/>
<span>权限名称</span>
<?php echo CHtml::textField('Authority[method_text]') ?><br>
<?php $this->endWidget(); ?>