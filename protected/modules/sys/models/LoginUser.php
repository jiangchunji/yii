<?php

/**
 * This is the model class for table "system_login_user".
 *
 * The followings are the available columns in table 'system_login_user':
 * @property integer $id
 * @property string $login_name
 * @property integer $role_id
 * @property string $nice_name
 * @property string $password
 * @property integer $enable
 * @property integer $effective_date
 * @property integer $login_time
 * @property integer $change_pwd_time
 * @property string $memo
 * @property integer $create_on
 * @property string $create_by
 * @property integer $change_on
 * @property string $change_by
 */
class LoginUser extends CActiveRecord
{
    public $ext_attr='role_name';
    //新增属性ap_key
    public $role_name;
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'system_login_user';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('role_id, enable, effective_date, login_time, change_pwd_time, create_on, change_on', 'numerical', 'integerOnly' => true),
            array('login_name, nice_name, password, memo, create_by, change_by', 'length', 'max' => 255),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, login_name, role_id, nice_name, password, enable, effective_date, login_time, change_pwd_time, memo, create_on, create_by, change_on, change_by', 'safe', 'on' => 'search'),
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
            'id'              => 'ID',
            'login_name'      => 'Login Name',
            'role_id'         => 'Role',
            'nice_name'       => 'Nice Name',
            'password'        => 'Password',
            'enable'          => 'Enable',
            'effective_date'  => 'Effective Date',
            'login_time'      => 'Login Time',
            'change_pwd_time' => 'Change Pwd Time',
            'memo'            => 'Memo',
            'create_on'       => 'Create On',
            'create_by'       => 'Create By',
            'change_on'       => 'Change On',
            'change_by'       => 'Change By',
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
        $criteria->compare('login_name', $this->login_name, true);
        $criteria->compare('role_id', $this->role_id);
        $criteria->compare('nice_name', $this->nice_name, true);
        $criteria->compare('password', $this->password, true);
        $criteria->compare('enable', $this->enable);
        $criteria->compare('effective_date', $this->effective_date);
        $criteria->compare('login_time', $this->login_time);
        $criteria->compare('change_pwd_time', $this->change_pwd_time);
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
     * @return LoginUser the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    //分页
    public function PageList($pageIndex, $pagesize, $login_name = '')
    {
        $criteria         = new CDbCriteria();
        $criteria->select = 't.*,t1.name as role_name';
        $criteria->join   = 'left join system_role t1 on t.role_id=t1.id';
        if ($login_name) {
            $criteria->addSearchCondition('login_name', $login_name); //相当于like
        }
//        $criteria->condition = "disabled = 'false'";
//        $criteria->order = 'ordernum DESC,brand_id ASC';

        // 求总的记录数
        $count            = self::model()->count($criteria);
        $criteria->limit  = $pagesize;
        $criteria->offset = ($pageIndex - 1) * $pagesize;
        $list             = self::model()->findAll($criteria);

        return array('item' => $list, 'count' => $count);
    }
}
