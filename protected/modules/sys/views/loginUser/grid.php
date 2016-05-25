<?php
$this->widget('ext.yii-easyui.widgets.EuiDataGrid',
    array(
        'id'         => 'gvTable',
        'url'        => Yii::app()->createUrl("sys/LoginUser/search"),
        'pagination' => true,
        'rownumbers' => true,
        'idField'    => 'id',
        'toolbar'    => '#divToolbar',
        'columns'    => array(
            array('field' => 'id', 'title' => 'ID', 'width' => 100, 'checkbox' => true),
            array('field' => 'login_name', 'title' => '用户名', 'width' => 100),
            array('field' => 'role_name', 'title' => '角色', 'width' => 100),
            array('field' => 'nice_name', 'title' => '昵称', 'width' => 100),
            array('field' => 'enable', 'title' => '是否有效', 'width' => 100,'formatter'=>'$.formatterYesOrNo'),
            array('field' => 'effective_date', 'title' => '有效期', 'width' => 100, 'formatter'=>'$.formatterTimestamp'
            ),
            array('field' => 'login_time', 'title' => '最后登录时间', 'width' => 100),
            array('field' => 'change_pwd_time', 'title' => '修改密码时间', 'width' => 100),
            array('field' => 'memo', 'title' => '备注', 'width' => 100)
        ),
    ));
?>

<!--<table class="easyui-datagrid" id="gvTable" data-options="fitColumns:true,fit:true,striped:true,idField:'id',url:'/yii/index.php?r=sys/LoginUser/search',pagination:true,rownumbers:true,pageSize:20,remoteSort:true,toolbar:'#divToolbar'" style="display: none;">-->
<!--    <thead>-->
<!--    <tr>-->
<!--        <th id="yw0" data-options="title:'ID',field:'id',width:100,checkbox:true">ID</th>-->
<!--        <th id="yw1" data-options="title:'用户名',field:'login_name',width:100">用户名</th>-->
<!--        <th id="yw2" data-options="title:'昵称',field:'nice_name',width:100">昵称</th>-->
<!--        <th id="yw3" data-options="title:'是否有效',field:'enable',width:100">是否有效</th>-->
<!--        <th id="yw4" data-options="title:'有效期',field:'effective_date',width:100,formatter:tewt">有效期</th>-->
<!--        <th id="yw5" data-options="title:'最后登录时间',field:'login_time',width:100">最后登录时间</th>-->
<!--        <th id="yw6" data-options="title:'修改密码时间',field:'change_pwd_time',width:100">修改密码时间</th>-->
<!--        <th id="yw7" data-options="title:'备注',field:'memo',width:100">备注</th>-->
<!--    </tr>-->
<!--    </thead>-->
<!--</table>-->

