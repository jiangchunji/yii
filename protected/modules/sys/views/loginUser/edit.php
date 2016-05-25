<?php $form = $this->beginWidget('CActiveForm'); ?>
    <table class="edittable">
        <tr>
            <td class="editor-label" style="width: 10%">
                用户名
            </td>
            <td class="editor-field" style="width: 90%">
                <?php
                $this->widget('ext.yii-easyui.widgets.EuiValidateBox', array(
                    'required' => true,
                    'name'     => 'LoginUser[login_name]',
                    'value'=>$model['login_name']
                ));
                ?>
            </td>
        </tr>
        <tr>
            <td class="editor-label">
                昵称
            </td>
            <td class="editor-field">
                <?php
                $this->widget('ext.yii-easyui.widgets.EuiValidateBox', array(
                    'required' => true,
                    'name'     => 'LoginUser[nice_name]',
                    'value'=>$model['nice_name']
                ));
                ?>
            </td>
        </tr>
        <tr>
            <td class="editor-label">
                有效期
            </td>
            <td class="editor-field">
                <?php
                $this->widget('ext.yii-easyui.widgets.EuiDatebox', array(
                    'required' => true,
                    'name'     => 'LoginUser[effective_date]',
                    'value'=>date('Y-m-d',$model['effective_date'])
                ));
                ?>
            </td>
        </tr>
        <tr>
            <td class="editor-label">
                是否有效：
            </td>
            <td class="editor-field">
                <?php echo $form->radioButtonList($model,'enable',array('1'=>'有效','0'=>'无效',),array('template'=>'<span class="radio">{input}{label}</span>','separator'=>''))?>
            </td>
        </tr>
        <tr>
            <td class="editor-label">
                备注：
            </td>
            <td class="editor-field">
                <?php
                $this->widget('ext.yii-easyui.widgets.EuiValidateBox', array(
                    'required' => true,
                    'name'     => 'LoginUser[memo]',
                    'value'=>$model['memo']
                ));
                ?>
            </td>
        </tr>

    </table>
<?php $this->endWidget(); ?>