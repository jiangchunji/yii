<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 15-10-16
 * Time: 下午2:37
 */
class BaseModel extends CActiveRecord
{
    public function  executeSqlWithSearch($sql, $queryParam = array(), $order = null, $limit = array())
    {
        $where = '';
        //根据条件拼接sql
        if ($queryParam) {
            $where = ' where ';
            foreach ($queryParam as $val) {
                switch ($val[1]) {
                    case 'equal':
                        $where .= $val[0] . ' = ' . $val[2] . ' ';
                        break;
                    case 'in':
                        $where .= $val[0] . ' in ' . $val[2] . ' ';
                        break;
                    case 'notin':
                        $where .= $val[0] . ' not in ' . $val[2] . ' ';
                        break;
                    case 'or':
                        $where .= $val[0] . ' or ' . $val[2] . ' ';
                        break;
                    case 'like':
                        $where .= $val[0] . ' like %' . $val[2] . '% ';
                        break;
                    case 'between':
                        $rang = explode(',', $val[2]);
                        $where .= $val[0] . ' between ' . $rang[0] . ' and' . $rang[1] . ' ';
                        break;
                }
            }
        }
        if ($where) $sql .= $where;
        if ($order) $sql .= ' order by ' . $order;
        if ($limit) $sql .= ' LIMIT ' . $limit[1] . ' OFFSET ' . $limit[0];
        $connection = Yii::app()->db;
        $command    = $connection->createCommand($sql);
        $result     = $command->queryAll();

        return $result;
    }

    public function executeSql($sql, $param = null)
    {
        $db = Yii::app()->db;
        if ($param) {
            $command = $db->createCommand($sql);
            foreach($param as $index=>&$val){
                $type=gettype($val);
                switch($type){
                    case 'integer':
                        $command->bindParam($index, $val, PDO::PARAM_INT);
                        break;
                    case 'string':
                        $command->bindParam($index, $val, PDO::PARAM_STR);
                        break;
                }
            }
            return $result = $command->queryAll();

        } else {
            return $db->createCommand($sql)->queryAll();
        }
    }

    public function test()
    {
        return 'a';
    }
}