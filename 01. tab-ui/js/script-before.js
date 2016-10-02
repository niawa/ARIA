$(document).ready(function() {
	$('.tab-list-before > li').keyup(function(e){
		var keyCode = e.keyCode || e.which;//키보드 코드값  
		if(keyCode == 39 || keyCode ==	40){// 오른쪽방향키 이거나 아래 방향키
			 // 브라우저의 기본 동작을 취소한다.
			e.preventDefault();
			// 다음 tab 요소에 selectedItem class를 추가하고 
			// 형제요소중에 자신 tab 이외의 나머지 tab 요소들을 selectedItem class를 삭제한다.
			$(this).next().addClass("selectedItem").siblings().removeClass("selectedItem")
			
			//다음 tab요소의 data-controls의 값을 가져온다.(이 값은 tab요소의 컨텐츠를 담고 있는 section요소의 id값과 일치함)
			var selectedId = "#"+$(this).next().data("controls");
			
			//tab요소의 컨텐츠를 담고 있는 unvisual class을 삭제하고 나머지 형제요소에 unvisual class을 추가한다.
			$(selectedId).removeClass("unvisual").siblings().addClass("unvisual");
			
			// 다음요소로 포커스를 이동한다.
			$(this).next().focus();
			
			//마지막요소에서 오른쪽 방향키나 아래 방향키를 눌렀을 경우
			if($(this).next().prevObject.data("controls")=='section3-before'){
				//tab, tabpanel,focus 모두 처음으로 이동 
				$('#tab1-before').addClass("selectedItem").siblings().removeClass("selectedItem");
				$('#section1-before').removeClass("unvisual").siblings().addClass("unvisual");
				$('#tab1-before').focus();
			}
		}
		if(keyCode == 37 || keyCode ==38){// 왼쪽방향키 이거나 위쪽 방향키
			e.preventDefault();
			// 이전 tab 요소에 selectedItem class를 추가하고 
			// 형제요소중에 자신 tab 이외의 나머지 tab 요소들을 selectedItem class를 삭제한다.
			$(this).prev().addClass("selectedItem").siblings().removeClass("selectedItem");
			
			//이전 tab요소의 data-controls의 값을 가져온다.(이 값은 tab요소의 컨텐츠를 담고 있는 section요소의 id값과 일치함)
			var selectedId = "#"+$(this).prev().data("controls");
			//tab요소의 컨텐츠를 담고 있는 unvisual class을 삭제하고 나머지 형제요소에 unvisual class을 추가한다.
			$(selectedId).removeClass("unvisual").siblings().addClass("unvisual");
			// 이전요소로 포커스를 이동한다.
			$(this).prev().focus();
			//처음요소에서 왼쪽 방향키나 위쪽 방향키를 눌렀을 경우
			if($(this).prev().prevObject.data("controls")=='section1-before'){
				//tab, tabpanel,focus 모두 마지막으로 이동
				$('#tab3-before').addClass("selectedItem").siblings().removeClass("selectedItem");
				$('#section3-before').removeClass("unvisual").siblings().addClass("unvisual");
				$('#tab3-before').focus();
			}
		}	
		if(keyCode == 35){//end 키를 눌렀을 때
			e.preventDefault();
			//tab, tabpanel,focus 모두 마지막으로 이동
			$('#tab3-before').addClass("selectedItem").siblings().removeClass("selectedItem");
			$('#section3-before').removeClass("unvisual").siblings().addClass("unvisual");
			$('#tab3-before').focus();
		}
		if(keyCode == 36){//home키를 눌렀을 때
			e.preventDefault();
			//tab, tabpanel,focus 모두 처음으로 이동 
			$('#tab1-before').addClass("selectedItem").siblings().removeClass("selectedItem");
				$('#section1-before').removeClass("unvisual").siblings().addClass("unvisual");
				$('#tab1-before').focus();
		}
		
	});
	$('.tab-list-before  li').keydown(function(e){
		
		var keyCode = e.keyCode || e.which;//키보드 코드값  
		if(keyCode == 9){//탭키를 눌렀을 때
			e.preventDefault();
			var selectedId = "#"+$(this).data("controls");
			$(selectedId).children('a').focus();
			
		}
		
	});
	
	$('.tab-list-before ~ div section  a').keydown(function(e){
		
		var keyCode = e.keyCode || e.which;//키보드 코드값 
		if (keyCode == 9 && e.shiftKey) {//shift+tab 키
			$('.tab-list-before li').each(function( index ) {
				
				if($( this ).hasClass('selectedItem') == true){
					$( this ).next().focus();
					return false;
				}
			 
			});
			
			
		}
	});
	// tab 요소에 클릭 이벤트를 추가한다.
	$('.tab-list-before > li').on('click', function(e) {
		e.preventDefault();
		// 클릭한 tab 요소에 selectedItem class를 추가하고 
		// 형제요소중에 자신 tab 이외의 나머지 tab 요소들에 selectedItem class를 삭제한다.
		$(this).addClass("selectedItem").siblings().removeClass("selectedItem");
		//선택한 tab요소의 data-controls의 값을 가져온다.(이 값은 tab요소의 컨텐츠를 담고 있는 section요소의 id값과 일치함)
		var selectedId = "#"+$(this).data('controls');
		//선택한 tab요소의 컨텐츠를 담고 있는 unvisual class을 삭제하고 나머지 형제요소에 unvisual class을 추가한다.
		$(selectedId).removeClass("unvisual").siblings().addClass("unvisual");
	});
});