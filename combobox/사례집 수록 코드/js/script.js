/*! combobox.js © yamoo9.net, 2016 */
;(function(global, $) {
	'use strict';

	/** @type {Object} 키보드 객체 */
	var keys = {
		'tab'		: 9,
		'enter'		: 13,
		'alt'		: 18,
		'esc'		: 27,
		'space'		: 32,
		'pageup'	: 33,
		'pagedown'	: 34,
		'left'		: 37,
		'up'		: 38,
		'right'		: 39,
		'down'		: 40,
	};

	// ----------------------------------------------------
	// 초기화 (Initialization)

	/** @type {jQuery Object} 컴포넌트 문서 객체 참조 */
	var $combobox_wrapper = $('.ui-combobox-wrapper');
	var $combobox				 = $combobox_wrapper.find('.ui-combobox');
	var $combobox_button	= $combobox_wrapper.find('.ui-combobox-button');
	var $combobox_list		= $combobox_wrapper.find('.ui-combobox-list');
	var $combobox_options = $combobox_list.find('.ui-combobox-list-option');
	/** @type {Number} 리스트박스 옵션 개수 */
	var options_len = $combobox_options.length;
	/** @type {Number} 리스트박스 높이(보더까지 포함) */
	var list_height = $combobox_list.outerHeight();
	/** @type {Number} 선택된 리스트박스 옵션 인덱스 */
	var selected_option_idx = 0;
	/** @type {Null | jQuery Object} 포커스된 옵션 jQuery 객체 */
	var focused_option = null;

	// 이벤트 핸들러 바인딩 함수 호출
	bindEventHandler();

	// ----------------------------------------------------
	// 설정 (Setting)

	/** @function bindEventHandler */
	function bindEventHandler() {
		// COMBOBOX
		// <input> [ click | keydown | blur ] 이벤트 핸들러 바인딩
		$combobox.on({
			'click': inputClick,
			'keydown': inputKeydown,
			'blur': inputBlur
		});
		// COMBOBOX BUTTON
		// <button> [ click | keydown ] 이벤트 핸들러 바인딩
		$combobox_button.on({
			'click': toggleList,
			'keydown': inputKeydown
		});
		// LISTBOX OPTIONS
		// <li> click 이벤트 핸들러 바인딩
		$.each($combobox_options, function(idx, el) {
			var $option = $combobox_options.eq(idx);
			$option.on('click', $.proxy(optionsClick, $option, idx));
		});
	}
	/**
	 *	@function inputClick
	 *	@param		{Event Object}	e
	 */
	function inputClick(e) {
		// 리스트박스(메뉴)가 닫혀있다면, 리스트박스(메뉴) 열림
		!isListOpen() && openList();
	}
	/**
	 *	@function inputKeydown
	 *	@param		{Event Object}	e
	 */
	function inputKeydown(e) {
		// alt 키를 사용자가 함께 눌렀을 경우
		if (e.altKey) {
			// UP(↑) 키 누르면, 리스트박스(메뉴) 열림
			if ( e.keyCode === keys.up ) {
				openList();
				// 리스트박스(메뉴)를 띄우면서 현재 활성화된 콤보박스 값을 저장
				$combobox.data( 'memory-value', $combobox.val() );
			}
			// DOWN(↓) 키 누르면, 리스트박스(메뉴) 닫힘
			e.keyCode === keys.down && closeList();
			return; // 함수 종료
		}
		// 리스트가박스(메뉴)가 열려있을 경우
		if (isListOpen()) {
			// UP(↑) 키를 누르면, 이전 옵션 탐색
			e.keyCode === keys.up && prevSelectOption();
			// DOWN(↓) 키를 누르면, 다음 옵션 탐색
			e.keyCode === keys.down && nextSelectOption();
			// pageUp 키 누르면, 처음 옵션 이동
			e.keyCode === keys.pageup && firstSelectOption();
			// pageDown 키 누르면, 마지막 옵션 이동
			e.keyCode === keys.pagedown && lastSelectOption();
			// esc 키를 누르면, 취소
			e.keyCode === keys.esc && escapeSelectOption();
			// enter, space 키를 누르면, 활성화
			(e.keyCode === keys.enter || e.keyCode === keys.space) && activeSelectOption();
			return; // 함수 종료
		}
		// 리스트박스(메뉴)가 열려있지 않다면
		else {
			// UP(↑) 키 누르면, 이전 옵션 선택
			if (e.keyCode === keys.up) {
				prevSelectOption();
				activeSelectOption();
			}
			// DOWN(↓) 키 누르면, 다음 옵션 선택
			if (e.keyCode === keys.down) {
				nextSelectOption();
				activeSelectOption();
			}
		}
	}
	/**
	 *	@function inputBlur
	 *	@param		{Event Object}	e
	 */
	function inputBlur(e) {
		// 0.1초 뒤에 리스트박스(메뉴) 닫음
		global.setTimeout(closeList, 100);
	}
	/** @function focusSelectInput */
	function focusSelectInput() {
		$combobox.focus();
	}
	/**
	 *	@function isListOpen
	 *	@return	 {Boolean}		메뉴 열림/닫힘 여부 반환
	 */
	function isListOpen() {
		return $combobox.attr('aria-expanded') === 'true' ? true : false;
	}
	/** @function toggleList	리스트박스(메뉴) 토글 */
	function toggleList() {
		isListOpen() ? closeList() : openList();
	}
	/** @function openList	리스트박스(메뉴) 열기 */
	function openList() {
		$combobox.attr('aria-expanded', true);
		$combobox_list.attr('aria-hidden', false);
		$combobox_button
			.attr('aria-label', '지역 선택 목록 닫기')
			.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
	}
	/** @function closeList	 리스트박스(메뉴) 닫기 */
	function closeList() {
		$combobox.attr('aria-expanded', false);
		$combobox_list.attr('aria-hidden', true);
		$combobox_button
			.attr('aria-label', '지역 선택 목록 열기')
			.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
	}

	/**
	 *	@function optionsClick		선택된 옵션 .selected 라디오 클래스 적용
	 *	@param		{Number}				idx
	 */
	function optionsClick(idx) {
		radioOption(idx);
		activeSelectOption();
	}
	/** @function firstSelectOption	 처음 옵션 선택 */
	function firstSelectOption() {
		radioOption(0);
	}
	/** @function lastSelectOption	 마지막 옵션 선택 */
	function lastSelectOption() {
		radioOption(options_len - 1);
	}
	/** @function prevSelectOption	이전 옵션 탐색 */
	function prevSelectOption() {
		radioOption(--selected_option_idx < 0 ? options_len - 1 : selected_option_idx);
	}
	/** @function nextSelectOption	다음 옵션 탐색 */
	function nextSelectOption() {
		radioOption(++selected_option_idx > options_len - 1 ? 0 : selected_option_idx);
	}
	/** @function radioOption	 옵션 라디오 클래스/선택 */
	function radioOption(idx) {
		// 선택된 옵션 인덱스 업데이트
		var $option = $combobox_options.eq(idx);
		focused_option = $option;
		selected_option_idx = idx;
		$combobox_options.filter('.selected').removeClass('selected');
		$option.addClass('selected');
		updateSelectedOption( focused_option.attr('id') );
		updateInput(focused_option.text());
		updateListScrollTop($option.position().top);
	}
	/** @function activeSelectOption	포커스된 옵션 활성화 */
	function activeSelectOption() {
			updateInput(focused_option.text());
			isListOpen() && closeList();
			focusSelectInput();
	}
	/** @function escapeSelectOption	esc 키를 누를 경우 실행되는 취소 */
	function escapeSelectOption() {
			var memory_value = $combobox.data('memory-value');
			var id = $combobox_options.filter(':contains('+memory_value+')').attr('id');
			updateInput( memory_value );
			updateSelectedOption( id );
			isListOpen() && closeList();
			focusSelectInput();
	}

	/**
	 *	@function updateInput	 COMBOBOX <input> 값 업데이트
	 *	@param		{String}	value
	 */
	function updateInput(value) {
		$combobox.val(value);
	}
	/**
	 *	@function updateSelectedOption	선택된 옵션 id 값 업데이트
	 *	@param		{String}	id
	 */
	function updateSelectedOption(id) {
		$combobox.attr('aria-activedescendant', id);
	}
	/**
	 *	@function updateListScrollTop	리스트박스(메뉴) 스크롤 높이 업데이트
	 *	@param		{Number}	top
	 */
	function updateListScrollTop(top) {
			$combobox_list.stop().animate({ 'scrollTop': top }, 200, 'linear');
	}

})(this, this.jQuery);
