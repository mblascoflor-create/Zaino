// Lo que casi nadie quiere perderse la primera vez que va a cada zona. El motor les da un empujón,
// sin obligar: si al grupo no le encaja (o no es temporada) siguen fuera.
export const ICONOS = {
  'roma': ['coliseo-foro','trevi-panteon','vaticano','san-pedro','trastevere-paseo','campidoglio','plaza-espana-popolo'],
  'toscana': ['duomo-florencia','uffizi','oltrarno-atardecer','piazzale-michelangelo-san-miniato','siena-campo','pisa-miracoli','accademia-david'],
  'napoles': ['spaccanapoli','pompeya','lungomare','pizza-sfogliatella','quartieri-spagnoli','plebiscito-castel-nuovo'],
  'costa-amalfitana': ['duomo-amalfi','positano-callejones','ravello-belvedere','sentiero-degli-dei','atrani'],
  'veneto-venecia': ['san-marco-ducal','rialto-mercado','gran-canal-vaporetto','burano-murano','dorsoduro-paseo','bacari-cicchetti','verona-arena-julieta'],
  'sicilia': ['vucciria-capo','normanni-palatina','quattro-canti-pretoria','ortigia','taormina-teatro','valle-templos','etna','cefalu'],
  'cerdena': ['castello-cagliari','poetto','centro-alghero','bastioni-alghero','cala-luna-barco'],
  'dolomitas': ['seceda','alpe-siusi','tre-cime','braies','bolzano-centro'],
  'puglia-salento': ['bari-san-nicola','polignano-lama-monachile','alberobello-trulli','lecce-barocco','ostuni-citta-bianca','gallipoli-centro','otranto'],
  'liguria-cinque-terre': ['vernazza','manarola-atardecer','sentiero-azzurro','riomaggiore','caruggi-genova','portofino'],
  'umbria': ['perugia-centro','asis-basilica','orvieto-duomo','spello'],
  'emilia-romana-gastronomica': ['plaza-maggiore','torre-asinelli','quadrilatero','ravena-mosaicos','san-luca'],
  'piamonte': ['centro-storico','museo-egizio','mole-museo-cine','langhe-cata'],
  'lagos-del-norte': ['ferri-como-bellagio-varenna','como-lungolago-duomo','islas-borromeas','sirmione-castello','bellagio-pueblo'],
  'basilicata-matera': ['sasso-caveoso','sasso-barisano','mirador-murgia','noche-sassi'],
  'calabria': ['tropea-centro','tropea-atardecer','scilla-chianalea','pizzo'],
  'lombardia-milan': ['duomo-terrazas','galleria','castello-sempione','brera','cenacolo','navigli-aperitivo','citta-alta-bergamo'],
  'friuli-venezia-giulia': ['piazza-unita-molo-audace','miramare','san-giusto','canal-grande-borgo'],
  'abruzos': ['trabocchi-costa','laquila-centro','rocca-calascio','pescara-lungomare'],
  'molise': ['termoli-borgo','termoli-trabucco'],
  'valle-de-aosta': ['aosta-romana','skyway-monte-bianco'],
  'marcas': ['palazzo-ducale-urbino','portonovo','ascoli-piazza-popolo','sirolo-atardecer'],
  'trento': ['duomo-trento','buonconsiglio','riva-garda']
};

// Correcciones puntuales de datos de la biblioteca original (duración real de la visita, momento del día).
export const AJUSTES = {
  'roma': { 'coliseo-foro': { duracion: 'medio_dia' } }
};
