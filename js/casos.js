/* Escena 3: casos en horizontal anclado (solo desktop con movimiento). En el resto, columna vertical. */
(function(){
  var C=window.Cine=window.Cine||{};
  C.irACaso=function(){return false};
  document.addEventListener("DOMContentLoaded",function(){
    if(!window.gsap||!window.ScrollTrigger)return;
    var sec=document.getElementById("casos"),pista=sec.querySelector(".casos-pista");
    var mm=gsap.matchMedia();
    mm.add("(min-width:900px) and (min-height:800px) and (prefers-reduced-motion: no-preference)",function(){
      sec.classList.add("horizontal");
      var dist=function(){
        var m=parseFloat(getComputedStyle(pista).marginLeft)||0;
        return Math.max(0,pista.scrollWidth+m*2-window.innerWidth);
      };
      var tw=gsap.to(pista,{x:function(){return -dist()},ease:"none",scrollTrigger:{
        trigger:sec,start:"top top",end:function(){return "+="+dist()},pin:true,scrub:true,invalidateOnRefresh:true,anticipatePin:1}});
      var st=tw.scrollTrigger;
      C.irACaso=function(n){
        var c=document.getElementById("caso-"+n);if(!c||!st)return false;
        var d=dist(),x=Math.min(d,Math.max(0,c.offsetLeft-pista.offsetLeft)),y=st.start+(d?x/d:0)*(st.end-st.start);
        C.irA(y);return true;
      };
      return function(){sec.classList.remove("horizontal");C.irACaso=function(){return false}};
    });
  });
})();
