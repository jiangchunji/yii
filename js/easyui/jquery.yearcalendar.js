/// <reference path="jquery/jquery-1.8.1.js" />
/// <reference path="easyui/jquery.easyui.1.3.1.min.js" />
(function ($) {
	function yearcalendar_ShowYearCalendar(options, tableBody, startMonth) {
		var monthTitle = $('<tr class="yearcalendar-monthtitle"></tr>').appendTo(tableBody); //月份标题
		var weekTitle = $('<tr class="yearcalendar-weektitle"></tr>').appendTo(tableBody); //月份标题
		for (var index = 0; index <= 3; index++) {
			$('<th colspan="7" class="yearcalendar-monthcell"></th>').appendTo(monthTitle).html(options.months[index + startMonth]);
			for (var weekIndex = options.firstDay; weekIndex <= options.firstDay + 6; weekIndex++) {
				var cell = $('<th class="yearcalendar-weekcell"></th>').appendTo(weekTitle).html(options.weeks[(weekIndex) % 7]);
				if (weekIndex == options.firstDay) { cell.addClass("yearcalendar-weekbegincell"); }
				else if (weekIndex == options.firstDay + 6) { cell.addClass("yearcalendar-weekendcell"); }
			}
		}
		var year = options.currentYear; var result;
		var renderEnd1 = false, renderEnd2 = false, renderEnd3 = false, renderEnd4 = false;
		var monthDate1 = new Date(year, startMonth, 1); var monthDate2 = new Date(year, startMonth + 1, 1);
		var monthDate3 = new Date(year, startMonth + 2, 1); var monthDate4 = new Date(year, startMonth + 3, 1);
		while (!(renderEnd1 && renderEnd2 && renderEnd3 && renderEnd4)) {
			var dateRow = $('<tr class="yearcalendar-daterow"></tr>').appendTo(tableBody);
			var result = yearcalendar_ShowDateCell(options, year, dateRow, monthDate1, renderEnd1, startMonth);
			monthDate1 = result.MonthDate; renderEnd1 = result.RenderEnd;
			result = yearcalendar_ShowDateCell(options, year, dateRow, monthDate2, renderEnd2, startMonth + 1);
			monthDate2 = result.MonthDate; renderEnd2 = result.RenderEnd;
			result = yearcalendar_ShowDateCell(options, year, dateRow, monthDate3, renderEnd3, startMonth + 2);
			monthDate3 = result.MonthDate; renderEnd3 = result.RenderEnd;
			result = yearcalendar_ShowDateCell(options, year, dateRow, monthDate4, renderEnd4, startMonth + 3);
			monthDate4 = result.MonthDate; renderEnd4 = result.RenderEnd;
		}
	}
	function yearcalendar_ShowDateCell(opts, year, dateRow, monthDate, renderEnd, startMonth) {
		var weekNameIndex = opts.firstDay;
		for (weekIndex = 0; weekIndex <= 6; weekIndex++) {
			weekNameIndex = (weekIndex + opts.firstDay) % 7;
			var cell = $('<td></td>').appendTo(dateRow); var weekName = monthDate.getDay();
			if (weekIndex == 0) { cell.addClass("yearcalendar-weekbegincell"); }
			else if (weekIndex == 6) { cell.addClass("yearcalendar-weekendcell"); }
			if (weekName == weekNameIndex && !renderEnd) {
				var thisDate = monthDate.getDate();
				cell.addClass("yearcalendar-allday");
				var divDom = $("<div/>").appendTo(cell).html(thisDate);
				var date = monthDate.getFullYear() * 10000 + (monthDate.getMonth() + 1) * 100 + thisDate;
				if ($(opts.linkButton).length > 0) {
					$(divDom).css("cursor", "pointer").attr("date", date);
					$(divDom).bind("dblclick", cell, opts.dateCellDblClick);
					$(divDom).bind("click", cell, opts.dateCellClick);
				}
				monthDate = new Date(year, startMonth, thisDate + 1);
				renderEnd = monthDate.getMonth() != startMonth;
			}
		}
		return { MonthDate: monthDate, RenderEnd: renderEnd };
	}
	function yearcalendar_MaskLoading(target) {
		var opts = $.data(target, "yearcalendar").options;
		$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(target);
		var msg = $("<div class=\"datagrid-mask-msg\" style=\"display:block\"></div>").html(opts.loadingMessage).appendTo(target);
		msg.css("left", ($(target).width() - msg._outerWidth()) / 2);
	}
	function yearcalendar_MaskLoaded(target) {
		$(target).children("div.datagrid-mask-msg").remove();
		$(target).children("div.datagrid-mask").remove();
	}
	function yearcalendar_Initialization(target) {
		var opts = $.data(target, 'yearcalendar').options;
		var thead = $(target).find("table>thead");
		var tbody = $(target).find("table>tbody");
		if (thead.length == 0) {
			$(target).addClass('yearcalendar').wrapInner("<table class=\"yearcalendar-table\"><caption valign=\"top\"></caption>" +
		"<thead class=\"yearcalendar-tableheader\"></thead><tbody class=\"yearcalendar-tablebody\"></tbody></table>");
			thead = $(target).find("table>thead");
			tbody = $(target).find("table>tbody");
			yearcalendar_ShowCalendarType(target, $(target).find("table>caption"));
			var yearHeader = $('<tr class="yearcalendar-header"></tr>').appendTo(thead);
			var prevYear = $('<th colspan=\"2\" class="yearcalendar-prevyear"><div><<</div></th>').appendTo(yearHeader); //上一年度
			var yearTitle = $('<th colspan=\"24\" class="yearcalendar-yeartitle"><div></div></th>').appendTo(yearHeader); //年度信息
			var nextYear = $('<th colspan=\"2\" class="yearcalendar-nextyear"><div>>></div></th>').appendTo(yearHeader); //下一年度
			$("div", yearTitle).html(opts.currentYear);
			$("div", prevYear).css("cursor", "pointer");
			$("div", nextYear).css("cursor", "pointer");
			$(prevYear).find('div').click(function () { yearcalendar_ChangeYear(target, -1); });
			$(nextYear).find('div').click(function () { yearcalendar_ChangeYear(target, 1); });
		}
		else {
			thead.find(".yearcalendar-yeartitle>div").html(opts.currentYear);
			tbody.html("");
		}
		yearcalendar_ShowYearCalendar(opts, tbody, 0);
		yearcalendar_ShowYearCalendar(opts, tbody, 4);
		yearcalendar_ShowYearCalendar(opts, tbody, 8);
	}
	function yearcalendar_ShowCalendarType(target, caption) {
		var opts = $.data(target, 'yearcalendar').options;
		var allowChange = $(opts.linkButton).length > 0;
		jQuery.each(opts.calendarType, function (vl, cls) {
			var radioSpan = $('<span></span>').addClass(cls).appendTo(caption);
			$(radioSpan).css("border", "solid 1px #c0c0c0").css("margin", "5px").css("display", "inline-block");
			if (allowChange) { $('<input class="web-radiobutton" name="CalendarType" type="radio">').appendTo(radioSpan).val(vl).attr("id", "CalendarType" + vl); }
			$('<label></label>').appendTo(radioSpan).html(opts.calendarTypeName[vl]).attr("for", "CalendarType" + vl);
		});
	}
	function yearcalendar_ChangeYear(target, newYearOffset) {
		var opts = $.data(target, 'yearcalendar').options;
		opts.currentYear = opts.currentYear + newYearOffset;
		yearcalendar_MaskLoading(target);
		yearcalendar_Initialization(target);
		var loadparam = $.extend({ CurrentYear: opts.currentYear }, opts.loadParams);
		yearcalendar_LoadRemoteData.call(target, opts, loadparam, function (data) { yearcalendar_LoadData(target, data); yearcalendar_MaskLoaded(target); });
	}
	function yearcalendar_LoadRemoteData(opts, param, onSuccess) {
		if (!opts.url) { yearcalendar_OnLoadError.apply(this); return false; }
		$.ajax(opts.url, { type: "POST", data: param, global: false,
			success: function (data) { onSuccess(data); },
			error: function () { yearcalendar_OnLoadError.apply(this, arguments); }
		});
	}
	function yearcalendar_LoadData(target, calendarType) {
		var opts = $.data(target, 'yearcalendar').options;
		return opts.calendarType[calendarType];
	}
	function yearcalendar_ClearData(target) {
		var opts = $.data(target, 'yearcalendar').options;
		jQuery.each(opts.calendarType, function (name, value) { $(target).find("td." + value).removeClass(value); });
	}
	function yearcalendar_LoadData(target, data) {/*从客户端数据中加载*/
		data = jQuery.extend({ Success: false, Data: [] }, data);
		if (data.Success && data.Data.length && data.Data.length > 0) {
			yearcalendar_ClearData(target);
			var date = 19000101; var cellCls = yearcalendar_LoadData(target, 3);
			for (name in data.Data) {
				date = data.Data[name].date; cellCls = yearcalendar_LoadData(target, data.Data[name].calendarType);
				$(target).find("div[data=" + date + "]").parent().addClass(cellCls);
			}
		}
		else {
			yearcalendar_OnLoadError.call(target);
		}
	}
	function yearcalendar_OnLoadError() {/*从服务器中加载数据失败*/
		yearcalendar_MaskLoaded(this);
	}
	function yearcalendar_Load(target, param) {
		var opts = $.data(target, 'yearcalendar').options;
		if (param == undefined)
			param = opts.loadParams;
		else
			opts.loadParams = param;
		var loadparam = $.extend({ CurrentYear: opts.currentYear }, param);
		yearcalendar_LoadRemoteData(opts, loadparam, function (data) { yearcalendar_LoadData(target, data); });
	}
	$.fn.yearcalendar = function (options, param) {
		if (typeof options == 'string') {
			return $.fn.yearcalendar.methods[options](this, param);
		}
		options = options || {};
		return this.each(function () {
			var state = $.data(this, 'yearcalendar');
			if (state) { $.extend(state.options, options); }
			else { state = $.data(this, 'yearcalendar', { options: $.extend({}, $.fn.yearcalendar.defaults, $.fn.yearcalendar.parseOptions(this), options) }); }
			yearcalendar_Initialization(this);
		});
	};
	$.fn.yearcalendar.methods = {
		options: function (jq) { return $.data(jq[0], 'yearcalendar').options; },
		reload: function (jq) { return jq.each(function () { yearcalendar_Load(this); }); },
		load: function (jq, param) { return jq.each(function () { yearcalendar_Load(this, param); }); }
	};
	$.fn.yearcalendar.parseOptions = function (target) {
		return $.extend({}, $.parser.parseOptions(target, ['width', 'height', 'url', 'postUrl', { firstDay: 'number', currentYear: 'number'}]));
	};
	$.fn.yearcalendar.defaults = { firstDay: 0, url: null, postUrl: null, currentYear: new Date().getFullYear()
		, loadParams: {}, linkButton: null
		, loadingMessage: "Processing, please wait ...", weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
		, months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		, calendarType: { 1: "yearcalendar-morningday", 2: "yearcalendar-afternoonday",
			3: "yearcalendar-allday", 4: "yearcalendar-weekend", 5: "yearcalendar-holiday"
		}, calendarTypeName: { 1: "前半天", 2: "后半天", 3: "全天", 4: "周末", 5: "节日" }
		, dateCellDblClick: function (evt) { }, dateCellClick: function (evt) { }
		, onBeforeLoad: function (param) { }, onLoadSuccess: function () { }, onLoadError: function () { }
	};
})(jQuery);