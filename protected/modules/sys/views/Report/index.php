<?php

/*
* author:xudafeng@126.com
* blog:http://www.xdf.me
* date:2012.7.28
*/

class danteng
{
    function init($col1_name, $col2_name, $col3_name, $time_unit)
    {
        echo "<table border=1><tr><th>" . $col1_name . "</th><th>" . $col2_name . "</th><th colspan=\"" . $time_unit . "\">" . $col3_name . "</th></tr>";
    }

    function baobiao_danteng($name, $time_unit, $pro_name, $pre_name)
    {
        echo "<tr><th rowspan=\"" . count($pro_name) . "\">$name</th><td>" . $pro_name[0] . "</td>";
        for ($i = 0; $i < $time_unit; $i++) {
            echo "<td>" . $pre_name . $i . "";
        }
        echo "</tr>";
        for ($j = 0; $j < (count($pro_name) - 1); $j++) {
            echo "<tr><td>" . $pro_name[($j + 1)] . "</td>";
            for ($i = 0; $i < $time_unit; $i++) {
                echo "<td>" . $pre_name . $i . "";
            }
            echo "";
        }
    }

    function finish()
    {
        echo "";
    }
}

?>

<?php
$init = new danteng();
$time_num=3;
$init->init('类型', '项目', '时间单元', 1);
$init->baobiao_danteng('伏羲', $time_num, 1, 'pre_n');
$init->baobiao_danteng('女娲', $time_num, 1, '单元');
$init->baobiao_danteng('盘古', $time_num, 1, '啊');
$init->baobiao_danteng('小冶', $time_num, 1, '蛋子');
$init->finish();
?>