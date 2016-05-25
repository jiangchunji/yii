<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/default/easyui.css"/>
    <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/icon.css"/>

    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery-1.8.0.min.js" type="text/javascript"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/easyui-lang-zh_CN.js" type="text/javascript"></script>
</head>
<?php
//echo('弹窗<br/>');
//$this->widget('ext.yii-easyui.widgets.EuiWindow', array(
//'id' => 'win',
//'title' => 'My Window',
//'style' => 'width:500px;height:250px;padding:10px;'
//));
echo('按钮<br/>');
$this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
    'text'    => '查询',
    'iconCls' => 'icon-search'

));
echo('<br/>');
echo('日历<br/>');
$this->widget('ext.yii-easyui.widgets.EuiDatebox', array());
echo('<br/>');
echo('树控件');
$this->widget('ext.yii-easyui.widgets.EuiTree', array('id'=>"leftTree",'url'=> Yii::app()->createUrl("dislocOrders/getData")));

?>
<br/>表单
<form method="post">
    <?php
    $this->widget('ext.yii-easyui.widgets.EuiValidateBox', array(
        'required' => true
    ));
    ?>
</form>
<br/>表格
<div id="divToolbar">
    <?php
        $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
            'text'    => '查询',
//            'url'     => Yii::app()->createUrl("dislocOrders/getData"),
            'iconCls' => 'icon-search'

        ));
    ?>
</div>
<?php
$this->widget('ext.yii-easyui.widgets.EuiDataGrid', array(
    'columns'    => array(
        array('field' => 'id', 'title' => 'ID', 'width' => 100,'checkbox'=>true),
        array('field' => 'name', 'title' => '姓名', 'width' => 100)
    ),
    'url'        => Yii::app()->createUrl("Student/GetData"),
    'pagination' => true,
    'rownumbers' => true,
    'idField'=>'id',
    'toolbar'=>'#divToolbar'

));
?>