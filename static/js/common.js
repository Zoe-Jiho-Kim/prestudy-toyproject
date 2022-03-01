document.addEventListener('DOMContentLoaded', () => {
  naviEffect();
  slideEffect();
  starEffect();
});

//헤더 상단 네비 효과
function naviEffect() {
  const mainMenu = document.querySelector('#memberinfo>li>a');
  const memberBox = document.querySelector('#memberBox');
  const header_inner = document.querySelector('#header_inner');
  const logDiv = document.querySelector('#logDiv');

  initEvent();

  function initEvent() {
    logDiv.addEventListener('mouseenter', mainMenuOver);
    header_inner.addEventListener('mouseleave', mainMenuOut);
  } //initEvent

  function mainMenuOver() {
    gsap.set(memberBox, { display: 'block' });
  }
  function mainMenuOut() {
    gsap.set(memberBox, { display: 'none' });
  }
} //naviEffect

//헤더 상단 네비 효과 끝

//비쥬얼 슬라이드 효과 시작
function slideEffect() {
  const slideBanner = document.querySelector('#slideBanner'); //슬라이드배너 이미지
  const dotBtn = document.querySelectorAll('#dotBtn>a'); //모든 도트 버튼 찾음

  let imgLength = dotBtn.length; //3개
  let selectedDot; // 선택되어있는 dot를 대입할 변수
  let dotOverNum = 0; // 선택한 Dot의 순번 ( 초기값0 )
  let isSlide = false; // 현제 슬라이드를 하고있는 체크하는 상태변수 ( 초기값 false )
  let timer; // setInterval() 대입할 변수

  initEvent();
  dotActivate(0); //초기값: 0번째 도트 활성화
  autoPlay(); // 자동슬라이드 함수실행

  function initEvent() {
    for (const item of dotBtn) {
      // 모든 dot버튼에 이벤트 적용하여 dotOver 함수실행
      item.addEventListener('mouseenter', dotOver);
    }
    slideBanner.addEventListener('mouseenter', stopAutoPlay); // slideBanner 전체에 마우스를 올리면 자동슬라이드 함수 멈춤
    slideBanner.addEventListener('mouseleave', autoPlay); // slideBanner 전체에서 마우스를 빼면 다시 자동슬라이드 함수 실행
  } //initEvent

  function dotActivate(num) {
    // 선택된 dot 번호를 활성화 해주는 함수 ( 매개변수활용 )
    if (selectedDot != null) {
      selectedDot.classList.remove('selected'); // 기존에 선택되었는 dot 버튼 비활성화
    }
    selectedDot = dotBtn[num];
    selectedDot.classList.add('selected'); // 새로 선택된 dot 버튼 활성화
  }

  function dotOver() {
    // 모든 dot 버튼에 마우스 올리면 실행할 함수

    dotOverNum = getIndex(this); // 순번을 구하는 getIndex()함수를 이용하여 dot 버튼에 마우스를 올린 순번을 구해서 dotOverNum 변수에 대입
    dotActivate(dotOverNum); // 해당 순번에 대한 dot 버튼 활성화 함수실행 ( 매개변수활용 )
    visualSlide(); // 해당 순번에 대한 비주얼 슬라이드 함수 실행 ( 매개변수활용 )
  }

  function getIndex(checkMenu) {
    let selectedIndex = 0;

    while ((checkMenu = checkMenu.previousElementSibling) != null) {
      selectedIndex++;
    }
    return selectedIndex;
  } //getIndex 순번 구하는 함수

  function visualSlide() {
    // 비주얼 슬라이드 실행함수

    if (isSlide == false) {
      //  슬라이드 하지 않을때만 슬라이드 실행

      isSlide = true; // 슬라이드를 진행하면 isSlide 상태변수를 true로 지정하여 슬라이드하는 동안 다음 슬라이드 명령이 중복되지 않게 설정
      if (dotOverNum == 0) {
        gsap.set(slideBanner, {
          backgroundImage:
            'linear-gradient(0deg, rgba(0, 0, 0, 0.6), ' +
            'rgba(0, 0, 0, 0.4)),url(https://image.zdnet.co.kr/2020/03/06/hjan_EWKpagLviyCwJNQ.jpg)',
        });
      } else if (dotOverNum == 1) {
        gsap.set(slideBanner, {
          backgroundImage:
            'linear-gradient(0deg, rgba(0, 0, 0, 0.6), ' +
            'rgba(0, 0, 0, 0.4)),url(https://i.pinimg.com/564x/c6/a5/1f/c6a51f0cf4c0569c3097c168acc9bba6.jpg)',
        });
      } else if (dotOverNum == 2) {
        gsap.set(slideBanner, {
          backgroundImage:
            'linear-gradient(0deg, rgba(0, 0, 0, 0.6), ' +
            'rgba(0, 0, 0, 0.4)),url(https://i.pinimg.com/564x/6d/da/24/6dda247489442b5a868bea008954b8d4.jpg)',
        });
      }
    } //If
    isSlide = false;
  } //visualSlide

  function autoPlay() {
    // 5초마다 slideCount 함수실행하여 자동 슬라이드 실행
    timer = setInterval(slideCount, 5000);
  }

  function slideCount() {
    // dotOverNum 순번을 1씩 증가하면서 dotActivate(), visualSlide() 함수실행
    dotOverNum++;
    if (dotOverNum >= imgLength) {
      dotOverNum = 0;
    }
    dotActivate(dotOverNum); // dot 버튼을 활성화 함수실행 (매개변수활용)
    visualSlide(dotOverNum); // 비쥬얼 슬라이드 함수실행 (매개변수활용)
  }

  function stopAutoPlay() {
    // timer에 대입되어있는 자동슬라이드 함수를 멈춤
    clearInterval(timer);
  }
} //slideEffect
//비쥬얼 슬라이드 효과 끝

//별 눌렀을 때, 활성화 비활성화 효과

function starEffect(){
   const starBtn=document.querySelector('#favorites');
   const star=document.querySelector('#favorites>a');
   let isActivate=false;

   initEvent();
   function initEvent(){
       starBtn.addEventListener('click', clickStar);
   }; //initEvent

   function clickStar(){
     heartActivate();
   }; //clickStar

   function heartActivate(){
     if(isActivate==false){
       star.classList.add('yellow');
       isActivate=true;
     }else{
       star.classList.remove('yellow');
       isActivate=false;
     }
   }; //heartActivate
 }; //heartEffect
