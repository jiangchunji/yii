<?php

class RoleController extends Controller
{
    //首页
    public function actionIndex()
    {
        $this->layout = '//layouts/treeEdit';
        $this->render('index');
    }

    public function actionCreateTree()
    {
        $data = Role::model()->findAll();
        $rows = array();
        foreach ($data as $item)
            $rows[] = $this->encodeData($item);

        foreach ($rows as $key => $val) {
            $rows[$key] = array_merge($val, array('attributes' => $val, 'text' => $val['name']));
        }
        $result = Helper::list_to_tree($rows, 'id', 'parent_key', 'children');
        $this->Json($result);
    }

    public function actionCreate()
    {
        $role             = new Role();
        $attributes       = $_POST['Role'];
        $role->attributes = $attributes;
        if ($role->save())
            $this->Json(array('st' => true, 'rt' => '操作成功'));
        else {
            $this->Json(array('st' => false, 'rt' => CHtml::errorSummary($role)));
        }
    }

    //编辑操作
    public function actionEdit()
    {
        $result = Role::model()->updateByPk($_POST['Role']['id'], $_POST['Role']);
        $this->Json(array('st' => true, 'rt' => '操作成功'));

    }

    //删除
    public function actionDelete()
    {
        $result = Role::model()->deleteByPk($_POST['Role']["id"]);
        if ($result)
            $this->Json(array('st' => true, 'rt' => '操作成功'));
        else {
            $this->Json(array('st' => false, 'rt' => CHtml::errorSummary(Role::model())));
        }
    }

    //配置权限页面
    public function actionAccessConfigurationView()
    {
        $this->renderPartial('accessConfiguration', array('roleId' => $_GET['roleKey']));
    }

    //创建权限树
    public function actionCreateRightTree()
    {
        $rows = Role::model()->createTree($_GET['id']);
        foreach ($rows as $key => $val) {
            $rows[$key] = array_merge($val, array('attributes' => array('isMenu' => $val['data_type'])));
            if ($val['is_check']) {
                $rows[$key] = array_merge($rows[$key], array('checked' => true));
            }
        }
        $result = Helper::list_to_tree($rows, 'id', 'parent_key', 'children');
        $this->Json($result);
    }

    public function actionAccessConfiguration()
    {
        if ($this->post('menuModels')) {
            //删除菜单权限
            RoleMenu::model()->deleteAll('role_id=:role_id', array(':role_id' => $_POST['roleKey']));
            $menuDatas = $_POST["menuModels"];
            foreach ($menuDatas as $val) {
                $roleMenu          = new RoleMenu();
                $roleMenu->role_id = $val['roleId'];
                $roleMenu->menu_id = $val['menuId'];
                $roleMenu->save();
            }
        }
        if ($this->post('auModels')) {
            //删除操作权限
            RoleRight::model()->deleteAll('role_id=:role_id', array(':role_id' => $_POST['roleKey']));
            $auDatas = $_POST["auModels"];
            foreach ($auDatas as $val) {
                $roleRight          = new RoleRight();
                $roleRight->au_id   = $val['auId'];
                $roleRight->role_id = $val['roleId'];
                $roleRight->save();
            }
        }

        $this->Json(array('st' => true, 'rt' => '操作成功'));
    }


}