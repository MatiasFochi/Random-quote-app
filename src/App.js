import './App.css';
import { useState, useEffect, useCallback } from 'react';
import LogoClaro from './Logos/LogoPersonalBlanco2.png';
import LogoOscuro from './Logos/LogoPersonal.png';

const citas = [
  ["La vida es lo que pasa mientras estás ocupado haciendo otros planes.", "John Lennon"],
  ["El único modo de hacer un gran trabajo es amar lo que haces.", "Steve Jobs"],
  ["El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.", "Albert Schweitzer"],
  ["El fracaso es simplemente la oportunidad de comenzar de nuevo, esta vez de forma más inteligente.", "Henry Ford"],
  ["La mejor manera de predecir el futuro es inventándolo.", "Alan Kay"],
  ["Tener conocimientos no es suficiente, debemos aplicarlos. Desear no es suficiente, debemos actuar.", "Johann Wolfgang von Goethe"],
  ["Las heridas que no se ven son las más profundas.", "William Shakespeare"],
  ["No hables a menos que puedas mejorar el silencio.", "Jorge Luis Borges"],
  ["Los lenguajes no son más que una pobre traducción.", "Franz Kafka"],
  ["Errar en el camino propio es mejor que acertar en el camino de alguien más.", "Fiódor Dostoyevsky"],
  ["Desleal es aquel que se despide cuando el camino se oscurece.", "J.R.R. Tolkien"],
  ["La gente enojada no siempre es sabia.", "Jane Austen"],
  ["El fracaso es el condimento que le da sabor al éxito.", "Truman Capote"],
];

function App() {

  let irATwittear = 'https://twitter.com/intent/tweet?text=%22';

  //Asincronicos
  const [colorAleatorio, setColorAleatorio] = useState('rgb(93, 18, 146)');
  const [demasiadoClaro, setDemasiadoClaro] = useState(false);
  
  
  //Sincronizar
  //La cita y autor que trabaja el algoritmo
  const [citaIndex, setCitaIndex] = useState(Math.floor((Math.random() * ((citas.length-1) - 0 + 1) + 0)));
  //La cita y autor que se muestran en pantalla, no lo que opera en las funciones
  const [citaPantalla, setCitaPantalla] = useState(["Bienvenido!","Haz click en el boton 'Nueva Frase'"]);
  const [botonDesactivado, setBotonDesactivado] = useState(false);
  const [opacidad, setOpacidad] = useState(1);
  const [decreasing, setDecreasing] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);


  /* FUNCIONES DE COLOR */
  //Funcion que determina si es demasiado claro un color o no para cambiar el color de la fuente mediante la formula HSP (Highly Sensitive Poo)
  const esClaroOscuro= (rojo, verde, azul) => {
    let r = rojo;
    let g = verde;
    let b = azul;
    let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    if (hsp < 127.5) {
      setDemasiadoClaro(false);
    } else {
      setDemasiadoClaro(true);
    }
  }
  //Funcion que maneja el cambio de color
  const funcionColor = () => {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    esClaroOscuro(red, green, blue);
    setColorAleatorio(`rgb(${red}, ${green}, ${blue})`);
  };

  /* FUNCION DE CITA */
  //Funcion que maneja el cambio de cita
  const funcionNuevaCita = useCallback(() => {
    let nuevaCita = Math.floor((Math.random() * ((citas.length-1) - 0 + 1) + 0)); //Mantiene la forma de la formula de numeros aleatorios Math.floor((Math.random() * ((max) - min + 1) + min))
    setCitaIndex(nuevaCita);
    setCitaPantalla(citas[citaIndex]);}, [citaIndex]);

  /* FUNCION LINK TWITTER */

  //Funcion que genera el link para tuitear
  const linkTwitter = useCallback(() => {
    let citaALink = '';
    let soloCita = citaPantalla[0];
    let soloAutor = citaPantalla[1];
    for(var i = 0; i < soloCita.length; i++){
      if(soloCita[i] === ' '){
        citaALink = citaALink + "%20";
      }
      else{
        citaALink = citaALink + soloCita[i];
      }
    }
    citaALink = citaALink + "%22%20"
    for(var j = 0; j < soloAutor.length; j++){
      if(soloAutor[j] === ' '){
        citaALink = citaALink + "%20";
      }
      else{
        citaALink = citaALink + soloAutor[j];
      }
    }
    return irATwittear+citaALink;
  }, [citaPantalla, irATwittear]);

  /* FUNCION DE BOTON */

  //Funcion que dispara el clic del boton newQuote
  const manejarClik = () =>{
    setBotonDesactivado(true);
    funcionColor();
    setStartAnimation(true);
  };

  //Funcion que desencadena los efectos de la pagina
  useEffect(() => {
    if (startAnimation) {
      const intervalId = setInterval(() => {
        setOpacidad((prevOpacidad) => {
          let nextOpacidad;
          if (decreasing) {
            nextOpacidad = prevOpacidad - 0.01;
            if (nextOpacidad <= 0.01) {
              setDecreasing(false);
              funcionNuevaCita();
              linkTwitter();
            }
          } else {
            nextOpacidad = prevOpacidad + 0.01;
            if (nextOpacidad >= 0.99) {
              setDecreasing(true);
              clearInterval(intervalId);
              setStartAnimation(false);
              setBotonDesactivado(false);
            }
          }
          return nextOpacidad;
        });
      }, 10);
      return () => clearInterval(intervalId);
    }
  }, [startAnimation, decreasing, funcionNuevaCita, linkTwitter]);

  
  return (
    <div className='App' style={{background: colorAleatorio, color: colorAleatorio}}>
      <div id='Contenedor-general'>
        <div className='Contenedor-logo'>
          <a className='Contenedor-logo-2' href='https://www.linkedin.com/in/matias-fochi/' target='_blank' rel='noreferrer' >
            <img className='LogoMF' src={LogoClaro} style={{opacity: demasiadoClaro ? 0 : 1}} alt='Logo Matias Fochi'/>
            <img className='LogoMF' src={LogoOscuro} style={{opacity: demasiadoClaro ? 1 : 0}} alt='Logo Matias Fochi'/>
          </a>
        </div>
        <div id='Contenedor-frase' style={{background: (demasiadoClaro) ? 'black' : 'white'}} >
          <div className='Texto-cita' style={{opacity: opacidad}} >
          <i className="bi-quote"></i>
            <span id='text' >{citaPantalla[0]}</span>
          </div>
          <div className='Autor-cita' style={{opacity: opacidad}} >
            {"- "} 
            <span id='author'>{citaPantalla[1]}</span>
          </div>
          <div className='Botones'>
            <a className='Boton' id='tweet-cita' title='Twittea esta frase!' target='_top' 
            href={linkTwitter()} style={{background: colorAleatorio, color:(demasiadoClaro) ? 'black' : 'white'}} hidden={(citaPantalla[0] === "Empecemos!") ? true : false}>
              <i className='bi-twitter'></i>
            </a>
            <button className='Boton' id='nuevaFrase' onClick={manejarClik} style={{background: colorAleatorio, color:(demasiadoClaro) ? 'black' : 'white'}} disabled={botonDesactivado} >Nueva Frase</button>
          </div>
        </div>
        <div className='footer' style={{background: colorAleatorio, color:(demasiadoClaro) ? 'black' : 'white'}}>
          by 
          <a href='https://www.linkedin.com/in/matias-fochi/' target='_blank' rel='noreferrer' style={{color:(demasiadoClaro) ? 'black' : 'white'}} > MatiasFochi</a>
        </div>
      </div>
    </div>
  );
}

export default App;

//<img className='LogoMF' src={(colorLogoClaro) ? LogoClaro : LogoOscuro} style={{opacity: opacidad}} alt='Logo Matias Fochi'/>