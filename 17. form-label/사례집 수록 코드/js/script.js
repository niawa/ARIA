/*! form-label.js © yamoo9.net, 2016 */
;(function(global, $) {
	'use strict';

	// 아이디 입력 필드 참조
	var $r_id = $('#register_id');
	$r_id.data('pristine', true);
	// 이벤트 핸들러(함수) 연결
	$r_id.on('keyup', $.proxy(validateId, $r_id));
	// 아이디 유효성 검사 함수
	function validateId(e) {
		// 사용자가 입력한 아이디 값 참조(양쪽 공백 제거)
		var value = $.trim( this.val() );
		// 아이디 최소 입력 값
		var min = this.attr('minlength') || 0;
		// 아이디 최대 입력 값
		var max = this.attr('maxlength') || 20;
		var $form_group = this.closest('.form-group');
		// 주의 요소 참조
		var $alert = this.next('[role="alert"]');
		// 정규표현식 객체 생성
		var reg_id = new RegExp('^[A-Za-z0-9_]{'+min+','+max+'}$');
		// 특수문자 체크를 위한 정규표현식(리터럴)
		var reg_special_char = /[~!@\#$%<>^&*\()\-=+\’]/gi;
		// 한글 정규 표현식
		var reg_kor_char = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

		// 사용자 입력 값 확인 검증
		// 유효하지 않은 값을 입력한 경우 상태 변경
		if ($r_id.data('pristine')) {
			$r_id.data('pristine', false);
			return;
		}
		if ( !reg_id.test(value) ) {
			this.attr({
				'aria-invalid': true,
				'aria-describedby': 'id_error'
			});
			if ( reg_special_char.test(value) ) {
				$alert.text('특수 문자는 _ 만 가능. (#,@,!,$,%,^,&,*,<,>,(,),-,=,+ 사용하면 안됨)');
			}
			else if ( reg_kor_char.test(value) ) {
				$alert.text('한글이 포함되면 안됨');
			} else {
				$alert.text('영문자, 숫자, _만 입력 가능(최소 3자)');
			}
			$form_group.addClass('has-error');
		}
		// 유효한 값을 입력한 경우 상태 변경
		else {
			this.attr({
				'aria-invalid': false,
				'aria-describedby': 'id_info'
			});
			$alert.text('');
			$form_group.removeClass('has-error').addClass('has-success');
		}
	}

})(this, this.jQuery);