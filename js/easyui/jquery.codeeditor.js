/// <reference path="jquery-1.8.0.js" />
/// <reference path="jquery.easyui-1.3.1.min.js" />
(function () { //codeeditor
    $.fn.codeeditor = function (options, param) {
        /// <summary>
        /// 自定义代码编辑器
        /// </summary>
        /// <param name="options">初始化参数</param>
        /// <param name="param">如果options为方法名称，则param为方法参数</param>
        if (typeof options == "string") { return $.fn.codeeditor.methods[options](this, param); }
        return this.each(function () {
            var state = $.data(this, "codeeditor"); var opts;
            if (state) {
                opts = $.extend(state.options, options);
                state.options = opts;
            } else {
                opts = $.extend({}, $.extend({}, $.fn.codeeditor.defaults, { queryParams: {} }), $.fn.codeeditor.parseOptions(this), options);
                $.data(this, "codeeditor", { options: opts, panel: _14a.panel, dc: _14a.dc, selectedRows: [], data: { total: 0, rows: [] }, originalRows: [], updatedRows: [], insertedRows: [], deletedRows: [] });
            }
        });
    };
    $.fn.codeeditor.parseOptions = function (target) {
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
    $.fn.codeeditor.defaults = jQuery.extend({}, $.fn.layout.defaults, {
        columns: undefined, fitColumns: false, autoRowHeight: true, toolbar: null, striped: false,
        method: "post", nowrap: true, idField: null, url: null, loadMsg: "正在处理，请稍待... ...", rownumbers: false,
        singleSelect: false, selectOnCheck: true, checkOnSelect: true, pagination: false, pagePosition: "bottom", pageNumber: 1,
        pageSize: 10, pageList: [10, 20, 30, 40, 50], queryParams: {}, sortName: null, sortOrder: "asc", remoteSort: true,
        showHeader: true, showFooter: false, scrollbarSize: 18
    });
})(jQuery);        //codeeditor