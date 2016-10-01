/*! carousel.js © yamoo9.net, 2016 */
;(function(global, $) {
	'use strict';

	// 캐로셀 UI를 설정할 대상 요소를 jQuery 인스턴스 객체로 변수에 참조
	var $widget = $('#yamoo9-carousel');
	// 캐로셀 UI 탭 패널 요소 수집 후, jQuery 인스턴스 객체로 변수에 참조
	var $tabpanel = $widget.children();
	// 캐로셀 UI 인디케이터 컨테이너 요소 생성 후, 변수에 참조
	var $tablist = $('<ol role="tablist">');
	// 동적으로 생성될 인디케이터 템플릿
	var template_indicators = [
		'<li role="presentation">',
		'<a href="#" role="tab">',
		'<span class="readable-hidden"></span>',
		'</a>',
		'</li>'
	].join('');
	// 캐로셀 UI 탭 패널 요소를 순환한 후, 템플릿을 활용하여 동적으로 코드 생성
	$.each($tabpanel, function(idx) {
		// 개별 탭 패널 참조
		var $panel = $tabpanel.eq(idx);
		// 탬플릿 문자열로 탭 요소 생성 후, 변수에 참조
		var $tab = $(template_indicators);
		// 탭 패널의 레이블 설정 값을 label 변수에 참조
		var label = $panel.attr('data-label');
		// 탭 내부에서 span요소를 찾아 label 속성 값을 콘텐츠로 설정
		// label 변수 값이 존재하지 않으면, 패널 내부의 제목(첫번째 매칭 요소) 콘텐츠를 설정
		// 제목 또한 존재하지 않으면 '슬라이드 N'으로 설정
		$tab.find('span').text(label || $panel.find(':header:eq(0)').text() || '슬라이드 ' + (idx + 1));
		$tab.attr('title', label || $panel.find(':header:eq(0)').text() || '슬라이드 ' + (idx + 1));
		// 완성된 코드는 $tablist에 마지막 자식 요소로 삽입
		$tab.appendTo($tablist);
	});
	// 완성된 $tablist 요소를 $widget 요소의 첫번째 자식 요소로 삽입힌다.
	$widget.prepend($tablist);
	// 이전/다음 슬라이드 보기 버튼 추가
	$.each(['prev', 'next'], function(idx, feature) {
		$('<button type="button" class="ui-carousel__button ui-carousel__button--' + feature + '">')
			.html('<span class="readable-hidden"></span>').appendTo($widget);
	});

	// 이전/다음 슬라이드 탐색 버튼을 찾아 변수 $buttons에 참조
	var $buttons = $('.ui-carousel__button');

	// $widget 요소에 클래스 속성 식별자 및 WAI-ARIA 적용
	$widget.attr({
		// 클래스 식별자
		'class': 'ui-carousel',
		// 역할
		'role': 'region',
		// 속성
		'aria-label': $widget.attr('data-label') || $widget.children(':header:eq(0)').text() || '캐로셀 UI: 슬라이드 메뉴'
	});
	// 탭 리스트 요소에 클래스 속성 식별자 추가
	$tablist.addClass('ui-carousel__indicators');
	// 탭 리스트 내부 탭에 클래스 속성 식별자 추가
	var $tabs = $tablist.find('[role="tab"]');
	$.each($tabs, function(idx) {
		// 개별 탭 참조
		var $tab = $tabs.eq(idx);
		// 0을 붙인 숫자로 변경하는 함수를 사용하여 반환된 결과를 num 변수에 참조
		var num = readingZeroNum(idx);
		var slide_id = 'ui-carousel__slide--' + num;
		$tab.attr({
			'id': 'ui-carousel__tab--' + num,
			'class': 'ui-carousel__tab',
			'aria-controls': slide_id,
			'aria-selected': false,
			'tabindex': -1
		});
		// 탭 패널에 클래스 속성 식별자 추가
		var $panel = $tabpanel.eq(idx);
		$panel.attr({
			'class': 'ui-carousel__tabpanel',
			'id': slide_id,
			'role': 'tabpanel',
			'aria-labelledby': 'ui-carousel__tab--01',
			'aria-hidden': true
		});
	});

	// 슬라이드를 감싸는 영역을 동적으로 생성
	$tabpanel.wrapAll('<div class="ui-carousel__tabpanel-wrapper">');

	// 0을 붙인 숫자로 변경하여 반환하는 헬퍼 함수
	function readingZeroNum(idx) {
		var num = idx + 1;
		return 10 > num ? '0' + num : num;
	}

	// -----------------------------------------------------

	// $tabs를 반복 순환하여 개별 $tab 요소에
	// 이벤트 ↔ 이벤트 핸들러 바인딩
	$.each($tabs, function(idx) {
		// 개별 $tab 참조
		var $tab = $tabs.eq(idx);
		// $tab 요소에 이벤트 핸들러 바인딩
		// $.proxy() 프록시 우회 메소드를 사용하여
		// this 컨텍스트 참조 변수 설정
		$tab.on('click', $.proxy(activeSlide, $tab));
	});

	// 슬라이드 활성화 이벤트 핸들러(함수) 정의
	function activeSlide(e) {
		// 브라우저 기본 동작 차단
		e.preventDefault();
		var index = getIndex.call(this);
		// 사용자 상호작용에 따른 "선택 상태" 변경 메소드 호출
		changeStateSelect.call(this);
		// 사용자 상호작용에 따른 "감춤 상태" 변경 메소드 호출
		changeStateHidden.call(this);
		// 탭 패널의 부모 요소(<ol>)의 left 위치 값을 선택된 탭의 인덱스에 따라 변경
		// $tabpanel.parent().css('left', $tabpanel.outerWidth() * index * -1);
		$tabpanel.parent().stop().animate({
			'left': $tabpanel.outerWidth() * index * -1
		});
		// 버튼 텍스트 업데이트
		updateButtonText(index);
	}

	// 선택 상태 변경 함수
	function changeStateSelect() {
		// 선택된 탭의 부모 형제의 자식 중 role 속성 값이 tab 인 요소를 찾아
		// WAI-ARIA 상태 변경
		// 키보드 포커싱이 되지 않도록 설정
		// active 클래스 속성 제거
		this.parent().siblings().find('[role="tab"]').attr({
			'aria-selected': false,
			'tabindex': -1
		}).removeClass('active');
		// 선택된 탭 요소의 WAI-ARIA 상태 변경
		// 키보드 포커싱이 되도록 설정
		// active 클래스 속성 추가
		this.attr({
			'aria-selected': true,
			'tabindex': 0
		}).addClass('active');
	}

	// 감춤 상태 변경 함수
	function changeStateHidden() {
		// 사용자가 선택한 탭의 aria-controls 속성 값을 통해
		// 제어해야 할 탭 패널(슬라이드)를 필터링한다.
		var $panel = $tabpanel.filter('#' + this.attr('aria-controls'));
		// 필터링된 탭 패널의 형제 요소 중, aria-selected 속성을 가진 요소를 찾아
		// 감춤 상태를 업데이트 한다.
		$panel.siblings(['aria-selected']).attr({
			'aria-hidden': true
		}).find('a').attr('tabindex', -1);
		// 사용자가 선택한 탭이 제어하는 탭 패널의 감춤 상태를 업데이트 한다.
		$panel.attr({
			'aria-hidden': false
		}).find('a').removeAttr('tabindex');
	}

	// 인덱스를 반환하는 함수
	function getIndex() {
		// 선택된 탭의 aria-controls 속성 값에서
		// 인덱스 정보를 뽑아 반환한다.
		return Number(this.attr('aria-controls').split('--')[1]) - 1;
	}

	// 탭을 활성화하는 함수
	function activeTab(id) {
		// 전달된 id 인자 값에 따라 활성화할 탭 필터링
		var $filter, type = $.type(id);
		// 숫자일 경우, 해당 숫자에 해당하는 탭 활성화
		if (type === 'number') {
			$filter = $tabs.eq(id - 1);
		}
		// 문자일 경우, 해당 선택자에 해당하는 탭 활성화
		else if (type === 'string') {
			$filter = $tabs.filter(id);
		}
		// 숫자,문자가 아닐 경우 오류 메시지 출력 후, 함수 종료
		else {
			return console.error('숫자 또는 선택자(문자)를 입력해주세요.');
		}
		// 필터링 된 탭 활성화(클릭)
		$filter.trigger('click');
	}

	// -----------------------------------------------------

	// $buttons 요소에 click 이벤트 핸들러 바인딩
	// 이벤트 핸들러 activeTabWithButton
	$buttons.on('click', activeTabWithButton);

	// activeTabWithButton 함수 정의
	function activeTabWithButton() {
		// 활성화 된 탭을 찾아 $tab 변수에 참조
		var $tab = $tabs.filter('.active');
		// getIndex 함수를 사용하여 활성화 된 탭의 인덱스 값 index 변수에 참조
		var index = getIndex.call($tab) + 1;
		// 사용자가 클릭한 버튼이 이전 버튼인지 확인
		// 이전 버튼일 경우 true 값이 isClickPrevBtn 변수에 참조
		var isClickPrevBtn = this.getAttribute('class').indexOf('prev') > -1;
		// $tabs의 개수 값을 length 변수에 참조
		var length = $tabs.length;
		// isClickPrevBtn 참조 값이 참일 경우 실행
		if (isClickPrevBtn) {
			// 유효한 index 값을 설정함
			index = --index > 0 ? index : length;
		}
		// isClickPrevBtn 참조 값이 거짓일 경우 실행
		else {
			// 유효한 index 값을 설정함
			index = ++index <= length ? index : 1;
		}
		// 해당 index에 해당하는 탭 활성화
		activeTab(index);
	}

	// 버튼 텍스트 업데이트 함수
	function updateButtonText(idx) {
		// 전달받은 idx 값을 사용하여 활성화된 탭을 $tab 변수에 참조
		var $tab = $tabs.eq(idx - 1);
		// getIndex() 함수를 사용하여 활성화된 탭의 index 값을 참조
		var index = getIndex.call($tab);
		// $buttons 객체에 수집된 요소 중 이전 버튼을 필터링하여 참조
		var $prevBtn = $buttons.filter('.ui-carousel__button--prev');
		// $buttons 객체에 수집된 요소 중 다음 버튼을 필터링하여 참조
		var $nextBtn = $buttons.filter('.ui-carousel__button--next');
		// 이전 버튼에 삽입되어야 할 텍스트를 탭 내부의 span 요소에서 참조
		var prevText = $tabs.eq(index - 1).find('span').text();
		// 다음 버튼에 삽입되어야 할 텍스트를 탭 내부의 span 요소에서 참조
		var nextText = $tabs.eq(index + 1 === 3 ? 0 : index + 1).find('span').text();
		// 이전 버튼 내부의 span 요소에 prevText 값 설정
		$prevBtn.find('span').text(prevText);
		// 이전 버튼의 title 속성에 prevText 값 설정
		$prevBtn.attr('title', prevText);
		// 다음 버튼 내부의 span 요소에 nextText 값 설정
		$nextBtn.find('span').text(nextText);
		// 다음 버튼의 title 속성에 nextText 값 설정
		$nextBtn.attr('title', nextText);
	}

	// -----------------------------------------------------

	// 키보드로 제어하는 탭 내비게이션 활성화를 위한 이벤트 핸들링
	$tabs.on('keydown', activeKeyboardNavigation);
	// 키보드로 제어하는 탭 내비게이션 활성화 함수 정의
	function activeKeyboardNavigation(e) {
		// 키코드 변수 값 참조
		var key = e.keyCode;
		// 활성화된 탭 정보를 가져와 변수에 참조
		var $tab = $tabs.filter('.active');
		var index = getIndex.call($tab) + 1;
		var length = $tabs.length;
		// 사용자가 키보드 ←, ↑ 누를 경우 처리되는 조건
		if (key === 37 || key === 38) {
			// 유효한 인덱스 값을 설정
			index = --index > 0 ? index : length;
		}
		// 사용자가 키보드 →, ↓ 누를 경우 처리되는 조건
		else if (key === 39 || key === 40) {
			// 유효한 인덱스 값을 설정
			index = ++index <= length ? index : 1;
		}
		// 설정한 키보드 키가 아닌 경우 함수 종료
		else {
			return;
		}
		// 해당 인덱스의 탭 활성화
		activeTab(index);
		// 활성화 된 탭에 포커스 설정
		$tabs.filter('.active').focus();
	}

	// 활성화 할 탭 인덱스를 설정
	activeTab(2);

})(this, this.jQuery);