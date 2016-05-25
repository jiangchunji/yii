<?php

/**
 * This is the model class for table "system_authority".
 *
 * The followings are the available columns in table 'system_authority':
 * @property integer $id
 * @property integer $menu_id
 * @property string $controller
 * @property string $action
 * @property string $name
 * @property integer $create_on
 * @property string $create_by
 * @property integer $change_on
 * @property string $change_by
 */
class Authority extends CActiveRecord
{
    public $ext_attr='ap_key';
    //新增属性ap_key
    public $ap_key;

//    public $au_name;
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'system_authority';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('id, menu_id, create_on, change_on', 'numerical', 'integerOnly'=>true),
			array('controller, action, name, create_by, change_by', 'length', 'max'=>255),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, menu_id, controller, action, name, create_on, create_by, change_on, change_by', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'menu_id' => 'Menu',
			'controller' => 'Controller',
			'action' => 'Action',
			'name' => 'Name',
			'create_on' => 'Create On',
			'create_by' => 'Create By',
			'change_on' => 'Change On',
			'change_by' => 'Change By',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('menu_id',$this->menu_id);
		$criteria->compare('controller',$this->controller,true);
		$criteria->compare('action',$this->action,true);
		$criteria->compare('name',$this->name,true);
		$criteria->compare('create_on',$this->create_on);
		$criteria->compare('create_by',$this->create_by,true);
		$criteria->compare('change_on',$this->change_on);
		$criteria->compare('change_by',$this->change_by,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Authority the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

    //分页
    public function PageList($pageIndex, $pagesize, $menu_id = '')
    {
        $criteria         = new CDbCriteria();
        $criteria->select = '*,id as ap_key';
        if ($menu_id) {
            $criteria->addSearchCondition('menu_id',$menu_id); //相当于like
        }
        // 求总的记录数
        $count            = self::model()->count($criteria);
        $criteria->limit  = $pagesize;
        $criteria->offset = ($pageIndex - 1) * $pagesize;
        $list = self::model()->findAll($criteria);

        return array('item' => $list, 'count' => $count);
    }

}
