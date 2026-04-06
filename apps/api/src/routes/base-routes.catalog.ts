export type BaseRouteTemplate = {
  templateKey: string;
  title: string;
  origin: string;
  destination: string;
  stopsText: string;
  weekdays: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  departureTime: string;
  estimatedArrivalTime: string;
  availableSeats: number;
  distanceKm: number;
  recommendedPricePerSeat: number;
};

export const BASE_ROUTE_TEMPLATES: BaseRouteTemplate[] = [
  {
    templateKey: 'corredor-norte-ecatepec-indios-verdes',
    title: 'Corredor Norte: Ecatepec -> Indios Verdes',
    origin: 'Ecatepec',
    destination: 'Indios Verdes',
    stopsText: 'Ruta laboral frecuente. Punto de abordaje sugerido en zona publica y visible de Ecatepec.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    departureTime: '06:20',
    estimatedArrivalTime: '07:35',
    availableSeats: 4,
    distanceKm: 24,
    recommendedPricePerSeat: 42
  },
  {
    templateKey: 'corredor-norte-acolman-indios-verdes',
    title: 'Corredor Norte: Acolman -> Indios Verdes',
    origin: 'Acolman',
    destination: 'Indios Verdes',
    stopsText: 'Ruta laboral frecuente para zona norte. Referencia clara de abordaje para operacion segura.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    departureTime: '05:50',
    estimatedArrivalTime: '07:20',
    availableSeats: 4,
    distanceKm: 34,
    recommendedPricePerSeat: 55
  },
  {
    templateKey: 'corredor-norte-teotihuacan-indios-verdes',
    title: 'Corredor Norte: Teotihuacan -> Indios Verdes',
    origin: 'Teotihuacan',
    destination: 'Indios Verdes',
    stopsText: 'Corredor de alta demanda semanal. Operar con punto de abordaje visible y facil de identificar.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    departureTime: '05:40',
    estimatedArrivalTime: '07:15',
    availableSeats: 4,
    distanceKm: 38,
    recommendedPricePerSeat: 62
  },
  {
    templateKey: 'corredor-norte-otumba-indios-verdes',
    title: 'Corredor Norte: Otumba -> Indios Verdes',
    origin: 'Otumba',
    destination: 'Indios Verdes',
    stopsText: 'Ruta extendida para trabajadores recurrentes. Recomendar abordaje en punto publico.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    departureTime: '05:30',
    estimatedArrivalTime: '07:20',
    availableSeats: 4,
    distanceKm: 42,
    recommendedPricePerSeat: 70
  },
  {
    templateKey: 'corredor-norte-tecamac-indios-verdes',
    title: 'Corredor Norte: Tecamac -> Indios Verdes',
    origin: 'Tecamac',
    destination: 'Indios Verdes',
    stopsText: 'Ruta laboral frecuente para conexion rapida al nodo Indios Verdes.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    departureTime: '06:10',
    estimatedArrivalTime: '07:30',
    availableSeats: 4,
    distanceKm: 28,
    recommendedPricePerSeat: 46
  },
  {
    templateKey: 'corredor-oriente-neza-pantitlan',
    title: 'Corredor Oriente: Nezahualcoyotl -> Pantitlan',
    origin: 'Nezahualcoyotl',
    destination: 'Pantitlan',
    stopsText: 'Ruta laboral frecuente para zona oriente con llegada a nodo Pantitlan.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    departureTime: '06:10',
    estimatedArrivalTime: '07:10',
    availableSeats: 4,
    distanceKm: 18,
    recommendedPricePerSeat: 30
  },
  {
    templateKey: 'corredor-oriente-chimalhuacan-pantitlan',
    title: 'Corredor Oriente: Chimalhuacan -> Pantitlan',
    origin: 'Chimalhuacan',
    destination: 'Pantitlan',
    stopsText: 'Corredor operativo para trabajadores del oriente hacia CDMX.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    departureTime: '05:55',
    estimatedArrivalTime: '07:05',
    availableSeats: 4,
    distanceKm: 22,
    recommendedPricePerSeat: 34
  },
  {
    templateKey: 'corredor-oriente-chicoloapan-pantitlan',
    title: 'Corredor Oriente: Chicoloapan -> Pantitlan',
    origin: 'Chicoloapan',
    destination: 'Pantitlan',
    stopsText: 'Ruta laboral frecuente con enfoque en traslado puntual de entrada.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    departureTime: '05:45',
    estimatedArrivalTime: '07:10',
    availableSeats: 4,
    distanceKm: 27,
    recommendedPricePerSeat: 40
  },
  {
    templateKey: 'corredor-suburbano-cuautitlan-buenavista',
    title: 'Corredor Suburbano: Cuautitlan -> Buenavista',
    origin: 'Cuautitlan',
    destination: 'Buenavista',
    stopsText: 'Ruta hacia nodo laboral y de transbordo de Buenavista.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    departureTime: '06:00',
    estimatedArrivalTime: '07:25',
    availableSeats: 4,
    distanceKm: 31,
    recommendedPricePerSeat: 48
  },
  {
    templateKey: 'corredor-norponiente-naucalpan-cuatro-caminos',
    title: 'Corredor Norponiente: Naucalpan -> Cuatro Caminos',
    origin: 'Naucalpan',
    destination: 'Cuatro Caminos',
    stopsText: 'Ruta laboral frecuente para acceso rapido a Toreo y conexiones CDMX.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    departureTime: '06:30',
    estimatedArrivalTime: '07:30',
    availableSeats: 4,
    distanceKm: 16,
    recommendedPricePerSeat: 28
  },
  {
    templateKey: 'corredor-cdmx-centro-laboral',
    title: 'Corredor CDMX: Centro Laboral',
    origin: 'EdoMex (punto de abordaje)',
    destination: 'Centro CDMX',
    stopsText: 'Ruta flexible hacia zonas laborales centrales y terminales de alta demanda.',
    weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    departureTime: '06:40',
    estimatedArrivalTime: '08:00',
    availableSeats: 4,
    distanceKm: 35,
    recommendedPricePerSeat: 52
  }
];
