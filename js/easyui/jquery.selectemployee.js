/// <reference path="jquery-1.8.0.js" />
/// <reference path="jquery.easyui-1.3.1.min.js" />
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
					dialogPanel.find("#gvEmployeeTable").datagrid({
						onSelect: function (index, data) { selectemployee_loadsuccess(target, data); dialogPanel.dialog("close"); }
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
})(jQuery);