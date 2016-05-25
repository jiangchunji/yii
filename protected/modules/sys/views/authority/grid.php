<?php
$this->widget('ext.yii-easyui.widgets.EuiDataGrid',
    array(
        'id'         => 'gvTable',
        'url'        => Yii::app()->createUrl("sys/authority/search"),
        'pagination' => true,
        'rownumbers' => true,
        'idField'    => 'id',
        'toolbar'    => '#divToolbar',
        'columns'    => array(
            array('field' => 'id', 'title' => 'ID', 'width' => 100, 'checkbox' => true),
            array('field' => 'ap_key', 'title' => '关键字', 'width' => 100),
            array('field' => 'menu_id', 'title' => '菜单关键字', 'width' => 100),
            array('field' => 'controller', 'title' => '控制器', 'width' => 100),
            array('field' => 'action', 'title' => '操作请求', 'width' => 100),
            array('field' => 'name', 'title' => '权限名称', 'width' => 100)
        ),
    ));
?>