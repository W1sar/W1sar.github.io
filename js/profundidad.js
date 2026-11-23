/* Escena 2: parallax en profundidad de las tarjetas y titular de fondo. Solo transform/opacity. */
(function(){
  document.addEventListener("DOMContentLoaded",function(){
    if(!window.gsap||!window.ScrollTrigger)return;
    var mm=gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)",function(){
      var sec=document.getElementById("proyectos"),amp=innerWidth<900?38:150;
      var st={trigger:sec,start:"top bottom",end:"bottom top",scrub:true};
      sec.querySelectorAll(".pcard").forEach(function(c){
        var z=parseFloat(c.dataset.z)||.5;
        gsap.fromTo(c,{y:amp*z*.8},{y:-amp*z,ease:"none",scrollTrigger:st});
        gsap.from(c,{opacity:0,duration:.8,ease:"power2.out",scrollTrigger:{trigger:c,start:"top 92%",once:true}});
      });
      sec.querySelectorAll(".prof-fondo span").forEach(function(s){
        var d=parseFloat(s.dataset.fx)||1;
        gsap.fromTo(s,{xPercent:-9*d},{xPercent:9*d,ease:"none",scrollTrigger:st});
      });
    });
  });
})();
