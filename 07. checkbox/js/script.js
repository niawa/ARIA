$(document).ready(function() {
	//checkbox 속성을 갖고 있는 li를 클릭할 때
	$('li[role=checkbox]').click(function() {
		// aria-checked 속성이 true이면 false로 변경
		if ($(this).attr('aria-checked') === 'true') {
			$(this).attr('aria-checked', 'false');
		} else {
			// 그렇지 않으면 true로 변경
			$(this).attr('aria-checked', 'true');
		}
	});

	// 위와 동일한 이벤트 핸들러이며 스페이스바를 동작을 위해 추가
	$('li[role=checkbox]').keydown(function(e) {
		// 스페이스바 키 번호 32
		if (e.keyCode == '32') {
			if ($(this).attr('aria-checked') === 'true') {
				$(this).attr('aria-checked', 'false');
			} else {
				$(this).attr('aria-checked', 'true');
			}
		}
	});
});

$(document).ready(function() {
	$('.checkbox2').click(function() {
		if ($(this).attr('data-class') === 'check') {
			$(this).attr('data-class', 'nocheck');
		} else {
			$(this).attr('data-class', 'check');
		}
	});
});