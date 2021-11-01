const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

const servidor=http.createServer((pedido ,respuesta) => {
    const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);


function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/recuperardatos': {
      recuperar(pedido,respuesta);
      break;
    }	
    default : {  
      fs.stat(camino, error => {
        if (!error) {
        fs.readFile(camino,(error, contenido) => {
          if (error) {
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          } else {
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      } else {
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}


function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    var ti= formulario['tipo'];
    var nu= parseInt(formulario['numero']);
    var ca= formulario['cadena'];

    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=
      `<!doctype html><html><head></head><body>
      `+Mostrar(ti,nu,ca)+`
      </body></html>`;
      
    respuesta.end(pagina);
  });	
}

function Mostrar(tipo, numero, cadena){ 
    var res="";
    cadena=cadena.toLowerCase();
    var tip;
    var funca=true;
    for(var x=0; x<cadena.length; x++){
        if(cadena[x].charCodeAt(0) >= 97 && cadena[x].charCodeAt(0) <= 122 ){}
        else{
            funca=false;
        }
    }
    if(funca==true){
        
        res+="<h3>";
        if(tipo=="c")
            tip=1;
        else
            tip=-1;
        
        var a=0;

        for(var x=0; x<cadena.length; x++){
            a=cadena[x].charCodeAt(0);
            a+=numero*tip;
            if(a>122)
                a-=26;
            if(a<97){
                a+=26;}
            
            res+=String.fromCharCode(a);
        }
        res+="</h3>";
        
    }
    else{
        res+="Ingrese una cadena valida (la cadena tiene que contener unicamente letras)";
    }
    return res;
}
console.log('Servidor web iniciado');