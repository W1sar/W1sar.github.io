/* Escena 5 · "Armá tu proyecto": estado -> vista previa + entregables + mensaje prearmado. */
(function(){
  /* ---- Contacto: único lugar donde se cambia (en el cierre del index.html el número va en el href) ----
     WHATSAPP: número internacional sin "+" ni espacios. El botón principal es WhatsApp; el mail es secundario. */
  var EMAIL="angelriquelme573@gmail.com";
  var WHATSAPP="5493764151908";

  var TIPOS=[
    {id:"web",nombre:"Web de alto impacto",
     focoTit:"2 · Para qué la querés",
     focos:[{id:"presentar",t:"Presentar mi negocio",e:"Secciones de servicios, proyectos y contacto"},
            {id:"vender",t:"Vender online",e:"Catálogo y circuito de pedido"},
            {id:"turnos",t:"Recibir turnos o consultas",e:"Elección de día y horario sin superposiciones"}],
     base:["Especificación escrita de lo que se va a hacer","Sitio pensado para celular y compu, hecho a mano en HTML, CSS y JavaScript"],
     extras:[{id:"anim",t:"Animación y scroll",e:"Movimiento y scroll animado que se detiene si la persona pidió menos movimiento"},
             {id:"form",t:"Formulario o WhatsApp",e:"Formulario o botón de WhatsApp con el mensaje ya armado"},
             {id:"pub",t:"Publicación y dominio",e:"Publicación online con actualización automática"},
             {id:"panel",t:"Panel de pedidos",e:"Panel con ingreso para ver y gestionar los pedidos"}],
     nota:"Referencias propias: este sitio, el del consultorio y el de Hiro Digital."},
    {id:"sistema",nombre:"Sistema de gestión a medida",
     focoTit:"2 · Para qué rubro",
     focos:[{id:"comercio",t:"Comercio",e:"Pensado para un local con atención al público"},
            {id:"agenda",t:"Consultorio o agenda",e:"Agenda con horarios que no se pueden superponer"},
            {id:"otro",t:"Otro rubro",e:"Primero relevamos tu forma de trabajar, antes de definir nada"}],
     base:["Relevamiento y especificación escrita antes de programar","Pruebas automáticas de las reglas del negocio","Entrega instalada y lista para usar"],
     extras:[{id:"caja",t:"Caja y stock",e:"Caja con cobro y stock con historial de cada cambio"},
             {id:"cc",t:"Cuentas corrientes",e:"Cuentas corrientes de clientes o proveedores, con saldo y pagos"},
             {id:"roles",t:"Usuarios y permisos",e:"Usuarios con roles: cada uno ve solo lo que le corresponde"},
             {id:"copias",t:"Copias de seguridad",e:"Copias de seguridad que se pueden restaurar"}],
     nota:"Referencias propias: la caja y stock de una carnicería y la agenda de un consultorio."},
    {id:"bot",nombre:"Bot IA + automatización",
     focoTit:"2 · Dónde vive el bot",
     focos:[{id:"wa",t:"WhatsApp",e:"Asistente que conversa por WhatsApp"},
            {id:"web",t:"Web o chat",e:"Asistente integrado en una web o chat"},
            {id:"interno",t:"Tareas internas",e:"Automatización de tareas internas, sin chat de por medio"}],
     base:["Definición de qué responde y qué no","Pruebas con conversaciones reales antes de usarlo"],
     extras:[{id:"faq",t:"Consultas frecuentes",e:"Respuestas a las consultas más repetidas"},
             {id:"pedidos",t:"Pedidos o turnos",e:"Toma de pedidos o turnos"},
             {id:"conectar",t:"Conectar a mi sistema",e:"Conexión con tu planilla o sistema"},
             {id:"informes",t:"Informes automáticos",e:"Informes automáticos con lo que pasó en el día"}],
     nota:"Hoy el asistente de WhatsApp con IA es un proyecto mío de uso personal: tu caso lo diseñamos juntos."}
  ];

  var $=function(i){return document.getElementById(i)};
  var st={tipo:0,foco:0,extras:{}};

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function radio(cont,name,items,sel,cb){
    cont.innerHTML=items.map(function(it,i){
      return '<label class="op"><input type="radio" name="'+name+'" value="'+i+'"'+(i===sel?" checked":"")+'><span>'+esc(it)+'</span></label>'}).join("");
    cont.querySelectorAll("input").forEach(function(r){r.addEventListener("change",function(){cb(+r.value)})});
  }
  function extrasUI(){
    var T=TIPOS[st.tipo];
    $("op-extras").innerHTML=T.extras.map(function(x){
      return '<label class="op"><input type="checkbox" value="'+x.id+'"'+(st.extras[x.id]?" checked":"")+'><span>'+esc(x.t)+'</span></label>'}).join("");
    $("op-extras").querySelectorAll("input").forEach(function(c){c.addEventListener("change",function(){st.extras[c.value]=c.checked;pintar()})});
  }
  function controles(){
    var T=TIPOS[st.tipo];
    radio($("op-tipo"),"tipo",TIPOS.map(function(t){return t.nombre}),st.tipo,function(i){st.tipo=i;st.foco=0;st.extras={};controles();pintar()});
    $("leg-foco").textContent=T.focoTit;
    radio($("op-foco"),"foco",T.focos.map(function(f){return f.t}),st.foco,function(i){st.foco=i;pintar()});
    extrasUI();
  }

  /* ---- Vista previa esquemática (HTML dentro del lienzo) ---- */
  function previa(){
    var T=TIPOS[st.tipo],F=T.focos[st.foco],x=st.extras,h="";
    if(T.id==="web"){
      h='<div class="barra-f"><i></i><i></i><i></i><span>tu-sitio.com.ar</span></div>'+
        '<div class="tit">'+esc(F.id==="vender"?"Tu tienda":F.id==="turnos"?"Pedí tu turno":"Tu negocio")+'<br><em>'+(x.anim?"en movimiento.":"bien presentado.")+'</em></div>'+
        '<div class="ln"></div><div class="ln s"></div>'+
        (x.form||F.id==="turnos"?'<div class="btn-f">'+(x.form?"[ ESCRIBINOS POR WHATSAPP ]":"[ ELEGIR DÍA Y HORA ]")+'</div>':'')+
        '<div class="fila" style="--c:'+(F.id==="vender"?4:3)+'">'+
          [1,2,3].concat(F.id==="vender"?[4]:[]).map(function(){return '<div class="bloque"><b>—</b></div>'}).join("")+'</div>'+
        '<div class="tags">'+(x.anim?'<span>scroll animado</span>':'')+(x.pub?'<span>online</span>':'')+(x.panel?'<span>panel de pedidos</span>':'')+'</div>';
    }else if(T.id==="sistema"){
      var filas=F.id==="agenda"?[["Turno","Hora","Lugar"],["Pedido 1","09:00","Sede A"],["Pedido 2","09:30","Sede A"],["Pedido 3","10:00","Sede B"]]:
                F.id==="comercio"?[["Producto","Cant.","Total"],["Ítem 1","2","$ —"],["Ítem 2","1","$ —"],["Ítem 3","3","$ —"]]:
                [["Registro","Estado","Fecha"],["Dato 1","Listo","—"],["Dato 2","Listo","—"],["Dato 3","Pendiente","—"]];
      h='<div class="barra-f"><i></i><i></i><i></i><span>sistema · '+esc(F.t.toLowerCase())+'</span></div>'+
        '<div class="tabla">'+filas.map(function(r){return '<div><span>'+r.join('</span><span>')+'</span></div>'}).join("")+'</div>'+
        '<div class="fila" style="--c:2">'+(x.caja?'<div class="bloque ac"><b>Caja</b><span>abierta</span></div>':'')+(x.cc?'<div class="bloque ac"><b>Cta. cte.</b><span>saldo</span></div>':'')+'</div>'+
        '<div class="tags">'+(x.roles?'<span>encargado</span><span>cajero</span>':'')+(x.copias?'<span>copia al abrir</span>':'')+'<span>sin internet o en la nube, según el caso</span></div>';
    }else{
      var canal=F.id==="wa"?"WhatsApp":F.id==="web"?"Chat web":"Tarea interna";
      h='<div class="barra-f"><i></i><i></i><i></i><span>'+canal+'</span></div><div class="chat">'+
        (F.id==="interno"?'<span>Cada día a las 20:00 …</span><span class="yo">→ planilla actualizada</span>':
         '<span>Hola, ¿qué horarios tienen?</span><span class="yo">'+(x.faq?"Atendemos de lunes a viernes.":"Te cuento enseguida.")+'</span>'+
         (x.pedidos?'<span>Quiero pedir un turno</span><span class="yo">Listo, quedó anotado.</span>':''))+
        '</div><div class="tags">'+(x.conectar?'<span>conectado a tu sistema</span>':'')+(x.informes?'<span>informe diario</span>':'')+'<span>respuestas de ejemplo</span></div>';
    }
    return '<div class="pv" role="presentation">'+h+'</div>';
  }

  function mensaje(){
    var T=TIPOS[st.tipo],F=T.focos[st.foco],ex=T.extras.filter(function(e){return st.extras[e.id]}).map(function(e){return e.t});
    return "Hola Ángel, vi tu portafolio y quiero consultarte por: "+T.nombre+".\nEnfoque: "+F.t+".\nExtras: "+(ex.length?ex.join(", "):"todavía no sé")+".\n¿Podemos charlar?";
  }

  function pintar(){
    var T=TIPOS[st.tipo],F=T.focos[st.foco];
    var ent=T.base.concat([F.e],T.extras.filter(function(e){return st.extras[e.id]}).map(function(e){return e.e}));
    $("prev-tipo").textContent=T.nombre.toUpperCase();
    $("prev-n").textContent=(ent.length<10?"0":"")+ent.length+" ENTREGABLES";
    $("prev-lienzo").innerHTML=previa();
    $("prev-lista").innerHTML=ent.map(function(e){return "<li>"+esc(e)+"</li>"}).join("");
    $("prev-nota").textContent=T.nota;
    var m=mensaje(),wa=$("btn-wa"),mail=$("btn-mail");
    wa.href="https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(m);
    mail.href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Consulta desde tu portafolio: "+T.nombre)+"&body="+encodeURIComponent(m);
  }

  document.addEventListener("DOMContentLoaded",function(){
    if(!$("armar-form"))return;
    controles();pintar();
  });
})();
