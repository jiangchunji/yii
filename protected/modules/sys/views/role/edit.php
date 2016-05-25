<?php $form = $this->beginWidget('CActiveForm'); ?>
    <table class="edittable">
        <tr>
            <td class="editor-label" style="width: 10%">
                角色名称
            </td>
            <td class="editor-field" style="width: 90%">
                <?php
                echo $form->hiddenField($model, 'id');
                $this->widget('ext.yii-easyui.widgets.EuiValidateBox', array(
                    'required'      => true,
                    'name'          => 'Role[name]',
                    'enabled_state' => 6
                ));
                ?>
            </td>

            <td class="editor-label">
                上级角色
            </td>
            <td class="editor-field">
                <?php
                $this->widget('ext.yii-easyui.widgets.EuiComboTree', array(
                    'name'          => 'Role[parent_key]',
                    'enabled_state' => 6,
                    'url'           => Yii::app()->createUrl("sys/Role/CreateTree"),
                    'disabled'      => true
                ));
                ?>
            </td>
        </tr>
        <tr>
            <td class="editor-label">
                是否有效：
            </td>
            <td class="editor-field">
<!--                --><?php //echo $form->radioButtonList($model, 'enable', array('1' => '有效', '0' => '无效',), array('template' => '<span class="radio">{input}{label}</span>', 'separator' => '', 'enabled_state' => 6)) ?>
                <?php echo CHtml::radioButtonList('Role[enable]','1',array('1' => '有效', '0' => '无效',),array('separator'=>'','enabled_state' => 6)) ?>
            </td>

            <!--        下拉框-->
            <!--        <tr>-->
            <!--            <td class="editor-label">-->
            <!--                是否有效：-->
            <!--            </td>-->
            <!--            <td class="editor-field">-->
            <!--                --><?php //echo $form->dropDownList($model,'enable',array('0'=>'无效','1'=>'有效'),array('style'=>'width:175px;'))?>
            <!--            </td>-->
            <!--        </tr>-->


            <td class="editor-label">
                备注：
            </td>
            <td class="editor-field">
                <?php
                $this->widget('ext.yii-easyui.widgets.EuiValidateBox', array(
                    'name'          => 'Role[memo]',
                    'enabled_state' => 6
                ));
                ?>
            </td>
        </tr>

    </table>
<?php $this->endWidget(); ?>