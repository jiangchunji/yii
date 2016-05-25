<?php

Yii::import('ext.yii-easyui.widgets.EuiButton');

class EuiLinkButton extends EuiButton
{
    public $url = '#';

    /**
     * True to show a plain effect.
     */
    public $plain = true;

//    弹出层宽度 by jcj 15-10-21
//    public $dialogWidth;

    //    弹出层高度  by jcj 15-10-21
    public $height;
    public $width;

    //    按钮可用状态值和初始化是否可用  by jcj 15-10-21
    public $enabled_state;
    public $visibled_state;
    public $disabled = false;

    //点击查询关联控件 by jcj 15-10-21
    public $search_for;

    //点击事件 by jcj 15-11-3
    public $onclick;

    //权限编码code by jcj 15-11-6
    public $code = 0;


    /**
     * (non-PHPdoc)
     * @see EuiWidget::getCssClass()
     */
    public function getCssClass()
    {
        //初始化按钮可用状态 by jcj 15-10-22
        if ($this->disabled) {
            return 'easyui-linkbutton l-btn-disabled';
        }
        return 'easyui-linkbutton';
    }

    public function  init()
    {
        parent::init();
        $this->addInvalidOptions('url');
    }

    public function run()
    {
        //权限验证 by JCJ 15-11-6
        if ($this->code != 0) {
            if (!Helper::checkBtnAu($this->code)) {
                return;
            }
        }
        $options = $this->toOptions();

        //添加button中dialog 的width 和 height属性 by jcj 15-10-22 <a height="100" width="100">
        $options['height'] = $this->height;
        $options['width']  = $this->width;

        //添加button中enabled_status属性 by jcj 15-10-22
        $options["enabled_state"] = $this->enabled_state;

        //添加button中visibled_state属性 by jcj 15-10-26
        $options["visibled_state"] = $this->visibled_state;

        //点击查询关联控件 by jcj 15-10-21
        $options["search_for"] = $this->search_for;

        //添加属性 by jcj 15-10-26
        $options["easyuitype"] = 'linkbutton';

        //添加点击事件 by jcj 15-11-3
        $options["onclick"] = $this->onclick;

        $options["url"] = $this->url;

        unset($options['text']);
        unset($options['inline']);
        unset($options['url']);
        echo CHtml::link(CHtml::encode($this->text), CHtml::normalizeUrl($this->url), $options) . "\n";
    }
}

?>