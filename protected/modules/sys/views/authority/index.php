<div id="divToolbar">
    <?php
    $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
        'id'            => 'lbtCreate',
        'text'          => '新增',
        'iconCls'       => 'icon-add',
        'width'         => '400',
        'height'        => '350',
        'enabled_state' => 1, //只能选一条数据
//        'visibled_state'=>32,
        'disabled'      => true,
        'url'           => Yii::app()->createUrl("sys/Authority/CreateView"),

    ));
    $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
        'id'            => 'lbtEdit',
        'text'          => '编辑',
        'iconCls'       => 'icon-edit',
        'width'         => '580',
        'height'        => '350',
        'enabled_state' => 16, //只能选一条数据
        'url'           => Yii::app()->createUrl("sys/Authority/EditView"),
        'disabled'      => true
    ));
    $this->widget('ext.yii-easyui.widgets.EuiLinkButton', array(
        'id'            => 'lbtDelete',
        'text'          => '删除',
        'iconCls'       => 'icon-remove',
        'url'           => Yii::app()->createUrl("sys/Authority/Delete"),
        'enabled_state' => 16, //一条或多条
        'disabled'      => true
    ));
    ?>
</div>
<div id="divTreeGrid" class="easyui-treegridpage" data-options="fit:true,border:false">
    <?php $this->beginContent('//layouts/treeGridLeft');
    $this->widget('ext.yii-easyui.widgets.EuiTree', array('id' => "tvMenu", 'url' => Yii::app()->createUrl("sys/Authority/CreateTree")));
    $this->endContent(); ?>
    <div id="divRightPanel" data-options="region:'center',noheader:true,border:false">
        <!--        @RenderBody()-->
        <?php $this->renderPartial('grid') ?>
    </div>
</div>


<script type="text/javascript" language="javascript">
    $(document).ready(function () {
        jQuery.InitializeTreeGridPage({ gridId: "#gvTable", treeid: "#tvMenu", watermark: "#CodeName",
            afterselectnode: function (target, node) {
                node.attributes.IsRootNode == true ? $("#lbtCreate").enabled(0) : $("#lbtCreate").enabled(49);
            }, saveAuthority: function (dialog) {
                //表单执行成功回调方法
                //附加到序列化后form表单json数据
                //表单提交（后台处理失败）回调方法
                $("form", dialog).ajaxJsonForm(function (data) {
                    dialog.dialog("close");
                    var grid = $("#gvTable");
                    grid.datagrid("loadData", data);
                }, null, function () {
                    $('#lbtOk', dialog).linkbutton('enable');
                });
            }, clickAddAuthority: function (evt) {

                var jqLink = $(evt.currentTarget);
                var treepage = evt.data;
                var pageOpts = $(treepage).treegridpage("options");
                var btnOpts = jqLink.linkbutton("options");
                if (btnOpts.disabled) {
                    evt.preventDefault();
                    return false;
                }
                var node = $('#tvMenu').tree('getSelected');
                var opts = jqLink.serializeAttrs({ "menuKey": node.id });
                //                jQuery.OpenDialog(opts, pageOpts.saveAuthority);
                //dialog属性
                //点击ok按钮触发事件
                //附加到序列化后form表单json数据
                jQuery.OpenDialog(opts, pageOpts.saveAuthority, null);

            }
        });
    });

</script>