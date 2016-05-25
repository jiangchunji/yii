<?php $this->beginContent('//layouts/treeLeft');
$this->widget('ext.yii-easyui.widgets.EuiTree', array('id' => "tvRole", 'url' => Yii::app()->createUrl("sys/Role/CreateTree")));
$this->endContent(); ?>

<?php $this->beginContent('//layouts/treeRight'); ?>
<div id="divToolbar" data-options="region:'north',border:false" style="padding: 3px;
                    overflow: hidden;">
    <?php
    $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
        'id'             => 'lbtCreate',
        'text'           => '新增',
        'iconCls'        => 'icon-add',
        'width'          => '400',
        'height'         => '350',
        'visibled_state' => 33, //只能选一条数据
        'url'            => Yii::app()->createUrl("sys/Role/Create")
    ));
    $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
        'id'             => 'lbtEdit',
        'text'           => '编辑',
        'iconCls'        => 'icon-edit',
        'visibled_state' => 32,
        'style'          => 'display: none',
        'url'            => Yii::app()->createUrl("sys/Role/Edit"),

    ));
    $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
        'id'             => 'lbtDelete',
        'text'           => '删除',
        'iconCls'        => 'icon-remove',
        'url'            => Yii::app()->createUrl("sys/Role/Delete"),
        'visibled_state' => 32,
        'style'          => 'display: none',

    ));
    $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
        'id'             => 'lbtSave',
        'text'           => '保存',
        'iconCls'        => 'icon-save',
        'url'            => Yii::app()->createUrl("sys/Role/Save"),
        'visibled_state' => 6,
        'style'          => 'display: none',

    ));
    $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
        'id'             => 'lbtCancel',
        'text'           => '取消',
        'iconCls'        => 'icon-cancel',
        'visibled_state' => 6,
        'style'          => 'display: none',
    ));
    $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
        'url'            => Yii::app()->createUrl("sys/Role/AccessConfigurationView"),
        'text'           => '权限配置',
        'iconCls'        => 'icon-tip',
        'visibled_state' => 32,
        'width'          => '350',
        'height'         => '500',
        'style'          => 'display: none',
        'onclick'        => 'clickAccessConfiguration'
    ));
    ?>
</div>
<div id="divEdit" data-options="region:'center',border:false" style="padding: 3px;">
    <?php
    $role = new Role();
    $role->enable = 1;
    $this->renderPartial('edit', array(
        'model' => $role,
    )) ?>
</div>
<?php $this->endContent(); ?>

<script type="text/javascript" language="javascript">
    $(document).ready(function () {
        jQuery.InitializeTreeEditPage({ tree: "#tvRole", superSelector: "#ParentKey", afternewsave: function (target, options, param) {
            $("#tvRole").tree('reload');
            var ctOptions = $("#ParentKey").combotree("options");
            $("#ParentKey").combotree("reload", ctOptions.url);
        }, aftereditsave: function (target, options, param) {
            $("#tvRole").tree('reload');
            var ctOptions = $("#ParentKey").combotree("options");
            $("#ParentKey").combotree("reload", ctOptions.url);
        }, clickAccessConfiguration: function (evt) {
            var jqLink = $(evt.currentTarget);
            var btnOpts = jqLink.linkbutton("options");
            if (btnOpts.disabled) {
                evt.preventDefault();
                return false;
            }
            var node = $('#tvRole').tree('getSelected'); //获取要配置的角色
            var opts = jqLink.serializeAttrs({ "roleKey": node.id });
            opts.toolbar = [
                { id: "lbtSelectAll", iconCls: "icon-checkall", plain: true, text: jQuery.Button.SelectAll, disabled: false,
                    handler: function () {
                        $("#tvRightTree").tree("checkall");
                    }
                }
            ];
            opts.toolbar.push({ id: "lbtUnselectAll", iconCls: "icon-uncheckall", plain: true, text: jQuery.Button.UnselectAll, disabled: false,
                handler: function () {
                    $("#tvRightTree").tree("uncheckall");
                }
            });
            opts.toolbar.push({ id: "lbtSelectChildAll", iconCls: "icon-checkall", plain: true, text: jQuery.Button.SelectChildren, disabled: false,
                handler: function () {
                    var node = $("#tvRightTree").tree("getSelected");
                    if (node != null) {
                        $("#tvRightTree").tree("checkall", node.target);
                    }
                }
            });
            $.OpenDialog(opts, function (dialog, param) {
                debugger;
                var nodes = $("#tvRightTree").tree("getChecked"); //获取总共的选中的菜单
                var selectNode = $('#tvRole').tree('getSelected'); //获取要配置的角色
                if (selectNode == null) {
                    return;
                }
                if(nodes.length==0){
                    $.Alert('提示信息','尚未选择','error');
                    $('#lbtOk', dialog).linkbutton('enable');
                    return;
                }
                var data = { "roleKey": selectNode.id };
                var rightIndex = 0;
                var menuIndex = 0;
                jQuery.each(nodes, function (index, node) {
                    if (node.attributes.isMenu == 'right') {
                        data['auModels[' + rightIndex + "][roleId]"] = selectNode.id;
                        data['auModels[' + rightIndex + "][auId]"] = node.id;
                        rightIndex++;
                    }
                    else {
                        data['menuModels[' + menuIndex + "][roleId]"] = selectNode.id;
                        data['menuModels[' + menuIndex + "][menuId]"] = node.id;
                        menuIndex++;
                    }
                });

                jqLink.ajaxLinkJson(data, function (data) {
                    dialog.dialog("close");
                    $("#tvTree").tree("reload");
                }, function (error) {
                    jQuery.Alert(error);
                });
            });
            return false;
        }, clickCopyRole: function (evt) {
            var jqLink = $(evt.currentTarget);
            var treepage = evt.data;
            var pageOpts = $(treepage).treeedit("options");
            var btnOpts = jqLink.linkbutton("options");
            if (btnOpts.disabled) {
                evt.preventDefault();
                return false;
            }
            var node = $('#tvRole').tree('getSelected'); //获取要配置的角色
            var opts = jqLink.serializeAttrs({ "roleKey": node.id });
            jQuery.OpenDialog(opts, function (dialog) {
                ;
                var opts = { serialized: true };
                var nodes = $("#tvUserRole").tree("getSelected"); //获取总共的选中的菜单
                if (nodes == null) {
                    $.Alert('至少选择一项！')
                    $('#lbtOk', dialog).linkbutton('enable');
                    return;
                }
                opts.oldRoleKey = nodes.id;
                $("form", dialog).ajaxJsonForm(function () {
                        dialog.dialog("close");
                        $("#tvTree").tree("reload");
                    }, opts,
                    function () {
                        $('#lbtOk', dialog).linkbutton('enable');
                    });
            });
            evt.preventDefault();
        }, afterselectnode: function (target, node) {
            if (node != null && node.url != null)
                $("#tvTree").tree({ url: node.url });
        }
        });
    });

</script>