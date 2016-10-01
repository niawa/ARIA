/*! jquery.combobox.js © yamoo9.net, 2016 */
;(function(global, $){
	'use strict';

	/**
	 *	@default 기본 옵션
	 *	@type		{Object}
	 */
	var defaults = {
		'usingAria': true,
		'activeClass': 'selected',
		'buttonLabel': '선택 목록',
		'options': []
	};

	/**
	 *	@method	 jQuery.prototype.ComboboxUI
	 *	@param		{Object}	settings
	 */
	$.fn.ComboboxUI = function(settings) {
		var $this = this;
		return $.each($this, function(idx, el) {
			var $el = $this.eq(idx);
			return $el.data('comboboxUI', new ComboboxUI($el).initialize(settings) );
		});
	};

	/**
	 *	@constructor	ComboboxUI
	 *	@param				{object}	el HTMLElement
	 */
	var ComboboxUI = function($el) {
		this.$el = $el;
	};
	/**
	 *	@prototype ComboboxUI
	 *	@type			{Object}
	 */
	ComboboxUI.prototype = {
		'constructor': ComboboxUI,
		/**
		 *	@method	 initialize 콤보박스 초기화
		 *	@memberOf ComboboxUI.prototype
		 *	@param		{Object}	settings
		 *	@return	 {Object}	ComboboxUI {}
		 */
		'initialize': function(settings) {
			// 옵션 객체 합성
			this.settings = $.extend({}, defaults, settings);
			// 옵션 생성 인덱스 초기화
			this.option_id_idx = 0;
			// 옵션 개수
			this.options_len = this.settings.options.length;
			// 초기 선택된 옵션 인덱스
			this.selected_option_idx = 0;
			// 포커스된 객체 초기화
			this.focused_option = null;
			// 콤보박스 초기화
			settingCombo.call(this);
			// 이벤트 핸들러 바인딩
			bindingEvents.call(this);
			// 콤보박스 UI 객체 반환
			return this;
		},
		/**
		 *	@method	 selectOption
		 *	@memberOf ComboboxUI.prototype
		 */
		'selectOption': function(idx) {
			radioOption.call(this, idx);
			console.info( '"' + this.settings.options[idx] + '" 값이 선택되었습니다.');
			return this;
		},
		/**
		 *	@method	 isListOpen
		 *	@memberOf ComboboxUI.prototype
		 */
		'isListOpen': isListOpen,
		/**
		 *	@method	 openList
		 *	@memberOf ComboboxUI.prototype
		 */
		'openList': openList,
		/**
		 *	@method	 closeList
		 *	@memberOf ComboboxUI.prototype
		 */
		'closeList': closeList,
		/**
		 *	@method	 toggleList
		 *	@memberOf ComboboxUI.prototype
		 */
		'toggleList': toggleList,
		/**
		 *	@method	 setAria
		 *	@memberOf ComboboxUI.prototype
		 */
		'setAria': settingAria,
		/**
		 *	@method	 desetAria
		 *	@memberOf ComboboxUI.prototype
		 */
		'desetAria': destroyAria
	};

	/** @type {Object} 키보드 객체 */
	var keys = {
		'tab'			: 9,
		'enter'		: 13,
		'alt'			: 18,
		'esc'			: 27,
		'space'		: 32,
		'pageup'	 : 33,
		'pagedown' : 34,
		'left'		 : 37,
		'up'			 : 38,
		'right'		: 39,
		'down'		 : 40,
	};

	/** @private	makingId */
	var build_id = 0;
	function makingId() {
		return 'ui-combobox-' + build_id++;
	}
	/** @private	settingCombo */
	function settingCombo() {
		var $combobox = this;
		var $c_wrapper = $combobox.$el;
		$combobox.id = $c_wrapper.attr('id') || makingId();
		// 속성 설정
		$c_wrapper.addClass('ui-combobox-wrapper');
		$c_wrapper.find('label').addClass('ui-combobox-label');
		$c_wrapper.find('input').attr({
			'class': 'ui-combobox',
			'data-expanded': false,
			'readonly': true,
		});
		// 리스트박스 설정
		createListbox.call(this);
		// 버튼 설정
		createButton.call(this);
		// WAI-ARIA 설정
		$combobox.settings.usingAria && settingAria.call($combobox);
	}
	/** @private	settingAria */
	function settingAria() {
		var $c_wrapper = this.$el;
		$c_wrapper.attr('role', 'group');
		$c_wrapper.find('input').attr({
			'role': 'combobox',
			'aria-autocomplete': 'list',
			'aria-owns': this.id + '-list',
			'aria-haspopup': true,
			'aria-readonly': true,
			'aria-expanded': false,
			'aria-activedescendant': ''
		});
		$c_wrapper.find('button').attr({
			'aria-label': this.settings.buttonLabel + ' 열기'
		});
		$c_wrapper.find('button > span').attr('aria-hidden', true);
		$c_wrapper.find('ul').attr({
			'role': 'listbox',
			'aria-hidden': true
		});
		$c_wrapper.find('li').attr('role', 'option');
		// Aria 사용 설정 값이 false 일 경우, true로 변경
		if ( !this.settings.usingAria ) {
			this.settings.usingAria = true;
			console.info('WAI-ARIA가 적용되었습니다.');
		}
		return this;
	}
	/** @private	destroyAria */
	function destroyAria() {
		var $c_wrapper = this.$el;
		var aria_props = [
			'role',
			'aria-autocomplete',
			'aria-owns',
			'aria-haspopup',
			'aria-readonly',
			'aria-expanded',
			'aria-activedescendant'
		];
		$c_wrapper.removeAttr('role');
		var $combobox = $c_wrapper.find('input');
		while (aria_props.length) { $combobox.removeAttr( aria_props.pop() ); }
		$c_wrapper.find('button').removeAttr('aria-label');
		$c_wrapper.find('button > span').removeAttr('aria-hidden');
		$c_wrapper.find('ul')
			.removeAttr('role')
			.removeAttr('aria-hidden');
		this.settings.usingAria = false;
		console.info('WAI-ARIA가 해제되었습니다.');
		return this;
	}
	/** @private	createButton */
	function createButton() {
		var $c_wrapper = this.$el;
		var $combobox = $c_wrapper.find('input');
		var $button = $('<button>', {
			'type': 'button',
			'class': 'ui-combobox-button',
			'data-label': this.settings.buttonLabel + ' 열기',
			'html': '<span class="fa fa-angle-down"></span>'
		});
		$combobox.after($button);
	}
	/** @private	createListbox */
	function createListbox() {
		var $c_wrapper = this.$el;
		var options = this.settings.options;
		var $listbox = $('<ul>', {
			'id': this.id + '-list',
			'class': 'ui-combobox-list',
			'data-hidden': true
		});
		var i=0, l=options.length, option;
		for( ; (option = options[i]); i++ ) {
			$listbox.append( $('<li>', {
				'id': this.id + '-option-' + ++this.option_id_idx,
				'class': 'ui-combobox-list-option',
				'text': option
			}) );
		}
		$c_wrapper.append( $listbox );
	}
	/** @private	bindingEvents */
	function bindingEvents() {
		var combobox = this;
		var $c_wrapper = combobox.$el;
		var $combobox = $c_wrapper.find('input');
		var $combobox_button = $c_wrapper.find('button');
		var $combobox_options = $c_wrapper.find('li');
		// COMBOBOX
		// <input> [ click | keydown | blur ] 이벤트 핸들러 바인딩
		$combobox.on({
			'click': $.proxy(inputClick, combobox),
			'keydown': $.proxy(inputKeydown, combobox),
			'blur': $.proxy(inputBlur, combobox)
		});
		// COMBOBOX BUTTON
		// <button> [ click | keydown ] 이벤트 핸들러 바인딩
		$combobox_button.on({
			'click': $.proxy(toggleList, combobox),
			'keydown': $.proxy(inputKeydown, combobox)
		});
		// LISTBOX OPTIONS
		// <li> click 이벤트 핸들러 바인딩
		$.each($combobox_options, function(idx, el) {
			var $option = $combobox_options.eq(idx);
			$option.on('click', $.proxy(optionsClick, $option, idx, combobox));
		});
	}
	/**
	 *	@function inputClick
	 *	@param		{Event Object}	e
	 */
	function inputClick(e) {
		// 리스트박스(메뉴)가 닫혀있다면, 리스트박스(메뉴) 열림
		!isListOpen.call(this) && openList.call(this);
	}
	/**
	 *	@function inputKeydown
	 *	@param		{Event Object}	e
	 */
	function inputKeydown(e) {
		var $c_wrapper = this.$el;
		var $combobox = $c_wrapper.find('input');
		// alt 키를 사용자가 함께 눌렀을 경우
		if (e.altKey) {
			// UP(↑) 키 누르면, 리스트박스(메뉴) 열림
			if ( e.keyCode === keys.up ) {
				openList.call(this);
				// 리스트박스(메뉴)를 띄우면서 현재 활성화된 콤보박스 값을 저장
				$combobox.data( 'memory-value', $combobox.val() );
			}
			// DOWN(↓) 키 누르면, 리스트박스(메뉴) 닫힘
			e.keyCode === keys.down && closeList.call(this);
			return; // 함수 종료
		}
		// 리스트가박스(메뉴)가 열려있을 경우
		if (isListOpen.call(this)) {
			// UP(↑) 키를 누르면, 이전 옵션 탐색
			e.keyCode === keys.up && prevSelectOption.call(this);
			// DOWN(↓) 키를 누르면, 다음 옵션 탐색
			e.keyCode === keys.down && nextSelectOption.call(this);
			// pageUp 키 누르면, 처음 옵션 이동
			e.keyCode === keys.pageup && firstSelectOption.call(this);
			// pageDown 키 누르면, 마지막 옵션 이동
			e.keyCode === keys.pagedown && lastSelectOption.call(this);
			// esc 키를 누르면, 취소
			e.keyCode === keys.esc && escapeSelectOption.call(this);
			// enter, space 키를 누르면, 활성화
			(e.keyCode === keys.enter || e.keyCode === keys.space) && activeSelectOption.call(this);
			return; // 함수 종료
		}
		// 리스트박스(메뉴)가 열려있지 않다면
		else {
			// UP(↑) 키 누르면, 이전 옵션 선택
			if (e.keyCode === keys.up) {
				prevSelectOption.call(this);
				activeSelectOption.call(this);
			}
			// DOWN(↓) 키 누르면, 다음 옵션 선택
			if (e.keyCode === keys.down) {
				nextSelectOption.call(this);
				activeSelectOption.call(this);
			}
		}
	}
	/**
	 *	@function inputBlur
	 *	@param		{Event Object}	e
	 */
	function inputBlur(e) {
		// 0.1초 뒤에 리스트박스(메뉴) 닫음
		global.setTimeout( $.proxy(closeList, this) , 100);
	}
	/** @function focusSelectInput */
	function focusSelectInput() {
		this.$el.find('input').focus();
	}
	/**
	 *	@function isListOpen
	 *	@return	 {Boolean}		메뉴 열림/닫힘 여부 반환
	 */
	function isListOpen() {
		var $combobox = this.$el.find('input');
		return $combobox.attr('data-expanded') === 'true' ? true : false;
	}
	/** @function toggleList	리스트박스(메뉴) 토글 */
	function toggleList() {
		isListOpen.call(this) ? closeList.call(this) : openList.call(this);
		return this;
	}
	/** @function openList	리스트박스(메뉴) 열기 */
	function openList() {
		var $c_wrapper = this.$el;
		var $combobox = $c_wrapper.find('input');
		var $combobox_list = $c_wrapper.find('ul');
		var $combobox_button = $c_wrapper.find('button');
		$combobox.attr('data-expanded', true);
		$combobox_list.attr('data-hidden', false);
		$combobox_button
			.attr('data-label', this.settings.buttonLabel + ' 닫기')
			.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
		if (this.settings.usingAria) {
			$combobox.attr('aria-expanded', true);
			$combobox_list.attr('aria-hidden', false);
			$combobox_button.attr('aria-label', this.settings.buttonLabel + ' 닫기');
		}
		return this;
	}
	/** @function closeList	 리스트박스(메뉴) 닫기 */
	function closeList() {
		var $c_wrapper = this.$el;
		var $combobox = $c_wrapper.find('input');
		var $combobox_list = $c_wrapper.find('ul');
		var $combobox_button = $c_wrapper.find('button');
		$combobox.attr('data-expanded', false);
		$combobox_list.attr('data-hidden', true);
		$combobox_button
			.attr('data-label', this.settings.buttonLabel + ' 열기')
			.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
		if (this.settings.usingAria) {
			$combobox.attr('aria-expanded', false);
			$combobox_list.attr('aria-hidden', true);
			$combobox_button.attr('aria-label', this.settings.buttonLabel + ' 열기');
		}
		return this;
	}
	/**
	 *	@function optionsClick		선택된 옵션 .selected 라디오 클래스 적용
	 *	@param		{Number}				idx
	 */
	function optionsClick(idx, combobox) {
		radioOption.call(combobox, idx);
		activeSelectOption.call(combobox);
	}
	/** @function firstSelectOption	 처음 옵션 선택 */
	function firstSelectOption() {
		radioOption.call(this, 0);
	}
	/** @function lastSelectOption	 마지막 옵션 선택 */
	function lastSelectOption() {
		radioOption.call(this, this.options_len - 1);
	}
	/** @function prevSelectOption	이전 옵션 탐색 */
	function prevSelectOption() {
		radioOption.call(this, --this.selected_option_idx < 0 ? this.options_len - 1 : this.selected_option_idx);
	}
	/** @function nextSelectOption	다음 옵션 탐색 */
	function nextSelectOption() {
		radioOption.call(this, ++this.selected_option_idx > this.options_len - 1 ? 0 : this.selected_option_idx);
	}
	/** @function radioOption	 옵션 라디오 클래스/선택 */
	function radioOption(idx) {
		// 선택된 옵션 인덱스 업데이트
		var $combobox_options = this.$el.find('li');
		var $option = $combobox_options.eq(idx);
		// 클래소 속성 상태 업데이트
		$combobox_options.filter('.'+this.settings.activeClass).removeClass(this.settings.activeClass);
		$option.addClass(this.settings.activeClass);
		// 포커스/선택 상태 업데이트
		this.focused_option = $option;
		this.selected_option_idx = idx;
		// 업데이트
		updateInput.call(this, this.focused_option.text());
		updateListScrollTop.call(this, $option.position().top);
		this.settings.usingAria && updateSelectedOption.call(this, this.focused_option.attr('id') );
	}
	/** @function activeSelectOption	포커스된 옵션 활성화 */
	function activeSelectOption() {
		updateInput.call(this, this.focused_option.text());
		isListOpen.call(this) && closeList.call(this);
		focusSelectInput.call(this);
	}
	/** @function escapeSelectOption	esc 키를 누를 경우 실행되는 취소 */
	function escapeSelectOption() {
		var $combobox = this.$el.find('input');
		var $combobox_options = this.$el.find('li');
		var memory_value = $combobox.data('memory-value');
		var id = $combobox_options.filter(':contains('+memory_value+')').attr('id');
		updateInput.call(this, memory_value );
		isListOpen.call(this) && closeList.call(this);
		focusSelectInput.call(this);
		this.settings.usingAria && updateSelectedOption.call(this, id );
	}
	/**
	 *	@function updateInput	 COMBOBOX <input> 값 업데이트
	 *	@param		{String}	value
	 */
	function updateInput(value) {
		this.$el.find('input').val(value);
	}
	/**
	 *	@function updateSelectedOption	선택된 옵션 id 값 업데이트
	 *	@param		{String}	id
	 */
	function updateSelectedOption(id) {
		this.$el.find('input').attr('aria-activedescendant', id);
	}
	/**
	 *	@function updateListScrollTop	리스트박스(메뉴) 스크롤 높이 업데이트
	 *	@param		{Number}	top
	 */
	function updateListScrollTop(top) {
			this.$el.find('ul').stop().animate({ 'scrollTop': top }, 200, 'linear');
	}

})(this, this.jQuery);