Combobox UI
=========================
## 사례집 수록 코드

"WAI-ARIA 사례집"에 실린 예제 코드 전문

쉬운 이해를 위해 절차지향적으로 작성

## Combobox jQuery Plugin

사용자 정의 콤보박스(Combobox) UI를 WAI-ARIA를 적용하여 jQuery 플러그인 형태로 제작

### How to use
```html
<div class="demo-combo">
  <label for="demo-combo-travel">도착지</label>
  <input type="text" id="demo-combo-travel" placeholder="도착 지역 선택">
</div>
```
```javascript
// 문서 객체를 선택하여 jQuery 인스턴스 객체화
var $demo_combo = $('.demo-combo');
// $demo_combo 객체에 플러그인 적용
$demo_combo.ComboboxUI({
  // ※ 옵션(<li>) 설정 데이터는 배열 유형으로 전달해야 함.
  'options': ['일본', '중국', '동남아시아/인도', '미주(북/남미)', '유럽', '대양주/괌', '러시아/몽골/중앙아시아', '중동/아프리카']
});
```

### Plugin Options

**usingAria**
WAI-ARIA 사용 유무
```
  type    : boolean
  default : true
```
**activeClass**
선택된 옵션의 클래스 속성 이름
```
  type    : string
  default : 'selected'
```
**buttonLabel**
콤보박스 버튼 요소의 레이블
```
  type    : string
  default : '선택 목록'
```
**options**
리스트박스 내, 옵션 아이템 설정
```
  type    : array
  default : []
```

### How to use: Combobox Instance Object

```js
// 콤보박스 인스턴스 객체 참조 및 컨트롤 방법
var demo_combo = $demo_combo.data('comboboxUI');
demo_combo
  // WAI-ARIA 설정 해제
  .desetAria()
  // 초기 옵션 값 설정
  .selectOption(1);
// 2초 뒤에 WAI-ARIA 설정
window.setTimeout(function() {
  demo_combo.setAria();
}, 2000);
```

#### Combobox Instance Methods

- 옵션 활성화: `.selectOption(index)`
- 메뉴 열림상태 반환: `.isListOpen()`
- 메뉴 열림: `.openList()`
- 메뉴 닫힘: `.closeList()`
- 메뉴 토글: `.toggleList()`
- WAI-ARIA 설정: `.setAria()`
- WAI-ARIA 해제: `.desetAria()`

### Live Demo
[demo page](https://nia.github.io/combobx/index.html)