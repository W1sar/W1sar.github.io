/* Escena 0 · preloader. JS puro (no depende de GSAP). Se omite: misma sesión, poco movimiento o sin JS. */
(function(){
  var C=window.Cine=window.Cine||{};
  var root=document.documentElement,pre=document.getElementById("pre");
  C.listo=false;
  function terminar(){
    if(C.listo)return;
    C.listo=true;
    root.style.overflow="";
    document.dispatchEvent(new CustomEvent("cine:listo"));
  }
  if(!pre||root.classList.contains("sin-pre")){
    if(pre&&pre.parentNode)pre.parentNode.removeChild(pre);
    terminar();return;
  }
  var n=document.getElementById("pre-n"),pct=document.getElementById("pre-pct"),barra=document.getElementById("pre-barra"),skip=document.getElementById("pre-skip");
  var DUR=2200,t0=null,fin=false,raf=0;
  root.style.overflow="hidden";
  function pad(v){return v<10?"0"+v:String(v)}
  function salir(){
    if(fin)return;fin=true;cancelAnimationFrame(raf);
    try{sessionStorage.setItem("cine-visto","1")}catch(e){}
    n.textContent="100";pct.textContent="100%";barra.style.transform="scaleX(1)";
    pre.style.transition="transform .75s cubic-bezier(.76,0,.24,1)";
    pre.style.transform="translateY(-100%)";
    var hecho=false;
    function quitar(){if(hecho)return;hecho=true;if(pre.parentNode)pre.parentNode.removeChild(pre);terminar()}
    pre.addEventListener("transitionend",quitar);
    setTimeout(quitar,900);
    /* la escena de abajo ya puede animarse mientras sube el telón */
    setTimeout(terminar,350);
  }
  function paso(ts){
    if(fin)return;
    if(t0===null)t0=ts;
    var p=Math.min((ts-t0)/DUR,1),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2,v=Math.round(e*100);
    n.textContent=pad(v);pct.textContent=v+"%";barra.style.transform="scaleX("+e+")";
    if(p<1)raf=requestAnimationFrame(paso);else setTimeout(salir,180);
  }
  raf=requestAnimationFrame(paso);
  skip.addEventListener("click",salir);
  skip.focus({preventScroll:true});
})();
