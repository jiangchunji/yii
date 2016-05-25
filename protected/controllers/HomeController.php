<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 15-10-19
 * Time: 下午4:27
 */
class HomeController extends Controller
{
    public function actionIndex()
    {
//        $this->layout = 'layout';
//        $this->render('main');
//        return;
        if (Yii::app()->session['loginInfo']) {
            $this->layout = 'layout';
            $this->render('main');
        } else {
            $this->renderPartial('login', array('msg' => ''));
        }

    }

    public function actionLeft()
    {
        $menuId = count($_POST) == 0 ? null : $_POST["id"];
        $rows   = Menu::model()->createTree($menuId);
        foreach ($rows as $key => $val) {
            $rows[$key] = array_merge($val,
                array('state' => $val['is_children'] == 1 ? 'closed' : ''));
            if (isset($val['url'])) {
                $rows[$key] = array_merge($rows[$key],
                    array('url' => Yii::app()->createUrl($val['url'])));
            }
        }
        $this->Json($rows);
    }

    public function actionLogin()
    {
        $attributes     = $_POST['LoginUser'];
        $loginUserModel = LoginUser::model()->find('login_name=:login_name and password=:password', array(':login_name' => $attributes['login_name'], 'password' => md5($attributes['password'])));
        if ($loginUserModel) {
            Yii::app()->session['loginInfo'] = array('id' => $loginUserModel->id, 'name' => $loginUserModel->login_name);
            $this->redirect(array('home/Index'));
        } else {
            $this->renderPartial('login', array('msg' => '用户名或密码错误'));
        }


    }

    public function actionLoginOut()
    {
        Yii::app()->session->clear();
    }
}