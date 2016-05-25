<?php $this->beginContent('//layouts/gridToolBar');
$this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
    'id'      => 'lbtCreate',
    'text'    => '新增',
    'iconCls' => 'icon-add',
    'width'   => '400',
    'height'  => '350',
    'code'    => 30030001,
    'url'     => Yii::app()->createUrl("sys/LoginUser/CreateView"),

));
$this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
    'id'            => 'lbtEdit',
    'text'          => '编辑',
    'iconCls'       => 'icon-edit',
    'width'         => '580',
    'height'        => '350',
    'enabled_state' => 80, //只能选一条数据
    'url'           => Yii::app()->createUrl("sys/LoginUser/EditView"),
    'disabled'      => true,
    'code'    => 30030003,
));
$this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
    'id'            => 'lbtDelete',
    'text'          => '删除',
    'iconCls'       => 'icon-remove',
    'url'           => Yii::app()->createUrl("sys/LoginUser/Delete"),
    'enabled_state' => 16, //一条或多条
    'disabled'      => true,
    'code'    => 30030002
));
?>
<div style="float: right;">

    <input type="text" placeholder="姓名" id="CodeName" name="CodeName">
    <?php
    $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
        'id'         => 'lbtSearch',
        'text'       => '查询',
        'iconCls'    => 'icon-search',
        'url'        => Yii::app()->createUrl("sys/LoginUser/Search"),
        'search_for' => '#CodeName'
    ));
    ?>
</div>
<?php $this->endContent(); ?>
<?php $this->renderPartial('grid') ?>
<script type="text/javascript" language="javascript">
    $(document).ready(function () {
        jQuery.InitializeDataGridPage({
            watermark: "#CodeName",
            onInitializePassword: function (evt) {
                var jqLink = $(evt.currentTarget);
                //页面在加载时就给linkbutton附加的数据
                var target = evt.data;
                var opts1 = $(target).gridpage("options");
                if (opts1.disabled) {
                    evt.preventDefault();
                    return false;
                }
                var pageopts = $.data(target, 'gridpage').options;
                var jqGrid = $(pageopts.gridId);
                jQuery.Confirm("是否要初始化密码成123456？", function (jqLink, jqGrid) {
                    var opts = jqGrid.datagrid("getDeleteKeys");
                    jqGrid.datagrid("loading");
                    jqLink.ajaxLinkJson(opts,
                        function (data) {
                            jqGrid.datagrid("reload");
                            jqGrid.datagrid("clearSelections");
                        },
                        function (error) {
                            jqGrid.datagrid("loaded");
                            jQuery.Alert(error);
                        });
                }, jqLink, jqGrid, pageopts);
            }, authorizedRoleConfig: function (evt) {
                var jqLink = $(evt.currentTarget);
                var target = evt.data;
                var json = $(target).gridpage("getSelectedKey");
                var opts = jqLink.serializeAttrs(json);
                //指定高度
                opts.autoHeight = false;

                var pageopts = $.data(target, 'gridpage').options;
                var jqGrid = $(pageopts.gridId);
                jQuery.OpenDialog(opts, function (dialog, param) {
                    var nodes = $("#tvUserRole", dialog).tree("getChecked");
                    var userKey = $("form #USERKEY", dialog).val();
                    var data = { "userkey": userKey };
                    jQuery.each(nodes, function (index, node) {
                        data["userRoleEntities[" + index + "].USERKEY"] = userKey;
                        data["userRoleEntities[" + index + "].ROLEKEY"] = node.id;
                    });
                    jqLink.ajaxLinkJson(data,
                        function (data) {
                            dialog.dialog("close");
                            jqGrid.datagrid("reload");
                            jqGrid.datagrid("clearSelections");
                        },
                        function (error) {
                            jqGrid.datagrid("loaded");
                            jQuery.Alert(error);
                        });
                });
            }, authorizationConfig: function (evt) {
                var jqLink = $(evt.currentTarget);
                var target = evt.data;
                var json = $(target).gridpage("getSelectedKey");
                var opts = jqLink.serializeAttrs(json);
                opts.toolbar = [
                    {
                        id: "lbtSelectAll", iconCls: "icon-checkall", plain: true, text: jQuery.Button.SelectAll, disabled: false,
                        handler: function () {
                            $("#tvUserAuthorization").tree("checkall");
                        }
                    }
                ];
                opts.toolbar.push({
                    id: "lbtUnselectAll", iconCls: "icon-uncheckall", plain: true, text: jQuery.Button.UnselectAll, disabled: false,
                    handler: function () {
                        $("#tvUserAuthorization").tree("uncheckall");
                    }
                });
                opts.toolbar.push({
                    id: "lbtSelectChildAll", iconCls: "icon-checkall", plain: true, text: jQuery.Button.SelectChildren, disabled: false,
                    handler: function () {
                        var node = $("#tvUserAuthorization").tree("getSelected");
                        if (node != null) {
                            $("#tvRightTree").tree("checkall", node.target);
                        }
                    }
                });

                $.OpenDialog(opts, function (dialog, param) {
                    var nodes = $("#tvUserAuthorization").tree("getChecked"); //获取总共的选中的菜单
                    var userKey = $("form #userKey", dialog).val();
                    var data = { "userKey": userKey };
                    var rightIndex = 0;
                    menuIndex = 0;
                    jQuery.each(nodes, function (index, node) {
                        if (!node.attributes.isMenu) {
                            data["userRightEntities[" + rightIndex + "].userKey"] = userKey;
                            data["userRightEntities[" + rightIndex + "].apKey"] = node.id;
                            rightIndex++;
                        }
                        else {
                            data["userMenuEntities[" + menuIndex + "].userKey"] = userKey;
                            data["userMenuEntities[" + menuIndex + "].menuKey"] = node.id;
                            menuIndex++;
                        }
                    });
                    jqLink.ajaxLinkJson(data, function (data) {
                        dialog.dialog("close");
                    }, function (error) {
                        jQuery.Alert(error);
                    });
                });
            },
            authorizedBrandConfig: function (evt) {
                var jqLink = $(evt.currentTarget);
                var target = evt.data;
                var btnOpts = jqLink.linkbutton("options");
                if (btnOpts.disabled) {
                    evt.preventDefault();
                    return false;
                }
                var opts = jqLink.serializeAttrs();
                jQuery.OpenDialog(opts, function (dialog) {
                    $("form", dialog).ajaxJsonForm(function (data) {
                        dialog.dialog("close");
                        $("#gvTable").datagrid("reload");
                        $("#gvTable").datagrid("clearSelections");
                    }, $("#gvTable").datagrid("getDeleteKeys"), function () {
                        $('#lbtOk', dialog).linkbutton('enable');
                    }, dialog);
                });
            }
        });
    });

</script>