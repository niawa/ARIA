AutoComplete UI
=========================
## 사례집 수록 코드

"예제로 살펴보는 WAI-ARIA"에 실린 예제 코드 전문

쉬운 이해를 위해 절차지향적으로 작성

## AutoComplete jQuery Plugin

검색어 자동완성기능 UI를 WAI-ARIA를 적용하여 jQuery 플러그인 형태로 제작

첨부된 데모는 DAUM API를 이용한 것으로, 일일 30,000콜의 제한이 있어 호출 횟수가 넘어갔을 시 추천 검색어가 나오지 않을 수 있습니다.

### How to use
```html
<form>
	<input type="text" id="test" />
</form>
```
```javascript
$('#test').AutoCompleteUI({
	getSources : function(){
		var keyword = this.keyword;
		...
		// setSources must be invoked with an array that is the suggested list related to keyword as argument
		this.setSources(source);
	}
});
```
* getSources는 반드시 구현되어야 하며, 이 함수에서 입력된 키워드로부터 추천 검색어(배열)를 생성.
* getSources는 생성된 추천 검색어 배열을 가지고 setSources를 호출해야 함.

### Options
**useAria**
WAI-ARIA 사용 여부
```
	type : boolean
	default : true
```
**prefix**
생성될 추천 검색어 목록의 id 중복을 막기 위한 prefix
```
	type : string
	default : 'mulder21c-AutoComplete' + {13~17자리 랜덤한 숫자}
```
**activeClass**
선택된 추천 검색어에 대한 class name
```
	type : string
	default : 'active'
```
### Live Demo
[demo page](https://niawa.github.io/ARIA/02.%20autocomplete/index.html)