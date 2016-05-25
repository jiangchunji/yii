/// <reference path="jquery-1.8.0.js" />
/// <reference path="jquery.easyui-1.3.1.min.js" />
(function ($) {
	function timebox_inputNumber(target, value) {
		var opts = $.data(target, "timebox").options;
		var state = $.data(target, "timebox");
		var valueMinute = opts.value;
		if (opts.highlight == 1) {	//输入小时部分
			window.status = (state.numCount);
			if (state.numCount == 0) {
				opts.value = value * 60 + valueMinute % 60; state.numCount = 1;
				state.inputHour = value;
			} else {
				opts.value = (state.inputHour * 10 + value) * 60 + valueMinute % 60;
				state.numCount = 0; opts.highlight = 2; state.inputHour = 0;
			}
			$(target).val(opts.value);
		}
		else if (opts.highlight == 2) {	//输入分钟部分
			var hourMinute = Math.floor(valueMinute / 60) * 60;
			if (state.numCount == 0) {
				opts.value = hourMinute + value; state.numCount = 1;
				state.inputMinute = value;
			}
			else {
				var newMinute = state.inputMinute * 10 + value;
				if (newMinute > 59) { newMinute = 59; }
				opts.value = hourMinute + newMinute;
				state.numCount = 0; state.inputMinute = 0;
			}
			$(target).val(opts.value);
		}
		timebox_toText(target);
		timebox_setClickCursor(target);
	};
	function timebox_setClickCursor(target) {//设置输入光标位置
		var opts = $.data(target, "timebox").options;
		var text = $.data(target, "timebox").text[0];
		var cursorStart = 0, cursorEnd = 0;
		if (opts.highlight == 1) {
			cursorStart = 0;
			cursorEnd = 2;
		} else if (opts.highlight == 2) {
			cursorStart = 3;
			cursorEnd = 5;
		}
		if (text.selectionStart != null) {
			text.setSelectionRange(cursorStart, cursorEnd);
		} else if (text.createTextRange) {
			var textRange = text.createTextRange();
			textRange.collapse();
			textRange.moveEnd("character", cursorEnd);
			textRange.moveStart("character", cursorStart);
			textRange.select();
		}
		$(target).focus();
	};
	function timebox_toText(target) {
		var opts = $.data(target, "timebox").options;
		var text = $.data(target, "timebox").text;
		if ($(target).val() != "") { opts.value = parseInt($(target).val(), 10); }
		var hourStr = "00", minuteStr = "00";
		var minuteValue = opts.value;
		if (minuteValue < opts.minValue) { minuteValue = opts.minValue; }
		if (minuteValue > opts.maxValue) { minuteValue = opts.maxValue; }
		if (minuteValue > 0) {
			var hour = Math.floor(minuteValue / 60), minute = minuteValue - hour * 60;
			hourStr = hour <= 9 ? "0" + hour : hour;
			minuteStr = minute <= 9 ? "0" + minute : minute;
		}
		if (opts.value != minuteValue) { opts.value = minuteValue; $(target).val(opts.value); }
		text.val(hourStr + opts.separator + minuteStr);
	};
	function timebox_textClick(evt) {
		var opts = $.data(evt.data, "timebox").options;
		var cursorPosition = 0;
		if (opts.highlight == 0) {
			if (this.selectionStart != null) {
				cursorPosition = this.selectionStart;
			} else if (this.createTextRange) {
				var _5 = target.createTextRange();
				var s = document.selection.createRange();
				s.setEndPoint("StartToStart", _5);
				cursorPosition = s.text.length;
			}
			if (cursorPosition >= 0 && cursorPosition <= 2) {
				opts.highlight = 1;
			} else if (cursorPosition >= 3) {
				opts.highlight = 2;
			}
		}
		timebox_setClickCursor(evt.data);
	};
	function timebox_textkeydown(evt) {
		var opts = $.data(evt.data, "timebox").options;
		if (evt.keyCode >= 37 && evt.keyCode <= 40) {	//触发键盘方向键左上右下
			var state = $.data(evt.data, "timebox");
			if (evt.keyCode == 37 && state.options.highlight == 2) {
				state.options.highlight = 1; state.firstNumber = 0;
				state.numCount = 0; state.inputHour = 0;
			} //向左
			else if (evt.keyCode == 38 && state.options.highlight == 2) {
				state.options.highlight = 1; state.firstNumber = 0;
				state.numCount = 0; state.inputHour = 0;
			} //向上
			else if (evt.keyCode == 39 && state.options.highlight == 1) {
				state.options.highlight = 2; state.firstNumber = 0;
				state.numCount = 0; state.inputMinute = 0;
			} //向右
			else if (evt.keyCode == 40 && state.options.highlight == 1) {
				state.options.highlight = 2; state.firstNumber = 0;
				state.numCount = 0; state.inputMinute = 0;
			} //向下
			timebox_setClickCursor(evt.data);
			evt.preventDefault();
		}
		else if (evt.keyCode >= 48 && evt.keyCode <= 57) {	//触发键盘方向键数字键0~9
			timebox_inputNumber(evt.data, evt.keyCode - 48);
			evt.preventDefault();
		}
		else if (evt.keyCode >= 96 && evt.keyCode <= 105) {	//触发键盘方向键数字键0~9
			timebox_inputNumber(evt.data, evt.keyCode - 96);
			evt.preventDefault();
		}
		else if (evt.keyCode == 13 || evt.keyCode == 9) {
			return;
		}
		else if (evt.keyCode == 8 || evt.keyCode == 46) {
			evt.preventDefault();
		}
		else { evt.preventDefault(); }
	};
	function timebox_create(target) {
		var opts = $.data(target, "timebox").options;
		if ($(target).attr("type") == "text") { $(target).css("display", "none"); }
		if ($(target).val() != "") { opts.value = parseInt($(target).val(), 10); }
		var textInput = $('<input type="text">').addClass("web-textbox").attr("for", $(target).attr("name")).insertAfter(target);
		if (target.disabled) { textInput.attr("disabled", true); target.disabled = false; }
		$.data(target, "timebox").text = textInput;
		timebox_toText(target);
		textInput.unbind(".timebox");
		textInput.bind("focus.timebox", target, function () {
			var state = $.data(target, "timebox");
			state.options.value = 0; state.numCount = 0;
			state.inputHour = 0; state.inputMinute = 0;
		})
		.bind("click.timebox", target, timebox_textClick)
		.bind("keydown.timebox", target, timebox_textkeydown)
		.bind("blur.timebox", target, function (evt) { timebox_toText(evt.data); });
		return textInput;
	};
	function timebox_changedisabled(target, disabled) {
		$.data(target, "timebox").text.attr("disabled", disabled);
	};
	$.fn.timebox = function (options, param) {
		if (typeof options == "string") { $.fn.timebox.methods[options](this, param); }
		options = options || {};
		return this.each(function () {
			var state = $.data(this, "timebox"); if (state) { $.extend(state.options, options); }
			else {
				$.data(this, "timebox", { options: $.extend({ value: 0 }, $.fn.timebox.defaults, $.fn.timebox.parseOptions(this), options),
					numCount: 0, inputHour: 0, inputMinute: 0
				});
				var textInput = timebox_create(this);
			}
		});
	};
	$.fn.timebox.methods = { options: function (jq) {
		var _21 = $.data(jq[0], "timebox").options;
		return $.extend(_21, { value: jq.val() });
	}, showText: function (jq) {
		return jq.each(function (index, input) { timebox_toText(input); });
	}, enable: function (jq) {
		return jq.each(function (index, input) { timebox_changedisabled(input, false); });
	}, disable: function (jq) {
		return jq.each(function (index, input) { timebox_changedisabled(input, true); });
	}
	};
	$.fn.timebox.parseOptions = function (target) {
		return $.extend({}, $.parser.parseOptions(target, ["separator", { showSeconds: "boolean", highlight: "number", minValue: "number", maxValue: "number"}]));
	};
	$.fn.timebox.defaults = { separator: ":", showSeconds: false, highlight: 1, minValue: 0, maxValue: 1440 };
})(jQuery);