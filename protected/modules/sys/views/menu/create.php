<form id="admin_cdglAdd_addForm" method="post">
    <table class="edittable" style="width: 100%;">
        <tr>
            <td class="editor-label" style="width: 6%">
                编号
            </td>
            <td class="editor-field" style="width: 39%">
                <input class="easyui-numberbox" name="Menu[id]" data-options="required:true"/>
            </td>
            <td class="editor-label">
                菜单名称
            </td>
            <td class="editor-field" style="width: 39%">
                <input name="Menu[name]" class="easyui-validatebox" data-options="required:true"/>
            </td>
        </tr>
        <tr>
            <td class="editor-label" style="width: 6%">
                菜单地址
            </td>
            <td class="editor-field" style="width: 39%">
                <input name="Menu[url]" class="easyui-validatebox" data-options="required:true"/>
            </td>
            <td class="editor-label">
                菜单排序
            </td>
            <td class="editor-field" style="width: 39%">
                <input name="Menu[show_order]" class="easyui-numberspinner" data-options="min:0,max:999,editable:false,required:true,missingMessage:'请选择菜单排序'"/>
            </td>
        </tr>
        <tr>
            <td class="editor-label" style="width: 6%">
                菜单图标
            </td>
            <td class="editor-field" style="width: 39%">
                <input id="admin_cdglAdd_combobox" name="Menu[img_class]" style="width: 155px;"/>
            </td>
            <td class="editor-label">
                上级菜单
            </td>
            <td class="editor-field" style="width: 39%">
                <input id="admin_cdglAdd_pid" name="Menu[parent_key]" class="easyui-combotree" data-options="url:'<?php echo Yii::app()->createUrl("sys/Menu/CreateTree") ?>',parentField : 'pid',lines : true" style="width: 140px;"/>
                <img src='<?php echo Yii::app()->baseUrl . '/css/icons/cut.png'; ?>'
                     onclick="$('#admin_cdglAdd_pid').combotree('clear');"/>
            </td>
        </tr>
    </table>
</form>
<script type="text/javascript">
    $(function () {
        $('#admin_cdglAdd_combobox').combobox({
            data: iconData,
            formatter: function (v) {
                return formatString('<span class="{0}" style="display:inline-block;vertical-align:middle;width:16px;height:16px;"></span>{1}', v.value, v.value);
            }
        });

//        $('#admin_cdglAdd_pid').combotree({ onChange: function (newValue, oldValue) {

//            $('#ParentKey').combotree({ url: $('#ParentKey').attr("url") +"/"+ newValue });
//            
//        }
//        });


    });
</script>
