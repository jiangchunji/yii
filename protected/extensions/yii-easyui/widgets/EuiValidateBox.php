<?php

Yii::import('ext.yii-easyui.widgets.EuiControl');

class EuiValidateBox extends EuiControl
{
    /**
     * @var string Defines attribute name of input
     */
    public $name;

    /**
     * @var boolean    Defines if the field should be inputed
     */
    public $required;

    /**
     * @var string,array Defines the field valid type, such as email, url, etc. Possible values are:
     */
    public $validType;

    /**
     * @var number Delay to validate from the last inputting value
     */
    public $delay;

    /**
     * @var string    Tooltip text that appears when the text box is empty
     */
    public $missingMessage;

    /**
     * @var string    Tooltip text that appears when the content of text box is invalid
     */
    public $invalidMessage;

    /**
     * @var string Defines the position of tip message when the content of text box is invalid. Possible values: 'left','right'
     */
    public $tipPosition;

    /**
     * @var int Specifies the width of  in characters
     */
    public $size;

    /**
     * @var int The maximum number of characters allowed
     */
    public $maxlength;

    /**
     * @var string Specifies a short hint that describes the expected value
     */
    public $placeholder;

    public $value;

    public $validtype;

    public $isValidate;

    // 文本框是否可用  by jcj 15-10-21
    public $enabled_state;


    public function getCssClass()
    {
        return 'easyui-validatebox';
    }

    public function init()
    {
        $this->addInvalidOptions(array(
            'name',
            'size',
            'maxlength',
            'placeholder'
        ));
    }

    public function run()
    {
        $options                = $this->toOptions();
        $options['name']        = $this->name;
        $options['size']        = $this->size;
        $options['maxlength']   = $this->maxlength;
        $options['placeholder'] = $this->placeholder;

        //添加values属性 by jcj 15-10-22
        $options['value'] = $this->value;

        //添加text中enabled_status属性 by jcj 15-10-22
        $options["enabled_state"] = $this->enabled_state;

        //手动添加date属性 by jcj 15-10-25
        if ($this->validtype == "date") {
            $options['validtype']  = $this->validtype;
            $options['isValidate'] = $this->isValidate;
            $options['style'] = 'width:173px';
        }


        echo CHtml::Tag('input', $options) . "\n";
    }
}

?>