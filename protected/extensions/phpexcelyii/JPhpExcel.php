<?php

/**
 * JPhpExcel class file.
 *
 * @author jerry2801 <jerry2801@gmail.com>
 * @version alpha1
 *
 * A typical usage of JPhpExcel is as follows:
 * <pre>
 *
 * $data = array(
 *     1 => array ('Name', 'Surname'),
 *     array('Schwarz', 'Oliver'),
 *     array('Test', 'Peter')
 * );
 *
 * Yii::import('application.extensions.phpexcel.JPhpExcel');
 * $xls = new JPhpExcel('UTF-8', false, 'My Test Sheet');
 * $xls->addArray($data);
 * $xls->generateXML('my-test');
 * </pre>
 */

require_once dirname(__FILE__).DIRECTORY_SEPARATOR.'php-excel.class.php';

class JPhpExcel extends Excel_XML
{
}