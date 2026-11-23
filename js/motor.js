/* Motor: Lenis + ScrollTrigger, HUD, hero, anclas, scramble y diálogos. Solo anima transform/opacity. */
(function(){
  var C=window.Cine=window.Cine||{};
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  C.reduce=reduce;
  C.lenis=null;
  var gsapOk=!!(window.gsap&&window.ScrollTrigger);
  if(gsapOk)gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  if(gsapOk&&!reduce&&window.Lenis){
    var lenis=new Lenis({lerp:.1,smoothWheel:true});
    C.lenis=lenis;
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000)});
    gsap.ticker.lagSmoothing(0);
    if(!C.listo)lenis.stop();
    document.addEventListener("cine:listo",function(){lenis.start()});
  }
  C.parar=function(){if(C.lenis)C.lenis.stop()};
  C.seguir=function(){if(C.lenis)C.lenis.start()};
  C.irA=function(y){
    if(C.lenis)C.lenis.scrollTo(y,{duration:1.3});
    else window.scrollTo({top:y,behavior:reduce?"auto":"smooth"});
  };

  /* ---------- Anclas ---------- */
  $$("[data-ancla]").forEach(function(a){
    a.addEventListener("click",function(e){
      var h=a.getAttribute("href");if(!h||h.charAt(0)!=="#")return;
      var t=$(h);if(!t)return;
      e.preventDefault();
      if(!(C.irACaso&&/^#caso-\d$/.test(h)&&C.irACaso(+h.slice(-1)))){
        var off=innerWidth<900&&h==="#armar-resultado"?96:0;
        var y=Math.max(0,t.getBoundingClientRect().top+window.pageYOffset-off);
        C.irA(y);
      }
      try{history.replaceState(null,"",h)}catch(x){}
    });
  });

  /* ---------- HUD: escena actual + progreso real del scroll ---------- */
  var escenas=$$("[data-escena]"),hn=$("#hud-n"),hnom=$("#hud-nombre"),hprog=$("#hud-prog"),actual=0,pend=false;
  function hud(){
    pend=false;
    var mid=innerHeight*.5,id=1;
    for(var i=0;i<escenas.length;i++){if(escenas[i].getBoundingClientRect().top<=mid)id=+escenas[i].dataset.escena}
    if(id!==actual){actual=id;hn.textContent=id<10?"0"+id:id;hnom.textContent=escenas[id-1].dataset.nombre}
    var max=document.documentElement.scrollHeight-innerHeight;
    hprog.style.transform="scaleX("+(max>0?Math.min(1,Math.max(0,window.pageYOffset/max)):0)+")";
  }
  function pedir(){if(!pend){pend=true;requestAnimationFrame(hud)}}
  addEventListener("scroll",pedir,{passive:true});
  addEventListener("resize",pedir);
  addEventListener("load",hud);
  hud();

  /* ---------- Hero: entrada + parallax de luz ---------- */
  function hero(){
    if(!gsapOk||reduce)return;
    var hs=$$("#inicio [data-h]"),lineas=$$("#inicio .linea>span");
    var otros=hs.filter(function(x){return lineas.indexOf(x)<0});
    gsap.set(lineas,{yPercent:115});gsap.set(otros,{opacity:0,y:18});gsap.set(".scroll-guia",{opacity:0});
    function entrar(){
      var tl=gsap.timeline({defaults:{ease:"power3.out"}});
      tl.to(otros[0],{opacity:1,y:0,duration:.7},0)
        .to(lineas,{yPercent:0,duration:1.05,stagger:.12},.1)
        .to(otros.slice(1),{opacity:1,y:0,duration:.8,stagger:.1},.55)
        .to(".scroll-guia",{opacity:1,duration:.8},1.1);
    }
    if(C.listo)entrar();else document.addEventListener("cine:listo",entrar);
    gsap.to("#inicio .luz",{opacity:.6,duration:5,ease:"sine.inOut",yoyo:true,repeat:-1});
    gsap.to("#inicio .hero-in",{y:-70,ease:"none",scrollTrigger:{trigger:"#inicio",start:"top top",end:"bottom top",scrub:true}});
    gsap.to("#inicio .luz",{y:90,ease:"none",scrollTrigger:{trigger:"#inicio",start:"top top",end:"bottom top",scrub:true}});
  }
  document.addEventListener("DOMContentLoaded",hero);

  /* ---------- Scramble de texto en botones (solo con mouse) ---------- */
  var GL="!<>-_/[]{}=+*^?#%&";
  if(!reduce&&matchMedia("(hover:hover)").matches){
    $$(".cta").forEach(function(a){
      var t=$(".cta-t",a);if(!t)return;
      var orig=t.textContent,busy=false;
      a.setAttribute("aria-label",orig.replace(/[\[\]]/g,"").trim());
      a.addEventListener("pointerenter",function(){
        if(busy)return;busy=true;var t0=performance.now(),D=420;
        (function f(now){
          var p=Math.min((now-t0)/D,1),fijas=Math.floor(p*orig.length),s="";
          for(var i=0;i<orig.length;i++){var c=orig.charAt(i);s+=(i<fijas||c===" "||c==="["||c==="]")?c:GL.charAt(Math.floor(Math.random()*GL.length))}
          t.textContent=s;
          if(p<1)requestAnimationFrame(f);else{t.textContent=orig;busy=false}
        })(t0);
      });
    });
  }

  /* ---------- Visor de capturas y juego ---------- */
  var visor=$("#visor"),vi=$("img",visor),vp=$("p",visor),juego=$("#juego");
  function abrir(d){C.parar();d.showModal()}
  [visor,juego].forEach(function(d){
    d.addEventListener("click",function(e){if(e.target===d||e.target.hasAttribute("data-cerrar"))d.close()});
    d.addEventListener("close",function(){C.seguir();if(d===juego){var f=$("iframe",d);f.removeAttribute("src")}});
  });
  $$("[data-visor]").forEach(function(b){b.addEventListener("click",function(){vi.src=b.dataset.visor;vi.alt=b.dataset.alt||"";vp.textContent=b.dataset.t||"";abrir(visor)})});
  $("#jugar").addEventListener("click",function(){var f=$("iframe",juego);f.src="https://w1sar.github.io/gato-misionero/";abrir(juego)});
})();
