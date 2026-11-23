/* Canvas 2D liviano: partículas que reaccionan a la velocidad del scroll. Se pausa fuera de pantalla. */
(function(){
  var C=window.Cine=window.Cine||{};
  var cv=document.getElementById("particulas");
  if(!cv||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var sec=cv.parentNode,ctx=cv.getContext("2d"),W=0,H=0,dpr=1,ps=[],corre=false,raf=0,lastY=window.pageYOffset,vel=0;
  function crear(){
    var n=innerWidth<700?42:Math.min(110,Math.round(W*H/16000));
    ps=[];
    for(var i=0;i<n;i++){var z=.15+Math.random()*.85;ps.push({x:Math.random()*W,y:Math.random()*H,z:z,r:.5+z*1.7,a:.25+z*.55,ac:Math.random()<.14})}
  }
  function medir(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    W=sec.clientWidth;H=sec.clientHeight;
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);crear();
  }
  function cuadro(){
    var y=window.pageYOffset,d=y-lastY;lastY=y;
    vel+=(d-vel)*.18;                       /* velocidad suavizada */
    var v=Math.max(-60,Math.min(60,vel)),av=Math.abs(v);
    ctx.clearRect(0,0,W,H);
    for(var pass=0;pass<2;pass++){
      ctx.fillStyle=pass?"#baff29":"#f4f4f0";ctx.strokeStyle=ctx.fillStyle;
      for(var i=0;i<ps.length;i++){
        var p=ps[i];if(p.ac!==!!pass)continue;
        p.y+=-.12*p.z+v*(1-p.z)*.55;          /* deriva propia + paralaje según profundidad */
        p.x+=Math.sin((p.y+i*37)*.004)*.12;
        if(p.y<-8)p.y=H+8;else if(p.y>H+8)p.y=-8;
        if(p.x<-8)p.x=W+8;else if(p.x>W+8)p.x=-8;
        ctx.globalAlpha=p.a;
        if(av>3){ctx.lineWidth=p.r;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x,p.y-v*p.z*.9);ctx.stroke()}
        else ctx.fillRect(p.x,p.y,p.r,p.r);
      }
    }
    ctx.globalAlpha=1;
    raf=requestAnimationFrame(cuadro);
  }
  function iniciar(){if(corre)return;corre=true;lastY=window.pageYOffset;raf=requestAnimationFrame(cuadro)}
  function parar(){corre=false;cancelAnimationFrame(raf)}
  medir();
  new IntersectionObserver(function(es){es[0].isIntersecting?iniciar():parar()},{rootMargin:"80px"}).observe(sec);
  if(window.ResizeObserver){var t;new ResizeObserver(function(){clearTimeout(t);t=setTimeout(medir,150)}).observe(sec)}
  document.addEventListener("visibilitychange",function(){if(document.hidden)parar();else if(sec.getBoundingClientRect().bottom>0&&sec.getBoundingClientRect().top<innerHeight)iniciar()});
})();
