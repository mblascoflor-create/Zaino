/* ===== Marca Zaino: la Z es el símbolo (flecha blanca + sol amarillo sobre turquesa) ===== */
var MARCA = (function(){
  'use strict';
  var C = {teal:'#164836', sol:'#ff860e', coral:'#F47762', uva:'#754A77', marron:'#30231F', blanco:'#FFFFFF'};
  // Símbolo en una caja de 100×100. fondo:false = sin baldosa (para usarla dentro de la palabra)
  function simbolo(o){ o = o||{}; var r = o.redondeo==null ? 22 : o.redondeo;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"'+(o.clase?' class="'+o.clase+'"':'')+' role="img" aria-label="Z">'+
      (o.fondo===false ? '' : '<rect width="100" height="100" rx="'+r+'" fill="'+C.teal+'"/>')+
      '<path fill="#fff4dc" d="M21 24H77V37L41 67H68V59L86 74 68 90V81H20V67L55 37H21Z"/>'+
      '<path fill="#99ae82" d="M77 24V37H64ZM20 67H34L20 81Z"/>'+
      '<circle cx="75" cy="14" r="6" fill="'+C.sol+'"/>'+
    '</svg>'; }
  // Palabra: el símbolo hace de Z y el resto de letras va en la tipografía de la app
  function palabra(){ return '<span class="marca" aria-label="Zaino">'+simbolo({clase:'marca-z', redondeo:20})+'<span class="marca-t" aria-hidden="true">Zaino</span></span>'; }
  return {C:C, simbolo:simbolo, palabra:palabra};
})();
