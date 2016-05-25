<script type="text/javascript" charset="utf-8">
    function loginOut() {
        $.AjaxJson('<?php echo(Yii::app()->createUrl("home/LoginOut")) ?>', null, function () { document.location.reload(); })
    }
    function changePwd() {
        var options = { "actionUrl": '@Html.WebAction("ChangePwd")', "height": 200, "width": 300, "title": "修改密码" };
        jQuery.OpenDialog(options, function (dialog) {
            $("form", dialog).hideFormError();
            $("form", dialog).ajaxJsonForm(function () { dialog.dialog("close"); }, null, function () { $('#lbtOk', dialog).linkbutton('enable'); }, dialog);
        });

    }
</script>
<div data-options="region:'north',href:'/layout/north.jsp'" style="height: 58px;
    overflow: hidden; width: 100%;" class=" panel-body panel-body-noheader layout-body logoDiv"
     title="">
    <div class="logoCss">
<!--        阳澄湖电商后台管理系统-->
<!--        管理系统-->
    </div>
    <div id="sessionInfoDiv" style="position: absolute; right: 5px; top: 10px;">
        [<strong><?php echo(Yii::app()->session['loginInfo']['name'])?></strong>]，欢迎您！您使用[<strong><?php echo(Yii::app()->request->userHostAddress)?>
        </strong>]IP登录！
    </div>
    <div style="position: absolute; right: 0px; bottom: 0px;">
        <a href="javascript:void(0);" class="easyui-menubutton" data-options="menu:'#layout_north_pfMenu',iconCls:'icon-ok'">
            更换皮肤</a> <a href="javascript:void(0);" class="easyui-menubutton" data-options="menu:'#layout_north_kzmbMenu',iconCls:'icon-help'">
            控制面板</a> <a href="javascript:void(0);" class="easyui-menubutton" data-options="menu:'#layout_north_zxMenu',iconCls:'icon-back'">
            注销</a>
    </div>
    <div id="layout_north_pfMenu" style="width: 120px; display: none;">
        <div onclick="changeTheme('default');">
            default</div>
        <div onclick="changeTheme('gray');">
            gray</div>
        <div onclick="changeTheme('metro');">
            metro</div>
        <div onclick="changeTheme('cupertino');">
            cupertino</div>
        <div onclick="changeTheme('dark-hive');">
            dark-hive</div>
        <div onclick="changeTheme('pepper-grinder');">
            pepper-grinder</div>
        <div onclick="changeTheme('sunny');">
            sunny</div>
    </div>
    <div id="layout_north_kzmbMenu" style="width: 100px; display: none;">
        <div onclick="changePwd();">
            修改密码</div>
        <div class="menu-sep">
        </div>
        <div>
            <span>更换主题</span>
            <div style="width: 120px;">
                <div onclick="changeTheme('default');">
                    default</div>
                <div onclick="changeTheme('gray');">
                    gray</div>
                <div onclick="changeTheme('metro');">
                    metro</div>
                <div onclick="changeTheme('cupertino');">
                    cupertino</div>
                <div onclick="changeTheme('dark-hive');">
                    dark-hive</div>
                <div onclick="changeTheme('pepper-grinder');">
                    pepper-grinder</div>
                <div onclick="changeTheme('sunny');">
                    sunny</div>
            </div>
        </div>
    </div>
    <div id="layout_north_zxMenu" style="width: 100px; display: none;">
        <div onclick="logoutFun();">
            锁定窗口</div>
        <div class="menu-sep">
        </div>
        <div onclick="logoutFun();">
            重新登录</div>
        <div onclick="loginOut()">
            退出系统</div>
    </div>
</div>
