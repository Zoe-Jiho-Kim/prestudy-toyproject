document.addEventListener('DOMContentLoaded',()=>{
    naviEffect();

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
 }