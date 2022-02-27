document.addEventListener('DOMContentLoaded',()=>{
    naviEffect(); //00님 환영합니다. =>마우스 오버시 서브메뉴(로그아웃 버튼, 회원가입수정 버튼 등장)
    memberShowHide();
  });

 function naviEffect() {
     const mainMenu = document.querySelector("#memberinfo>li>a");
     const memberBox = document.querySelector("#memberBox");
     const header_inner = document.querySelector("#header_inner");

     initEvent();

     function initEvent() {
         mainMenu.addEventListener('mouseenter', mainMenuOver);
         header_inner.addEventListener('mouseleave', mainMenuOut);
     }; //initEvent

     function mainMenuOver(){
         gsap.set(memberBox,{display:'block'});
     }
     function mainMenuOut(){
         gsap.set(memberBox,{display:'none'});
     }
 }; //naviEffect

 function memberShowHide(){
     //변수 선언
     let nickinfo = document.querySelector('#nickinfo');
     let nick = nickinfo.innerHTML;
     let isExist = isNaN(nick); //nick의 값이 없다면 (로그인X) => false값 받고, nick 값이 있다면(로그인 O) =>true값 받는다.
     const logBtn = document.querySelector('#logBtn');
     const memberinfo = document.querySelector('#memberinfo');
     const logout=document.querySelector('#logout>a')
    // console.log(isExist);

    if(isExist == false){
        logBtn.style.display="block";
        memberinfo.style.display="none";
    }else{
         logBtn.style.display="none";
         memberinfo.style.display="block";
    }
    initEvent(); //이벤트 함수

    function initEvent(){
        logout.addEventListener('click',memberHide)
     }; //initEvent

     function memberHide(){
        logBtn.style.display="block";
        memberinfo.style.display="none";
     }; //memberHide
}; //memberShowHide