/// <reference path="/Scripts/JQuery/jquery-1.8.0.js" />
/// <reference path="/Scripts/easyui/jquery.easyui.1.3.1.min.js" />
/// <reference path="/Scripts/script-ui-extend.1.0.0.js" />
(function ($) {
    //加载自定义事件
    $.extend({
        initAddNew: function (options, param, isRefresh, searchId) {
            var jqLink = $(options.linkId);
            var grid = $(options.gridId);
            var opts = jqLink.serializeAttrs(grid.datagrid("options").queryParams);




            if (param) {
                opts.param = param
            }
            ;
            jQuery.NewDialog(opts, function (data) {



                if (isRefresh == true) {
                    $(searchId).trigger("click");
                    return;
                }
                if (data.total)
                    grid.datagrid("loadData", data);
                else
                    $.Alert("操作提示", "操作成功", "info")
            });
        },
        initSearch: function (options) {
            var jqLink = $(options.linkId);
            var grid = $(options.gridId);
            if (jqLink.attr("search-for") != undefined) {
                param = $(jqLink.attr("search_for")).serializeObject();
            }
            param = jQuery.extend(grid.datagrid("options").queryParams, param);
            if (jqLink.attr("url") != undefined && jqLink.attr("url") != "")
                jQuery.extend(param, { url: jqLink.attr("url") });
            grid.datagrid("searchData", param);
        },
        initDelete: function (options) {
            var jqLink = $(options.linkId);
            var jqGrid = $(options.gridId);

            jQuery.DeleteConfirm(function (jql, jqg) {
                var delJson = jqg.datagrid("getDeleteKeys");
                jqg.datagrid("loading");
                jql.ajaxLinkJson(delJson,
                    function (data) {
                        jqGrid.datagrid("reload");
                        jqGrid.datagrid("clearSelections");
                    },
                    function (error) {
                        jqGrid.datagrid("loaded");
                        jQuery.Alert(error);
                    });
            }, jqLink, jqGrid);
        },
        initEdit: function (options) {
            var jqLink = $(options.linkId);
            var jqGrid = $(options.gridId);
            var btnOpts = jqLink.linkbutton("options");
            if (btnOpts.disabled) {
                evt.preventDefault();
                return false;
            }
            var opts = jqGrid.datagrid("getUpdateKeys");
            jQuery.extend(opts, jqLink.serializeAttrs());
            jQuery.UpdateDialog(opts, function (data) {
                jqGrid.datagrid("reload");
                jqGrid.datagrid("clearSelections");
            });

        }

    });

    function gridpage_addnew(evt) {
        var jqLink = $(evt.currentTarget);
        var target = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var pageopts = $.data(target, 'gridpage').options;
        var grid = $(pageopts.gridId);
        if (pageopts.beforeaddnew(target, pageopts)) {
            var opts = jqLink.serializeAttrs(grid.datagrid("options").queryParams);
            jQuery.NewDialog(opts, function (data) {
                if (data.total)
                    grid.datagrid("loadData", data);
                else {
//                    $.Alert("操作提示", "操作成功", "info")
                    grid.datagrid("reload");
                }
                pageopts.afteraddnew(target, pageopts, data);
            });
        }
        evt.preventDefault();
    }

    function gridpage_update(evt) {
        var jqLink = $(evt.currentTarget);
        var target = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var pageopts = $.data(target, 'gridpage').options;
        if (pageopts.beforeupdate(target, pageopts)) {
            var jqGrid = $(pageopts.gridId);
            var opts = jqGrid.datagrid("getUpdateKeys");
            jQuery.extend(opts, jqLink.serializeAttrs());
            jQuery.UpdateDialog(opts, function (data) {
                jqGrid.datagrid("reload");
                jqGrid.datagrid("clearSelections");
                pageopts.afterupdate(target, pageopts, data);
            });
        }
        evt.preventDefault();
    }

    function gridpage_delete(evt) {
        var jqLink = $(evt.currentTarget);
        var target = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var pageopts = $.data(target, 'gridpage').options;
        if (pageopts.beforedelete(target, pageopts)) {
            var jqGrid = $(pageopts.gridId);
            jQuery.DeleteConfirm(function (jql, jqg, opts) {

                var delJson = jqg.datagrid("getDeleteKeys");
                jqg.datagrid("loading");
                jql.ajaxLinkJson(delJson,
                    function (data) {
                        jqGrid.datagrid("reload");
                        jqGrid.datagrid("clearSelections");
                        opts.afterdelete(target, opts, data);
                    },
                    function (error) {
                        jqGrid.datagrid("loaded");
                        jQuery.Alert(error);
                    });
            }, jqLink, jqGrid, pageopts);
        }
        evt.preventDefault();
    }

    function gridpage_import(evt) {
        var jqLink = $(evt.currentTarget);
        var target = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        //        var opts2 = $.data(target, 'gridpage').options;
        //        var grid = $(opts2.gridId); var opts1 = grid.datagrid("options").queryParams;
        var opts = jqLink.serializeAttrs();
        //        opts.form = "#editForm";
        jQuery.OpenDialog(opts, function (dialog) {
            dialog.panel("loading");
            $("form", dialog).eq(1).ajaxJsonForm(function (data) {
                dialog.panel("loaded");
                dialog.dialog("close");
                //                $("#gvTable").datagrid("reload");
            }, null, function () {
                $('#lbtOk', dialog).linkbutton('enable');
            }, dialog);
        });
        evt.preventDefault();
    }

    function gridpage_search(evt) {
        var jqLink = $(evt.currentTarget);
        var page = evt.data;
        var param = {};
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var pageopts = $.data(page, 'gridpage').options;
        var grid = $(pageopts.gridId);
        if (jqLink.attr("search_for") != undefined) {
            param = $(jqLink.attr("search_for")).serializeObject();
        }
        param = jQuery.extend(grid.datagrid("options").queryParams, param);
        if (jqLink.attr("url") != undefined && jqLink.attr("url") != "")
            jQuery.extend(param, { url: jqLink.attr("url") });
        if (pageopts.beforesearch(page, pageopts, param)) {
            grid.datagrid("searchData", param);
            pageopts.aftersearch(page, pageopts, param);
        }
        evt.preventDefault();
    }

    function gridpage_adsearch(evt) {
        var jqLink = $(evt.currentTarget);
        var target = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var opts2 = $.data(target, 'gridpage').options;
        var grid = $(opts2.gridId);
        var opts1 = grid.datagrid("options").queryParams;
        if (opts2.beforeadsearch(target, opts2)) {
            var opts = jqLink.serializeAttrs(opts1);
            jQuery.OpenDialog(opts, function (dialog) {
                var param = $("form", dialog).serializeObject();
                if (jqLink.attr("url") != undefined && jqLink.attr("url") != "")
                    jQuery.extend(param, { url: jqLink.attr("url") });
                dialog.dialog("close");
                grid.datagrid("searchData", param);
                opts2.afteradsearch(target, opts2);
            });
        }
        evt.preventDefault();
    }

    function gridpage_initialization(target, opts) {
        if (opts.beforeinitialization(target, opts)) {
            $(target).find("a").each(function (index) {
                if ($(this).attr("id") == "lbtCreate") {
                    $(this).bind("click", target, gridpage_addnew);
                    $.extend(opts, { newButton: $(this) });
                }
                else if ($(this).attr("id") == "lbtEdit") {
                    $(this).bind("click", target, gridpage_update);
                    $.extend(opts, { editButton: $(this) });
                }
                else if ($(this).attr("id") == "lbtSearch") {
                    $(this).bind("click", target, gridpage_search);
                    $.extend(opts, { searchButton: $(this) });
                }
                else if ($(this).attr("id") == "lbtAdSearch") {
                    $(this).bind("click", target, gridpage_adsearch);
                    $.extend(opts, { adsearchButton: $(this) });
                }
                else if ($(this).attr("id") == "lbtDelete") {
                    $(this).bind("click", target, gridpage_delete);
                    $.extend(opts, { delButton: $(this) });
                }
                else if ($(this).attr("id") == "lbtImport") {
                    $(this).bind("click", target, gridpage_import);
                    $.extend(opts, { importButton: $(this) });
                }
                else if ($(this).attr("onclick") != undefined) {
                    $(this).bind("click", target, opts[$(this).attr("onclick")]);
                    this.onclick = null;
                }
            });
            $(opts.gridId).datagrid({});
            $(opts.watermark).waterMark();
            $(opts.watermark).keypress(function (event) {
                if (event.keyCode == 13) {
                    opts.searchButton.trigger("click", target);
                }
            });
            opts.afterinitialization(target, opts);
        }
        /*end if (opts.beforeinitialization(target, opts)) {*/
    }

    function gridpage_getselectedkey(target) {
        var opts = $.data(target, "gridpage").options;
        var dgopts = $(opts.gridId).datagrid("options");
        return $(opts.gridId).datagrid("getSelectedKey");
    }

    $.fn.gridpage = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.gridpage.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "gridpage");
            if (state) {
                $.extend(state.options, options);
            }
            else {
                state = { options: $.extend({}, $.fn.gridpage.defaults, options) };
                $.data(this, "gridpage", state);
            }
            gridpage_initialization(this, state.options);
        });
    };
    $.fn.gridpage.methods = {
        options: function (gp) {
            return $.data(gp[0], "gridpage").options;
        },
        getSelectedKey: function (gp) {
            return gridpage_getselectedkey(gp[0]);
        }
    };
    $.fn.gridpage.defaults = { gridId: "#gvTable", toolbar: "#divToolbar", watermark: "#SearchText",
        beforeinitialization: function (target, options) {
            return true;
        },
        afterinitialization: function (target, options) {
        },
        beforeaddnew: function (target, options, param) {
            return true;
        },
        afteraddnew: function (target, options, param) {
        },
        beforeupdate: function (target, options, param) {
            return true;
        },
        afterupdate: function (target, options, param) {
        },
        beforedelete: function (target, options, param) {
            return true;
        },
        afterdelete: function (target, options, param) {
        },
        beforesearch: function (target, options, param) {
            return true;
        },
        aftersearch: function (target, options, param) {
        },
        beforeadsearch: function (target, options, param) {
            return true;
        },
        afteradsearch: function (target, options, param) {
        }
    };
})(jQuery);                   //gridpage
(function ($) {
    function treegridpage_addnew(evt) {
        var jqLink = $(evt.currentTarget);
        var page = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var pageopts = $.data(page, 'treegridpage').options;
        var grid = $(pageopts.gridId);
        if (pageopts.beforeaddnew(page)) {
            var opts = jqLink.serializeAttrs();
            if (typeof (opts.actionUrl) != "undefined")
                opts.actionUrl = opts.actionUrl + "&" + $.param(grid.datagrid("options").queryParams);
            jQuery.NewDialog(opts, function (data) {
//                grid.datagrid("loadData", data);
                //修改成刷新 by JCJ 15-11-03
                grid.datagrid("reload");
                pageopts.afteraddnew(page, data);
            });
        }
        evt.preventDefault();
    }

    function treegridpage_update(evt) {
        var jqLink = $(evt.currentTarget);
        var page = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var pageopts = $.data(page, 'treegridpage').options;
        if (pageopts.beforeupdate(page)) {
            var jqGrid = $(pageopts.gridId);
            var opts = jqGrid.datagrid("getUpdateKeys");
            jQuery.extend(opts, jqLink.serializeAttrs());
            jQuery.UpdateDialog(opts, function (data) {
                jqGrid.datagrid("reload");
                jqGrid.datagrid("clearSelections");
                pageopts.afterupdate(page, data);
            });
        }
        evt.preventDefault();
    }

    function treegridpage_delete(evt) {
        var jqLink = $(evt.currentTarget);
        var page = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var pageopts = $.data(page, 'treegridpage').options;
        if (pageopts.beforedelete(page)) {
            var jqGrid = $(pageopts.gridId);
            jQuery.DeleteConfirm(function (jql, jqg, opts) {
                debugger;
                var delJson = jqg.datagrid("getDeleteKeys");
                jqg.datagrid("loading");
                jql.ajaxLinkJson(delJson, function (data) {
                    jqGrid.datagrid("reload");
                    jqGrid.datagrid("clearSelections");
//                    opts.afterdelete(target, opts, data);
                }, function (error) {
                    jqGrid.datagrid("loaded");
                    jQuery.Alert(error);
                });
            }, jqLink, jqGrid, pageopts);
        }
        evt.preventDefault();
    }

    function treegridpage_search(evt) {
        var jqLink = $(evt.currentTarget);
        var page = evt.data;
        var param = {};
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var pageopts = $.data(page, 'treegridpage').options;
        var grid = $(pageopts.gridId);
        if (jqLink.attr("search_for") != undefined) {
            param = $(jqLink.attr("search_for")).serializeObject();
        }
        param = jQuery.extend(pageopts.queryParams, param);
        if (jqLink.attr("url") != undefined && jqLink.attr("url") != "")
            jQuery.extend(param, { url: jqLink.attr("url") });
        if (pageopts.beforesearch(page, param)) {
            grid.datagrid("searchData", param);
            pageopts.aftersearch(page, param);
        }
        evt.preventDefault();
    }

    function treegridpage_adsearch(evt) {
        var jqLink = $(evt.currentTarget);
        var target = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var tgpopts = $.data(target, 'treegridpage').options;
        var grid = $(tgpopts.gridId);
        var opts1 = tgpopts.queryParams;
        if (tgpopts.beforeadsearch(target, tgpopts)) {
            var opts = jqLink.serializeAttrs(opts1);
            jQuery.OpenDialog(opts, function (dialog) {
                var param = $("form", dialog).serializeObject();
                if (jqLink.attr("url") != undefined && jqLink.attr("url") != "")
                    jQuery.extend(param, opts1, { url: jqLink.attr("url") });
                dialog.dialog("close");
                grid.datagrid("searchData", param);
                tgpopts.afteradsearch(target, tgpopts);
            });
        }
        evt.preventDefault();
    }

    function treegridpage_selectednode(target, node) {
        var opts = $.data(target, 'treegridpage').options;
        if (opts.beforeselectnode(target, node)) {
            var param = {};
            if (typeof (node.attributes) != "undefined") {
                param = node.attributes;
                opts.queryParams = param;
            }
            $(opts.gridId).datagrid("searchData", param);
            $("a", "#divTreeGrid").enabled(PageStatus.SelectedNode);
            $("a", "#divTreeGrid").visible(PageStatus.SelectedNode);
            opts.afterselectnode(target, node);
        }
    }

    function treegridpage_initialization(target, opts) {
        $(opts.leftPanel).width(opts.treeWidth);
        $(opts.treeid).tree({ onSelect: function (node) {
            treegridpage_selectednode(target, node);
        } });
        $(opts.gridId).datagrid({});
        $(target).layout({ fit: true });
        // $(opts.gridId).datagrid({});

        if (opts.beforeinitialization(target, opts)) {

            $("a", "#divTreeGrid").each(function (index) {
                if ($(this).attr("id") == "lbtCreate") {
                    $(this).bind("click", target, treegridpage_addnew);
                    $.extend(opts, { newButton: $(this) });
                }
                else if ($(this).attr("id") == "lbtEdit") {
                    $(this).bind("click", target, treegridpage_update);
                    $.extend(opts, { editButton: $(this) });
                }
                else if ($(this).attr("id") == "lbtSearch") {
                    $(this).bind("click", target, treegridpage_search);
                    $.extend(opts, { searchButton: $(this) });
                }
                else if ($(this).attr("id") == "lbtAdSearch") {
                    $(this).bind("click", target, treegridpage_adsearch);
                    $.extend(opts, { adsearchButton: $(this) });
                }
                else if ($(this).attr("id") == "lbtDelete") {
                    $(this).bind("click", target, treegridpage_delete);
                    $.extend(opts, { delButton: $(this) });
                }
                else if ($(this).attr("id") != undefined) {
                    $(this).bind("click", target, opts[$(this).attr("onclick")]);
                    this.onclick = null;
                }
            });
            $(opts.watermark).waterMark();
            $(opts.watermark).keypress(function (event) {
                if (event.keyCode == 13) {
                    opts.searchButton.trigger("click", opts.gridId);
                }
            });

            opts.afterinitialization(target, opts);
        }
        /*end if (opts.beforeinitialization(target, opts)) {*/
    }

    $.fn.treegridpage = function (options, param) {

        if (typeof options == 'string') {
            return $.fn.treegridpage.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "treegridpage");
            if (state) {
                $.extend(state.options, options);
            }
            else {
                state = { options: $.extend({}, $.fn.treegridpage.defaults, options) };
                $.data(this, "treegridpage", state);
            }
            treegridpage_initialization(this, state.options);
        });
    };
    $.fn.treegridpage.methods = {
        options: function (gp) {
            return $.data(gp[0], "treegridpage").options;
        }
    };
    $.fn.treegridpage.defaults = { gridId: "#gvTable", treeid: "#tvTree", treeWidth: 150,
        toolbar: "#divToolbar", watermark: "#SearchText", rightPanel: "#divRightPanel", leftPanel: "#divLeftPanel",
        beforeinitialization: function (target) {
            return true;
        },
        afterinitialization: function (target) {
        },
        beforeselectnode: function (target, node) {
            return true;
        },
        afterselectnode: function (target, node) {
        },
        beforeaddnew: function (target, param) {
            return true;
        },
        afteraddnew: function (target, param) {
        },
        beforeupdate: function (target, param) {
            return true;
        },
        afterupdate: function (target, param) {
        },
        beforedelete: function (target, param) {
            return true;
        },
        afterdelete: function (target, param) {
        },
        beforesearch: function (target, param) {
            return true;
        },
        aftersearch: function (target, param) {
        },
        beforeadsearch: function (target, param) {
            return true;
        },
        afteradsearch: function (target, param) {
        }
    };
})(jQuery); //treegridpage
(function ($) {
    function treeedit_initpagestate(target, state) {
        $.data(target, 'treeedit').options.status = state;
        $("input,select", "form").enabled(state);
        $("a[visibled_state]").visible(state);
    }

    function treeedit_selectednode(target, node) {
        var validateInput = $("form input[isvalidate='true']")
        //取消控件客户端验证
        $.each(validateInput, function (i, input) {
            $(input).validatebox('remove');
        });
        var opts = $.data(target, 'treeedit').options;
        $("form").hideFormError();
        if (opts.beforeselectnode(target, node)) {
            if (typeof (node.attributes) != "undefined") {
                $("input,select", "form").setFormValue(node.attributes);
            }
            treeedit_initpagestate(target, PageStatus.SelectedNode);
            opts.afterselectnode(target, node);
        }
        else {
            treeedit_initpagestate(target, PageStatus.Normal);
            $("a[iconCls='icon-save']").attr("url", "");
            $("form").clearForm(true);
        }
    }

    function treeedit_addnew(evt) {
        var jql = $(evt.currentTarget);
        var target = evt.data;
        var btnOpts = jql.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var opts = $.data(target, 'treeedit').options;
        $("form").clearForm(true);
        if (opts.beforeaddnew(target, opts)) {
            treeedit_initpagestate(target, PageStatus.AddNew);
            $("#lbtSave").attr("url", jql.attr("url"));
            opts.afteraddnew(target, opts);
            treeedit_treeenabled(target, false);
        }
        evt.preventDefault();
        var validateInput = $("form input[isvalidate='true']")
        //恢复控件客户端验证
        $.each(validateInput, function (i, input) {
            $(input).validatebox('reduce');
        });
    }

    function treeedit_update(evt) {
        if (!$("form").form("validate")) {
            return;
        }
        var jqLink = $(evt.currentTarget);
        var target = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var opts = $.data(target, 'treeedit').options;
        if (opts.beforeupdate(target, opts)) {
            treeedit_initpagestate(target, PageStatus.Update);

            $("#lbtSave").attr("url", jqLink.attr("url"));
            $("#lbtSave").attr("href", jqLink.attr("url"));
            opts.afterupdate(target, opts);
            treeedit_treeenabled(target, false);
        }
        evt.preventDefault();
        var validateInput = $("form input[isvalidate='true']")
        //恢复控件客户端验证
        $.each(validateInput, function (i, input) {
            $(input).validatebox('reduce');
        });
    }

    function treeedit_delete(evt) {
        var jqLink = $(evt.currentTarget);
        var target = evt.data;
        var opts = $.data(target, 'treeedit').options;
        var jqTree = $(opts.tree);
        if (opts.beforedelete(target, opts)) {
            jQuery.DeleteConfirm(function (jql, jqt) {
                var formJson = $("form").serializeObject();
                jql.ajaxLinkJson(formJson, function () {
                        jqt.tree('reload');
                        $("form").clearForm(true);
                        opts.afterdelete(target, opts);
                    },
                    function (error) {
                        jQuery.Alert(jQuery.serializeError(error))
                    });
            }, jqLink, jqTree);
        }
        evt.preventDefault();
    }

    function treeedit_savesuccess(target) {
        var opts = $.data(target, 'treeedit').options;
        var pageState = opts.status;
        treeedit_initpagestate(target, PageStatus.Normal);
        $("form").clearForm(true);
        if (pageState == PageStatus.AddNew) {
            opts.afternewsave(target, opts);
        }
        else if (pageState == PageStatus.Update) {
            opts.aftereditsave(target, opts);
        }
        treeedit_treeenabled(target, true);
        $("form").hideFormError();
    }

    function treeedit_checkrecursion(options, node, superValue) {
        var nodes = $(options.tree).tree("getChildren", node.target);
        if (nodes.length) {
            for (i in nodes) {
                if (nodes[i].id == superValue) {
                    return false;
                }
                var result = treeedit_checkrecursion(options, nodes[i], superValue);
                if (!result) {
                    return false;
                }
            }
        }
        return true;
    }

    function treeedit_checksuper(target) {
        var opts = $.data(target, 'treeedit').options;
        var superCtrl = $(opts.superSelector);
        if (superCtrl.length && opts.status != PageStatus.AddNew) {
            var superValue = superCtrl.val();
            var state = $.data(superCtrl[0], "combotree");
            if (superValue == "" && state != undefined) {
                superValue = superCtrl.combotree("getValue");
            }
            if (superValue != "") {
                var node = $(opts.tree).tree("getSelected");
                if (node) {
                    if (node.id == superValue) {
                        return false;
                    } else {
                        return treeedit_checkrecursion(opts, node, superValue);
                    }
                }
            }
        }
        return true;
    }

    function treeedit_save(evt) {

        //客户端验证
        if (!$("form").form("validate")) {
            return false;
        }
        var target = evt.data;
        var opts = $.data(target, 'treeedit').options;
        var execState = treeedit_checksuper(target);
        if (execState && opts.status == PageStatus.AddNew) {
            execState = opts.beforenewsave(target, opts);
        }
        else if (execState && opts.status == PageStatus.Update) {
            execState = opts.beforeeditsave(target, opts);
        }
        if (!execState) {
            evt.preventDefault();
            return;
        }
        var formJson = $("form").serializeObject();
        $("form").hideFormError();
        $(evt.currentTarget).ajaxLinkJson(formJson,
            function () {
                treeedit_savesuccess(target);
            },
            function (error) {
                $("form").showFormError(error);
            });
        evt.preventDefault();
    }

    function treeedit_cancel(evt) {
        var validateInput = $("form input[isvalidate='true']")
        //取消控件客户端验证
        $.each(validateInput, function (i, input) {
            $(input).validatebox('remove');
        });
        treeedit_initpagestate(evt.data, PageStatus.Normal);
        $("a[iconCls='icon-save']").attr("url", "");
        treeedit_treeenabled(evt.data, true);
        $("form").hideFormError();
        evt.preventDefault();


    }

    function treeedit_import(evt) {
        var jqLink = $(evt.currentTarget);
        var target = evt.data;
        var btnOpts = jqLink.linkbutton("options");
        if (btnOpts.disabled) {
            evt.preventDefault();
            return false;
        }
        var opts2 = $.data(target, 'treeedit').options;
        var opts = jqLink.serializeAttrs();
        jQuery.OpenPanel(opts);
        evt.preventDefault();
    }

    function treeedit_treeenabled(target, b) {
        var opts = $.data(target, 'treeedit').options;
        if (b) {
            $(opts.tree).tree("enabled");
        } else {
            $(opts.tree).tree("disabled");
        }
    }

    function treeedit_initialization(target, opts) {
        $(opts.tree).tree({ onSelect: function (node) {
            treeedit_selectednode(target, node);
        } });
        if (opts.toolBarHeight > 0) {
            $(opts.toolbar).height(opts.toolBarHeight);
        }
        $(opts.leftPanel).width(opts.leftPanelWidth);
        $(target).layout({ fit: true });
        $(target).find("#divRightPanel>div").layout({ fit: true });
        if (opts.beforeinitialization(target, opts)) {
            jQuery.parser.parse(opts.editPanel);
            treeedit_initpagestate(target, PageStatus.Normal);
            $("a", opts.toolbar).each(function (index) {
                if ($(this).attr("id") == "lbtCreate") {
                    $(this).bind("click", target, treeedit_addnew);
                }
                else if ($(this).attr("id") == "lbtEdit") {
                    $(this).bind("click", target, treeedit_update);
                }
                else if ($(this).attr("id") == "lbtDelete") {
                    $(this).bind("click", target, treeedit_delete);
                }
                else if ($(this).attr("id") == "lbtSave") {
                    $(this).bind("click", target, treeedit_save);
                }
                else if ($(this).attr("id") == "lbtCancel") {
                    $(this).bind("click", target, treeedit_cancel);
                }
                else if ($(this).attr("id") == "lbtImport") {
                    $(this).bind("click", target, treeedit_import);
                    $.extend(opts, { importButton: $(this) });
                }
                else if ($(this).attr("onclick") != undefined) {
                    $(this).bind("click", target, opts[$(this).attr("onclick")]);
                    this.onclick = null;
                }
            });
            opts.afterinitialization(target, opts);
        }
        /*end if (opts.beforeinitialization(target, opts)) {*/
    }

    $.fn.treeedit = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.treeedit.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "treeedit");
            if (state) {
                $.extend(state.options, options);
            }
            else {
                state = { options: $.extend({}, $.fn.treeedit.defaults, options) };
                $.data(this, "treeedit", state);
            }
            $.extend(state.options, { status: PageStatus.Normal });
            treeedit_initialization(this, state.options);
        });
    };
    $.fn.treeedit.methods = {
        options: function (tp) {
            return $.data(tp[0], "treeedit").options;
        },
        initstate: function (tp, b) {
            return treeedit_initpagestate(tp[0], b);
        },
        treeenable: function (tp, b) {
            return treeedit_treeenabled(tp[0], b);
        }
    };
    $.fn.treeedit.defaults = { tree: "#tvTree", toolbar: "#divToolbar", leftPanelWidth: 200, toolBarHeight: 30,
        editPanel: "#divEdit", superSelector: null, rightPanel: "#divRightPanel", leftPanel: "#divLeftPanel",
        beforeinitialization: function (target, options) {
            return true;
        },
        afterinitialization: function (target, options) {
        },
        beforeselectnode: function (target, node) {
            return true;
        },
        afterselectnode: function (target, node) {
        },
        beforeaddnew: function (target, options, param) {
            return true;
        },
        afteraddnew: function (target, options, param) {
        },
        beforeupdate: function (target, options, param) {
            return true;
        },
        afterupdate: function (target, options, param) {
        },
        beforedelete: function (target, options, param) {
            return true;
        },
        afterdelete: function (target, options, param) {
        },
        beforenewsave: function (target, options, param) {
            return true;
        },
        afternewsave: function (target, options, param) {
        },
        beforeeditsave: function (target, options, param) {
            return true;
        },
        aftereditsave: function (target, options, param) {
        }
    };
})(jQuery); //treeedit
jQuery.extend({
    InitializeDataGridPage: function (options) {
        $("#divToolbar").gridpage(options);
    },
    InitializeTreeEditPage: function (options) {
        $("#divTreeEdit").treeedit(options);
    },
    InitializeTreeGridPage: function (options) {
        $("#divTreeGrid").treegridpage(options);
    }
});