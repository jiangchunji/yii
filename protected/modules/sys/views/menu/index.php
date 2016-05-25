<?php $this->renderPartial('//layouts/header'); ?>
<script type="text/javascript">
var iconData = [
    {
        value: '',
        text: '默认'
    },
    {
        value: 'icon-add',
        text: 'icon-add'
    },
    {
        value: 'icon-edit',
        text: 'icon-edit'
    },
    {
        value: 'icon-remove',
        text: 'icon-remove'
    },
    {
        value: 'icon-save',
        text: 'icon-save'
    },
    {
        value: 'icon-cut',
        text: 'icon-cut'
    },
    {
        value: 'icon-ok',
        text: 'icon-ok'
    },
    {
        value: 'icon-no',
        text: 'icon-no'
    },
    {
        value: 'icon-cancel',
        text: 'icon-cancel'
    },
    {
        value: 'icon-reload',
        text: 'icon-reload'
    },
    {
        value: 'icon-search',
        text: 'icon-search'
    },
    {
        value: 'icon-print',
        text: 'icon-print'
    },
    {
        value: 'icon-help',
        text: 'icon-help'
    },
    {
        value: 'icon-undo',
        text: 'icon-undo'
    },
    {
        value: 'icon-redo',
        text: 'icon-redo'
    },
    {
        value: 'icon-back',
        text: 'icon-back'
    },
    {
        value: 'icon-sum',
        text: 'icon-sum'
    },
    {
        value: 'icon-tip',
        text: 'icon-tip'
    }
];

$(function () {
    $('#admin_cdgl_treegrid').treegrid({
        url: '<?php echo Yii::app()->createUrl("sys/Menu/CreateTree")?>',
        idField: 'id',
        treeField: 'text',
        parentField: 'pid',
        fit: true,
        fitColumns: true,
        border: false,
        frozenColumns: [
            [
                {
                    field: 'text',
                    title: '菜单名称',
                    width: 150
                }
            ]
        ],
        columns: [
            [
                {
                    title: '编号',
                    field: 'id',
                    width: 50
                },
                {
                    field: 'iconCls',
                    title: '菜单图标',
                    width: 60,
                    formatter: function (value) {
                        if (!value) {
                            return '';
                        } else {
                            return formatString('<span class="{0}" style="display:inline-block;vertical-align:middle;width:16px;height:16px;"></span>', value);
                        }
                    }
                },
                {
                    field: 'url',
                    title: '菜单路径',
                    width: 200
                },
                {
                    field: 'seq',
                    title: '排序',
                    width: 50
                },
                {
                    field: 'action',
                    title: '动作',
                    width: 50,
                    formatter: function (value, row, index) {
                        return formatString('<img onclick="admin_cdgl_editFun(\'{0}\');" src="{1}"/>&nbsp;<img onclick="admin_cdgl_deleteFun(\'{2}\');" src="{3}"/>', row.id, '<?php echo Yii::app()->baseUrl . '/css/icons/pencil.png'; ?>', row.id, '<?php echo Yii::app()->baseUrl . '/css/icons/cancel.png'; ?>")');
                    }
                }
            ]
        ],
        toolbar: [
            {
                text: '增加',
                iconCls: 'icon-add',
                handler: function () {
                    admin_cdgl_appendFun();
                }
            },
            '-',
            {
                text: '展开',
                iconCls: 'icon-redo',
                handler: function () {
                    var node = $('#admin_cdgl_treegrid').treegrid('getSelected');
                    if (node) {
                        $('#admin_cdgl_treegrid').treegrid('expandAll', node.cid);
                    } else {
                        $('#admin_cdgl_treegrid').treegrid('expandAll');
                    }
                }
            },
            '-',
            {
                text: '折叠',
                iconCls: 'icon-undo',
                handler: function () {
                    var node = $('#admin_cdgl_treegrid').treegrid('getSelected');
                    if (node) {
                        $('#admin_cdgl_treegrid').treegrid('collapseAll', node.cid);
                    } else {
                        $('#admin_cdgl_treegrid').treegrid('collapseAll');
                    }
                }
            },
            '-',
            {
                text: '刷新',
                iconCls: 'icon-reload',
                handler: function () {
                    $('#admin_cdgl_treegrid').treegrid('reload');
                }
            }
        ],
        onContextMenu: function (e, row) {
            e.preventDefault();
            $(this).treegrid('unselectAll');
            $(this).treegrid('select', row.id);
            $('#admin_cdgl_menu').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        }
    });
});

function admin_cdgl_appendFun() {
    $('<div/>').dialog({
        href: '<?php echo Yii::app()->createUrl("sys/Menu/CreateView")?>',
        width: 500,
        height: 200,
        modal: true,
        title: '菜单添加',
        buttons: [
            {
                text: '增加',
                iconCls: 'icon-add',
                handler: function () {
                    debugger;
                    var d = $(this).closest('.window-body');
                    var formJson = $('#admin_cdglAdd_addForm').serializeObject();
                    $.AjaxJson('<?php echo Yii::app()->createUrl("sys/Menu/Create")?>', formJson, function (result) {
                        if (result.st) {
                            var menuObject = result.rt;
                            $('#admin_cdgl_treegrid').treegrid('append', {
                                parent: menuObject.pid,
                                data: [menuObject]
                            });

                            d.dialog('destroy');

                            $('#leftTree').tree('reload');
                        }
                        $.messager.show({
                            title: '提示',
                            msg: '添加成功'
                        });
                    });


                }
            }
        ],
        onClose: function () {
            $(this).dialog('destroy');
        }
    });
}
function admin_cdgl_editFun(id) {
    if (id != undefined) {
        $('#admin_cdgl_treegrid').treegrid('select', id);
    }
    var node = $('#admin_cdgl_treegrid').treegrid('getSelected');
    $('<div/>').dialog({
        href: '<?php echo Yii::app()->createUrl("sys/menu/editView&id=")?>' + node.id,
        width: 500,
        height: 200,
        modal: true,
        title: '菜单编辑',
        buttons: [
            {
                text: '编辑',
                iconCls: 'icon-edit',
                handler: function () {
                    var d = $(this).closest('.window-body');
                    var formJson = $('#admin_cdglEdit_editForm').serializeObject();
                    $.AjaxJson('<?php echo Yii::app()->createUrl("sys/Menu/Edit")?>', formJson, function (result) {
                        if (result.st) {
                            $('#admin_cdgl_treegrid').treegrid('reload');
                            d.dialog('destroy');
                            $('#leftTree').tree('reload');
                        }

                    });

                }
            }
        ],
        onClose: function () {
            $(this).dialog('destroy');
        },
        onLoad: function () {
            $('#admin_cdglEdit_editForm').form('load', node);
        }
    });
}
function admin_cdgl_deleteFun(id) {
    if (id != undefined) {
        $('#admin_cdgl_treegrid').treegrid('select', id);
    }
    var node = $('#admin_cdgl_treegrid').treegrid('getSelected');
    if (node) {
        $.messager.confirm('询问', '您确定要删除【' + node.text + '】？', function (b) {
            if (b) {
                $.ajax({
                    url: '<?php echo Yii::app()->createUrl("sys/menu/delete")?>',
                    data: {
                        menuKey: node.id
                    },
                    cache: false,
                    dataType: 'JSON',
                    success: function (r) {
                        if (r.st) {
                            $('#admin_cdgl_treegrid').treegrid('remove', node.id);
                            $('#leftTree').tree('reload');
                        }
                        $.messager.show({
                            msg: r.rt,
                            title: '提示'
                        });
                    }
                });
            }
        });
    }
}
</script>
<table id="admin_cdgl_treegrid">
</table>
<div id="admin_cdgl_menu" class="easyui-menu" style="width: 120px; display: none;">
    <div onclick="admin_cdgl_appendFun();" data-options="iconCls:'icon-add'">
        增加
    </div>
    <div onclick="admin_cdgl_deleteFun();" data-options="iconCls:'icon-remove'">
        删除
    </div>
    <div onclick="admin_cdgl_editFun();" data-options="iconCls:'icon-edit'">
        编辑
    </div>
</div>
