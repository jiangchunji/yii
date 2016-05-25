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
                    'name'     => 'LoginUser[login_name]'
                ));
                ?>
            </td>

        </tr>
        <tr>
            <td class="editor-label" style="width: 10%">
                角色
            </td>
            <td class="editor-field" style="width: 90%">
                <?php
                $this->widget('ext.yii-easyui.widgets.EuiComboTree', array(
                    'name'          => 'LoginUser[role_id]',
                    'enabled_state' => 6,
                    'url'           => Yii::app()->createUrl("sys/Role/CreateTree"),

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
                    'name'     => 'LoginUser[nice_name]'
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
                    'name'     => 'LoginUser[effective_date]',
                    'validtype'=>'date',
                    'isValidate'=>'true',
                    'width'=>'200px;'
                ));
               ?>
            </td>
        </tr>
<!--        单选-->
        <tr>
            <td class="editor-label">
                是否有效：
            </td>
            <td class="editor-field">
                <?php echo $form->radioButtonList($model,'enable',array('1'=>'有效','0'=>'无效',),array('template'=>'<span class="radio">{input}{label}</span>','separator'=>''))?>
            </td>
        </tr>
<!--        下拉框-->
<!--        <tr>-->
<!--            <td class="editor-label">-->
<!--                是否有效：-->
<!--            </td>-->
<!--            <td class="editor-field">-->
<!--                --><?php //echo $form->dropDownList($model,'enable',array('0'=>'无效','1'=>'有效'),array('style'=>'width:175px;'))?>
<!--            </td>-->
<!--        </tr>-->

        <tr>
            <td class="editor-label">
                备注：
            </td>
            <td class="editor-field">
                <?php
                $this->widget('ext.yii-easyui.widgets.EuiValidateBox', array(
                    'required' => true,
                    'name'     => 'LoginUser[memo]'
                ));
                ?>
            </td>
        </tr>

        <tr>
            <td class="editor-label">
                照片：
            </td>
            <td class="editor-field">
                <input id="pic" type="file" multiple="false">
                <img id="imgPic" style="width: 20px;height: 20px">
            </td>

        </tr>

    </table>
<?php $this->endWidget(); ?>

<script>
    $('#pic').uploadify({
        'formData'     : {
            'timestamp' : '<?php echo time();?>',
            'token'     : '<?php echo md5('unique_salt' . time());?>'
        },
        'swf'      : '<?php echo Yii::app()->request->baseUrl; ?>'+'/js/uploadify/uploadify.swf',
        'uploader' : '<?php echo Yii::app()->request->baseUrl; ?>'+'/js/uploadify/uploadify.php',
        onUploadSuccess: function (file,filename,response) {
            if(response){
                debugger;
//                var div='<div id="div'+pic_index+'"></div>'
                var imgurl='<?php echo Yii::app()->request->baseUrl; ?>'+'/upload/' + filename;
                $("#imgPic").attr("src",imgurl);
//                var a='<a target="_Blank" href="'+imgurl+'" >'+imgurl+'</a>';
//                var input='<input type="hidden" name="pic_urls['+pic_index+'][]" value="'+imgurl+'">'
//                var del='<a onclick="deletePic(this)" style="cursor: pointer" data-id="'+pic_index+'">删除</a>'
//                $("#divUrlsCourseAdd").append($(div).append(a).append(input).append(del).append("<br><br>"));

//							$('#course_pic_add_music_url').attr('href','uploads/pics/' + filename).text('uploads/pics/' + filename);
//							$('#music_music_add_dialog_form_music_url').val('uploads/pics/' + filename);
//                pic_index++;
            }else{
                $.Alert('提示信息', '图片上传失败', 'info');
            }
        }
    });
</script>