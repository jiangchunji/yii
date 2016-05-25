<?php

/**
 * This is the model class for table "system_menu".
 *
 * The followings are the available columns in table 'system_menu':
 * @property integer $id
 * @property integer $show_order
 * @property string $name
 * @property string $img_class
 * @property string $url
 * @property integer $parent_key
 * @property integer $create_on
 * @property string $create_by
 * @property integer $change_on
 * @property string $change_by
 */
class Menu extends BaseModel
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'system_menu';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('id, show_order, parent_key, create_on, change_on', 'numerical', 'integerOnly' => true),
            array('name, img_class, url, create_by, change_by', 'length', 'max' => 255),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, show_order, name, img_class, url, parent_key, create_on, create_by, change_on, change_by', 'safe', 'on' => 'search'),
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
            'show_order' => 'Show Order',
            'name'       => 'Name',
            'img_class'  => 'Img Class',
            'url'        => 'Url',
            'parent_key' => 'Parent Key',
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
        $criteria->compare('show_order', $this->show_order);
        $criteria->compare('name', $this->name, true);
        $criteria->compare('img_class', $this->img_class, true);
        $criteria->compare('url', $this->url, true);
        $criteria->compare('parent_key', $this->parent_key);
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
     * @return Menu the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function  createTree($menu_id = null)
    {
        if ($menu_id) {
            $sql = "select t1.id,t1.name as text, 'node-menu' as nodeCls,t1.img_class as 'iconCls',(select count(1) from system_menu t2 where t1.id=t2.parent_key ) as is_children,t1.url from system_menu t1 where t1.parent_key =:menu_id and t1.id in (select t1.menu_id from system_role_menu t1 inner join system_role t2 on t1.role_id=t2.id left join system_login_user t3 on t2.id=t3.role_id where t3.id=:user_id);";
            return $this->ExecuteSql($sql, array(':menu_id' => (int)$menu_id, ':user_id' => (int)Yii::app()->session['loginInfo']['id']));
        } else {
            $sql = "select id,name as text,'node-group' as nodeCls,img_class as 'iconCls',1 as is_children from system_menu where parent_key is null
and id in (select t1.menu_id from system_role_menu t1 inner join system_role t2 on t1.role_id=t2.id left join system_login_user t3 on t2.id=t3.role_id where t3.id=:user_id)";
            return $this->ExecuteSql($sql, array(':user_id' => (int)Yii::app()->session['loginInfo']['id']));
        }


    }
}
