<?php

class LoginUserController extends Controller
{
    //首页
    public function actionIndex()
    {
        $this->layout = '//layouts/gridPage';
        $this->render('index');
    }

    //新增视图
    public function actionCreateView()
    {
        $loginUser         = new LoginUser();
        $loginUser->enable = 1;
        $this->renderPartial('create', array(
            'model' => $loginUser,
        ));
    }

    //新增操作
    public function actionCreate()
    {
        $loginUser                    = new LoginUser();
        $attributes                   = $_POST['LoginUser'];
        $attributes['effective_date'] = strtotime($attributes['effective_date']);
        $attributes['password']       = md5('123456');
        $loginUser->attributes        = $attributes;
        if ($loginUser->save())
            $this->Json(array('st' => true, 'rt' => '操作成功'));
        else {
            $this->Json(array('st' => false, 'rt' => CHtml::errorSummary($loginUser)));
        }
    }

    //查询
    public function actionSearch()
    {
        if ($this->get("ExportMode") == 2) {
            $loginUser = new LoginUser();
            $result    = $loginUser->findAll();
            //列
            $data = array(
                array('id', 'login_name', 'password')
            );
            foreach ($result as $val) {
                $data[] = array($val['id'], $val['login_name'], $val['password']);
            }
           Helper::exportExcelYII($data);


        } else {
            $data = LoginUser::model()->PageList($_POST["PageIndex"], $_POST["PageSize"], $this->post('CodeName'));
            $this->JsonGrid($data);
        }
    }

    //编辑视图
    public function actionEditView()
    {

        $model = LoginUser::model()->findByPk($_GET['id']);
        $this->renderPartial('edit', array(
            'model' => $model,
        ));
    }

    //编辑操作
    public function actionEdit()
    {
        $_POST['LoginUser']['effective_date'] = strtotime($_POST['LoginUser']['effective_date']);
        LoginUser::model()->updateByPk($_GET['id'], $_POST['LoginUser']);
        $this->Json(array('st' => true, 'rt' => '操作成功'));
    }

    //删除
    public function actionDelete()
    {
        $result = LoginUser::model()->deleteByPk($_POST["ids"]);
        if ($result)
            $this->Json(array('st' => true, 'rt' => '操作成功'));
        else {
            $this->Json(array('st' => false, 'rt' => CHtml::errorSummary(LoginUser::model())));
        }
    }


}