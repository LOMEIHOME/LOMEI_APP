export interface Servicio {
  id: string;
  num: string;
  nombre: string;
  subtitulo?: string;
  descripcion: string;
  incluye: string;
  precio: string;
  iconId: string;
  imagen: string;
}

export const SERVICIOS: Servicio[] = [
  {
    id: "interiorismo",
    num: "01",
    nombre: "Interiorismo",
    descripcion:
      "Creamos espacios funcionales, armoniosos y llenos de personalidad. Desarrollamos una propuesta integral que define materiales, mobiliario, iluminación, colores y acabados para materializar tu visión.",
    incluye:
      "Entrevista preliminar + levantamiento + presentación con 3 visualizaciones 3D fotorrealistas + cotización.",
    precio: "Desde $5,800 x espacio",
    iconId: "interiorismo",
    imagen: "/images/servicios/interiorismo.png",
  },
  {
    id: "asesoria",
    num: "02",
    nombre: "Asesoría",
    descripcion:
      "Recibe acompañamiento profesional para resolver dudas, definir ideas y tomar decisiones con seguridad. Te ayudamos a transformar tu espacio de forma práctica, ya sea a distancia mediante una video llamada o en sitio.",
    incluye:
      "Entrevista de 60 minutos + imágenes explicativas de los puntos tratados en la llamada.",
    precio: "Desde $1,200 x espacio",
    iconId: "asesoria",
    imagen: "/images/servicios/asesoria.png",
  },
  {
    id: "custom-design",
    num: "03",
    nombre: "Custom Design",
    subtitulo: "Diseña tu mueble",
    descripcion:
      "Diseñamos piezas únicas pensadas para tus necesidades, gustos y espacio. Cada mueble combina funcionalidad, estética y atención al detalle para lograr un resultado completamente personalizado.",
    incluye:
      "Entrevista preliminar + levantamiento + visualización 3D fotorrealista + cotización.",
    precio: "Desde $2,600 x mueble",
    iconId: "custom-design",
    imagen: "/images/servicios/custom-design.png",
  },
  {
    id: "styling",
    num: "04",
    nombre: "Styling",
    subtitulo: "Decora tu espacio",
    descripcion:
      "Renueva la personalidad de tu hogar con una cuidadosa selección de mobiliario, decoración, textiles, iluminación y accesorios que reflejen tu estilo y eleven cada ambiente.",
    incluye:
      "Entrevista preliminar + presentación con las selecciones pensadas para tu espacio + cotización / listado de compras.",
    precio: "Desde $2,200 x espacio",
    iconId: "styling",
    imagen: "/images/servicios/styling.png",
  },
  {
    id: "proyecto-obra",
    num: "05",
    nombre: "Proyecto Obra",
    descripcion:
      "Coordinamos y supervisamos cada etapa de la obra para garantizar que el proyecto se materialice conforme al diseño, cuidando calidad, tiempos y presupuesto.",
    incluye:
      "Supervisión integral del proceso constructivo. Si ejecutas el proyecto con nosotros, te reembolsamos el pago de tu diseño al cumplir con la compra mínima por espacio.",
    precio: "Desde 15% del monto total de la cotización de obra",
    iconId: "ejecucion",
    imagen: "/images/servicios/ejecucion-de-obra.png",
  },
  {
    id: "fabricacion-mobiliario",
    num: "06",
    nombre: "Fabricación de Muebles",
    descripcion:
      "Creamos mobiliario personalizado que aprovecha al máximo cada espacio. Diseñado y fabricado con materiales seleccionados para ofrecer funcionalidad, durabilidad y un acabado excepcional.",
    incluye:
      "Diseño + fabricación con materiales seleccionados. Si nosotros fabricamos tu mueble, te reembolsamos el pago de tu diseño.",
    precio: "Desde 15% del monto total de la cotización de material + mano de obra",
    iconId: "fabricacion",
    imagen: "/images/servicios/fabricacion-mobiliario.png",
  },
  {
    id: "proyecto-ejecutivo",
    num: "07",
    nombre: "Ejecutivo",
    descripcion:
      "Transformamos el diseño arquitectónico en un plan preciso para su construcción. Generamos planos, detalles técnicos, especificaciones y documentación necesaria para ejecutar el proyecto con claridad y control.",
    incluye:
      "Entrevista preliminar + levantamiento topográfico + propuesta con renders fotorrealistas exteriores + planos arquitectónicos + planos de instalaciones básicas + planos estructurales + propuesta de acabados exteriores.",
    precio: "Desde $250 x m²",
    iconId: "proyecto-ejecutivo",
    imagen: "/images/servicios/proyecto-ejecutivo.png",
  },
  {
    id: "paisajismo",
    num: "08",
    nombre: "Paisajismo",
    subtitulo: "En colaboración con Naturhabitat",
    descripcion:
      "A través de nuestra colaboración con Naturhabitat, concebimos espacios exteriores como escenarios vivos donde la arquitectura y la naturaleza conviven en equilibrio. Diseñamos propuestas de paisajismo biodinámico que integran vegetación, materiales y soluciones sustentables para crear ambientes funcionales, estéticos y de bajo mantenimiento, apoyándonos en tecnologías de ecoinnovación que favorecen el desarrollo responsable de cada proyecto.",
    incluye:
      "Entrevista preliminar + levantamiento + creación de concepto + paleta vegetal + propuesta en render + plano de distribución + cotización.",
    precio: "",
    iconId: "paisajismo",
    imagen: "/images/servicios/paisajismo.png",
  },
];
