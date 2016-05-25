<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>管理员登录 </title>
    <link href="<?php echo Yii::app()->request->baseUrl; ?>/css/style.css" rel="stylesheet" type="text/css"/>
    <link href="<?php echo Yii::app()->request->baseUrl; ?>/css/base.css" rel="stylesheet" type="text/css"/>
    <script src="<?php echo Yii::app()->request->baseUrl; ?>/js/jQuery/jquery-1.8.0.js" type="text/javascript"></script>
</head>

<body class="loginbody">
<form name="form1" method="post" action="<?php echo(Yii::app()->createUrl("home/Login")) ?>" id="form1">
    <div class="login-screen">
        <div class="login-icon">LOGO</div>
        <div class="login-form">
            <h1>系统管理登录</h1>
            <div class="control-group">
                <input name="LoginUser[login_name]" type="text" value="admin" id="txtUserName" class="login-field" placeholder="用户名" title="用户名"/>
                <label class="login-field-icon user" for="txtUserName"></label>
            </div>
            <div class="control-group">
                <input name="LoginUser[password]" type="password" id="txtPassword" class="login-field" placeholder="密码" title="密码"/>
                <label class="login-field-icon pwd" for="txtPassword"></label>
            </div>
            <div>
                <input type="submit" name="btnSubmit" onclick="return check()" value="登 录" id="btnSubmit" class="btn-login"/>
            </div>
            <span class="login-tips"><i></i><b id="msgtip"><?php echo($msg ? $msg : "") ?></b></span>
        </div>
        <i class="arrow">箭头</i>
    </div>
</form>
</body>
</html>
<script>
    function check() {
        debugger;
        if ($.trim($("#txtUserName").val()) == "" || $.trim($("#txtPassword").val()) == "") {
            $("#msgtip").html("用户名和密码是必须的");
            return false;
        }
        else
            return true;

    }
</script>