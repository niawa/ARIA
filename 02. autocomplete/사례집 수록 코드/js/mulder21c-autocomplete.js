(function(window, $){
	'use strict';
	var $autocomplete = $('#autocomplete'),
		// combobox로 설정할 input 요소를 참조
		$txtField = $autocomplete.find('input:text'),
		// 추천 키워드 wrapper 요소 참조
		$suggestedWrap = $('<div />'),
		// 상태 정보를 업데이트할 요소 참조
		$status = $('<div class="hidden-accessible" />'),
		// 사용자의 키보드 네비게이팅 이전 값을 저장해 두기 위한 변수
		orgKeyword = '',
		// 사용자의 키 입력 중 수시로 추천 검색어를 가져오는 것을 방지하기 위한 타이머
		delayTimer = null;

	// WAI-ARIA Role, Property, State 초기화
	$txtField.attr({
		'role' : 'combobox',
		'aria-haspopup' : 'true',
		'aria-autocomplete' : 'list',
		'autocomplete' : 'off'
	});
	$suggestedWrap.appendTo($autocomplete);
	$status.attr({
		'role' : 'status',
		'aria-live' : 'polite',
		'aria-relevant' : 'additions'
	}).appendTo($autocomplete);

	// $txtField 요소에 keyboard 이벤트 핸들러 바인딩
	$txtField.on({
		keyup : updateList,
		keydown : bindKeyEvent
	});

	/**
	 * @function updateList
	 * @param {event} event
	 */
	function updateList(event){
		event = event || window.event;
		event.stopImmediatePropagation();
		var keycode = event.which || event.keyCode;
		var keyword = $txtField.val();
		if( orgKeyword === keyword ){
			return;
		}
		switch(keycode){
			case 13 :
			case 27 :
			case 38 :
			case 40 :
				event.preventDefault ? event.preventDefault() : event.returnValue = false;
				break;
			default :
				orgKeyword = keyword;
				// 일정 시간 동안 키 입력이 없을 때 API 호출
				clearTimeout(delayTimer);
				delayTimer = setTimeout(function(){
					if( keyword === '' ){
						removeList();
						return;
					}
					callAPI(keyword);
				}, 400);
		}
	}

	/**
	 * @function callAPI
	 * @param {string} keyword
	 */
	function callAPI(keyword){
		$.ajax({
			url : 'https://apis.daum.net/search/book',
			data : {
				apikey : 'a8cf3d52fc7b462f40a4469099d8e11a',
				output : 'json',
				display : 15,
				searchType : 'title',
				sort : 'accu',
				q : keyword
			},
			method : 'GET',
			dataType : 'jsonp',
			cache : false
		})
		.done(function(data){
			// JSON 데이터 가공 (검색어로 쓸 데이터만 추출)
			for (var i = -1, source = [], item = null;
					item = data.channel.item[++i] ; ){
				source.push(
					item['title'].replace(/\&lt;b\&gt;|\&lt;\/b\&gt;/g, '')
				)
			}
			// 추출된 검색어 목록으로 검색 목록을 렌더링
			renderList(source);
		});
	}

	/**
	 * @function renderList
	 * @param {array} source
	 */
	var $suggestedList = null;
	function renderList(source){
		if($suggestedList === null){
			// 추천 검색어 목록 생성
			$suggestedList = $('<ul class="listbox" />');
			// 추천 검색어 목록 초기화
			// WAI-ARIA 적용, 이벤트 바인딩
			$suggestedList
			.attr({
				'role' : 'listbox',
				'data-count' : source.length
			})
			.appendTo($suggestedWrap)
			.on({
				'mousedown' : function(event){
					// 마우스로 선택 시 처리
					event = event || window.event;
					event.stopPropagation();
					var activatedItem = $txtField.attr('aria-activedescendant');
					deSelectItem($('#' + activatedItem).index());
					selectItem($(this).index());
				}
			}, 'li');
			// 추천 검색어 목록 외 영역 클릭시 초기화 처리
			$(document).on({
				mousedown : function(event){
					event = event || window.event;
					if(event.target === $txtField[0]){
						return;
					}
					removeList();
				}
			});
		}

		// source로부터 추천 검색어 항목 생성
		var docFrag = document.createDocumentFragment();
		for(var i = -1, item = null; item = source[++i];){
			$('<li />')
			 .attr({'id' : 'item' + i, 'role' : 'option'})
			 .text(item)
			 .appendTo(docFrag);
		}
		$suggestedList
			.attr({
				'data-count' : source.length
			})
			.empty()
			.append(docFrag);

		// 상태 정보 업데이트
		$txtField.removeAttr('aria-activedescendant').attr({'aria-expanded' : 'true'});
		var state = $('<div />').text(source.length + '개의 추천 검색어가 있습니다.');
		$status.empty().append(state);
	}

	/**
	 * @function bindKeyEvent
	 * @param {event} event
	 */
	function bindKeyEvent(event){
		event = event || window.event;
		event.stopImmediatePropagation();
		var keycode = event.keyCode || event.which,
			idx = 0,
			activatedItem = $txtField.attr('aria-activedescendant');
		switch(keycode){
			case 13 :	// enter
				// 선택된 항목이 있는 경우
				if(activatedItem !== undefined){
					event.preventDefault ? event.preventDefault() : event.returnValue = false;
					$txtField.val($('#' + activatedItem).text());
					$txtField.parents('form').submit();
				}else{
					$txtField.parents('form').submit();
				}
				break;
			case 27 :	// Esc
				event.preventDefault ? event.preventDefault() : event.returnValue = false;
				$txtField.val(orgKeyword);
				removeList();
				break;
			case 38 :	// up arrow key
				event.preventDefault ? event.preventDefault() : event.returnValue = false;
				if($suggestedList === null ){
					return;
				}
				if( $txtField.attr('aria-activedescendant') === undefined ){
					idx = -1;
				}else{
					idx = $txtField
							.attr('aria-activedescendant')
							.replace('item', '') * 1 - 1;
				}
				deSelectItem(idx + 1);
				selectItem(idx);
				break;
			case 40 :	// down arrow key
				event.preventDefault ? event.preventDefault() : event.returnValue = false;
				if($suggestedList === null ){
					return;
				}
				if( $txtField.attr('aria-activedescendant') === undefined ){
					orgKeyword = $txtField.val();
					idx = 0;
				}else{
					idx = $txtField.attr('aria-activedescendant')
						.replace('item', '') * 1 + 1;
				}
				deSelectItem(idx - 1);
				selectItem(idx);
				break;
		}
	}

	/**
	 * @function selectItem
	 * @param {number} idx the index number of Item that will be selected
	 */
	function selectItem(idx){
		if(idx < 0 || $suggestedList === null || idx >= $suggestedList.data('count') ){
			$txtField.val(orgKeyword);
			removeList();
			return;
		}
		var value = $suggestedList
						.children('li:eq('+ idx +')')
						.addClass('active')
						.text();
		$txtField
			.attr({
				'aria-activedescendant' : 'item' + idx
			})
			.val(value);
	}

	/**
	 * @function deSelectItem
	 * @param {number} idx the index number of Item that will be deselected
	 */
	function deSelectItem(idx){
		$suggestedList.children('li:eq('+ idx +')').removeClass('active');
	}

	/**
	 * @function removeList
	 */
	function removeList(){
		if( $suggestedList !== null){
			$suggestedList.remove();
			$suggestedList = null;
			$txtField.removeAttr('aria-activedescendant').attr({'aria-expanded' : 'false'});
			$status.empty();
		}
	}

})(window, jQuery);