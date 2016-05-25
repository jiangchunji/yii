<?php

/**
 * This is the model class for table "system_role".
 *
 * The followings are the available columns in table 'system_role':
 * @property integer $id
 * @property string $name
 * @property integer $parent_key
 * @property integer $enable
 * @property string $memo
 * @property integer $create_on
 * @property string $create_by
 * @property integer $change_on
 * @property string $change_by
 */
class Role extends BaseModel
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'system_role';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('parent_key, enable, create_on, change_on', 'numerical', 'integerOnly' => true),
            array('name, memo, create_by, change_by', 'length', 'max' => 255),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name, parent_key, enable, memo, create_on, create_by, change_on, change_by', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array();
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id'         => 'ID',
            'name'       => 'Name',
            'parent_key' => 'Parent Key',
            'enable'     => 'Enable',
            'memo'       => 'Memo',
            'create_on'  => 'Create On',
            'create_by'  => 'Create By',
            'change_on'  => 'Change On',
            'change_by'  => 'Change By',
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

        $criteria = new CDbCriteria;

        $criteria->compare('id', $this->id);
        $criteria->compare('name', $this->name, true);
        $criteria->compare('parent_key', $this->parent_key);
        $criteria->compare('enable', $this->enable);
        $criteria->compare('memo', $this->memo, true);
        $criteria->compare('create_on', $this->create_on);
        $criteria->compare('create_by', $this->create_by, true);
        $criteria->compare('change_on', $this->change_on);
        $criteria->compare('change_by', $this->change_by, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Role the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function createTree($role_id)
    {
        $sql = "select t1.id,t1.name as text,t1.parent_key,'menu' as data_type,(select count(1) from system_role_menu t3 where t3.menu_id=t1.id and t3.role_id=:role_id) as is_check from system_menu t1 union all
select t2.id,t2.name as text,t2.menu_id as parent_key,'right' as data_type,(select count(1) from system_role_right t4 where t4.au_id=t2.id and t4.role_id=:role_id) as is_check from system_authority t2";

        return $this->ExecuteSql($sql, array(':role_id' => (int)$role_id));
    }
}
