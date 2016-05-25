/// <reference path="jquery-1.8.0.js" />
/// <reference path="jquery.easyui-1.3.1.min.js" />
(function () { //gridview
    function gridview_parseColumns(target) {
        var columns = [];
        $(target).children("thead").each(function () {
            $(this).find("tr").each(function () {
                var colArray = [];
                $(this).find("th").each(function () {
                    var th = $(this);
                    var col = $.extend({}, $.parser.parseOptions(this, ["field", "align",
                    { sortable: "boolean", checkbox: "boolean", resizable: "boolean" },
                    { rowspan: "number", colspan: "number", width: "number"}]),
                    { title: (th.html() || undefined), hidden: (th.attr("hidden") ? true : undefined) });
                    if (!col.align) {
                        col.align = "left";
                    }
                    colArray.push(col);
                });
                columns.push(colArray);
            });
        });
        return columns;
    };
    //初始化gridview
    function gridview_initialize(target, rowNumbers) {
        var columns = gridview_parseColumns(target);

        var gridPanel = $('<div class="datagrid-wrap"></div>').insertBefore(target);//外框架
        var gridPanel = $("<div class=\"datagrid-wrap\">" + "<div class=\"datagrid-view\">" + "<div class=\"datagrid-view1\">" + "<div class=\"datagrid-header\">" +
        "<div class=\"datagrid-header-inner\"></div>" + "</div>" + "<div class=\"datagrid-body\">" + "<div class=\"datagrid-body-inner\"></div>" +
        "</div>" + "<div class=\"datagrid-footer\">" + "<div class=\"datagrid-footer-inner\"></div>" + "</div>" + "</div>" + "<div class=\"datagrid-view2\">" +
        "<div class=\"datagrid-header\">" + "<div class=\"datagrid-header-inner\"></div>" + "</div>" + "<div class=\"datagrid-body\"></div>" +
         "<div class=\"datagrid-footer\">" + "<div class=\"datagrid-footer-inner\"></div>" + "</div>" + "</div>" + "</div>" + "</div>").wrap(_2a);
        gridPanel.panel({ doSize: false });
        gridPanel.panel("panel").addClass("datagrid").bind("_resize", function (e, _31) {
            var _32 = $.data(_2a, "datagrid").options;
            if (_32.fit == true || _31) {
                _7(_2a);
                setTimeout(function () {
                    if ($.data(_2a, "datagrid")) {
                        _33(_2a);
                    }
                }, 0);
            }
            return false;
        });
        $(_2a).hide().appendTo(_30.children("div.datagrid-view"));
       
        var _34 = _30.children("div.datagrid-view");
        var _35 = _34.children("div.datagrid-view1");
        var _36 = _34.children("div.datagrid-view2");
        return { panel: _30, frozenColumns: cc[0], columns: cc[1], dc: { view: _34, view1: _35, view2: _36, header1: _35.children("div.datagrid-header").children("div.datagrid-header-inner"), header2: _36.children("div.datagrid-header").children("div.datagrid-header-inner"), body1: _35.children("div.datagrid-body").children("div.datagrid-body-inner"), body2: _36.children("div.datagrid-body"), footer1: _35.children("div.datagrid-footer").children("div.datagrid-footer-inner"), footer2: _36.children("div.datagrid-footer").children("div.datagrid-footer-inner")} };
    };
    $.fn.gridview = function (options, param) {
        /// <summary>
        /// 提供轻量级快速的数据表格控件
        /// </summary>
        /// <param name="options">初始化参数</param>
        /// <param name="param">方法参数</param>
        if (typeof options == "string") { return $.fn.gridview.methods[options](this, param); }
        return this.each(function () {
            var state = $.data(this, "gridview");
            var opts;
            if (state) {
                opts = $.extend(state.options, options);
                state.options = opts;
            } else {
                opts = $.extend({}, $.extend({}, $.fn.gridview.defaults, { queryParams: {} }), $.fn.gridview.parseOptions(this), options);
                $(this).css("width", "").css("height", "");
                var _14a = gridview_initialize(this, opts.rownumbers);
                if (!opts.columns) {
                    opts.columns = _14a.columns;
                }
                if (!opts.frozenColumns) {
                    opts.frozenColumns = _14a.frozenColumns;
                }
                opts.columns = $.extend(true, [], opts.columns);
                opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
                $.data(this, "gridview", { options: opts, panel: _14a.panel, dc: _14a.dc, selectedRows: [], data: { total: 0, rows: [] }, originalRows: [], updatedRows: [], insertedRows: [], deletedRows: [] });
            }
            _3c(this);
            if (!state) {
                var data = _37(this);
                if (data.total > 0) {
                    _9e(this, data);
                    _131(this);
                }
            }
            _7(this);
            _13d(this);
            _52(this);
        });
    };
    $.fn.gridview.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.panel.parseOptions(target), $.parser.parseOptions(target,
        ["url", "toolbar", "idField", "sortName", "sortOrder", "pagePosition",
        { fitColumns: "boolean", autoRowHeight: "boolean", striped: "boolean", nowrap: "boolean" },
        { rownumbers: "boolean", singleSelect: "boolean", checkOnSelect: "boolean", selectOnCheck: "boolean" },
        { pagination: "boolean", pageSize: "number", pageNumber: "number" },
        { remoteSort: "boolean", showHeader: "boolean", showFooter: "boolean" },
        { scrollbarSize: "number"}]),
        { pageList: (t.attr("pageList") ? eval(t.attr("pageList")) : undefined),
            loadMsg: (t.attr("loadMsg") != undefined ? t.attr("loadMsg") : undefined),
            rowStyler: (t.attr("rowStyler") ? eval(t.attr("rowStyler")) : undefined)
        });
    };
    $.fn.gridview.defaults = jQuery.extend({}, $.fn.panel.defaults, {
        columns: undefined, fitColumns: false, autoRowHeight: true, toolbar: null, striped: false,
        method: "post", nowrap: true, idField: null, url: null, loadMsg: "正在处理，请稍待... ...", rownumbers: false,
        singleSelect: false, selectOnCheck: true, checkOnSelect: true, pagination: false, pagePosition: "bottom", pageNumber: 1,
        pageSize: 10, pageList: [10, 20, 30, 40, 50], queryParams: {}, sortName: null, sortOrder: "asc", remoteSort: true,
        showHeader: true, showFooter: false, scrollbarSize: 18
    });
})(jQuery);        //gridview