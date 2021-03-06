'use strict';
/*************************
 * favorite 저장함수
 **************************/

const favoriteOff = document.querySelector('#favorites-off');
favoriteOff.addEventListener('click', save_favorites);

function save_favorites() {
  let title = titleBucket;
  let name = document.querySelector('#useremail').innerHTML;

  $.ajax({
    type: 'GET',
    url: '/favoritelist',
    data: {},
    success: function (response) {
      let rows = response['favorites'];
      const arrayNew = [{ name: name, title: title }];
      const newArr = [...rows, ...arrayNew];

      // 중복 확인
      const newArrSet = [...new Set(newArr.map(JSON.stringify))].map(
        JSON.parse
      );

      rows.length === newArrSet.length
        ? alert('이미 즐겨찾기 되어있습니다!')
        : $.ajax({
            type: 'POST',
            url: '/favorites',
            data: {
              name_give: name,
              title_give: title,
            },
            success: function (response) {
              console.log(response);
              alert(response['msg']);
            },
          });
    },
  });
}

/*************************
 * moreBtn function
 **************************/

const moreBtn = document.querySelector('#morebtn');
let btnCount = 1;

moreBtn.addEventListener('click', morebtn);

function morebtn() {
  $.ajax({
    type: 'GET',
    url: '/webtoons',
    data: {},
    success: function (response) {
      let rows = response['webtoons'];

      (function clickCounter() {
        btnCount += 1;
      })();

      for (let i = btnCount * 30; i < 30 + btnCount * 30; i++) {
        let title = rows[i]['title'];
        let body = rows[i]['body'].replace(/\"/gi, "'"); // Change double quotes to single quotes
        let img = rows[i]['img'];
        let writer = rows[i]['writer'];
        let url = rows[i]['url'];
        let star = rows[i]['star'];
        let genre = rows[i]['genre'];

        let temp_html = `<button
                             type="button"
                             class="thumbnail"
                             data-bs-toggle="modal"
                             data-bs-target="#exampleModal"
                             data-bs-whatever="${title}"
                             data-writer="${writer}"
                             data-body="${body}"
                             data-url="${url}"
                             data-star="⭐${star}"
                             data-genre="${genre}"
                             data-img="${img}"
                           >
                             <div class="col">
                               <div class="card shadow-sm">
                                 <img
                                   src="${img}"
                                   width="100%"
                                   height="100%"
                                   title="${title}"
                                   alt="${title}"
                                 />
                                 <div class="card-body">
                                   <p class="thunmbnail__title card-text">${title}</p>
                                 </div>
                               </div>
                             </div>
                           </button>`;
        $('#thumbnail-box').append(temp_html);
      }
      readTitle();
      viewComments();
    },
  });
}

/////////////////
document.addEventListener('DOMContentLoaded', () => {
  slideEffect();
});

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
