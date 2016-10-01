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
	// id가 #allCheck를 클릭하면
	$('#allCheck').click(function() {
		// 한개라도 aria-checked 속성과 true 값을 갖고 있다면
		if ($(this).attr('aria-checked') === 'true') {
			//checkbox 속성을 갖고 있는 li의 aria-checked 속성은 true로 변경
			$('li[role=checkbox]').attr('aria-checked', 'true');
		} else {
			//그렇지 않으면 checkbox 속성을 갖고 있는 li의 aria-checked 속성은 false로 변경
			$('li[role=checkbox]').attr('aria-checked', 'false');
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
	$('#allCheck').keydown(function(e) {
		if (e.keyCode == '32') {
			if ($(this).attr('aria-checked') === 'true') {
					$('li[role=checkbox]').attr('aria-checked', 'true');
			} else {
				$('li[role=checkbox]').attr('aria-checked', 'false');
			}
		}
	});
});