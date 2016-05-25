/// <reference path="jquery-1.8.0.js" />
/// <reference path="jquery.easyui-1.3.1.min.js" />
/**********自定义控件扩展*********/
(function ($) {
	function yearcalendar_showyearcalendar(target, opts, tableBody, startMonth) {
		var monthTitle = $('<tr class="yearcalendar-monthtitle"></tr>').appendTo(tableBody); //月份标题
		var weekTitle = $('<tr class="yearcalendar-weektitle"></tr>').appendTo(tableBody); //月份标题
		for (var index = 0; index <= 3; index++) {
			$('<th colspan="7" class="yearcalendar-monthcell"></th>').appendTo(monthTitle).html(opts.months[index + startMonth]);
			for (var weekIndex = opts.firstDay; weekIndex <= opts.firstDay + 6; weekIndex++) {
				var cell = $('<th class="yearcalendar-weekcell"></th>').appendTo(weekTitle).html(opts.weeks[(weekIndex) % 7]);
				if (weekIndex == 0) { opts.renderMonthLeftCell.call(target, cell); }
				else if (weekIndex == 6) { opts.renderMonthRightCell.call(target, cell); }
			}
		}
		var year = opts.currentYear; var result;
		var renderEnd1 = false, renderEnd2 = false, renderEnd3 = false, renderEnd4 = false;
		var monthDate1 = new Date(year, startMonth, 1); var monthDate2 = new Date(year, startMonth + 1, 1);
		var monthDate3 = new Date(year, startMonth + 2, 1); var monthDate4 = new Date(year, startMonth + 3, 1);
		while (!(renderEnd1 && renderEnd2 && renderEnd3 && renderEnd4)) {
			var dateRow = $('<tr class="yearcalendar-daterow"></tr>').appendTo(tableBody);
			var result = yearcalendar_showdatecell(target, opts, year, dateRow, monthDate1, renderEnd1, startMonth);
			monthDate1 = result.MonthDate; renderEnd1 = result.RenderEnd;
			result = yearcalendar_showdatecell(target, opts, year, dateRow, monthDate2, renderEnd2, startMonth + 1);
			monthDate2 = result.MonthDate; renderEnd2 = result.RenderEnd;
			result = yearcalendar_showdatecell(target, opts, year, dateRow, monthDate3, renderEnd3, startMonth + 2);
			monthDate3 = result.MonthDate; renderEnd3 = result.RenderEnd;
			result = yearcalendar_showdatecell(target, opts, year, dateRow, monthDate4, renderEnd4, startMonth + 3);
			monthDate4 = result.MonthDate; renderEnd4 = result.RenderEnd;
		}
	};
	function yearcalendar_showdatecell(target, opts, year, dateRow, monthDate, renderEnd, startMonth) {
		var weekNameIndex = opts.firstDay;
		for (weekIndex = 0; weekIndex <= 6; weekIndex++) {
			weekNameIndex = (weekIndex + opts.firstDay) % 7;
			var dateCell = $('<td></td>').appendTo(dateRow).addClass("yearcalendar-datecell");
			var weekName = monthDate.getDay();
			if (weekIndex == 0) { opts.renderMonthLeftCell.call(target, dateCell); }
			else if (weekIndex == 6) { opts.renderMonthRightCell.call(target, dateCell); }
			if (weekName == weekNameIndex && !renderEnd) {
				var thisDate = monthDate.getDate();
				var y = monthDate.getFullYear(); var m = monthDate.getMonth() + 1;
				var date = y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (thisDate < 10 ? ('0' + thisDate) : thisDate);
				dateCell.addClass("yearcalendar-allday").attr("id", date);
				var divDom = $("<div/>").appendTo(dateCell).addClass("yearcalendar-date").html(thisDate);
				$.data(target, 'yearcalendar').dateCells[date] = { cell: dateCell, div: divDom };
				monthDate = new Date(year, startMonth, thisDate + 1);
				renderEnd = monthDate.getMonth() != startMonth;
			}
		}
		return { MonthDate: monthDate, RenderEnd: renderEnd };
	};
	function yearcalendar_maskloading(target) {
		var opts = $.data(target, "yearcalendar").options;
		$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(target);
		var msg = $("<div class=\"datagrid-mask-msg\" style=\"display:block\"></div>").html(opts.loadingMessage).appendTo(target);
		msg.css("left", ($(target).width() - msg._outerWidth()) / 2);
	};
	function yearcalendar_maskloaded(target) {
		$(target).children("div.datagrid-mask-msg").remove();
		$(target).children("div.datagrid-mask").remove();
	};
	function yearcalendar_createtable(target, opts) {
		$(target).addClass('yearcalendar').wrapInner("<table class=\"yearcalendar-table\"><caption valign=\"top\"></caption>" +
		"<thead class=\"yearcalendar-tableheader\"></thead><tbody class=\"yearcalendar-tablebody\"></tbody></table>");
		var thead = $(target).find("table>thead");
		var tbody = $(target).find("table>tbody");
		yearcalendar_showcalendartype(target, opts, $(target).find("table>caption"));
		var yearHeader = $('<tr class="yearcalendar-header"></tr>').appendTo(thead);
		var prevYear = $('<th colspan=\"2\" class="yearcalendar-prevyear"><div style="cursor:pointer;"><<</div></th>').appendTo(yearHeader); //上一年度
		var yearTitle = $('<th colspan=\"24\" class="yearcalendar-yeartitle"><div></div></th>').appendTo(yearHeader); //年度信息
		var nextYear = $('<th colspan=\"2\" class="yearcalendar-nextyear"><div style="cursor:pointer;">>></div></th>').appendTo(yearHeader); //下一年度
		return { tablehead: thead, tablebody: tbody, prevPanel: $(prevYear).find('div'), nextPanel: $(nextYear).find('div'), yearPanel: $("div", yearTitle) }
	};
	function yearcalendar_changeststus(target, status) {
		var opts = $.data(target, 'yearcalendar').options; opts.status = status;
		var prevPanel = $.data(target, 'yearcalendar').prevPanel;
		var nextPanel = $.data(target, 'yearcalendar').nextPanel;
		prevPanel.unbind("click"); nextPanel.unbind("click");
		if (status) {
			prevPanel.bind("click", function () { yearcalendar_changeyear(target, -1); });
			nextPanel.bind("click", function () { yearcalendar_changeyear(target, 1); });
		}
	};
	function yearcalendar_initialization(target) {
		var opts = $.data(target, 'yearcalendar').options;
		var tbody = $.data(target, 'yearcalendar').tablebody;
		var yearPanel = $.data(target, 'yearcalendar').yearPanel;
		yearPanel.html(opts.currentYear);
		tbody.empty();
		yearcalendar_showyearcalendar(target, opts, tbody, 0);
		yearcalendar_showyearcalendar(target, opts, tbody, 4);
		yearcalendar_showyearcalendar(target, opts, tbody, 8);
	};
	function yearcalendar_showcalendartype(target, opts, caption) {
		jQuery.each(opts.calendarType, function (vl, cls) {
			var radioSpan = $('<span></span>').addClass(cls).appendTo(caption);
			$(radioSpan).css("border", "solid 1px #c0c0c0").css("margin", "5px").css("display", "inline-block");
			if (opts.authorizeUsed) {
				var rdo = $('<input class="web-radiobutton" name="OCType" type="radio">').appendTo(radioSpan).val(vl).attr("id", "OCType" + vl);
				$(rdo).bind("change", function (evt) { opts.currentCalendarType = parseInt($(evt.currentTarget).val(), 10); });
				if (opts.currentCalendarType == vl) { rdo.attr("checked", "checked"); }
			}
			$('<label></label>').appendTo(radioSpan).html(opts.calendarTypeName[vl]).attr("for", "OCType" + vl);
		});
	};
	function yearcalendar_changeyear(target, newYearOffset) {
		var opts = $.data(target, 'yearcalendar').options;
		yearcalendar_maskloading(target);
		opts.currentYear = opts.currentYear + newYearOffset;
		$.data(target, 'yearcalendar').dateCells = {};
		yearcalendar_initialization(target);
		var loadparam = $.extend({ CurrentYear: opts.currentYear }, opts.loadParams);
		yearcalendar_loadremotedata.call(target, opts, loadparam,
		 function (data) { yearcalendar_loaddata(target, data); yearcalendar_maskloaded(target); });
	};
	function yearcalendar_cleardata(target) {
		var opts = $.data(target, 'yearcalendar').options;
		jQuery.each(opts.calendarType, function (name, value) { $(target).find("td." + value).removeClass(value); });
	};
	function yearcalendar_loadremotedata(opts, param, onSuccess) {
		var target = this; if (!opts.url) { yearcalendar_onloaderror.call(target); return false; }
		$.ajax(opts.url, { type: "POST", data: param, global: false,
			success: function (data) { onSuccess(data); },
			error: function (jqXHR) { yearcalendar_onloaderror.call(target, jqXHR.responseText); }
		});
	};
	function yearcalendar_loaddata(target, data) {/*从客户端数据中加载*/
		var result = data || []; var opts = $.data(target, 'yearcalendar').options;
		var dateCells = $.data(target, 'yearcalendar').dateCells;
		if (result.length && result.length > 0) {
			$.each(result, function (index, value) {
				var dateCell = dateCells[value[opts.datefield]];
				if (dateCell != null && dateCell != undefined) {
					dateCells[value[opts.datefield]].data = value;
					yearcalendar_setdatecell(target, opts, value, dateCell.cell, dateCell.div);
				}
			});
		}
		else { yearcalendar_onloaderror.call(target); }
	};
	function yearcalendar_setdatecell(target, opts, data, dateCell, dateDiv) {
		if (data == undefined || data == null) { return; }
		var date = data[opts.datefield]; var cellCls = opts.calendarType[data[opts.typefield]];
		dateCell.removeClass().addClass("yearcalendar-datecell").addClass(cellCls);
		if (opts.authorizeUsed && opts.status) {
			dateDiv.attr("ts", data[opts.tsfield]).attr("date", date);
			dateDiv.css("cursor", "pointer").attr("onselectstart", "return false");
			dateDiv.unbind("dblclick").unbind("click");
			dateDiv.bind("dblclick", dateCell, function (evt) { opts.dateCellDblClick.call(target, evt); });
			dateDiv.bind("click", dateCell, function (evt) { opts.dateCellClick.call(target, evt); });
		}
		else {
			divDom.removeAttr("ts").removeAttr("date");
			divDom.unbind("dblclick").unbind("click");
		}
	};
	function yearcalendar_onloaderror(responseText) {/*从服务器中加载数据失败*/
		yearcalendar_maskloaded(this);
		if (responseText != undefined && responseText != null) {
			var _1db = /<body[^>]*>((.|[\n\r])*)<\/body>/im.exec(responseText);
			if (_1db) { jQuery.Alert(_1db[1]); }
		}
	}
	function yearcalendar_load(target, param) {
		var opts = $.data(target, 'yearcalendar').options;
		if (param == undefined) { param = opts.loadParams; }
		else { opts.loadParams = param; }
		if (param.url != undefined && param.url != null) { opts.url = param.url; delete param.url; }
		var loadparam = $.extend({ CurrentYear: opts.currentYear }, param);
		yearcalendar_maskloading(target);
		yearcalendar_loadremotedata(opts, loadparam
			, function (data) { yearcalendar_cleardata(target); yearcalendar_loaddata(target, data); yearcalendar_maskloaded(target); });
	}
	$.fn.yearcalendar = function (options, param) {
		if (typeof options == 'string') {
			return $.fn.yearcalendar.methods[options](this, param);
		}
		options = options || {};
		return this.each(function () {
			var state = $.data(this, 'yearcalendar');
			if (state) { $.extend(state.options, options); }
			else {
				var opts = $.extend({}, $.fn.yearcalendar.defaults, $.fn.yearcalendar.parseOptions(this), options);
				var result = yearcalendar_createtable(this, opts);
				state = $.data(this, 'yearcalendar', $.extend({ options: opts, dateCells: {} }, result));
			}
			yearcalendar_initialization(this);
		});
	};
	$.fn.yearcalendar.methods = {
		options: function (jq) { return $.data(jq[0], 'yearcalendar').options; },
		reload: function (jq) { return jq.each(function () { yearcalendar_load(this); }); },
		load: function (jq, param) { return jq.each(function () { yearcalendar_load(this, param); }); },
		enable: function (jq, param) { return jq.each(function () { yearcalendar_changeststus(this, param); }); },
		arguments: function (jq) {
			var opts = $.data(jq[0], 'yearcalendar').options;
			return $.extend({ CurrentYear: opts.currentYear }, opts.loadParams);
		}
	};
	$.fn.yearcalendar.parseOptions = function (target) {
		return $.extend({}, $.parser.parseOptions(target, ['width', 'height', "datefield", "guidfield", "tsfield", 'url', 'postUrl', { firstDay: 'number', currentYear: 'number'}]));
	};
	$.fn.yearcalendar.defaults = { firstDay: 0, url: null, postUrl: null, currentYear: new Date().getFullYear()
		, loadParams: {}, currentCalendarType: 3, authorizeUsed: false, status: false, dateCells: {}
		, typefield: "OCTYPE", datefield: "OCDATE", guidfield: "OCKEY", tsfield: "MODIFIEDTIME"
		, loadingMessage: "Processing, please wait ...", weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
		, months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
		, calendarType: { 1: "yearcalendar-morningday", 2: "yearcalendar-afternoonday",
			3: "yearcalendar-allday", 4: "yearcalendar-weekend", 5: "yearcalendar-holiday"
		}, calendarTypeName: { 1: "前半天", 2: "后半天", 3: "全天", 4: "周末", 5: "节日" }
		, renderMonthLeftCell: function (cell) {
			cell.css("border-left", "solid 1px #696969");
		}, renderMonthRightCell: function (cell) {
			cell.css("border-right", "solid 1px #696969");
		}, dateCellDblClick: function (evt) {
			var target = this; var cell = evt.data; var divTarget = $(evt.currentTarget);
			var opts = $.data(target, 'yearcalendar').options;
			if (opts.postUrl == null) { return; }
			var param = jQuery.extend({ CurrentYear: opts.currentYear }, opts.loadParams);
			param[opts.typefield] = opts.currentCalendarType;
			param[opts.tsfield] = divTarget.attr("ts");
			param[opts.datefield] = divTarget.attr("date");
			$.ajax(opts.postUrl, { type: "POST", data: param, global: false,
				success: function (data) { yearcalendar_setdatecell(target, opts, data.Entity, cell, divTarget); }, //, cell, evt.currentTarget); },
				error: function (jqXHR) { yearcalendar_onloaderror.call(target, jqXHR.responseText); }
			});
			evt.preventDefault(); return false;
		}, dateCellClick: function (evt) { }
	};
})(jQuery);  //yearcalendar
(function ($) {
	function selectemployee_initialization(target) {
		var opts = $.data(target, 'selectemployee').options;
	};
	function selectemployee_createselectinput(row, target, containInputTd, inputName, containLabelTd, label) {
		var labelTd = row.find(containLabelTd); var codeTd = row.find(containInputTd);
		$('<label ></label>').appendTo(labelTd).attr("for", inputName).html(label);
		var table = $("<table class=\"combo\" style=\"width:100%;border-collapse: collapse;display: block;\"><tr></tr></table>").appendTo(codeTd);
		var inputTd = $("<td style=\"width:100%;padding:0px;\"></td>").appendTo(table.find(">tbody>tr"));
		var imgTd = $("<td style=\"padding:0px;\"></td>").appendTo(table.find(">tbody>tr"));
		var imgSpan = $("<span class=\"selectemployee-search\"></span>").appendTo(imgTd);
		var codeCtrl = $('<input class="combo-text" type="text">').appendTo(inputTd);
		codeCtrl.attr("id", inputName).attr("name", inputName).css("width", "100%");
		codeCtrl.bind("focusout", target, selectemployee_focusout);
		codeCtrl.bind("keydown", target, selectemployee_keydown);
		imgSpan.bind("mouseenter.combo", function () {
			$(this).addClass("selectemployee-search-hover");
		}).bind("mouseleave.combo", function () {
			$(this).removeClass("selectemployee-search-hover");
		}).bind("mousedown.combo", function () {
			return false;
		}).bind("click", target, selectemployee_openpanel);
		return { combo: codeCtrl, search: imgSpan };
	};
	function selectemployee_createdisbaledinput(row, containInputTd, inputName, containLabelTd, label) {
		$('<label ></label>').appendTo(row.find(containLabelTd)).attr("for", inputName).html(label);
		return $('<input class="web-textbox" disabled="true" type="text">').appendTo(row.find(containInputTd))
			.attr("id", inputName).attr("name", inputName);
	};
	function selectemployee_createemployeecoderow(target, opts, coderow) {
		$('<td class="editor-label"></td><td class="editor-field"></td><td class="editor-msg"></td>').appendTo(coderow);
	};
	function selectemployee_createcontrol(target, opts) {
		if (target.tagName != "TABLE") { jQuery.error("初始化员工选择控件必须为table标签"); return; }
		var tbody = $(target).find(">tbody"); var firstrow = tbody.find(">tr:first");
		var result = { firstfocus: tbody.find("tr:first input[type=text]") };
		var coderow = $("<tr></tr>").prependTo(tbody); selectemployee_createemployeecoderow(target, opts, coderow);
		result.codetd = coderow.find("td.editor-field:first");
		var code = selectemployee_createselectinput(coderow, target, "td.editor-field:first", "STAFFCODE", "td.editor-label:first", opts.codelabel);
		$.extend(result, { codecombo: code.combo, codesearch: code.search });
		if (opts.multiple) {
			var namerow = $("<tr></tr>").insertAfter(coderow); selectemployee_createemployeecoderow(target, opts, namerow);
			result.nametd = namerow.find("td.editor-field:first");
			var name = selectemployee_createselectinput(namerow, target, "td.editor-field:first", "STAFFNAME", "td.editor-label:first", opts.namelabel);
			$.extend(result, { namecombo: name.combo, namesearch: name.search });
			result.codetd.attr("colspan", "4"); result.nametd.attr("colspan", "4");
			firstrow.find("td.editor-label").css("width", "5%");
			firstrow.find("td.editor-field").css("width", "30%"); firstrow.find("td.editor-msg").css("width", "10%");
			firstrow.find(">td").css("border-top-width", "3px").css("border-top-style", "double");
		}
		else {
			selectemployee_createemployeecoderow(target, opts, coderow); result.nametd = coderow.find("td.editor-field:last");
			var name = selectemployee_createselectinput(coderow, target, "td.editor-field:last", "STAFFNAME", "td.editor-label:last", opts.namelabel);
			$.extend(result, { namecombo: name.combo, namesearch: name.search });
		}
		if (opts.nextfocus != null) { result.firstfocus = $(opts.nextfocus); }
		var inputempkey = $("input[name=" + opts.empkey + "]:hidden");
		if (inputempkey.length > 0) {
			//result.empkey = $('<input type="hidden">').appendTo(result.codetd).attr("name", opts.empkey);
			var firstFocus = inputempkey.attr("first-focus"); if ($(firstFocus).length > 0) { result.firstfocus = $(firstFocus); }
			inputempkey.remove();
		}
		if (!opts.multiple) {
			var row2 = $('<tr><td class="editor-label"></td><td class="editor-field"></td><td class="editor-msg"></td>' +
			'<td class="editor-label"></td><td class="editor-field"></td><td class="editor-msg"></td></tr>').insertAfter(coderow);
			var row3 = $('<tr><td class="editor-label"></td><td class="editor-field"></td><td class="editor-msg"></td>' +
			'<td class="editor-label"></td><td class="editor-field"></td><td class="editor-msg"></td></tr>').insertAfter(row2);
			row3.find("td.editor-label").css("width", "5%"); row3.find("td.editor-field").css("width", "30%"); row3.find("td.editor-msg").css("width", "10%");
			row3.find(">td").css("border-bottom-width", "3px").css("border-bottom-style", "double");
			result.organization = selectemployee_createdisbaledinput(row2, "td.editor-field:first", "SORGNAME", "td.editor-label:first", opts.orglabel);
			result.position = selectemployee_createdisbaledinput(row2, "td.editor-field:last", "SPOSNAME", "td.editor-label:last", opts.poslabel);
			result.joindate = selectemployee_createdisbaledinput(row3, "td.editor-field:first", "SJOINDATE", "td.editor-label:first", opts.joindatelabel);
			result.status = selectemployee_createdisbaledinput(row3, "td.editor-field:last", "SSTATUSTEXT", "td.editor-label:last", opts.statuslabel);
		}
		return result;
	};
	function selectemployee_getdialogpanel(target) {
		var state = $.data(target, 'selectemployee'); var opts = state.options;
		var dialogPanel = $("<div></div>").appendTo(document.body);
		return dialogPanel.dialog({ closed: true, modal: true, resizable: true,
			width: opts.width, height: opts.height, title: opts.title,
			onClose: function () { $(this).dialog("destroy"); },
			onLoad: function () {
				var dialogPanel = $(this);
				if (!opts.multiple) {
					dialogPanel.find("#gvEmployeeTable").datagrid({ singleSelect: true
						, onClickRow: function (index, data) { selectemployee_loadsuccess(target, data); dialogPanel.dialog("close"); }
					});
				}
				else {
					dialogPanel.find("#gvEmployeeTable").datagrid({ singleSelect: false,
						onSelect: function (index, data) { selectemployee_selectrow(target, data, true); },
						onUnselect: function (index, data) { selectemployee_selectrow(target, data, false); },
						onSelectAll: function (rows) { $.each(rows, function (index, data) { selectemployee_selectrow(target, data, true) }); },
						onUnselectAll: function (rows) { $.each(rows, function (index, data) { selectemployee_selectrow(target, data, false) }); }
					});
				}
				dialogPanel.find("#empSearch").bind("click", function (evt) {
					var param = $.extend($("form", "#divSearchToolbar").serializeObject(), { "url": $(evt.currentTarget).attr("url") });
					selectemployee_clearcontent(target);
					$("#gvEmployeeTable").datagrid("searchData", param);
				});
			}
		});
	}
	function selectemployee_selectrow(target, data, selected) {
		var state = $.data(target, 'selectemployee'); var codetd = state.codetd, opts = state.options;
		if (selected) {
			var inputkey = $('<input type="hidden">').appendTo(codetd).attr("name", opts.empkey).val(data[opts.empkey]);
			state.staffcode.push(data[opts.staffcode]); state.staffname.push(data[opts.staffname]);
			inputkey.attr("staffcode", data[opts.staffcode]).attr("staffname", data[opts.staffname]);
			inputkey.attr("orgkey", data[opts.orgkey]).attr("poskey", data[opts.poskey]);
			inputkey.attr("statuskey", data[opts.statuskey]); //.attr("poskey", data[opts.poskey]);
			state.empkey = codetd.find("input[name=" + opts.empkey + "]:hidden");
		}
		else {
			var staffcode = data[opts.staffcode];
			codetd.find("input[name=" + opts.empkey + "][value=" + data[opts.empkey] + "]:hidden").remove();
			state.empkey = codetd.find("input[name=" + opts.empkey + "]:hidden");
			state.staffcode = []; state.staffname = [];
			state.empkey.each(function () { state.staffcode.push($(this).attr("staffcode")); state.staffname.push($(this).attr("staffname")); });
		}
		state.codecombo.val(state.staffcode.join(","));
		state.namecombo.val(state.staffname.join(","));
	};
	function selectemployee_openpanel(evt) {
		var target = evt.data; var state = $.data(target, 'selectemployee');
		var opts = state.options; var panel = state.panel;
		var dialogPanel = selectemployee_getdialogpanel(target);
		dialogPanel.dialog("open").dialog("refresh", opts.href);
	};
	function selectemployee_clearcontent(target) {
		var state = $.data(target, 'selectemployee'); if (state.empkey) { state.empkey.remove(); }
		state.codecombo.val(""); state.namecombo.val("");
		if (!state.options.multiple) { state.organization.val(""); state.position.val(""); state.joindate.val(""); state.status.val(""); }
		else { state.staffcode = []; state.staffname = []; }
	};
	function selectemployee_focusout(evt) {
		var opts = $.data(evt.data, 'selectemployee').options;
		var tagetContent = $(evt.target).val();
		if (tagetContent == "") { return false; }
		evt.preventDefault();
	};
	function selectemployee_loadsuccess(target, entity) {
		var state = $.data(target, 'selectemployee'); var opts = state.options;
		if (entity[opts.empkey] != null && entity[opts.empkey] != 0) {
			state.empkey = $('<input type="hidden">').appendTo(state.codetd).attr("name", opts.empkey).val(entity[opts.empkey]);
			state.codecombo.setFieldValue(entity[state.codecombo.attr("name")]); // codesearch: code.search });
			state.namecombo.setFieldValue(entity[state.namecombo.attr("name")]);
			state.organization.setFieldValue(entity[state.organization.attr("name")]);
			state.position.setFieldValue(entity[state.position.attr("name")]);
			state.joindate.setFieldValue(entity[state.joindate.attr("name")]);
			state.status.setFieldValue(entity[state.status.attr("name")]);
			state.firstfocus.focus();
		}
		else { selectemployee_clearcontent(target); }
	};
	function selectemployee_keydown(evt) {
		if (evt.keyCode == 13 || evt.keyCode == 9) {
			var opts = $.data(evt.data, 'selectemployee').options;
			var targetContent = $(evt.target).val();
			if (targetContent != "" && opts.url != null && opts.url != "") {
				jQuery.ajax(opts.url, { type: "POST", data: "id=" + targetContent + "&" + $(evt.target).fieldSerialize()
					, success: function (data) { if (data.Success) { selectemployee_loadsuccess(evt.data, data.Entity); evt.preventDefault(); } else { jQuery.Alert(data.Error); } }
					//, error: function (jqXHR, textStatus, errorThrown) { jQuery.Alert(errorThrown); }
				});
			}
		}
		else if (evt.keyCode == 46) {//8:退格键,46:删除键
			selectemployee_clearcontent(evt.data);
		}
	};
	function selectemployee_parseoptions(target) {
		var firstrow = $(target).find("tr[url]:first");
		if (firstrow.length > 0) {
			var opts = $.parser.parseOptions(firstrow[0], ['title', 'url', 'href', { width: 'number', height: 'number', multiple: "boolean"}]);
			firstrow.remove();
			return opts;
		}
		return {};
	};
	$.fn.selectemployee = function (options, param) {
		if (typeof options == 'string') {
			return $.fn.selectemployee.methods[options](this, param);
		}
		options = options || {};
		return this.each(function () {
			var state = $.data(this, 'selectemployee');
			if (state) { $.extend(state.options, options); }
			else {
				var tropts = selectemployee_parseoptions(this);
				var opts = $.extend({}, $.fn.selectemployee.defaults, tropts, $.fn.selectemployee.parseOptions(this), options);
				var result = selectemployee_createcontrol(this, opts);
				state = $.data(this, 'selectemployee', $.extend(result, { options: opts }));
				if (opts.multiple) { state.staffcode = []; state.staffname = []; }
			}
			selectemployee_initialization(this);
		});
	};
	$.fn.selectemployee.methods = {
		options: function (jq) { return $.data(jq[0], 'selectemployee').options; }
	};
	$.fn.selectemployee.parseOptions = function (target) {
		return $.extend({}, $.parser.parseOptions(target, ['title', 'url', 'href', { width: 'number', height: 'number', multiple: "boolean"}]));
	};
	$.fn.selectemployee.defaults = { multiple: false, url: null, href: null, title: null, nextfocus: null, width: 724, height: 400,
		empkey: "EMPKEY", staffcode: "STAFFCODE", staffname: "STAFFNAME",
		codelabel: "员工工号", namelabel: "员工姓名",
		orglabel: "员工组织", poslabel: "员工职位", joindatelabel: "入职日期", statuslabel: "员工状态",
		orgkey: "SORGKEY", orgname: "SORGNAME", poskey: "SPOSKEY", posname: "SPOSNAME",
		joindate: "SJOINDATE", statuskey: "SSTATUS", statusname: "SSTATUSTEXT"
	};
})(jQuery); //selectemployee