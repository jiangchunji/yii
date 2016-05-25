<?php

class MenuController extends Controller
{
    //首页
    public function actionIndex()
    {
        $this->renderPartial('index');
    }

    //新增视图
    public function actionCreateView()
    {
        $this->renderPartial('create');
    }

    //新增操作
    public function actionCreate()
    {
        $menu             = new Menu();
        $attributes       = $_POST['Menu'];
        $menu->attributes = $attributes;
        if ($menu->save()) {
            $pName   = $attributes['parent_key'] == null ? "" : $menu->findByPk($attributes['parent_key'])->name;
            $addMenu = array('id'      => $attributes['id'],
                             'text'    => $attributes['name'],
                             'iconCls' => $attributes['img_class'],
                             'pid'     => $attributes['parent_key'],
                             'url'     => $attributes['url'],
                             'pname'   => $pName,
                             'seq'     => $attributes['show_order']
            );
            $this->Json(array('st' => true, 'rt' => $addMenu));
        } else {
            $this->Json(array('st' => false, 'rt' => CHtml::errorSummary($menu)));
        }
    }

    //编辑视图
    public function actionEditView()
    {
        $model = Menu::model()->findByPk($_GET['id']);
        $this->renderPartial('edit', array(
            'model' => $model,
        ));
    }

    //编辑
    public function actionEdit(){
        Menu::model()->updateByPk($_POST['Menu']['id'], $_POST['Menu']);
        $this->Json(array('st' => true, 'rt' => '操作成功'));
    }

    //创建gridTree
    public function actionCreateTree()
    {
        $data = Menu::model()->findAll();
        $rows = array();
        foreach ($data as $item)
            $rows[] = $this->encodeData($item);

        foreach ($rows as $key => $val) {
            $rows[$key] = array_merge($val, array('iconCls' => $val['img_class'], 'text' => $val['name']));
        }
        $result = Helper::list_to_tree($rows, 'id', 'parent_key', 'children');
        $this->Json($result);
    }

    //删除
    public function actionDelete()
    {
        $result = Menu::model()->deleteByPk($_POST["menuKey"]);
        if ($result) {
            $this->Json(array('st' => true, 'rt' => '删除成功'));
        } else {
            $this->Json(array('st' => false, 'rt' => CHtml::errorSummary(Menu::model())));
        }
    }


}