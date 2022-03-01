document.addEventListener('DOMContentLoaded', () => {
  naviEffect(); //00님 환영합니다. =>마우스 오버시 서브메뉴(로그아웃 버튼, 회원가입수정 버튼 등장)
});

function naviEffect() {
  const mainMenu = document.querySelector('#memberinfo>li');
  const memberBox = document.querySelector('#memberBox');

  initEvent();

  function initEvent() {
    mainMenu.addEventListener('mouseenter', mainMenuOver);
    mainMenu.addEventListener('mouseleave', mainMenuOut);
  } //initEvent

  function mainMenuOver() {
    gsap.set(memberBox, { display: 'block' });
  }
  function mainMenuOut() {
    gsap.set(memberBox, { display: 'none' });
  }
} //naviEffect
