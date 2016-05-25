<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 15-10-28
 * Time: 上午10:54
 */
class Helper
{
    /*二维数组的树状结构*/
    static public function list_to_tree($list, $pk = 'id', $pid = 'pid', $child = '_child', $root = 0)
    {
        // 创建Tree
        $tree = array();
        if (is_array($list)) {
            // 创建基于主键的数组引用
            $refer = array();
            foreach ($list as $key => $data) {
                $refer[$data[$pk]] =& $list[$key];
            }
            foreach ($list as $key => $data) {
                // 判断是否存在parent
                $parentId = $data[$pid];
                if ($root == $parentId) {
                    $tree[] =& $list[$key];
                } else {
                    if (isset($refer[$parentId])) {
                        $parent           =& $refer[$parentId];
                        $parent[$child][] =& $list[$key];
                    }
                }
            }
        }
        return $tree;
    }

    static public function  exportExcelYII($data,$table_name='info')
    {
        Yii::import('ext.phpexcelyii.JPhpExcel');
        $xls = new JPhpExcel('UTF-8', false, 'sheet1');
        $xls->addArray($data);
        $xls->generateXML($table_name);
    }

    static public function exportExcel($data){
        Yii::$enableIncludePath = false;
        Yii::import('ext.PHPExcel.PHPExcel', 1);
        $objPHPExcel = new PHPExcel();

        $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A1', "id")
            ->setCellValue('B1', "login_name")
            ->setCellValue('C1', "password");

        foreach ($data as $index => $val) {
            $index = $index + 2;
            $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $index, $val["id"])
                ->setCellValue('B' . $index, $val["login_name"])
                ->setCellValue('C' . $index, $val["password"]);
        }

// Rename worksheet
        $objPHPExcel->getActiveSheet()->setTitle('导出测试数据');
// Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);
// Redirect output to a client’s web browser (Excel5)
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="导出测试数据.xls"');
        header('Cache-Control: max-age=0');
// If you're serving to IE 9, then the following may be needed
        header('Cache-Control: max-age=1');
// If you're serving to IE over SSL, then the following may be needed
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
        header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
        header('Pragma: public'); // HTTP/1.0

        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save('php://output');

    }

    static public function checkBtnAu($code)
    {
        $sql    = "select * from system_role_right t1 inner join system_role t2 on t1.role_id=t2.id inner join system_login_user t3 on t2.id=t3.role_id and t3.id=".Yii::app()->session['loginInfo']['id']." where t1.au_id=" . $code;
        $db     = Yii::app()->db;
        $result = $db->createCommand($sql)->queryAll();
        return count($result) > 0 ? true : false;
    }
}