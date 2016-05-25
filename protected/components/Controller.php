<?php

/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController
{

//	/**
//	 * @var string the default layout for the controller view. Defaults to '//layouts/column1',
//	 * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
//	 */
//	public $layout='//layouts/column1';
//	/**
//	 * @var array context menu items. This property will be assigned to {@link CMenu::items}.
//	 */
//	public $menu=array();
//	/**
//	 * @var array the breadcrumbs of the current page. The value of this property will
//	 * be assigned to {@link CBreadcrumbs::links}. Please refer to {@link CBreadcrumbs::links}
//	 * for more details on how to specify this property.
//	 */
//	public $breadcrumbs=array();

    public function Json($data)
    {
        header("Content-type:json/application;charset=utf-8");
        echo json_encode($data);
    }

    /**
     * Exports an array to a special readable JSON object.
     * <p>The $total parameter indicates the total number of records. This is useful is case of pagination where
     * the total number of records is needed by the control to create the correct pagination<br/>
     * @param array|IDataProvider $data the data to generate a JSON object from it
     * @param int $total total number of records in the entire data-source
     * @return string Data representation in JSON format
     * 输出JSON数据
     */
    public function JsonGrid($pageData)
    {
        $data    = $pageData["item"];
        $total   = $pageData["count"];
        $exports = array();
        $model   = null;

        if ($data instanceof IDataProvider) {
            $total = $data->getTotalItemCount();
            $data  = $data->getData();
        }

        if (is_object($data))
            $model = $data;
        else if (is_array($data) && !empty($data))
            $model = current($data);

        if ($model !== null && $model instanceof CActiveRecord && method_exists($model, 'attributeExports')) {
            $attrs = $model->attributeExports();

            if (!is_array($attrs) || (!empty($attrs) && !is_string(current($attrs))))
                throw new CException(Yii::t('easyui', 'Invalid return of method "attributeExports" of class "{class}"',
                    array('{class}' => get_class($model))));

            foreach ($attrs as $at)
                $exports = array_merge($exports, explode('.', $at));
        }

        if (is_array($data)) {
            $rows = array();
            foreach ($data as $item)
                $rows[] = $this->encodeData($item, null, false, $exports);

            echo(CJSON::encode(array('total' => (isset($total)) ? $total : sizeof($data), 'rows' => $rows)));
        } else
            echo(CJSON::encode($this->encodeData($data)));
    }

    /**
     * Convert model to array for export JSON format
     * @param $model the model to encode
     * @param boolean $hidePk whether to export primary key attribute
     * @param array $exports attribute names of export
     */
    public function encodeData($model, $alias = null, $hidePk = false, $exports = array())
    {
        $data = array();
        if (property_exists($model,'ext_attr')) {
            //手动添加扩展的属性值 by JCJ 15-11-3
            $extAttrs = explode(',', $model->ext_attr);
            foreach ($extAttrs as $value) {
                $data[$value] = $model->$value;
            }
        }

        foreach ($model as $key => $value) {
            if ($hidePk && $key == $model->getTableSchema()->primaryKey)
                continue;

            if (empty($exports) || in_array($key, $exports)) {
                $key        = ($alias) ? strtolower($alias) . '_' . $key : $key;
                $data[$key] = $value;
            }
        }

        if ($model instanceof CActiveRecord) {
            foreach ($model->relations() as $k => $relation) {
                if ($relation[0] === CActiveRecord::BELONGS_TO) {
                    $fk = $model->{$k};
                    if ((empty($exports) || in_array($k, $exports)) && $fk !== null) {
                        $cls   = get_class($fk);
                        $alias = ($alias !== null) ? $alias . '_' . $cls : $cls;
                        $data  = array_merge($data, $this->encodeData($fk, $alias, true, $exports));
                    }
                }
            }
        }
        return $data;
    }

    /**
     * GET获取单个数据
     */
    public function get($val, $type = 'str')
    {
        if ($type == 'str') {
            $data = isset($_GET[$val]) ? $_GET[$val] : '';
        } else if ($type == 'int') {
            $data = isset($_GET[$val]) ? $_GET[$val] : 0;
        }
        return $this->_CheckAndQuote($data);
    }

    /**
     * POST获取单个数据
     */
    public function post($val, $type = 'str')
    {
        if ($type == 'str') {
            $data = isset($_POST[$val]) ? $_POST[$val] : '';
        } else if ($type == 'int') {
            $data = isset($_POST[$val]) ? $_POST[$val] : 0;
        }
        return $this->_CheckAndQuote($data);
    }

    /**
     * prevent from invalidate sql sentense is put in advanced
     *
     * @param  $value value of waiting for format
     * @return string formatted value
     */
    function _CheckAndQuote($value)
    {
        if (is_int($value) || is_float($value)) {
            return $value;
        }

        //return '\'' . mysql_real_escape_string($value) . '\'';
        return $value;
    }
}