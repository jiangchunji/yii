<?php

class AuthorityController extends Controller
{
    //首页
    public function actionIndex()
    {
        $this->layout = '//layouts/treeGrid';
        $this->render('index');
    }

    public function actionCreateTree()
    {
        $rows = Menu::model()->getTree();

//        $data = Menu::model()->findAll();
//        $rows = array();
//        foreach ($data as $item)
//            $rows[] = $this->encodeData($item);

        foreach ($rows as $key => $val) {
            $rows[$key] = array_merge($val, array('attributes' => array('id' => $val['id'], 'IsRootNode' => $val['count_num'] == 0 ? false : true), 'text' => $val['name'], ''));
        }
        $result = Helper::list_to_tree($rows, 'id', 'parent_key', 'children');
        $this->Json($result);
    }

    public function actionCreateView()
    {
        $this->renderPartial('create');
    }

    public function actionCreate()
    {
        $attributes = $_POST['Authority'];
        foreach ((array)$attributes['method'] as $index => $val) {
            $menuUrl    = Menu::model()->findByPk($_GET['id'])->url;
            $urls       = explode('/', $menuUrl);
            $controller = $urls[1];
            switch ($val) {
                case 1:
                    $auId   = $_GET['id'] * 100 + 1;
                    $action = "Create";
                    $name   = '新增';
                    break;
                case 2:
                    $auId   = $_GET['id'] * 100 + 2;
                    $action = "Delete";
                    $name   = '删除';
                    break;
                case 3:
                    $auId   = $_GET['id'] * 100 + 3;
                    $action = "Edit";
                    $name   = '修改';
                    break;
                case 4:
                    $auId   = $_GET['id'] * 100 + 4;
                    $action = "Search";
                    $name   = '查询';

                    break;
                case 5:
                    $auId   = $_GET['id'] * 100 + 5;
                    $action = "AdSearch";
                    $name   = '高级查询';
                    break;
                case 6:
                    $auId   = $_GET['id'] * 100 + 6;
                    $action = "Import";
                    $name   = '导入';
                    break;
                default:
                    $authority = Authority::model()->find('menu_id=' . $_GET['id']);
                    if ($authority && $authority->id > $_GET['id'] * 100 + 9) {
                        $auId = $authority->id + 1;
                    } else {
                        $auId = $_GET['id'] * 100 + 10;
                    }
                    $action = $attributes['custom_method'];
                    $name   = $attributes['method_text'];
            }
            if ($auId && !Authority::model()->findByPk($auId)) {
                $authority             = new Authority();
                $authority->id         = $auId;
                $authority->menu_id    = $_GET['id'];
                $authority->controller = $controller;
                $authority->action     = $action;
                $authority->name       = $name;
                $authority->save();
            }
        }
        $this->Json(array('st' => true, 'rt' => '操作成功'));
    }

    public function actionSearch()
    {
        if ($this->post('id')) {
            $data = Authority::model()->PageList($_POST["PageIndex"], $_POST["PageSize"], $this->post('id'));
            $this->JsonGrid($data);
        } else {
            echo(CJSON::encode(array('total' => 0, 'rows' => array())));
        }
    }

    public function actionDelete()
    {
        $result = Authority::model()->deleteByPk($_POST["ids"]);
        if ($result)
            $this->Json(array('st' => true, 'rt' => '操作成功'));
        else {
            $this->Json(array('st' => false, 'rt' => CHtml::errorSummary(Authority::model())));
        }
    }
}