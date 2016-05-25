<?php
$this->widget('ext.yii-easyui.widgets.EuiTree', array('id' => "tvRightTree", 'url' => Yii::app()->createUrl("sys/Role/CreateRightTree&id=$roleId")));
?>
<script>
    $(document).ready(function () {
        $("#tvRightTree").tree({ checkbox: true, cascadeCheck: false,
            onClick: function (node) {
                // alert(node.id);
                var treeC = $(this);
                if (node.checked) {
                    treeC.tree("uncheck", node.target);
                }
                else {
                    treeC.tree("check", node.target);
                }
            },
            onCheck: function (node, checked) {
                var treeC = $(this);
                if (checked) {
                    var parentNode = treeC.tree("getParent", node.target);
                    if (parentNode != null) { treeC.tree("check", parentNode.target); }
                }
                else {

                }
            }

        });
    });
</script>