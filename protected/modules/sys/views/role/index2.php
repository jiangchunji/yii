<?php  $this->renderPartial('//layouts/header');?>
<body>
<div id="divTreeEdit" data-options="fit:true" class="easyui-treeedit">
    <div id="divLeftPanel" data-options="region:'west',border:false" style="width: 200px;
            border-right-width: 1px;">
        <?php
        $this->widget('ext.yii-easyui.widgets.EuiTree', array('id' => "tvRole", 'url' => Yii::app()->createUrl("sys/Role/CreateTree")));
        ?>
    </div>
    <div id="divRightPanel" data-options="region:'center',border:false">
        <div>
            <div id="divToolbar" data-options="region:'north',border:false" style="padding: 3px;
                    overflow: hidden;">
                <?php
                $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
                    'id'      => 'lbtCreate',
                    'text'    => '新增',
                    'iconCls' => 'icon-add',
                    'width'   => '400',
                    'height'  => '350',
                    'url'     => Yii::app()->createUrl("sys/loginUser/createView"),

                ));
                ?>
            </div>
            <div id="divEdit" data-options="region:'center',border:false" style="padding: 3px;">

            </div>
        </div>
    </div>
</div>
</body>


<script type="text/javascript" language="javascript">
    $(document).ready(function () {
        jQuery.InitializeTreeEditPage({ tree: "#tvRole", superSelector: "#ParentKey"
            , afternewsave: function (target, options, param) {
                $("#tvRole").tree('reload');
                var ctOptions = $("#ParentKey").combotree("options");
                $("#ParentKey").combotree("reload", ctOptions.url);
            }, aftereditsave: function (target, options, param) {
                $("#tvRole").tree('reload');
                var ctOptions = $("#ParentKey").combotree("options");
                $("#ParentKey").combotree("reload", ctOptions.url);
            }, clickAccessConfiguration: function (evt) {
                var jqLink = $(evt.currentTarget);
                var btnOpts = jqLink.linkbutton("options"); if (btnOpts.disabled) { evt.preventDefault(); return false; }
                var node = $('#tvRole').tree('getSelected'); //获取要配置的角色
                var opts = jqLink.serializeAttrs({ "roleKey": node.id });
                opts.toolbar = [{ id: "lbtSelectAll", iconCls: "icon-checkall", plain: true, text: jQuery.Button.SelectAll, disabled: false,
                    handler: function () { $("#tvRightTree").tree("checkall"); }
                }];
                opts.toolbar.push({ id: "lbtUnselectAll", iconCls: "icon-uncheckall", plain: true, text: jQuery.Button.UnselectAll, disabled: false,
                    handler: function () { $("#tvRightTree").tree("uncheckall"); }
                });
                opts.toolbar.push({ id: "lbtSelectChildAll", iconCls: "icon-checkall", plain: true, text: jQuery.Button.SelectChildren, disabled: false,
                    handler: function () { var node = $("#tvRightTree").tree("getSelected"); if (node != null) { $("#tvRightTree").tree("checkall", node.target); } }
                });

                $.OpenDialog(opts, function (dialog, param) {
                    var nodes = $("#tvRightTree").tree("getChecked"); //获取总共的选中的菜单
                    var selectNode = $('#tvRole').tree('getSelected'); //获取要配置的角色
                    if (selectNode == null) { return; }
                    var data = { "roleKey": selectNode.id };
                    var rightIndex = 0; menuIndex = 0;
                    jQuery.each(nodes, function (index, node) {
                        if (node.attributes.isMenu == 1) {
                            data["rightEntities[" + rightIndex + "].roleKey"] = selectNode.id;
                            data["rightEntities[" + rightIndex + "].apKey"] = node.id;
                            rightIndex++;
                        }
                        else {
                            data["menuEntities[" + menuIndex + "].roleKey"] = selectNode.id;
                            data["menuEntities[" + menuIndex + "].menuKey"] = node.id;
                            menuIndex++;
                        }
                    });

                    jqLink.ajaxLinkJson(data, function (data) { dialog.dialog("close"); $("#tvTree").tree("reload"); }, function (error) { jQuery.Alert(error); });
                });
            }, clickCopyRole: function (evt) {
                var jqLink = $(evt.currentTarget); var treepage = evt.data;
                var pageOpts = $(treepage).treeedit("options");
                var btnOpts = jqLink.linkbutton("options"); if (btnOpts.disabled) { evt.preventDefault(); return false; }
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
                    $("form", dialog).ajaxJsonForm(function () { dialog.dialog("close"); $("#tvTree").tree("reload"); }, opts,
                        function () { $('#lbtOk', dialog).linkbutton('enable'); });
                });
                evt.preventDefault();
            }, afterselectnode: function (target, node) {
                if (node != null && node.url != null)
                    $("#tvTree").tree({ url: node.url });
            }
        });
    });

</script>
