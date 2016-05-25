<?php
Yii::import('ext.yii-easyui.web.EuiController');

class StudentController extends EuiController
{

    /**
     * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
     * using two-column layout. See 'protected/views/layouts/column2.php'.
     */
    public $layout = '//layouts/column2';

    /**
     * @return array action filters
     */
    public function filters()
    {
        return array(
            'accessControl', // perform access control for CRUD operations
            'postOnly + delete', // we only allow deletion via POST request
        );
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules()
    {
        return array(
            array('allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('index', 'view'),
                'users'   => array('*'),
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('create', 'update'),
                'users'   => array('@'),
            ),
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('admin', 'delete'),
                'users'   => array('admin'),
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    /**
     * Displays a particular model.
     * @param integer $id the ID of the model to be displayed
     */
    public function actionView($id)
    {
        $this->render('view', array(
            'model' => $this->loadModel($id),
        ));
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreate()
    {
        $model = new Student;

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['Student'])) {
            $model->attributes = $_POST['Student'];
            if ($model->save())
                $this->redirect(array('view', 'id' => $model->Id));
        }

        $this->render('create', array(
            'model' => $model,
        ));
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id)
    {
        $model = $this->loadModel($id);

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['Student'])) {
            $model->attributes = $_POST['Student'];
            if ($model->save())
                $this->redirect(array('view', 'id' => $model->Id));
        }

        $this->render('update', array(
            'model' => $model,
        ));
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id)
    {
        $this->loadModel($id)->delete();

        // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
        if (!isset($_GET['ajax']))
            $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
    }

    /**
     * Lists all models.
     */
    public function actionIndex()
    {
        $this->renderPartial('index');
//		$dataProvider=new CActiveDataProvider('Student');
//		$this->render('index',array(
//			'dataProvider'=>$dataProvider,
//		));
    }

    /**
     * Manages all models.
     */
    public function actionAdmin()
    {
        $model = new Student('search');
        $model->unsetAttributes(); // clear any default values
        if (isset($_GET['Student']))
            $model->attributes = $_GET['Student'];

        $this->render('admin', array(
            'model' => $model,
        ));
    }


    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return Student the loaded model
     * @throws CHttpException
     */
    public function loadModel($id)
    {
        $model = Student::model()->findByPk($id);
        if ($model === null)
            throw new CHttpException(404, 'The requested page does not exist.');
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param Student $model the model to be validated
     */
    protected function performAjaxValidation($model)
    {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'student-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }


    public function  actionGetData()
    {
        $rs    = Student::model()->findAll();


        $connection=Yii::app()->db;
        //事务操作
        $transaction = $connection->beginTransaction();
        try {
            $sql="delete from tbl_student where id=4";
            $command= $connection->createCommand($sql);
            $command->execute();

            $sql="323";
            $command= $connection->createCommand($sql);
            $command->execute();
            $transaction->commit(); //提交事务会真正的执行数据库操作
        } catch (Exception $e) {
            $transaction->rollback(); //如果操作失败, 数据回滚
        }
        return;



//        1.多表连接查询
//        $student          = new Student();
//        $criteria         = new CDbCriteria();
//        $criteria->select = 't.*,t1.chinese'; //需要在student实体类上添加chinese属性
//        $criteria->join   = 'left join {{student_score}} t1 on (t.id=t1.student_id) ';
//
////        $criteria->addCondition('t.id=:id');
////        $criteria->params = array(':id' => 2);
////        $criteria->addCondition('t.name=:name');
////        $criteria->params = array(':id' => 2, ':name' => 'test');
//        $result = Student::model()->findAll($criteria);
//        echo(CJSON::encode($result->toArray()));
//        foreach ($result as $v) {
//            $resul=$v['chinese'];
//        }
//        return;
//        2.直接执行sql
        $db = Yii::app()->db;
//        $name="a' or '1'='1";
        $name="a";
//        $sql="select * from tbl_student where name='".$name."'";
        $sql="select * from tbl_student where name=:name";
//
        $command= $db->createCommand($sql);
        $command->bindParam(":name",$name,PDO::PARAM_STR);
        $result =  $command->queryAll();
        echo(CJSON::encode($result));
return;
//        $name="a' or '1'='1";
//        测试sql注入
//        $name="a";
//        $student=new Student();
//        $result = Student::model()->findAll('name=:name',array(':name'=>$name));


//return;
//        $name="a' or '1'='1";
//        $sql="SELECT * FROM `tbl_student` `t` WHERE name=:name";
//        $connection = Yii::app()->db;
//        $command = $connection->createCommand($sql);
//        $result  = $command->query(array(':name'=>'test'));

//        $db = Yii::app()->db;
//        $sql = "select * from tbl_student t1 left join tbl_student_score t2 on t1.id=t2.student_id where t1.name=:name";
//        $results = $db->createCommand($sql)->query(array(
//            ':name' => 'a',
//        ));
//        $db = Yii::app()->db;
//        $sql = "select * from tbl_student where name=:name";
//        $results = $db->createCommand($sql)->query(array(
//            ':name' => 'a'
//        ));
//        return;
        //错误写法
//      $result = Student::model()->find('name=test');
//        return;
//        $result = Student::model()->find('name=4');
//        $result = Student::model()->find();
//        $model=new Student();
//        $result =$model->findAll();
//
//        print_r($model->findAll());
//        return;

//        执行左链接sql
//        方法一
//        $sql="SELECT t.*,p.chinese FROM `tbl_student` `t` left join tbl_student_score t1 on t.id=t1.student_id left join tbl_book t2 on t1.book_id=t2.id WHERE ((t1.id=1) AND (t1.name=jack)) AND (t2.name=kevin) ORDER BY id LIMIT 10 OFFSET 5";
        $criteria         = new CDbCriteria();
        $criteria->select = 't.*,t1.chinese';
        $criteria->join   = 'left join {{student_score}} t1 on t.id=t1.student_id ';
//        $criteria->join='left join {{student_score}} t1 on t.id=t1.student_id left join {{book}} t2 on t1.book_id=t2.id';
        $criteria->addCondition('t.id=:id');
//        $criteria->params=array(':id'=>2);
        $criteria->addCondition('t.name=:name');
        $criteria->params = array(':id' => 2, ':name' => 'test');
//        $criteria->addCondition('t2.name=kevin');
        $criteria->limit  = 10;
        $criteria->offset = 0;
        $criteria->order  = 'id';
        $result           = Student::model()->findAll($criteria);
        foreach ($result as $v) {
                $resul=$v['chinese'];
       }

        return;
//        方法二
        $student    = new Student();
        $sql        = 'SELECT t.*,p.chinese FROM `tbl_student` `t` left join tbl_student_score t1 on t.id=t1.student_id left join tbl_book t2 on t1.book_id=t2.id';
        $queryParam = array(array('t1.id', 'equal', '1'), array('t2.name', 'equal', 'kevin'));
        $student->ExecuteSql($sql, $queryParam, 'id', array(5, 10));

        return;


        $rs    = Student::model()->findAll();
        $items = array();
        foreach ($rs as $row) {
            $items[] = array(
                'id'   => $row->Id,
                'name' => $row->name,
                '11'   => $row->test
            );
        }
        echo($this->exportData($items, count($items)));

    }
}
