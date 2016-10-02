Carousel UI
=========================
## 사례집 수록 코드

"예제로 살펴보는 WAI-ARIA"에 실린 예제 코드 전문

쉬운 이해를 위해 절차지향적으로 작성

## Carousel jQuery Plugin

사용자 정의 캐러셀(Carousel) UI를 WAI-ARIA를 적용하여 jQuery 플러그인 형태로 제작

### How to use
```html
<div class="demo-carousel" data-label="캐로셀을 기술하는 제목">
  <article data-label="캐로셀 슬라이드 레이블 1">
    <a href="#">
      <img src="http://placehold.it/400x240/16a085/fff/?text=Slide 01" alt="캐로셀 슬라이드 콘텐츠 1 내용" width="400" height="240">
    </a>
  </article>
  <article data-label="캐로셀 슬라이드 레이블 2">
    <a href="#">
      <img src="http://placehold.it/400x240/16a085/fff/?text=Slide 02" alt="캐로셀 슬라이드 콘텐츠 2 내용" width="400" height="240">
    </a>
  </article>
  <article data-label="캐로셀 슬라이드 레이블 3">
    <a href="#">
      <img src="http://placehold.it/400x240/16a085/fff/?text=Slide 03" alt="캐로셀 슬라이드 콘텐츠 3 내용" width="400" height="240">
    </a>
  </article>
</div>
```
```javascript
// 문서 객체를 선택하여 jQuery 인스턴스 객체화
var $demo_carousel = $('.demo-carousel');
// $demo_combo 객체에 플러그인 적용
// 기본 옵션을 사용할 경우
$demo_carousel.CarouselUI();
// 사용자 정의 옵션을 사용할 경우
// 옵션 객체를 전달하여 설정 값을 변경할 수 있다.
// $demo_carousel.CarouselUI({
//   'usingAria': false,
//   'duration': 2500
// });
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
  default : 'active'
```
**activeIndex**
초기 활성화될 캐러셀 탭/패널 인덱스
```
  type    : number
  default : 0
```
**playSlide**
캐러셀 재생 설정
```
  type    : Boolean
  default : true
```
**duration**
재생 시간(ms) 설정
```
  type    : number
  default : 3000
```

### How to use: Carousel Instance Object

```js
// 캐러셀 인스턴스 객체 참조 및 컨트롤
var demo_carousel_1 = $demo_carousel.eq(0).data('carouselUI');
var demo_carousel_2 = $demo_carousel.eq(1).data('carouselUI');

// 2초 뒤에 동작
window.setTimeout(function() {
  demo_carousel_1
    // WAI-ARIA 설정
    .setAria()
    // 재생 멈춤
    .stop();
}, 2000);
// 3초 뒤에 동작
window.setTimeout(function() {
  // 1.5초마다 재생 설정
  demo_carousel_2.play(1500);          // 슬라이드 1회 재생 설정 (1회만 동작)
  // demo_carousel_2.play(1500, true); // 슬라이드 연속 재생 설정 (연속 동작)
  console.info('캐러셀 재생 시작!');
}, 3000);
```

#### Carousel Instance Methods

- 캐러셀 텝/패널 활성화: `.activeTab(index)`
- 캐러셀 재생: `.play([duration, continuity])`
- 캐러셀 정지: `.stop()`
- WAI-ARIA 설정: `.setAria()`
- WAI-ARIA 해제: `.desetAria()`

### Live Demo
[demo page](https://niawa.github.io/ARIA/20.%20carousel/index.html)