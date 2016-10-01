$(document).ready(function(){
	var value = $("#placeholder-name").text();
	$("#name").val(value);
	$('#name').focusin(function(){//포커스가 들어왔을 때
		if($( "#name" ).val() == value){//텍스상자의 내용과 placeholder의 내용이 같으면
			$("#name").css("color","#000000");//입력색상으로 변경(placeholder 기능)
			$('#name').val("");//기존에 있던 내용을 모두 삭제(placeholder 기능)
		}
	});

	$("#name").focusout(function(){//포커스가 나갔을 때
		if($( "#name" ).val()==""){//내용이 비어있다면
			$("#name").val(value);//”예)홍길동으로 설정
			$("#name").css("color","#777");//placeholder 색상으로 설정
			$("#name").css("opacity","1");//
		}else{//내용이 비어 있지 않다면
			$("#name").css("color","#000000");//입력상자 색상으로 설정
		}
	});
});