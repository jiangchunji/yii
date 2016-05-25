/// <reference path="JQuery/jquery-1.8.1.js" />
/// <reference path="EasyUI/jquery.easyui.1.3.1.min.js" />
/// <reference path="jquery.form.3.14.js" />
/// <reference path="zh-CN/script-ui-text-1.0.0.js" />
var PageStatus = { Normal: 1, AddNew: 2, Update: 4, Delete: 8, SelectedRow: 16, SelectedNode: 32, SingleRow: 64 }
jQuery.extend({
    MSG: { Error_Title: "错误", Confirm_Title: "提醒", NoKey_MSG: "操作记录前，必须先选择记录", Delete_Confirm_Msg: "确定要删除已选择的记录？" },
    Button: { Ok: "确定", Cancel: "取消", Save: "保存", SaveContinue: "保存/继续", SelectAll: "全选", UnselectAll: "全不选", SelectChildren: "全选子节点" },
    serializeError: function (error) {
        var msg = "";
        this.each(error, function (key, value) {
            msg = msg + "<br />" + value;
        });
        return msg;
    },
    TimeStamp: function () {
        return new Date().toString();
    },
    ShowProgress: function (options) {
        jQuery.messager.progress(options);
    },
    Alert: function (title, message, type) {
        var msg = message;
        if (jQuery.isArray(message)) {
            msg = sumError.join("<br />");
        }
        else if (typeof (message) === "object") {
            msg = jQuery.serializeError(message);
        }
        jQuery.messager.alert(title, msg, type);
    },
    //添加格式化时间戳和bit类型 by jcj 15-10-23
    formatterTimestamp: function (value, row, index) {
        return new Date(parseInt(value) * 1000).format("yyyy-MM-dd");
    },
    formatterYesOrNo: function (value, row, index) {
        var data = ['否', '是'];
        return data[value]
    },
    AjaxJson: function (url, jsonData, onSuccess) {
        jQuery.ajax({ url: url, type: "POST", data: jsonData, global: false, dataType: "json",
            success: function (data) {
                if (onSuccess) {
                    onSuccess(data)
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var data = jqXHR.responseText;
                var _1da = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
                var _1db = _1da.exec(data);
                if (_1db) {
                    if (onError) {
                        onError(_1db[1]);
                    }
                    jQuery.Alert(_1db[1]);
                } else {
                    if (onError) {
                        onError(data);
                    }
                    jQuery.Alert(data);
                }
            }
        });
    },
    DeleteConfirm: function (callback, p1, p2, p3) {
        jQuery.messager.confirm(jQuery.MSG.Confirm_Title, jQuery.MSG.Delete_Confirm_Msg, function (r) {
            if (r) {
                callback(p1, p2, p3);
            }
        });
    },
    Confirm: function (confirmMessage, callback, p1, p2, p3) {
        jQuery.messager.confirm(jQuery.MSG.Confirm_Title, confirmMessage, function (r) {
            if (r) {
                callback(p1, p2, p3);
            }
        });
    },
    GetDialogPanel: function (panelid) {
        var dialogPanel = $("<div></div>").appendTo(document.body).attr("id", panelid);

        //添加按钮Enter事件
        $(dialogPanel).attr("tabindex", 0);
        $(dialogPanel).focus();
        $(dialogPanel).keydown(function (event) {
            var keyCode;
            var explorer = window.navigator.userAgent;
            if (explorer.indexOf("MSIE") >= 0) {
                keyCode = 13
            }
            else if (explorer.indexOf("Firefox") >= 0) {
                alert("Firefox");
            }
            else if (explorer.indexOf("Chrome") >= 0) {
                keyCode = 13
            }
            if (event.keyCode == keyCode) {
                if ($(dialogPanel).find("#lbtOk").length == 1) {
                    $(dialogPanel).find("#lbtOk").trigger("click")
                }
                else {
                    if ($(dialogPanel).find("#lbtNewSaveContinue").length == 1) {
                        $(dialogPanel).find("#lbtNewSaveContinue").trigger("click");
                    }
                    else {
                        $(dialogPanel).find("#lbtNewSave").trigger("click");
                    }
                }
            }
        });

        dialogPanel.dialog({ closed: true, modal: true, resizable: true, onLoad: function () {
            var opts = $(this).dialog("options");
            $(this).dialog("center");
            $("div.dialog-button a,div.dialog-toolbar a").linkbutton("enable");
        }, onClose: function () {
            $(this).dialog("destroy");
        }
        });
        return dialogPanel;
    },
    OpenWindow: function (url, title, width, height) {
        var opts = { "height": height, "width": width, url: url, title: title, maximizable: true, minimizable: true };
        var topDialog = jQuery.GetDialogPanel("topDialog");
        topDialog.dialog(opts);
        if (opts.url != undefined) {
            topDialog.dialog("open").dialog("refresh", opts.url);
        }
    },
    OpenDialog: function (opts, OkHandler, param) {
        if (opts == undefined || opts.actionUrl == undefined) {
            return;
        }
        var topDialog = jQuery.GetDialogPanel("topDialog");
        if (opts.param != undefined) {
            opts.actionUrl = opts.actionUrl + "&" + $.param(opts.param);
            delete opts.param;
        }
        var options = jQuery.extend({ toolbar: null }, opts);
        if (options.buttons == undefined || options.buttons == null) {
            options.buttons = [];
        }
        options.buttons.push({ id: "lbtOk", iconCls: "icon-ok", plain: true, disabled: true, text: jQuery.Button.Ok,
            handler: function () {
                $('#lbtOk', topDialog).linkbutton('disable');
                if (OkHandler != null || OkHandler != undefined) {
                    OkHandler(topDialog, param);
                }
                else {
                    _AjaxOkForm(topDialog, null, param);
                }
            }
        });
        options.buttons.push({ id: "lbtCancel", iconCls: "icon-cancel", plain: true, disabled: true, text: jQuery.Button.Cancel, handler: function () {
            topDialog.dialog("close");
        }
        });
        if (options.autoHeight) {
            delete options.height;
        }
        topDialog.dialog(options);
        if (options.actionUrl != undefined) {
            topDialog.dialog("open").dialog("refresh", options.actionUrl);
        }
    }, NewDialog: function (opts, OnSuccess) {
        var topDialog = jQuery.GetDialogPanel("topDialog");
//        php生成的url有问题 by jcj 15-10-21
//        if (opts.param != undefined) { opts.actionUrl = opts.actionUrl + "?" + $.param(opts.param); delete opts.param; }
        opts = jQuery.extend({ toolbar: null }, opts);
        if (opts.buttons == undefined || opts.buttons == null) {
            opts.buttons = [];
        }
        opts.buttons.push({ id: "lbtNewSave", iconCls: "icon-save", plain: true, disabled: true, text: jQuery.Button.Save, handler: function () {
            debugger;
            //给需要验证的datebox添加验证
            var validateInput = $("form input[isvalidate='true']", topDialog);
            $.each(validateInput, function (i, input) {
                var dateName=$(this).attr("comboname");
                var markDate = $("input[name='" + dateName + "']").val();
                //这边手动添加验证后会丢掉value值
                $(input).datebox({
                    required: true
                });
                $("input[name='" + dateName + "']").val(markDate);

            });
            if (!$("form", topDialog).form("validate")) {
                return;
            }
            topDialog.panel("loading");
            _AjaxNewForm(topDialog, OnSuccess, opts, false);
        }
        });
        opts.buttons.push({ id: "lbtNewSaveContinue", iconCls: "icon-save", plain: true, disabled: true, text: jQuery.Button.SaveContinue, handler: function () {
            //给需要验证的datebox添加验证
            var validateInput = $("form input[isvalidate='true']", topDialog);
            $.each(validateInput, function (i, input) {
                var dateName=$(this).attr("comboname");
                var markDate = $("input[name='" + dateName + "']").val();
                //这边手动添加验证后会丢掉value值
                $(input).datebox({
                    required: true
                });
                $("input[name='" + dateName + "']").val(markDate);

            });
            if (!$("form", topDialog).form("validate")) {
                return;
            }


            //添加一个控件让其获取焦点
//		    $("form", topDialog).append("<input id=\"txtFocus\" type=\"text\">");
//		    $("form input[id='txtFocus']", topDialog).focus();
            //给需要验证的datebox添加验证
            var validateInput = $("form input[isvalidate='true']", topDialog);
            $.each(validateInput, function (i, input) {
                var dateName=$(this).attr("comboname");
                var markDate = $("input[name='" + dateName + "']").val();

                //这边手动添加验证后会丢掉value值
                $(input).datebox({
                    required: true
                });
                $("input[name='" + dateName + "']").val(markDate);

            });

            _AjaxNewForm(topDialog, OnSuccess, opts, true);
        }
        });
        opts.buttons.push({ id: "lbtNewCancel", iconCls: "icon-cancel", plain: true, disabled: true, text: jQuery.Button.Cancel, handler: function () {
            topDialog.dialog("close");
        }
        });
        if (opts.height) {
            delete opts.height;
        }
        topDialog.dialog(opts);
        if (opts.actionUrl != undefined) {
            topDialog.dialog("open").dialog("refresh", opts.actionUrl);
        }
    }, UpdateDialog: function (opts, OnSuccess) {
        var topDialog = jQuery.GetDialogPanel("topDialog");
        opts = $.extend({ toolbar: null }, opts);
        topDialog.data("CurrentIndex", 0);
        var keyArray = opts.Keys;
        if (typeof (keyArray) != "undefined" && jQuery.isArray(keyArray) && keyArray.length >= 1) {
            if (opts.buttons == undefined || opts.buttons == null) {
                opts.buttons = [];
            }
            opts.buttons.push({ id: "lbtEditSave", iconCls: "icon-save", plain: true, disabled: true, text: jQuery.Button.Save, handler: function () {
                if (!$("form", topDialog).form("validate")) {
                    return;
                }
                topDialog.panel("loading");

                _AjaxEditForm(topDialog, OnSuccess, opts, false);
            }
            });
            if (keyArray.length >= 2) {
                opts.buttons.push({ id: "lbtEditSaveContinue", iconCls: "icon-save", plain: true, disabled: true, text: jQuery.Button.SaveContinue, handler: function () {
                    if (!$("form", topDialog).form("validate")) {
                        return;
                    }
                    topDialog.panel("loading");
                    _AjaxEditForm(topDialog, OnSuccess, opts, true);
                }
                });
            }
            opts.buttons.push({ id: "lbtEditCancel", iconCls: "icon-cancel", plain: true, disabled: true, text: jQuery.Button.Cancel, handler: function () {
                topDialog.dialog("close");
            }
            });
            if (opts.height) {
                delete opts.height;
            }
            topDialog.dialog(opts);
            if (typeof (opts.actionUrl) != "undefined") {
                topDialog.dialog("open").dialog("refresh", opts.actionUrl + "&" + $.param(keyArray[0]));
            }
        }
        /*end if (typeof (options.IDArray) != "undefined" && jQuery.isArray(options.IDArray))*/
    }, OpenSelectEmployee: function (opts) {
        var topDialog = jQuery.GetDialogPanel("selectEmployeeDialog");
        var options = jQuery.extend({ toolbar: null }, opts);
        topDialog.dialog(options);
        if (options.actionUrl != undefined) {
            topDialog.dialog("open").dialog("refresh", options.actionUrl);
        }
    },
    //合并行
    MergeCellsByField: function (tableID, colList) {
        var ColArray = colList.split(",");
        var tTable = $('#' + tableID);
        var TableRowCnts = tTable.datagrid("getRows").length;
        var tmpA;
        var tmpB;
        var PerTxt = "";
        var CurTxt = "";
        var alertStr = "";
        for (j = ColArray.length - 1; j >= 0; j--) {
            PerTxt = "";
            tmpA = 1;
            tmpB = 0;
            for (i = 0; i <= TableRowCnts; i++) {
                if (i == TableRowCnts) {
                    CurTxt = "";
                }
                else {
                    CurTxt = tTable.datagrid("getRows")[i][ColArray[0]];
                }
                if (PerTxt == CurTxt) {
                    tmpA += 1;
                }
                else {
                    tmpB += tmpA;
                    tTable.datagrid('mergeCells', {
                        index: i - tmpA,
                        field: ColArray[j],
                        rowspan: tmpA,
                        colspan: null
                    });
                    tmpA = 1;
                }
                PerTxt = CurTxt;
            }
        }
    }
});
jQuery.extend(jQuery.fn.datagrid.defaults, { tsField: null, opkField: null, initialization: true, allowExport: true,
    onLoadSuccess: function (data) {
        var jqGrid = $(this);
        var opts = jqGrid.datagrid("options");
        if (data.total > 0 && opts.pagination && opts.allowExport) {
            var pager = jqGrid.datagrid("getPager");
            pager.pagination({ buttons: [
                //
//                { iconCls: 'icon-xlsx', handler: function () {
//                    return jqGrid.datagrid("exportGrid", 3);
//                } },
                { iconCls: 'icon-xls', handler: function () {
                    return jqGrid.datagrid("exportGrid", 2);
                } }
            ]
            });
        }
        else if (data.total == 0 && opts.pagination) {
            var pager = jqGrid.datagrid("getPager");
            pager.pagination({ buttons: null });
        }
    },
    onLoadError: function (error, p2, p3) {
        if (typeof (error.responseText) != "undefined") {
            jQuery.Alert(error.responseText);
        }
    },
    onSelect: function (rowIndex, rowData) {
        var opts = $(this).datagrid("options");
        if (opts.toolbar == null) {
            return true;
        }
        var rows = $(this).datagrid("getSelections");
        if (rows.length == 0) {
            $("a[enabled_state]", opts.toolbar).enabled(PageStatus.Normal);
            return true;
        }
        else if (rows.length == 1) {
            $("a[enabled_state]", opts.toolbar).enabledGridRow(PageStatus.SingleRow);
        }
        else {
            $("a[enabled_state]", opts.toolbar).enabledGridRow(PageStatus.SelectedRow);
        }
    },
    onUnselect: function (rowIndex, rowData) {

        var opts = $(this).datagrid("options");
        if (opts.toolbar == null) {
            return true;
        }
        var rows = $(this).datagrid("getSelections");
        if (rows.length == 0) {
            $("a[enabled_state]", opts.toolbar).enabled(PageStatus.Normal);
            return true;
        }
        else if (rows.length == 1) {
            $("a[enabled_state]", opts.toolbar).enabledGridRow(PageStatus.SingleRow);
        }
        else {
            $("a[enabled_state]", opts.toolbar).enabledGridRow(PageStatus.SelectedRow);
        }
    },
    onSelectAll: function (rowIndex, rowData) {

        var opts = $(this).datagrid("options");
        if (opts.toolbar == null) {
            return true;
        }
        var rows = $(this).datagrid("getSelections");
        if (rows.length == 0) {
            $("a[enabled_state]", opts.toolbar).enabled(PageStatus.Normal);
        }
        else if (rows.length == 1) {
            $("a[enabled_state]", opts.toolbar).enabledGridRow(PageStatus.SingleRow);
        }
        else {
            $("a[enabled_state]", opts.toolbar).enabledGridRow(PageStatus.SelectedRow);
        }
    },
    onUnselectAll: function (rowIndex, rowData) {

        var opts = $(this).datagrid("options");
        if (opts.toolbar == null) {
            return true;
        }
        $("a[enabled_state]", opts.toolbar).enabled(PageStatus.Normal);
    }
});
jQuery.extend(jQuery.fn.datagrid.methods, {
    exportGrid: function (jqGrid, type) {
        var export_form = jQuery.data(jqGrid, "export_form");
        if (!export_form) {
            export_form = $("<form style='display:none;' method='post'></form>").insertAfter(jqGrid);
            export_form.attr("method", "post");
            jQuery.data(document.body, "export_form", export_form);
            $("<input type='hidden' id='PageSize' name='PageSize' value='0' />").appendTo(export_form);
            $("<input type='hidden' id='PageIndex' name='PageIndex' value='0' />").appendTo(export_form);
        }
        var opts = jqGrid.datagrid("options");
        var pagerOpts = jqGrid.datagrid("getPager").pagination("options");
        var jsonData = jQuery.extend({ "ExportMode": type }, opts.queryParams, { "TotalCount": pagerOpts.total });
        var exportUrl = opts.url + "&" + jQuery.param(jsonData);
        export_form.attr("action", exportUrl).submit();
        return false;
    }, loadClientData: function (jqGrid, param) {
        var data = jQuery.extend({ total: 0, rows: [], Success: true, Error: null }, param);
        jqGrid.datagrid("clearSelections");
        if (data.Success) {
            jqGrid.datagrid("loadData", data);
        } else {
            jQuery.Alert(data.Error);
        }
        jqGrid.datagrid("loaded");
    }, searchData: function (jqGrid, param) {
        if (param.url != undefined)
            jqGrid.datagrid("options").url = param.url;
        jqGrid.datagrid("options").initialization = true;
        jqGrid.datagrid("clearSelections");
        jqGrid.datagrid("loadData", { total: 0, rows: [] });
        jqGrid.datagrid("load", param);
    }, getDeleteKeys: function (jqGrid) {
        var rows = jqGrid.datagrid("getSelections");
        var opts = jqGrid.datagrid("options");
        var jsonData = jQuery.extend({}, opts.queryParams);
        if (opts.pagination) {
            jQuery.extend(jsonData, { PageIndex: opts.pageNumber, PageSize: opts.pageSize });
        }
        if (opts.sortName) {
            jQuery.extend(jsonData, { SortField: opts.sortName, SortOrder: opts.sortOrder });
        }
        if (rows != null && rows.length > 0) {
//            $.each(rows, function (index, value) {
//                if (opts.idField != null) {
//                    jsonData["entityArray[" + index + "]['" + opts.idField+"']"] = value[opts.idField];
//                }
//                if (opts.tsField != null) {
//                    jsonData["entityArray[" + index + "]['" + opts.tsField+"']"] = value[opts.tsField];
//                }
//                if (opts.opkField != null) {
//                    if ($.isArray(opts.opkField)) {
//                        $.each(opts.opkField, function (ai, av) {
//                            jsonData["entityArray[" + index + "]['" + av+"']"] = value[av];
//                        })
//                    }
//                    else if (typeof (opts.opkField) === "string") {
//                        jsonData["entityArray[" + index + "]['" + opts.opkField+"']"] = value[opts.opkField];
//                    }
//                }
//            });
            //修改删除方法 by jcj 15-10-23
            $.each(rows, function (index, value) {
                if (opts.idField != null) {
                    jsonData["ids[" + index + "]"] = value[opts.idField];
                }
                if (opts.tsField != null) {
                    jsonData["ids[" + index + "]"]= value[opts.tsField];
                }
                if (opts.opkField != null) {
                    if ($.isArray(opts.opkField)) {
                        $.each(opts.opkField, function (ai, av) {
                            jsonData["ids[" + index + "]"] = value[av];
                        })
                    }
                    else if (typeof (opts.opkField) === "string") {
                        jsonData["ids[" + index + "]"] = value[opts.opkField];
                    }
                }
            });
        }
        /*end if (rows != null && rows.length > 0)*/
        return jsonData;
    }, getUpdateKeys: function (jqGrid) {
        var rows = jqGrid.datagrid("getSelections");
        var opts = jqGrid.datagrid("options");
        var jsonData = {}
        if (rows != null && rows.length > 0) {
            jsonData.Keys = new Array();
            $.each(rows, function (index, value) {
                jsonData.Keys[index] = jQuery.extend({}, opts.queryParams);
                if (opts.pagination) {
                    jQuery.extend(jsonData.Keys[index], { PageIndex: opts.pageNumber, PageSize: opts.pageSize });
                }
                if (opts.sortName) {
                    jQuery.extend(jsonData.Keys[index], { SortField: opts.sortName, SortOrder: opts.sortOrder });
                }
                if (opts.idField != null) {
                    jsonData.Keys[index][opts.idField] = value[opts.idField];
                }
                if (opts.tsField != null) {
                    jsonData.Keys[index][opts.tsField] = value[opts.tsField];
                }
                if (opts.opkField != null) {
                    if ($.isArray(opts.opkField)) {
                        $.each(opts.opkField, function (ai, av) {
                            jsonData.Keys[index][av] = value[av];
                        })
                    }
                    else if (typeof (opts.opkField) === "string") {
                        jsonData.Keys[index][opts.opkField] = value[opts.opkField];
                    }
                }
            });
        }
        /*end if (rows != null && rows.length > 0)*/
        return jsonData;
    }, getSelectedKey: function (jqGrid) {
        var row = jqGrid.datagrid("getSelected");
        var opts = jqGrid.datagrid("options");
        var jsonData = jQuery.extend({}, opts.queryParams);
        if (row == undefined || row == null)
            return null;
        if (opts.pagination) {
            jQuery.extend(jsonData, { PageIndex: opts.pageNumber, PageSize: opts.pageSize });
        }
        if (opts.sortName) {
            jQuery.extend(jsonData, { SortField: opts.sortName, SortOrder: opts.sortOrder });
        }
        if (opts.idField != null) {
            jsonData[opts.idField] = row[opts.idField];
        }
        if (opts.tsField != null) {
            jsonData[opts.tsField] = row[opts.tsField];
        }
        if (opts.opkField != null) {
            if ($.isArray(opts.opkField)) {
                $.each(opts.opkField, function (ai, av) {
                    jsonData[av] = row[av];
                })
            }
            else if (typeof (opts.opkField) === "string") {
                jsonData[opts.opkField] = row[opts.opkField];
            }
        }
        return jsonData;
    }
});

jQuery.fn.extend({/*扩展JQuery标准函数库*/
    waterMark: function () {
        $(this).each(function (index) {
            var inputCtrl = $(this);
            var inputId = inputCtrl.attr("id");
            var labelCtrl = $("label[for='" + inputId + "']");
            if (inputCtrl.val() != "") {
                labelCtrl.hide();
            }
            inputCtrl.focus(function () {
                labelCtrl.hide();
            });
            inputCtrl.blur(function () {
                if (inputCtrl.val() != "") {
                    labelCtrl.hide();
                } else {
                    labelCtrl.show();
                }
            });
        });
    }, serializeObject: function () {
        debugger;
        var json = {};
        var arrayValue = {};
        var elementArray = this.serializeArray();
        jQuery.each(elementArray, function (index, keyValue) {
            if (json[keyValue.name]) {/*如果目标对象中已经存在属性则创建数据返回*/
                json[keyValue.name + "[0]"] = json[keyValue.name];
                json[keyValue.name + "[1]"] = keyValue.value || null;
                arrayValue[keyValue.name] = 2;
                delete json[keyValue.name];
            }
            else if (arrayValue[keyValue.name]) {
                json[keyValue.name + "[" + arrayValue[keyValue.name] + "]"] = keyValue.value || null;
                arrayValue[keyValue.name]++;
            }
            else {
                json[keyValue.name] = keyValue.value || null;
            }
        });
        return json;
    }, serializeMvcObject: function () {
        var json = {};
        var a = this.serializeArray();
        jQuery.each(a, function () {
            if (json[this.name]) {
                if (!json[this.name].push) {
                    json[this.name] = [json[this.name]];
                }
                json[this.name].push(this.value || '');
            }
            else {
                json[this.name] = this.value || '';
            }
        });
        return json;
    }, visible: function (state) {
        $(this).each(function (index) {
            if ($(this).attr("visibled_state") != undefined) {
                var visState = parseInt($(this).attr("visibled_state"), 10) & state;
                if ($(this).attr("easyuitype") == "combotree") {
                    $(this).combotree(visState > 0 ? "enable" : "disable");
                }
                else if ($(this).attr("easyuitype") == "numberspinner") {
                    $(this).numberspinner(visState > 0 ? "enable" : "disable");
                }
                else {
                    $(this).css("display", visState > 0 ? "inline-block" : "none")
                }
            }
        });
    }, enabled: function (state) {
        if (state === undefined) {
            state = 1;
        }
        this.each(function (index) {
            if ($(this).attr("enabled_state") != undefined) {
                var enState = parseInt($(this).attr("enabled_state"), 10) & state;
                if ($(this).attr("easyuitype") == "combotree") {
                    $(this).combotree(enState > 0 ? "enable" : "disable");
                }
                else if ($(this).attr("easyuitype") == "numberbox") {
                    $(this).numberbox(enState > 0 ? "enable" : "disable");
                }
                else if ($(this).attr("easyuitype") == "datebox") {
                    $(this).datebox(enState > 0 ? "enable" : "disable");
                }
                else if ($(this).attr("easyuitype") == "numberspinner") {
                    $(this).numberspinner(enState > 0 ? "enable" : "disable");
                }
                else if ($(this).attr("easyuitype") == "timebox") {
                    $(this).timebox(enState > 0 ? "enable" : "disable");
                }
                else if ($(this).attr("easyuitype") == "linkbutton") {
                    $(this).linkbutton(enState > 0 ? "enable" : "disable");
                }
                else if ($(this).attr("easyuitype") == "splitbutton") {
                    $(this).splitbutton(enState > 0 ? "enable" : "disable");
                }
                else {
                    this.disabled = enState === 0;
                }
            }
        });
    }, enabledGridRow: function (state) {
        this.each(function (idnex) {
            if ($(this).attr("enabled_state") != undefined) {
                //选择单行
                if (state == 64) {
                    if ($(this).attr("enabled_state") == 80 || $(this).attr("enabled_state") == 16) $(this).linkbutton("enable");
                }
                //多行
                else {
                    if ($(this).attr("enabled_state") == 80) $(this).linkbutton("disable");
                    if ($(this).attr("enabled_state") == 16) $(this).linkbutton("enable");
                }
            }
        })
    },
    setFormValue: function (entity) {
        $(this).each(function (index) {
            var ctrl = $(this);
            var name = ctrl.attr("name");
            if (name == "" || name == undefined) {
                name = ctrl.attr("id");
            }
            if (name != undefined && name != "") {
                if(ctrl.attr("easyuitype") == "combotree"){
                    name=ctrl.attr("comboname");
                }
                name=name.substr(name.indexOf('[')+1);
                name=name.substr(0,name.length-1);

                if (ctrl.attr("easyuitype") == "combotree") {
                    ctrl.combotree("setValue", entity[name]);
                }
                else if (ctrl.attr("type") == "radio") {
                    ctrl.attr('checked', ctrl.attr("value") == entity[name]);
                }
                else if (ctrl.attr("type") == "checkbox") {
                    ctrl.attr('checked', ctrl.attr("value") == entity[name]);
                }
                else {
                    ctrl.val(entity[name]);
                }
            }
        });
    }, setFieldValue: function (value) {
        var ctrl = $(this);
        var name = ctrl.attr("name");
        if (name == "" || name == undefined) {
            name = ctrl.attr("id");
        }
        if (name != undefined && name != "") {
            if (ctrl.attr("easyuitype") == "combotree") {
                ctrl.combotree("setValue", value);
            }
            else if (ctrl.attr("easyuitype") == "datebox") {
                ctrl.datebox("setValue", value);
            }
            else if (ctrl.attr("type") == "radio") {
                ctrl.attr('checked', ctrl.attr("value") == value);
            }
            else if (ctrl.attr("type") == "checkbox") {
                ctrl.attr('checked', ctrl.attr("value") == value);
            }
            else {
                ctrl.val(value);
            }
        }
    }, serializeAttrs: function (options) {
        var opts = {};
        var jqLink = $(this);
        if (jqLink.attr("width") != undefined)
            jQuery.extend(opts, { width: jqLink.attr("width") });
        if (jqLink.attr("height") != undefined)
            jQuery.extend(opts, { height: jqLink.attr("height") });
        if (jqLink.attr("title") != undefined && jqLink.attr("title") != "")
            jQuery.extend(opts, { title: jqLink.attr("title") });
        else if (jqLink.html() != undefined && jqLink.html() != "")
            jQuery.extend(opts, { title: jqLink.html() });
        if (jqLink.attr("url") != undefined && jqLink.attr("url") != "")
            jQuery.extend(opts, { actionUrl: jqLink.attr("url") });
        else if (jqLink.attr("href") != undefined && jqLink.attr("href") != "")
            jQuery.extend(opts, { actionUrl: jqLink.attr("href") });
        if (options != undefined)
            jQuery.extend(opts, { param: options });
        return opts;
    }, ajaxLinkJson: function (json, OnSuccess, OnError) {/*使用连接(a)提交Json数据*/
        $(this).each(function (index) {
            var lnkBtn = $(this);
            var url = lnkBtn.attr("url");
            var href = lnkBtn.attr("href");
            if (url != undefined && url != "") {
                href = url;
            }
            href = href.replace('View', '');

            jQuery.ajax(href, { type: "POST", data: json, global: false, dataType: "json",
                success: function (data) {
                    data = data || {};
                    if (data.st) {
                        OnSuccess(data);
                    } else {
                        OnError(data.Error);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var data = jqXHR.responseText;
                    var _1da = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
                    var _1db = _1da.exec(data);
                    if (_1db) {
                        jQuery.Alert(_1db[1]);
                    }
                    OnError(data);
                }
            });
        });
    }, ajaxJsonForm: function (OnSuccess, options, OnError, dialog) {/*提交Form表单，提交格式为Json数据, saveContinue是否需要继续修改数据{ SaveContinue: saveContinue }*/
        //给需要验证的datebox添加验证
        var validateInput = $("input[isvalidate='true']", $(this));
        $.each(validateInput, function (i, input) {
//            var dateId = $(this).attr("id");
            var dateName=$(this).attr("comboname");
            var markDate = $("input[name='" + dateName + "']").val();
            //这边手动添加验证后会丢掉value值
            $(input).datebox({
                required: true
            });
            $("input[name='" + dateName + "']").val(markDate);

        });
        if (!$(this).form("validate")) {
            dialog.panel("loaded");
            $('#lbtOk', dialog).linkbutton('enable');
            return;
        }
        var jqForm = $(this);
        if (jqForm.length == 1) {
            var formJson = jqForm.serializeObject();
            var formAction = jqForm.attr("action");
            if (options != null || options != undefined) {
                jQuery.extend(formJson, options);
            }
            //提交时去掉后面的View by jcj 15-10-22
//            debugger;
            formAction = formAction.replace('View', '');
            jQuery.ajax(formAction, { type: "POST", data: formJson, global: false, dataType: "json",
                success: function (data) {
                    data = data || {};
                    debugger;
                    if (data.st) {
                        OnSuccess(data);
                    } else {
//                        dialog.panel("loaded");
                        OnError.call(this, data);
//                        $.Alert(data.rt);
//                        if (OnError) {
//                            OnError.call(this, data)
//                        }
//                        jqForm.showFormError(data.Error);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var data = jqXHR.responseText;
                    var _1da = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
                    var _1db = _1da.exec(data);
                    if (_1db) {
                        if (OnError) {
                            OnError(_1db[1]);
                        }
                        jQuery.Alert(_1db[1]);
                    } else {
                        if (OnError) {
                            OnError(data);
                        }
                        jQuery.Alert(data);
                    }
                }
            });
        }
        /*end if (jqForm.length == 1)*/
    }, showFormError: function (error) {    /*在Form表单中显示错误信息*/
        var jqForm = this;
        if (typeof error != "undefined" && error != null) {
            var sumError = new Array();
            jQuery.each(error, function (key, value) {
                if (key == "") {
                    sumError.push(value);
                    return true;
                }
                var element = $("#" + key, jqForm);
                if (element.length == 0) {
                    sumError.push(value);
                    return true;
                }
                if ($("input[for=" + key + "]").length > 0) {
                    $("input[for=" + key + "]").addClass("input-validation-error");
                }
                if (element.attr("type") == "hidden" && element.attr("easyuitype") == undefined) {
                    sumError.push(value);
                    return true;
                }
                if (!element.hasClass("input-validation-error")) {
                    element.addClass("input-validation-error");
                }
                var label = $("span[data-valmsg-for='" + key + "']", jqForm);
                if (label.length > 0) {
                    label.attr("title", value).removeClass().addClass("field-validation-error").show();
                }
                else {
                    label = $("<span />").attr({ "data-valmsg-for=": key, "data-valmsg-replace": true }).addClass("field-validation-error").attr("title", value || "").insertAfter(element);
                }
            });
            /*jQuery.each(error, function (key, value) {*/
            if (sumError.length != 0) {
                var errorMsg = sumError.join(",");
                var es = $("div.validation-summary-errors", jqForm);
                if (es.length == 0) {
                    es = $('<div class="validation-summary-errors"></div>').appendTo(jqForm);
                }
                es.show();
                es.empty().append(errorMsg);
            }
        }
    }, hideFormError: function () {    /*在Form表单中显示错误信息*/
        this.find("div.validation-summary-errors").empty();
        this.find("span[data-valmsg-for]").attr("title", "").hide();
        this.find(".input-validation-error").removeClass("input-validation-error");
    }
});
function _AjaxOkForm(dialog, OnSuccess, options) {
    $("form", dialog).ajaxJsonForm(function (data) {
        dialog.dialog("close");
        $("form", dialog).detach();
        if (OnSuccess != null) {
            $('#lbtOk', topDialog).linkbutton('enable');
            OnSuccess(data);
        }
    }, options, function () {
        $('#lbtOk', dialog).linkbutton('enable');
    },dialog);
}
function _AjaxNewForm(dialog, OnSuccess, options, saveContinue) {
    $("form", dialog).hideFormError();
    $("#lbtNewSave", dialog).linkbutton("disable");
    $("#lbtNewSaveContinue", dialog).linkbutton("disable");
    $("form", dialog).ajaxJsonForm(function (data) {
            $("#lbtNewSave", dialog).linkbutton("enable");
            $("#lbtNewSaveContinue", dialog).linkbutton("enable");
            if (saveContinue) {
                if (typeof (options.actionUrl) != "undefined") {
                    $("form", dialog).detach();
                    OnSuccess(data);
                    dialog.dialog("refresh", options.actionUrl);
                }
            }
            else {
                dialog.dialog("close");
                $("form", dialog).detach();
                OnSuccess(data);
            }
        }, { SaveContinue: saveContinue, serialized: false },
        function (error) {
            dialog.panel("loaded");
            $("#lbtNewSave", dialog).linkbutton("enable");
            $("#lbtNewSaveContinue", dialog).linkbutton("enable");
//            错误提示直接弹出啦 by jcj 15-10-22
            $.Alert("操作提示", error.rt, "error")

        }, dialog);
}
function _AjaxEditForm(dialog, OnSuccess, options, saveContinue) {
    debugger;
    var keyArray = options.Keys;
    var currentIndex = dialog.data("CurrentIndex");
    if ((keyArray.length - 1) <= currentIndex) {
        saveContinue = false;
    }
    $("form", dialog).hideFormError();
    $("#lbtEditSave", dialog).linkbutton("disable");
    $("#lbtEditSaveContinue", dialog).linkbutton("disable");
    $("form", dialog).ajaxJsonForm(function (data) {
            if (saveContinue) {
                $("#lbtEditSave", dialog).linkbutton("enable");
                $("#lbtEditSaveContinue", dialog).linkbutton("enable");
                currentIndex = currentIndex + 1;
                dialog.data("CurrentIndex", currentIndex);
                if (keyArray.length > currentIndex) {
                    if (typeof (options.actionUrl) != "undefined") {
                        dialog.dialog("refresh", options.actionUrl + "?" + $.param(keyArray[currentIndex]));
                    }
                }
                else {
                    dialog.dialog("close");
                    $("form", dialog).detach();
                    OnSuccess(data);
                }
            }
            else {
                dialog.dialog("close");
                $("form", dialog).detach();
                OnSuccess(data);
            }
        }, { SaveContinue: saveContinue, serialized: false },
        function (error) {
            dialog.panel("loaded");
            $("#lbtEditSave", dialog).linkbutton("enable");
            $("#lbtEditSaveContinue", dialog).linkbutton("enable");
            dialog.panel("loaded");
            //            错误提示直接弹出啦 by jcj 15-10-22
            $.Alert("操作提示", error.rt, "error")
        });
}
function _CheckedLinkButton(rowIndex, rowData) {
    var opts = $(this).datagrid("options");
    if (opts.toolbar == null) {
        return true;
    }
    var rows = $(this).datagrid("getSelections");
    if (rows.length <= 0) {
        $("a[enabled_state]", opts.toolbar).enabled(PageStatus.Normal);
    }
    else {
        $("a[enabled_state]", opts.toolbar).enabled(PageStatus.SelectedRow);
    }
}

//扩展easyUI验证
$.extend($.fn.validatebox.defaults.rules, { dateTime: {
    validator: function (value) {
        //格式yyyy-MM-dd HH:MM:SS
        return /^(?:(?:(?:(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\/|-)(?:0?2\1(?:29)))|(?:(?:(?:1[6-9]|[2-9]\d)?\d{2})(\/|-)(?:(?:(?:0?[13578]|1[02])\2(?:31))|(?:(?:0?[1,3-9]|1[0-2])\2(29|30))|(?:(?:0?[1-9])|(?:1[0-2]))\2(?:0?[1-9]|1\d|2[0-8])))))\s(?:([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d)$/i.test(value);
    },
    message: '请输入适合的日期格式!yyyy-mm-dd HH:mm:ss'
}, date: {
    validator: function (value) {
        //格式yyyy-MM-dd或yyyy-M-d
        return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
    },
    message: '请输入适合的日期格式!如yyyy-MM-dd'
},
    dateCompare: {
        validator: function (valuend, param) {
            if (/^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(valuend) == false)
                return false;
            //            var valuebg = $(param[0]).val();
            var valuebg = $("input[name='" + param[0] + "']").val();
            if (valuebg != "" && valuend != "") {
                var datebg = valuebg.substring(0, 10);
                var datend = valuend.substring(0, 10);
                var datebgArr1 = datebg.split('-');
                var datendArr2 = datend.split('-');
                var datebg1 = new Date(datebgArr1[0], datebgArr1[1], datebgArr1[2]);
                var datend2 = new Date(datendArr2[0], datendArr2[1], datendArr2[2]);
                if (datebg1.getTime() < datend2.getTime()) {
                    return true;
                } else if (datebg1.getTime() > datend2.getTime()) {
                    return false;
                }
                var time1 = valuebg.substring(11).split(':');
                var time2 = valuend.substring(11).split(':');
                if (time1[0] > time2[0]) {
                    return false;
                }
                if (time1[1] > time2[1]) {
                    return false;
                }
                if (time1[2] > time2[2]) {
                    return false;
                }
                if (time1[0] == time2[0] && time1[1] == time2[1] && time1[2] == time2[2])
                    return false;
            }
            return true;
        },
        message: "必须输入日期类型且大于开始日期!"
    },
    mobile: {// 验证手机号码
        validator: function (value) {
            return /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value);
        },
        message: "手机号码格式不正确"
    },
    idcard: {// 验证身份证
        validator: function (value) {
            return /^d{15}(d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message: "身份证号码格式不正确"
    }

});


Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}