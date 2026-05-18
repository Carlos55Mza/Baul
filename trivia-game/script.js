const QUESTION_TIME = 20;
const TOTAL_LIVES = 3;
const QUESTIONS_PER_LEVEL = 20;
const HIGH_SCORES_KEY = "trivia_master_high_scores_v3";
const difficultyOrder = ["Facil", "Medio", "Dificil", "Experto"];

const $ = (id) => document.getElementById(id);
const startScreen = $("start-screen");
const gameScreen = $("game-screen");
const gameOverScreen = $("game-over-screen");
const confettiLayer = $("confetti-layer");
const startBtn = $("start-btn");
const restartBtn = $("restart-btn");
const p1NameInput = $("p1-name");
const p2NameInput = $("p2-name");
const qIndexEl = $("q-index");
const qTotalEl = $("q-total");
const difficultyTagEl = $("difficulty-tag");
const timerEl = $("timer");
const turnPlayerEl = $("turn-player");
const timeBarEl = $("time-bar");
const catIconEl = $("cat-icon");
const catTextEl = $("cat-text");
const questionTextEl = $("question-text");
const optionsEl = $("options");
const feedbackEl = $("feedback");
const p1LabelEl = $("p1-label");
const p2LabelEl = $("p2-label");
const p1ScoreEl = $("p1-score");
const p2ScoreEl = $("p2-score");
const p1LivesEl = $("p1-lives");
const p2LivesEl = $("p2-lives");
const p1FinalEl = $("p1-final");
const p2FinalEl = $("p2-final");
const finalAnsweredEl = $("final-answered");
const finalCorrectEl = $("final-correct");
const winnerLineEl = $("winner-line");
const scoreForm = $("score-form");
const playerNameInput = $("player-name");
const scoreListEl = $("score-list");

let gameState = null;
let timerInterval = null;
let audioCtx = null;

function shuffle(arr) {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}
function makeQ(category, difficulty, question, correct, wrong1, wrong2, wrong3) {
  const options = shuffle([correct, wrong1, wrong2, wrong3]);
  return { category, difficulty, question, options, answer: options.indexOf(correct) };
}
function pushSet(target, category, difficulty, tuples) {
  tuples.forEach((t) => target.push(makeQ(category, difficulty, t[0], t[1], t[2], t[3], t[4])));
}

function buildQuestionBank() {
  const q = [];

  pushSet(q, "Historia mundial", "Facil", [
    ["En que ano comenzo la Revolucion Francesa?", "1789", "1776", "1804", "1812"],
    ["Quien fue el primer presidente de EE. UU.?", "George Washington", "Thomas Jefferson", "John Adams", "James Madison"],
    ["Que imperio construyo Machu Picchu?", "Inca", "Maya", "Azteca", "Olmeca"],
    ["En que ciudad cayo el muro en 1989?", "Berlin", "Praga", "Budapest", "Varsovia"],
    ["Quien lidero la independencia de India con resistencia no violenta?", "Mahatma Gandhi", "Nehru", "Ambedkar", "Patel"],
    ["Que civilizacion construyo las piramides de Giza?", "Egipcia", "Persa", "Fenicia", "Hitita"],
    ["Que tratado puso fin a la Primera Guerra Mundial?", "Tratado de Versalles", "Tratado de Tordesillas", "Tratado de Utrecht", "Tratado de Brest-Litovsk"],
    ["Que ciudad fue capital del Imperio Bizantino?", "Constantinopla", "Atenas", "Roma", "Alejandria"],
  ]);
  pushSet(q, "Historia mundial", "Medio", [
    ["Que batalla de 1815 sello la derrota de Napoleon?", "Waterloo", "Austerlitz", "Leipzig", "Trafalgar"],
    ["Que dinastia ordeno construir la Ciudad Prohibida?", "Ming", "Qing", "Tang", "Han"],
    ["Que conflicto duro de 1914 a 1918?", "Primera Guerra Mundial", "Guerra de Crimea", "Guerra Franco-Prusiana", "Guerra de los Siete Anos"],
    ["En que ano comenzo la Segunda Guerra Mundial en Europa?", "1939", "1936", "1941", "1945"],
    ["Que emperador convoco el Concilio de Nicea?", "Constantino", "Augusto", "Trajano", "Neron"],
    ["Que movimiento politico surge en Rusia en 1917?", "Bolchevismo", "Fascismo", "Maoismo", "Peronismo"],
    ["Que ciudad fue arrasada por el Vesubio en 79 d.C.?", "Pompeya", "Herculano", "Ninive", "Cartago"],
    ["Que imperio tenia su centro en Tenochtitlan?", "Azteca", "Inca", "Maya", "Tolteca"],
  ]);
  pushSet(q, "Historia mundial", "Dificil", [
    ["Que paz de 1648 suele marcar el inicio del sistema de estados moderno?", "Paz de Westfalia", "Paz de Augsburgo", "Paz de Basilea", "Paz de Utrecht"],
    ["Que rey ingles firmo la Magna Carta en 1215?", "Juan Sin Tierra", "Enrique II", "Ricardo Corazon de Leon", "Eduardo I"],
    ["Que batalla naval de 1571 enfrento a la Liga Santa y al Imperio Otomano?", "Lepanto", "Salamina", "Actium", "Trafalgar"],
    ["Que reforma japonesa de 1868 modernizo al pais?", "Restauracion Meiji", "Edicto Tokugawa", "Reforma Taisho", "Constitucion Showa"],
    ["Que ciudad fue sede de los juicios de criminales nazis tras la guerra?", "Nuremberg", "Berlin", "Munich", "Bonn"],
    ["Que ano cayo Constantinopla ante los otomanos?", "1453", "1492", "1415", "1526"],
    ["Que rey frances fue conocido como el Rey Sol?", "Luis XIV", "Luis XV", "Luis XVI", "Francois I"],
    ["Que expedicion dio la primera vuelta al mundo?", "Magallanes-Elcano", "Colombo", "Vespucci", "Cook"],
  ]);
  pushSet(q, "Historia mundial", "Experto", [
    ["Que general cartagines cruzo los Alpes con elefantes?", "Anibal Barca", "Escipion", "Amilcar", "Maharbal"],
    ["Que acuerdo de 1938 permitio la anexacion de los Sudetes?", "Acuerdo de Munich", "Pacto Ribbentrop-Molotov", "Pacto de Locarno", "Acuerdo de Potsdam"],
    ["Que cronista escribio 'La guerra del Peloponeso'?", "Tucidides", "Herodoto", "Jenofonte", "Polibio"],
    ["Que revolucion de 1905 abrio el camino al final del zarismo?", "Domingo Sangriento", "Revolucion de Febrero", "Revolucion de Octubre", "Levantamiento de Kronstadt"],
    ["Que dinastia gobernaba Francia al estallar la Revolucion?", "Borbones", "Capetos", "Valois", "Orleans"],
    ["Que doctrina estadounidense de 1823 rechazo nuevas colonias europeas en America?", "Doctrina Monroe", "Corolario Roosevelt", "Destino Manifiesto", "New Deal"],
    ["Quien fue el principal estratega de la unificacion alemana del siglo XIX?", "Otto von Bismarck", "Metternich", "Hindenburg", "Bethmann-Hollweg"],
    ["Que conflicto termino con el Tratado de Utrecht (1713)?", "Guerra de Sucesion Espanola", "Guerra de los Treinta Anos", "Guerra de los Siete Anos", "Guerra de Crimea"],
  ]);

  pushSet(q, "Ciencia", "Facil", [
    ["Que planeta es conocido como planeta rojo?", "Marte", "Venus", "Jupiter", "Mercurio"],
    ["Cual es el simbolo quimico del oro?", "Au", "Ag", "Go", "Or"],
    ["Que organo bombea sangre en el cuerpo humano?", "Corazon", "Higado", "Pulmon", "Rinon"],
    ["Que gas es mas abundante en la atmosfera terrestre?", "Nitrogeno", "Oxigeno", "Argon", "CO2"],
    ["Cual es la unidad de intensidad de corriente en SI?", "Amperio", "Voltio", "Ohmio", "Vatio"],
    ["Que fuerza atrae objetos hacia la Tierra?", "Gravedad", "Friccion", "Empuje", "Inercia"],
    ["Que celula no tiene nucleo definido?", "Procariota", "Eucariota", "Neurona", "Epitelial"],
    ["Que vitamina se sintetiza con exposicion al sol?", "Vitamina D", "Vitamina C", "Vitamina K", "Vitamina B12"],
  ]);
  pushSet(q, "Ciencia", "Medio", [
    ["Que organelo produce ATP principalmente?", "Mitocondria", "Ribosoma", "Lisosoma", "Golgi"],
    ["Que cientifico formulo la gravitacion universal?", "Isaac Newton", "Kepler", "Galileo", "Bohr"],
    ["Numero atomico del carbono?", "6", "8", "12", "14"],
    ["Que tipo de enlace comparten electrones?", "Covalente", "Ionica", "Metalica", "Puente de hidrogeno"],
    ["Que proceso convierte glucosa en ATP sin oxigeno?", "Glucolisis anaerobia", "Ciclo de Krebs", "Fotolisis", "Quimiosmosis"],
    ["Que tipo de radiacion tiene mayor energia?", "Gamma", "Infrarroja", "Microondas", "Visible violeta"],
    ["Que hormona regula glucosa y baja azucar en sangre?", "Insulina", "Glucagon", "Adrenalina", "Cortisol"],
    ["Que particula tiene carga negativa?", "Electron", "Proton", "Neutron", "Positron"],
  ]);
  pushSet(q, "Ciencia", "Dificil", [
    ["Que particula es un lepton?", "Electron", "Proton", "Neutron", "Pion"],
    ["Que escala mide acidez y basicidad?", "pH", "Richter", "Kelvin", "Beaufort"],
    ["Que principio afirma que no se pueden conocer simultaneamente posicion y momento con precision arbitraria?", "Incertidumbre de Heisenberg", "Principio de Pauli", "Ley de Avogadro", "Teorema de Noether"],
    ["Que unidad del SI mide capacitancia?", "Faradio", "Henrio", "Tesla", "Siemens"],
    ["Que capa del Sol vemos normalmente?", "Fotosfera", "Corona", "Nucleo", "Cromosfera"],
    ["Que proceso celular divide una celula somatica en dos identicas?", "Mitosis", "Meiosis", "Fision binaria", "Esporulacion"],
    ["Que acido forma la lluvia acida mayormente por SO2?", "Acido sulfurico", "Acido clorhidrico", "Acido acético", "Acido formico"],
    ["Que molecula transporta informacion genetica heredable?", "ADN", "ATP", "ARNt", "Colageno"],
  ]);
  pushSet(q, "Ciencia", "Experto", [
    ["Constante que relaciona energia y frecuencia del foton?", "Constante de Planck", "Constante de Boltzmann", "Numero de Avogadro", "Constante de Faraday"],
    ["Particula mediadora de la interaccion electromagnetica?", "Foton", "Gluon", "Boson W", "Boson de Higgs"],
    ["Que ecuacion relativista expresa equivalencia masa-energia?", "E = mc^2", "F = ma", "PV = nRT", "V = IR"],
    ["Que boson fue observado en el CERN en 2012?", "Boson de Higgs", "Boson X", "Taquion", "Graviton"],
    ["Que mecanismo evolutivo no aleatorio selecciona rasgos adaptativos?", "Seleccion natural", "Deriva genetica", "Mutacion neutra", "Flujo genico"],
    ["Que estructura proteica celular separa cromatidas en anafase?", "Huso mitotico", "Centromero", "Nucléolo", "Membrana nuclear"],
    ["Que ley afirma aumento de entropia en sistemas aislados?", "Segunda ley de la termodinamica", "Ley de Hooke", "Ley de Hess", "Ley de Boyle"],
    ["Que modelo atomico introdujo orbitales cuanticos?", "Modelo mecanico cuantico", "Modelo de Thomson", "Modelo de Rutherford", "Modelo de Dalton"],
  ]);

  const tech = [
    ["Que significa HTTP?", "HyperText Transfer Protocol", "Hyper Transfer Text Program", "Host Text Transfer Process", "High Throughput Transfer Protocol", "Facil"],
    ["Que protocolo resuelve nombres de dominio?", "DNS", "DHCP", "SMTP", "FTP", "Facil"],
    ["Que estructura usa BFS?", "Cola", "Pila", "Heap", "Arbol B", "Medio"],
    ["Complejidad de busqueda binaria?", "O(log n)", "O(n)", "O(1)", "O(n log n)", "Dificil"],
    ["Que NO es VCS distribuido?", "Subversion", "Git", "Mercurial", "Fossil", "Dificil"],
    ["Que paradigma usa React?", "Declarativo por componentes", "Imperativo secuencial", "Procedural clasico", "Orientado a lotes", "Experto"],
    ["Que protocolo cifra web en TLS?", "HTTPS", "HTTP", "FTP", "Telnet", "Facil"],
    ["En SQL, que comando elimina filas por condicion?", "DELETE", "DROP", "TRUNCATE", "REMOVE", "Medio"],
    ["En Git, que comando integra otra rama en la actual?", "merge", "fork", "stash", "rebase --onto", "Medio"],
    ["En redes, que mascara corresponde a /24?", "255.255.255.0", "255.0.0.0", "255.255.0.0", "255.255.255.240", "Medio"],
    ["Que algoritmo de clave publica usa factorizacion de enteros grandes?", "RSA", "AES", "ChaCha20", "Blowfish", "Dificil"],
    ["Que estructura enlaza bloques en blockchain?", "Hash del bloque previo", "IP del minero", "Hora local del nodo", "Puerto TCP", "Experto"],
    ["En CSS, que propiedad organiza layout 2D?", "grid", "float", "position", "clear", "Facil"],
    ["Que metodo HTTP suele crear recurso?", "POST", "GET", "HEAD", "TRACE", "Facil"],
    ["Que formato serializa datos como pares clave-valor legibles?", "JSON", "BSON", "YAML binario", "CSV jerarquico", "Medio"],
    ["Que evita colision de cambios concurrentes con historial lineal local?", "rebase interactivo", "chmod", "ping", "scp", "Dificil"],
  ];
  tech.forEach((t) => q.push(makeQ("Tecnologia", t[5], t[0], t[1], t[2], t[3], t[4])));

  pushSet(q, "Cine", "Facil", [
    ["Quien dirigio Titanic?", "James Cameron", "Steven Spielberg", "Ridley Scott", "Peter Jackson"],
    ["Que saga incluye a Luke Skywalker?", "Star Wars", "Star Trek", "Dune", "Alien"],
    ["Quien interpreto a Rocky Balboa?", "Sylvester Stallone", "Arnold Schwarzenegger", "Al Pacino", "Robert De Niro"],
    ["Que pelicula de Pixar trata emociones personificadas?", "Inside Out", "Toy Story", "Wall-E", "Up"],
    ["Director de El padrino?", "Francis Ford Coppola", "Martin Scorsese", "Brian De Palma", "Nolan"],
    ["Que actor protagoniza Matrix como Neo?", "Keanu Reeves", "Brad Pitt", "Matt Damon", "Tom Cruise"],
    ["Que pelicula gano Oscar 2020?", "Parasite", "1917", "Joker", "Ford v Ferrari"],
    ["En que pelicula aparece el personaje Jack Sparrow?", "Piratas del Caribe", "Master and Commander", "Titanic", "Gladiador"],
  ]);
  pushSet(q, "Cine", "Medio", [
    ["Director de Pulp Fiction?", "Quentin Tarantino", "David Fincher", "Guy Ritchie", "Kubrick"],
    ["Director de Rashomon?", "Akira Kurosawa", "Ozu", "Miyazaki", "Miike"],
    ["Que filme de Bergman juega ajedrez con la muerte?", "El septimo sello", "Persona", "Fresas salvajes", "Gritos y susurros"],
    ["Que movimiento asocio a Murnau y Lang?", "Expresionismo aleman", "Neorrealismo", "Nouvelle Vague", "Dogma 95"],
    ["Quien dirigio 2001: A Space Odyssey?", "Stanley Kubrick", "Tarkovsky", "Ridley Scott", "Spielberg"],
    ["Que filme de Coppola transcurre en Vietnam y adapta a Conrad?", "Apocalypse Now", "Platoon", "The Deer Hunter", "Full Metal Jacket"],
    ["Quien dirigio Ciudadano Kane?", "Orson Welles", "John Ford", "Billy Wilder", "Howard Hawks"],
    ["Que actriz protagoniza La La Land junto a Ryan Gosling?", "Emma Stone", "Jennifer Lawrence", "Natalie Portman", "Anne Hathaway"],
  ]);
  pushSet(q, "Cine", "Dificil", [
    ["Primera pelicula cronologicamente con 11 Oscar?", "Ben-Hur", "Titanic", "El retorno del rey", "West Side Story"],
    ["Que cineasta dirigio Stalker y Solaris?", "Andrei Tarkovsky", "Bela Tarr", "Bergman", "Kieslowski"],
    ["Quien dirigio 8 1/2?", "Federico Fellini", "De Sica", "Visconti", "Antonioni"],
    ["Que director filmo Seven Samurai?", "Akira Kurosawa", "Mizoguchi", "Kitano", "Kon"],
    ["Que pelicula inaugura la Trilogia de Apu?", "Pather Panchali", "Aparajito", "The World of Apu", "Charulata"],
    ["Que director realizo Persona (1966)?", "Ingmar Bergman", "Fellini", "Antonioni", "Godard"],
    ["Que pelicula de Sciamma retrata a Heloise y Marianne?", "Portrait of a Lady on Fire", "Raw", "Blue Is the Warmest Color", "Mustang"],
    ["Que pelicula de Hitchcock transcurre casi entera en un patio observado?", "Rear Window", "Psycho", "Vertigo", "Rebecca"],
  ]);
  pushSet(q, "Cine", "Experto", [
    ["Que director de fotografia fue clave en In the Mood for Love?", "Christopher Doyle", "Roger Deakins", "Vittorio Storaro", "Emmanuel Lubezki"],
    ["Que filme de Eisenstein teoriza montaje de atracciones?", "El acorazado Potemkin", "Octubre", "Ivan el Terrible", "Alexander Nevsky"],
    ["Quien dirigio Satantango?", "Bela Tarr", "Tarkovsky", "Angelopoulos", "Haneke"],
    ["Que pelicula de Ozu explora choque generacional en Japon?", "Tokyo Story", "Late Spring", "Early Summer", "An Autumn Afternoon"],
    ["Que directora filmo Jeanne Dielman?", "Chantal Akerman", "Agnès Varda", "Claire Denis", "Lina Wertmuller"],
    ["Que filme de Bresson adapta a Dostoievski con Michel protagonista?", "Pickpocket", "Mouchette", "Au hasard Balthazar", "Lancelot du Lac"],
    ["En que pelicula de Tarkovsky aparece la Zona y la Habitacion?", "Stalker", "Solaris", "Nostalgia", "El espejo"],
    ["Que cinta de Wong Kar-wai usa a Yumeji's Theme como motivo?", "In the Mood for Love", "Chungking Express", "2046", "Days of Being Wild"],
  ]);

  const music = [
    ["Quien compuso la Quinta sinfonia en do menor?", "Beethoven", "Mozart", "Bach", "Vivaldi", "Facil"],
    ["Banda de Freddie Mercury?", "Queen", "U2", "The Police", "Pink Floyd", "Facil"],
    ["Genero asociado a Miles Davis?", "Jazz", "Soul", "Funk", "Disco", "Medio"],
    ["Compositor de Las cuatro estaciones?", "Vivaldi", "Handel", "Haydn", "Berlioz", "Medio"],
    ["Opera Tristan e Isolda fue escrita por?", "Richard Wagner", "Verdi", "Puccini", "Mozart", "Dificil"],
    ["Quien compuso El arte de la fuga?", "J. S. Bach", "Telemann", "Rameau", "Scarlatti", "Dificil"],
    ["Compositor de Le Sacre du printemps?", "Igor Stravinsky", "Debussy", "Ravel", "Prokofiev", "Experto"],
    ["Tecnica de Schoenberg con 12 tonos?", "Dodecafonismo", "Minimalismo", "Politonalidad", "Neoclasicismo", "Experto"],
    ["Instrumento de Yo-Yo Ma?", "Violonchelo", "Violin", "Piano", "Clarinete", "Facil"],
    ["Quien compuso Carmina Burana?", "Carl Orff", "Mahler", "Bruckner", "Hindemith", "Dificil"],
    ["Compositor de El barbero de Sevilla?", "Rossini", "Puccini", "Donizetti", "Verdi", "Medio"],
    ["Quien escribio la opera Wozzeck?", "Alban Berg", "Schoenberg", "Webern", "Mahler", "Experto"],
    ["Que banda grabo The Dark Side of the Moon?", "Pink Floyd", "The Who", "Genesis", "Dire Straits", "Facil"],
    ["Compositor del Bolero orquestal mas famoso?", "Ravel", "Debussy", "Satie", "Fauré", "Medio"],
    ["Quien compuso El clave bien temperado?", "J. S. Bach", "Haydn", "Mozart", "Corelli", "Dificil"],
    ["Que cantante es conocida como La Reina del Soul?", "Aretha Franklin", "Tina Turner", "Nina Simone", "Whitney Houston", "Facil"],
  ];
  music.forEach((m) => q.push(makeQ("Musica", m[5], m[0], m[1], m[2], m[3], m[4])));

  const literature = [
    ["Autor de Don Quijote?", "Miguel de Cervantes", "Lope de Vega", "Quevedo", "Garcilaso", "Facil"],
    ["Quien escribio Cien anos de soledad?", "Gabriel Garcia Marquez", "Cortazar", "Vargas Llosa", "Neruda", "Facil"],
    ["Autor de 1984?", "George Orwell", "Huxley", "Bradbury", "Clarke", "Facil"],
    ["Quien escribio Ulises?", "James Joyce", "T. S. Eliot", "Woolf", "Beckett", "Medio"],
    ["Autor de La metamorfosis?", "Franz Kafka", "Thomas Mann", "Musil", "Hesse", "Medio"],
    ["Autor de La montana magica?", "Thomas Mann", "Kafka", "Musil", "Hesse", "Dificil"],
    ["Autor de En busca del tiempo perdido?", "Marcel Proust", "Balzac", "Flaubert", "Zola", "Dificil"],
    ["Obra de Dante Alighieri?", "La divina comedia", "Decameron", "Orlando furioso", "Jerusalen liberada", "Experto"],
    ["Quien escribio Rayuela?", "Julio Cortazar", "Borges", "Onetti", "Sabato", "Experto"],
    ["Autor de Fausto?", "Goethe", "Schiller", "Heine", "Novalis", "Medio"],
    ["Escritor de Pedro Paramo?", "Juan Rulfo", "Carlos Fuentes", "Octavio Paz", "Carpentier", "Dificil"],
    ["Poeta de The Waste Land?", "T. S. Eliot", "Ezra Pound", "Yeats", "Auden", "Experto"],
    ["Poeta chileno Nobel 1971?", "Pablo Neruda", "Mistral", "Parra", "Huidobro", "Facil"],
    ["Quien escribio Moby-Dick?", "Herman Melville", "Hawthorne", "Whitman", "Twain", "Medio"],
    ["Novela de Dostoyevski sobre Raskolnikov?", "Crimen y castigo", "Los hermanos Karamazov", "El idiota", "Los demonios", "Dificil"],
    ["Autor de La odisea?", "Homero", "Hesiodo", "Virgilio", "Ovidio", "Facil"],
  ];
  literature.forEach((l) => q.push(makeQ("Literatura", l[5], l[0], l[1], l[2], l[3], l[4])));

  const geography = [
    ["Capital de Australia?", "Canberra", "Sydney", "Melbourne", "Perth", "Facil"],
    ["Rio mas largo de Sudamerica?", "Amazonas", "Parana", "Orinoco", "Magdalena", "Facil"],
    ["Capital de Canada?", "Ottawa", "Toronto", "Vancouver", "Montreal", "Facil"],
    ["Montana mas alta de Africa?", "Kilimanjaro", "Monte Kenia", "Ruwenzori", "Atlas", "Medio"],
    ["Pais con mas husos horarios contando ultramar?", "Francia", "Rusia", "Estados Unidos", "China", "Medio"],
    ["Estrecho entre Asia y America del Norte?", "Bering", "Gibraltar", "Ormuz", "Malaca", "Dificil"],
    ["Lago navegable mas alto?", "Titicaca", "Baikal", "Victoria", "Atitlan", "Dificil"],
    ["Punto oceanico mas profundo conocido?", "Abismo Challenger", "Fosa de Tonga", "Fosa de Java", "Fosa de Puerto Rico", "Experto"],
    ["Pais africano mas poblado?", "Nigeria", "Etiopia", "Egipto", "Sudafrica", "Experto"],
    ["Cordillera mas larga continental?", "Andes", "Himalaya", "Rocosas", "Alpes", "Medio"],
    ["Pais con mayor cantidad de islas oficialmente registradas?", "Suecia", "Indonesia", "Filipinas", "Noruega", "Dificil"],
    ["Capital de Japon?", "Tokio", "Osaka", "Kioto", "Nagoya", "Facil"],
    ["Mar interior entre Europa y Africa?", "Mediterraneo", "Egeo", "Adriatico", "Negro", "Medio"],
    ["Desierto calido mas grande?", "Sahara", "Kalahari", "Atacama", "Arabigo", "Dificil"],
    ["Que pais alberga el monte Elbrus?", "Rusia", "Georgia", "Armenia", "Turquia", "Experto"],
    ["Capital de Nueva Zelanda?", "Wellington", "Auckland", "Christchurch", "Hamilton", "Medio"],
  ];
  geography.forEach((g) => q.push(makeQ("Geografia", g[5], g[0], g[1], g[2], g[3], g[4])));

  const sports = [
    ["Cuantos jugadores por equipo en cancha en futbol?", "11", "10", "9", "12", "Facil"],
    ["Deporte de la Copa Davis?", "Tenis", "Golf", "Rugby", "Beisbol", "Facil"],
    ["Pais ganador primer Mundial 1930?", "Uruguay", "Argentina", "Brasil", "Italia", "Medio"],
    ["Pais origen del judo?", "Japon", "China", "Corea", "Tailandia", "Dificil"],
    ["Nadador con 8 oros en Beijing 2008?", "Michael Phelps", "Mark Spitz", "Ryan Lochte", "Ian Thorpe", "Dificil"],
    ["Distancia oficial del maraton?", "42.195 km", "40 km", "41.5 km", "43 km", "Experto"],
    ["Pais que invento voleibol moderno?", "Estados Unidos", "Brasil", "Rusia", "Japon", "Experto"],
    ["Cuantos anillos olimpicos hay?", "5", "4", "6", "7", "Facil"],
    ["Grand Slam sobre arcilla?", "Roland Garros", "Wimbledon", "US Open", "Australian Open", "Medio"],
    ["Eurocopa 2016 la gano...", "Portugal", "Francia", "Alemania", "Espana", "Dificil"],
    ["Deporte de Michael Jordan?", "Baloncesto", "Beisbol", "Futbol americano", "Golf", "Facil"],
    ["Que pais gano el Mundial 2010?", "Espana", "Alemania", "Italia", "Paises Bajos", "Medio"],
    ["En ajedrez, como se llama la situacion de no poder evitar captura del rey?", "Jaque mate", "Tablas", "Ahogado", "Enroque", "Facil"],
    ["En ciclismo, que carrera por etapas se disputa en Francia?", "Tour de France", "Giro de Lombardia", "Paris-Roubaix", "Vuelta a Suiza", "Medio"],
    ["Cuantas bases tiene un diamante de beisbol?", "4", "3", "5", "6", "Facil"],
    ["Primer campeon mundial oficial de ajedrez (1886)?", "Wilhelm Steinitz", "Lasker", "Morphy", "Capablanca", "Experto"],
  ];
  sports.forEach((s) => q.push(makeQ("Deportes", s[5], s[0], s[1], s[2], s[3], s[4])));

  const art = [
    ["Quien pinto La noche estrellada?", "Vincent van Gogh", "Picasso", "Dali", "Goya", "Facil"],
    ["Quien pinto Guernica?", "Pablo Picasso", "Miro", "Dali", "Velazquez", "Medio"],
    ["Escultor de El pensador?", "Auguste Rodin", "Bernini", "Donatello", "Brancusi", "Facil"],
    ["Autor de la Mona Lisa?", "Leonardo da Vinci", "Rafael", "Miguel Angel", "Botticelli", "Facil"],
    ["Corriente de Salvador Dali?", "Surrealismo", "Realismo", "Impresionismo", "Futurismo", "Medio"],
    ["Arquitecto de la Sagrada Familia?", "Antoni Gaudi", "Mies van der Rohe", "Le Corbusier", "Calatrava", "Dificil"],
    ["Pintor de Las meninas?", "Diego Velazquez", "El Greco", "Goya", "Murillo", "Experto"],
    ["Artista del Cuadrado negro?", "Kazimir Malevich", "Mondrian", "Kandinsky", "Chagall", "Dificil"],
    ["Movimiento de Claude Monet?", "Impresionismo", "Cubismo", "Barroco", "Surrealismo", "Medio"],
    ["Pintor de El grito?", "Edvard Munch", "Klimt", "Monet", "Cezanne", "Facil"],
    ["Arquitecto de cupula Santa Maria del Fiore?", "Brunelleschi", "Alberti", "Bramante", "Palladio", "Experto"],
    ["Muralista de El hombre en el cruce de caminos?", "Diego Rivera", "Siqueiros", "Orozco", "Tamayo", "Dificil"],
    ["Que museo alberga la Mona Lisa?", "Louvre", "Prado", "Hermitage", "Uffizi", "Medio"],
    ["Escultor de David en Florencia (renacentista)?", "Miguel Angel", "Donatello", "Bernini", "Cellini", "Medio"],
    ["Que tecnica uso Seurat en Una tarde en la isla de La Grande Jatte?", "Puntillismo", "Fresco", "Sfumato", "Tenebrismo", "Experto"],
    ["Movimiento de Piet Mondrian?", "Neoplasticismo", "Fauvismo", "Dadaismo", "Expresionismo", "Dificil"],
  ];
  art.forEach((a) => q.push(makeQ("Arte", a[5], a[0], a[1], a[2], a[3], a[4])));

  const nature = [
    ["Animal terrestre mas grande?", "Elefante africano", "Hipopotamo", "Rinoceronte", "Jirafa", "Facil"],
    ["Proceso por el que plantas producen glucosa?", "Fotosintesis", "Respiracion", "Fermentacion", "Transpiracion", "Facil"],
    ["Bioma con permafrost?", "Tundra", "Sabana", "Taiga", "Pradera", "Medio"],
    ["Tipo de simbiosis donde uno se beneficia y otro no se afecta?", "Comensalismo", "Mutualismo", "Parasitismo", "Amensalismo", "Dificil"],
    ["Mamifero que pone huevos?", "Ornitorrinco", "Delfin", "Koala", "Canguro", "Facil"],
    ["Ave no voladora mas grande?", "Avestruz", "Emu", "Casuario", "Kiwi", "Facil"],
    ["Arbol mas alto conocido entre vivos?", "Secuoya roja", "Baobab", "Cedro del Libano", "Eucalipto", "Medio"],
    ["Proceso de pasar de gas a liquido?", "Condensacion", "Evaporacion", "Sublimacion", "Solidificacion", "Medio"],
    ["Disciplina que estudia interacciones organismos-ambiente?", "Ecologia", "Etologia", "Taxonomia", "Paleontologia", "Dificil"],
    ["Nivel trofico de un halcon en cadena clasica?", "Consumidor terciario", "Productor", "Consumidor primario", "Descomponedor", "Experto"],
    ["Que capa protege de radiacion UV?", "Capa de ozono", "Mesosfera", "Ionosfera", "Troposfera", "Medio"],
    ["En que oceano vive la gran barrera de coral?", "Pacifico", "Atlantico", "Indico", "Artico", "Facil"],
    ["Que grupo incluye hongos, bacterias y otros recicladores de materia?", "Descomponedores", "Productores", "Consumidores primarios", "Omnivoros", "Medio"],
    ["Que cambio de estado pasa de solido a gas sin liquido?", "Sublimacion", "Fusion", "Evaporacion", "Condensacion", "Dificil"],
    ["Cual es el mayor felino silvestre por masa corporal?", "Tigre", "Leon", "Jaguar", "Leopardo", "Medio"],
    ["Que ecosistema acumula turba y actua como gran sumidero de carbono?", "Turberas", "Manglares", "Arrecifes", "Sabana", "Experto"],
  ];
  nature.forEach((n) => q.push(makeQ("Naturaleza", n[5], n[0], n[1], n[2], n[3], n[4])));

  const gastronomy = [
    ["De que pais es originaria la paella valenciana?", "Espana", "Italia", "Francia", "Portugal", "Facil"],
    ["Plato japones de arroz avinagrado con pescado crudo?", "Sushi", "Ramen", "Tempura", "Okonomiyaki", "Facil"],
    ["Ingrediente base del guacamole tradicional?", "Palta/aguacate", "Tomate", "Pepino", "Yogur", "Facil"],
    ["Queso italiano usado en tiramisu clasico?", "Mascarpone", "Parmigiano", "Gorgonzola", "Ricotta", "Medio"],
    ["Pais de origen del pho?", "Vietnam", "Tailandia", "China", "Corea", "Medio"],
    ["Que cereal es base del risotto?", "Arroz arborio", "Trigo", "Maiz", "Cebada", "Facil"],
    ["Condimento japones fermentado de soja y koji?", "Miso", "Wasabi", "Mirin", "Ponzu", "Dificil"],
    ["Tecnica francesa de coccion al vacio a baja temperatura?", "Sous-vide", "Confit", "Flambe", "Pochar", "Dificil"],
    ["Que pais asocia su cocina a ceviche de pescado y limon?", "Peru", "Ecuador", "Mexico", "Chile", "Facil"],
    ["Ingrediente principal del hummus?", "Garbanzo", "Lenteja", "Haba", "Soja", "Facil"],
    ["Que hongo se usa tradicionalmente en risotto ai funghi porcini?", "Boletus edulis", "Agaricus bisporus", "Shiitake", "Enoki", "Experto"],
    ["Que salsa emulsionada clasica lleva yema y manteca clarificada?", "Holandesa", "Bechamel", "Veloute", "Pomodoro", "Medio"],
    ["Que pastel frances laminado y hojaldrado se llama pain au chocolat?", "Napolitana", "Eclair", "Mille-feuille", "Brioche", "Medio"],
    ["Que tecnica convierte azucar en caramelo seco para croquembouche?", "Caramelizacion", "Gelificacion", "Laminado", "Infusion", "Dificil"],
    ["Que especia da color amarillo al curry y contiene curcumina?", "Curcuma", "Comino", "Cardamomo", "Pimienta de Sichuan", "Medio"],
    ["Que corte de vacuno argentino es equivalente a striploin?", "Bife de chorizo", "Vacio", "Entraña", "Colita de cuadril", "Experto"],
  ];
  gastronomy.forEach((g) => q.push(makeQ("Gastronomia", g[5], g[0], g[1], g[2], g[3], g[4])));

  const mythology = [
    ["En la mitologia griega, dios del mar?", "Poseidon", "Ares", "Hermes", "Apolo", "Facil"],
    ["Diosa griega de la sabiduria?", "Atenea", "Hera", "Artemisa", "Demeter", "Facil"],
    ["En mitologia nordica, dios del trueno?", "Thor", "Loki", "Balder", "Tyr", "Facil"],
    ["En mitologia egipcia, dios del inframundo?", "Osiris", "Ra", "Anubis", "Horus", "Medio"],
    ["Que heroe griego mato al Minotauro?", "Teseo", "Perseo", "Heracles", "Jason", "Medio"],
    ["Quien robo el fuego para la humanidad en mito griego?", "Prometeo", "Epimeteo", "Cronos", "Helios", "Medio"],
    ["En Roma, equivalente de Zeus?", "Jupiter", "Marte", "Neptuno", "Mercurio", "Facil"],
    ["Padre de los dioses olimpicos segun Hesiodo?", "Cronos", "Urano", "Zeus", "Oceano", "Dificil"],
    ["Que rio separa mundo de vivos e inframundo griego?", "Estigia", "Aqueronte", "Leteo", "Flegetonte", "Dificil"],
    ["En mitologia nordica, arbol cosmico?", "Yggdrasil", "Mimir", "Bifrost", "Gjallarhorn", "Medio"],
    ["Que deidad mexica esta asociada al sol y guerra?", "Huitzilopochtli", "Quetzalcoatl", "Tlaloc", "Tezcatlipoca", "Experto"],
    ["Heroe mesopotamico protagonista de una epopeya antigua?", "Gilgamesh", "Enkidu", "Hammurabi", "Sargon", "Dificil"],
    ["Quien era la esposa de Odiseo en la Odisea?", "Penelope", "Helena", "Circe", "Calipso", "Facil"],
    ["Que titan sostenia la esfera celeste?", "Atlas", "Prometeo", "Hyperion", "Cronos", "Medio"],
    ["Deidad hindu de la destruccion y transformacion?", "Shiva", "Brahma", "Vishnu", "Indra", "Experto"],
    ["En mitologia egipcia, dios solar principal?", "Ra", "Osiris", "Set", "Ptah", "Facil"],
  ];
  mythology.forEach((m, i) => q.push(makeQ("Mitologia", i < 5 ? "Facil" : i < 11 ? "Medio" : i < 14 ? "Dificil" : "Experto", m[0], m[1], m[2], m[3], m[4])));

  const astronomy = [
    ["Planeta con anillos mas visibles?", "Saturno", "Jupiter", "Urano", "Neptuno", "Facil"],
    ["Estrella mas cercana a la Tierra?", "Sol", "Proxima Centauri", "Sirius", "Betelgeuse", "Facil"],
    ["Galaxia en la que se encuentra el Sistema Solar?", "Via Lactea", "Andromeda", "Triangulo", "Sombrero", "Facil"],
    ["Fase lunar entre cuarto creciente y luna llena?", "Gibosa creciente", "Menguante", "Nueva", "Cuarto menguante", "Medio"],
    ["Planeta enano principal del cinturon de asteroides?", "Ceres", "Pluton", "Eris", "Haumea", "Medio"],
    ["Que tipo de objeto es Betelgeuse?", "Supergigante roja", "Enana blanca", "Pulsar", "Estrella de neutrones", "Dificil"],
    ["Unidad usada para distancias interestelares grandes?", "Ano luz", "Unidad astronomica", "Milla nautica", "Parsegundo", "Facil"],
    ["Punto mas profundo de pozo gravitacional en agujero negro clasico?", "Singularidad", "Fotosfera", "Heliosfera", "Magnetopausa", "Experto"],
    ["Que mision llevo humanos por primera vez a la Luna?", "Apollo 11", "Apollo 8", "Gemini 4", "Soyuz 1", "Facil"],
    ["Que planeta rota en sentido retrgrado extremo con dia mayor que su ano?", "Venus", "Mercurio", "Marte", "Jupiter", "Dificil"],
    ["Que limite define la region de no retorno de un agujero negro?", "Horizonte de sucesos", "Esfera de Hill", "Linea de Roche", "Cinturon de Kuiper", "Medio"],
    ["Que telescopio espacial reemplazo al Hubble en infrarrojo profundo?", "James Webb", "Chandra", "Kepler", "Gaia", "Facil"],
    ["Que tipo de galaxia es Andromeda?", "Espiral", "Eliptica", "Irregular", "Lenticular", "Medio"],
    ["Que principio explica corrimiento al rojo por expansion cosmica?", "Ley de Hubble-Lemaitre", "Ley de Titius-Bode", "Ley de Kepler II", "Ley de Wien", "Experto"],
    ["Que planeta tiene el Monte Olimpo, volcan mas alto conocido?", "Marte", "Venus", "Tierra", "Mercurio", "Dificil"],
    ["Que sonda aterrizo en Titan (luna de Saturno) en 2005?", "Huygens", "Voyager 2", "Pioneer 10", "Cassini (orbiter)", "Experto"],
  ];
  astronomy.forEach((a) => q.push(makeQ("Astronomia", a[5], a[0], a[1], a[2], a[3], a[4])));

  const cap = [
    ["Noruega", "Oslo", "Bergen", "Trondheim", "Stavanger"],
    ["Suecia", "Estocolmo", "Gotemburgo", "Malmo", "Uppsala"],
    ["Finlandia", "Helsinki", "Turku", "Tampere", "Espoo"],
    ["Dinamarca", "Copenhague", "Aarhus", "Odense", "Aalborg"],
    ["Polonia", "Varsovia", "Cracovia", "Gdansk", "Poznan"],
    ["Hungria", "Budapest", "Debrecen", "Szeged", "Pecs"],
    ["Chequia", "Praga", "Brno", "Ostrava", "Plzen"],
    ["Austria", "Viena", "Salzburgo", "Graz", "Linz"],
    ["Suiza", "Berna", "Zurich", "Ginebra", "Basilea"],
    ["Belgica", "Bruselas", "Amberes", "Gante", "Brujas"],
    ["Paises Bajos", "Amsterdam", "Rotterdam", "Utrecht", "La Haya"],
    ["Portugal", "Lisboa", "Porto", "Coimbra", "Braga"],
    ["Irlanda", "Dublin", "Cork", "Limerick", "Galway"],
    ["Grecia", "Atenas", "Tesalonica", "Patras", "Heraclion"],
    ["Turquia", "Ankara", "Estambul", "Esmirna", "Bursa"],
    ["Marruecos", "Rabat", "Casablanca", "Marrakech", "Fez"],
    ["Argelia", "Argel", "Oran", "Constantina", "Annaba"],
    ["Chile", "Santiago", "Valparaiso", "Concepcion", "Antofagasta"],
    ["Uruguay", "Montevideo", "Punta del Este", "Salto", "Paysandu"],
    ["Paraguay", "Asuncion", "Ciudad del Este", "Encarnacion", "Luque"],
    ["Bolivia", "Sucre", "La Paz", "Cochabamba", "Santa Cruz"],
    ["Ecuador", "Quito", "Guayaquil", "Cuenca", "Manta"],
    ["Colombia", "Bogota", "Medellin", "Cali", "Barranquilla"],
    ["Venezuela", "Caracas", "Maracaibo", "Valencia", "Barquisimeto"],
    ["Peru", "Lima", "Cusco", "Arequipa", "Trujillo"],
    ["Mexico", "Ciudad de Mexico", "Guadalajara", "Monterrey", "Puebla"],
    ["Cuba", "La Habana", "Santiago de Cuba", "Camaguey", "Holguin"],
    ["Jamaica", "Kingston", "Montego Bay", "Negril", "Mandeville"],
    ["China", "Pekin", "Shanghai", "Guangzhou", "Shenzhen"],
    ["India", "Nueva Delhi", "Mumbai", "Calcuta", "Bangalore"],
    ["Pakistan", "Islamabad", "Karachi", "Lahore", "Rawalpindi"],
    ["Indonesia", "Yakarta", "Bandung", "Surabaya", "Medan"],
    ["Tailandia", "Bangkok", "Chiang Mai", "Phuket", "Pattaya"],
    ["Vietnam", "Hanoi", "Ho Chi Minh", "Da Nang", "Hue"],
    ["Filipinas", "Manila", "Cebu", "Davao", "Quezon City"],
    ["Corea del Sur", "Seul", "Busan", "Incheon", "Daegu"],
    ["Australia", "Canberra", "Sydney", "Melbourne", "Perth"],
    ["Nueva Zelanda", "Wellington", "Auckland", "Christchurch", "Hamilton"],
    ["Sudafrica", "Pretoria", "Johannesburgo", "Ciudad del Cabo", "Durban"],
    ["Egipto", "El Cairo", "Alejandria", "Giza", "Luxor"],
  ];
  cap.forEach((x, i) => q.push(makeQ("Geografia", i < 15 ? "Medio" : "Dificil", `Cual es la capital de ${x[0]}?`, x[1], x[2], x[3], x[4])));

  const astroFacts = [
    ["Planeta mas cercano al Sol?", "Mercurio", "Venus", "Marte", "Tierra"],
    ["Planeta conocido por su gran mancha roja?", "Jupiter", "Saturno", "Neptuno", "Urano"],
    ["Luna mas grande de Saturno?", "Titan", "Europa", "Io", "Fobos"],
    ["Luna mas grande de Jupiter?", "Ganimedes", "Europa", "Calisto", "Io"],
    ["Mision que tomo primera foto de un agujero negro (colaboracion)?", "Event Horizon Telescope", "Voyager 2", "Cassini", "New Horizons"],
    ["Tipo de estrella del Sol?", "Enana amarilla", "Gigante roja", "Enana blanca", "Supergigante azul"],
    ["Objeto central de la Via Lactea?", "Sagitario A*", "Andromeda A", "Polaris", "Betelgeuse"],
    ["Planeta con mayor numero conocido de lunas (actualmente)?", "Saturno", "Jupiter", "Urano", "Neptuno"],
    ["Telescopio espacial dedicado a exoplanetas por transitos (2009)?", "Kepler", "Hubble", "Spitzer", "Gaia"],
    ["Fenomeno cuando la Luna tapa al Sol?", "Eclipse solar", "Eclipse lunar", "Transito de Venus", "Ocultacion"],
    ["Que es un pulsar?", "Estrella de neutrones magnetizada en rotacion", "Gigante gaseoso frio", "Agujero negro primitivo", "Cometa de periodo corto"],
    ["Nube donde nacen estrellas?", "Nebulosa molecular", "Cinturon de Kuiper", "Heliopausa", "Magnetocola"],
    ["Galaxia mas cercana grande a la Via Lactea?", "Andromeda", "Triangulo", "Gran Nube de Magallanes", "Sombrero"],
    ["Cometa famoso de periodo ~76 anos?", "Halley", "Hale-Bopp", "Encke", "Hyakutake"],
    ["Mision que exploro Pluton en 2015?", "New Horizons", "Cassini", "Juno", "Voyager 1"],
    ["Agencia espacial europea?", "ESA", "JAXA", "ISRO", "CNSA"],
  ];
  astroFacts.forEach((x, i) => q.push(makeQ("Astronomia", i < 6 ? "Medio" : i < 12 ? "Dificil" : "Experto", x[0], x[1], x[2], x[3], x[4])));

  const mythFacts = [
    ["Dios griego del inframundo?", "Hades", "Hermes", "Ares", "Dionisio"],
    ["Mensajero de los dioses griegos?", "Hermes", "Ares", "Apolo", "Hefesto"],
    ["Madre de Horus en mitologia egipcia?", "Isis", "Hathor", "Neftis", "Bastet"],
    ["Dios nordico tuerto asociado a la sabiduria?", "Odin", "Thor", "Balder", "Freyr"],
    ["Arma principal de Thor?", "Mjolnir", "Gungnir", "Gram", "Draupnir"],
    ["Heroe griego de los doce trabajos?", "Heracles", "Perseo", "Aquiles", "Jason"],
    ["Monstruo con cabeza de toro en Creta?", "Minotauro", "Quimera", "Hidra", "Cerbero"],
    ["Rio del olvido en el Hades?", "Leteo", "Estigia", "Aqueronte", "Cocito"],
    ["Diosa romana equivalente a Afrodita?", "Venus", "Juno", "Minerva", "Diana"],
    ["Deidad azteca de la lluvia?", "Tlaloc", "Quetzalcoatl", "Huitzilopochtli", "Mictlantecuhtli"],
    ["Serpiente emplumada mesoamericana?", "Quetzalcoatl", "Kukulcan", "Tlaloc", "Xolotl"],
    ["En la epopeya nordica, final catastrofico de los dioses?", "Ragnarok", "Valhalla", "Fimbulvetr", "Skoll"],
    ["Dios hindu con cabeza de elefante?", "Ganesha", "Krishna", "Hanuman", "Varuna"],
    ["Enuma Elish pertenece a que civilizacion?", "Mesopotamica", "Egipcia", "Persa", "Hittita"],
    ["Heroe que vencio a Medusa?", "Perseo", "Teseo", "Belerofonte", "Odiseo"],
    ["Guardiana de cosechas en Grecia antigua?", "Demeter", "Hera", "Artemisa", "Hestia"],
  ];
  mythFacts.forEach((x, i) => q.push(makeQ("Mitologia", i < 5 ? "Medio" : i < 11 ? "Dificil" : "Experto", x[0], x[1], x[2], x[3], x[4])));

  const gastrFacts = [
    ["Queso tipico de pizza napolitana tradicional?", "Mozzarella fior di latte", "Cheddar", "Gouda", "Gruyere"],
    ["Base del pesto genoves clasico?", "Albahaca", "Perejil", "Espinaca", "Rucula"],
    ["Pasta rellena en forma de anillo de Emilia-Romagna?", "Tortellini", "Penne", "Fusilli", "Farfalle"],
    ["Salsa mexicana de chiles secos y chocolate?", "Mole", "Pico de gallo", "Salsa verde", "Adobo"],
    ["Grano usado para polenta?", "Maiz", "Trigo", "Arroz", "Centeno"],
    ["Postre portugues de Belem?", "Pastel de nata", "Queijada", "Bolo rei", "Arroz doce"],
    ["Ingrediente principal del kimchi tradicional?", "Col napa", "Brocoli", "Lechuga", "Acelga"],
    ["Caldo japones de alga y bonito seco?", "Dashi", "Ponzu", "Mirin", "Shoyu"],
    ["Cocina de donde proviene el tagine?", "Marruecos", "Tunez", "Grecia", "Turquia"],
    ["Tipo de trigo de la pasta seca italiana habitual?", "Durum", "Espelta", "Kamut", "Sarraceno"],
    ["Preparacion peruana de pescado en limon y aji?", "Ceviche", "Tiradito", "Sudado", "Parihuela"],
    ["Que tecnica usa grasa para conservar carnes cocidas lentamente?", "Confit", "Escalfado", "Braseado", "Gratinado"],
    ["Dulce arabe de masa filo y frutos secos?", "Baklava", "Basbousa", "Kunafa", "Halva"],
    ["Ingrediente clave del falafel?", "Garbanzo", "Lenteja roja", "Frijol negro", "Alubia blanca"],
    ["Pimienta japonesa citrica usada en ramen gourmet?", "Sansho", "Sumac", "Aleppo", "Ras el hanout"],
    ["Plato coreano de arroz mixto con toppings?", "Bibimbap", "Bulgogi", "Japchae", "Tteokbokki"],
  ];
  gastrFacts.forEach((x, i) => q.push(makeQ("Gastronomia", i < 5 ? "Medio" : i < 11 ? "Dificil" : "Experto", x[0], x[1], x[2], x[3], x[4])));

  const litExtra = [
    ["Autor de Madame Bovary?", "Gustave Flaubert", "Victor Hugo", "Stendhal", "Balzac"],
    ["Autor de Guerra y paz?", "Leon Tolstoi", "Dostoyevski", "Chejov", "Gogol"],
    ["Autor de La Iliada?", "Homero", "Virgilio", "Hesiodo", "Ovidio"],
    ["Autor de El proceso?", "Franz Kafka", "Rilke", "Mann", "Musil"],
    ["Poeta de Hojas de hierba?", "Walt Whitman", "Eliot", "Pound", "Frost"],
    ["Autor de Los miserables?", "Victor Hugo", "Balzac", "Zola", "Dumas"],
    ["Autor de El extranjero?", "Albert Camus", "Sartre", "Malraux", "Aragon"],
    ["Autor de Ficciones?", "Jorge Luis Borges", "Bioy Casares", "Cortazar", "Sábato"],
    ["Autor de El nombre de la rosa?", "Umberto Eco", "Calvino", "Pavese", "Moravia"],
    ["Obra de Mary Shelley?", "Frankenstein", "Dracula", "Jane Eyre", "Wuthering Heights"],
    ["Autor de Cumbres borrascosas?", "Emily Bronte", "Charlotte Bronte", "Jane Austen", "George Eliot"],
    ["Autor de Lolita?", "Vladimir Nabokov", "Solzhenitsyn", "Bunin", "Pasternak"],
    ["Autor de La colmena?", "Camilo Jose Cela", "Delibes", "Laforet", "Matute"],
    ["Autor de Pedro Páramo?", "Juan Rulfo", "Arreola", "Fuentes", "Paz"],
    ["Autor de El Aleph?", "Borges", "Cortazar", "Onetti", "Bioy"],
    ["Autor de Ensayo sobre la ceguera?", "Jose Saramago", "Lobo Antunes", "Pessoa", "Eca de Queiros"],
  ];
  litExtra.forEach((x, i) => q.push(makeQ("Literatura", i < 6 ? "Medio" : i < 12 ? "Dificil" : "Experto", x[0], x[1], x[2], x[3], x[4])));

  const sciExtra = [
    ["Numero de cromosomas humanos en celulas somaticas?", "46", "44", "48", "52"],
    ["Que celula sanguinea transporta oxigeno?", "Eritrocito", "Plaqueta", "Neutrofilo", "Linfocito"],
    ["Que vitamina evita escorbuto?", "Vitamina C", "Vitamina A", "Vitamina E", "Vitamina B1"],
    ["Elemento quimico con simbolo Na?", "Sodio", "Nitrogeno", "Neon", "Niquel"],
    ["Unidad de resistencia electrica?", "Ohmio", "Voltio", "Amperio", "Julio"],
    ["Animal modelo de genetica clasica en laboratorio?", "Drosophila melanogaster", "Caenorhabditis elegans", "Danio rerio", "Mus musculus"],
    ["Tipo de sangre receptor universal (ABO)?", "AB", "O", "A", "B"],
    ["Molecula energética inmediata de la celula?", "ATP", "ADN", "ARNm", "Glucogeno"],
    ["Gas noble mas abundante en aire seco tras N2 y O2?", "Argon", "Helio", "Neon", "Xenon"],
    ["Proceso por el que celulas especializadas se vuelven menos especializadas en laboratorio?", "Reprogramacion celular", "Transduccion", "Metaplasia", "Apoptosis"],
    ["Que cientifico propuso seleccion natural con Wallace?", "Charles Darwin", "Lamarck", "Mendel", "Huxley"],
    ["Carga del proton?", "Positiva", "Negativa", "Neutra", "Variable"],
    ["Tejido que recubre superficies internas y externas?", "Epitelial", "Conectivo", "Muscular", "Nervioso"],
    ["Que particula de la luz se usa en efecto fotoelectrico?", "Foton", "Fonon", "Positron", "Muon"],
    ["Que metal liquido a temperatura ambiente?", "Mercurio", "Galio", "Cesio", "Bromo"],
    ["Formula del agua?", "H2O", "HO2", "H2O2", "O2H"],
  ];
  sciExtra.forEach((x, i) => q.push(makeQ("Ciencia", i < 6 ? "Facil" : i < 11 ? "Medio" : i < 14 ? "Dificil" : "Experto", x[0], x[1], x[2], x[3], x[4])));

  const histExtra = [
    ["Que explorador llego a America en 1492?", "Cristobal Colon", "Vasco da Gama", "Magallanes", "Caboto"],
    ["Que civilizacion desarrollo escritura cuneiforme?", "Sumeria", "Egipcia", "Fenicia", "Minoica"],
    ["Quien fue Lenin?", "Lider bolchevique ruso", "Kaiser aleman", "Rey frances", "General prusiano"],
    ["Que pais lanzo Sputnik 1?", "URSS", "Estados Unidos", "Reino Unido", "Francia"],
    ["Que proceso medieval redujo poblacion europea en siglo XIV?", "Peste Negra", "Hambruna irlandesa", "Gripe espanola", "Guerra de Crimea"],
    ["Que ciudad fue destruida por bomba atomica junto a Nagasaki?", "Hiroshima", "Osaka", "Kyoto", "Kobe"],
    ["Quien unifico Italia en el siglo XIX junto con Cavour?", "Garibaldi", "Mazzini", "Victor Manuel II", "Giolitti"],
    ["Que confederacion se enfrento a la Union en guerra civil estadounidense?", "Estados Confederados", "Comuneros", "Whigs", "Federalistas"],
    ["Que rey macedonio conquisto gran parte de Persia?", "Alejandro Magno", "Filipo V", "Perseo", "Pirro"],
    ["Que ciudad fue principal puerto fenicio en el Levante?", "Tiro", "Sidon", "Byblos", "Ugarit"],
    ["Que revolucion cientifica fue impulsada por Copernico y Galileo?", "Heliocentrica moderna", "Industrial", "Digital", "Neolitica"],
    ["Que periodo historico sigue a la Edad Media en Europa?", "Renacimiento/Edad Moderna", "Antiguedad clasica", "Edad Contemporanea", "Bronce final"],
    ["Que imperio cayo en 476 d.C. en Occidente?", "Romano de Occidente", "Bizantino", "Persa sasánida", "Carolingio"],
    ["Que lider sudafricano lucho contra apartheid y fue presidente en 1994?", "Nelson Mandela", "Desmond Tutu", "F. W. de Klerk", "Thabo Mbeki"],
    ["Que conferencia de 1945 sento bases de ONU?", "San Francisco", "Yalta", "Potsdam", "Teheran"],
    ["Que periodo frances posterior al Terror se llamo Directorio?", "1795-1799", "1789-1792", "1804-1815", "1830-1848"],
  ];
  histExtra.forEach((x, i) => q.push(makeQ("Historia mundial", i < 6 ? "Medio" : i < 12 ? "Dificil" : "Experto", x[0], x[1], x[2], x[3], x[4])));

  const elements = [
    ["Hidrogeno", "H"], ["Helio", "He"], ["Litio", "Li"], ["Berilio", "Be"], ["Boro", "B"], ["Carbono", "C"], ["Nitrogeno", "N"], ["Oxigeno", "O"], ["Fluor", "F"], ["Neon", "Ne"],
    ["Sodio", "Na"], ["Magnesio", "Mg"], ["Aluminio", "Al"], ["Silicio", "Si"], ["Fosforo", "P"], ["Azufre", "S"], ["Cloro", "Cl"], ["Argon", "Ar"], ["Potasio", "K"], ["Calcio", "Ca"],
    ["Escandio", "Sc"], ["Titanio", "Ti"], ["Vanadio", "V"], ["Cromo", "Cr"], ["Manganeso", "Mn"], ["Hierro", "Fe"], ["Cobalto", "Co"], ["Niquel", "Ni"], ["Cobre", "Cu"], ["Zinc", "Zn"],
    ["Galio", "Ga"], ["Germanio", "Ge"], ["Arsenico", "As"], ["Selenio", "Se"], ["Bromo", "Br"], ["Kripton", "Kr"], ["Rubidio", "Rb"], ["Estroncio", "Sr"], ["Itrio", "Y"], ["Zirconio", "Zr"],
    ["Niobio", "Nb"], ["Molibdeno", "Mo"], ["Paladio", "Pd"], ["Plata", "Ag"], ["Cadmio", "Cd"], ["Indio", "In"], ["Estano", "Sn"], ["Antimonio", "Sb"], ["Telurio", "Te"], ["Yodo", "I"],
    ["Xenon", "Xe"], ["Cesio", "Cs"], ["Bario", "Ba"], ["Platino", "Pt"], ["Oro", "Au"], ["Mercurio", "Hg"], ["Plomo", "Pb"], ["Uranio", "U"], ["Neptunio", "Np"], ["Plutonio", "Pu"],
  ];
  elements.forEach((e, i) => {
    const wrong = shuffle(elements.filter((x) => x[1] !== e[1]).map((x) => x[1])).slice(0, 3);
    q.push(makeQ("Ciencia", i < 20 ? "Medio" : i < 45 ? "Dificil" : "Experto", `Cual es el simbolo quimico de ${e[0]}?`, e[1], wrong[0], wrong[1], wrong[2]));
  });

  const inventions = [
    ["Telefonia practica de larga distancia (patente 1876)", "Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"],
    ["Bombilla incandescente comercialmente viable", "Thomas Edison", "James Watt", "Faraday", "Maxwell"],
    ["Penicilina (descubrimiento)", "Alexander Fleming", "Louis Pasteur", "Robert Koch", "Edward Jenner"],
    ["Teoria de la relatividad especial", "Albert Einstein", "Niels Bohr", "Max Planck", "Erwin Schrodinger"],
    ["Ley de la gravedad universal", "Isaac Newton", "Galileo Galilei", "Johannes Kepler", "Tycho Brahe"],
    ["Vacuna contra la viruela (pionero)", "Edward Jenner", "Jonas Salk", "Pasteur", "Fleming"],
    ["Radioactividad (termino y estudios pioneros)", "Marie Curie", "Rosalind Franklin", "Ada Lovelace", "Dorothy Hodgkin"],
    ["Estructura de doble helice del ADN (modelo)", "Watson y Crick", "Mendel y Morgan", "Pasteur y Koch", "Sanger y Gilbert"],
    ["Computadora analitica conceptual", "Charles Babbage", "Alan Turing", "Konrad Zuse", "Claude Shannon"],
    ["Primer algoritmo publicado para maquina", "Ada Lovelace", "Grace Hopper", "Katherine Johnson", "Hedy Lamarr"],
    ["World Wide Web", "Tim Berners-Lee", "Vint Cerf", "Linus Torvalds", "Bill Gates"],
    ["Lenguaje C", "Dennis Ritchie", "Ken Thompson", "Bjarne Stroustrup", "Niklaus Wirth"],
    ["Primer vuelo a motor controlado", "Hermanos Wright", "Santos-Dumont", "Bleriot", "Lindbergh"],
    ["Teoria de la evolucion por seleccion natural", "Charles Darwin", "Jean Lamarck", "Gregor Mendel", "Alfred Wegener"],
    ["Deriva continental", "Alfred Wegener", "Milutin Milankovic", "James Hutton", "Charles Lyell"],
    ["Ley de induccion electromagnetica", "Michael Faraday", "Ampere", "Ohm", "Gauss"],
    ["Motor de corriente alterna polifasica", "Nikola Tesla", "Edison", "Bell", "Volta"],
    ["Pila electrica (voltaica)", "Alessandro Volta", "Galvani", "Faraday", "Coulomb"],
    ["Teoria heliocentrica moderna", "Nicolas Copernico", "Ptolomeo", "Kepler", "Galileo"],
    ["Leyes del movimiento planetario", "Johannes Kepler", "Tycho Brahe", "Newton", "Cassini"],
  ];
  inventions.forEach((x, i) => q.push(makeQ("Tecnologia", i < 7 ? "Medio" : i < 14 ? "Dificil" : "Experto", `Quien es asociado a: ${x[0]}?`, x[1], x[2], x[3], x[4])));

  const capitalsHard = [
    ["Kazajistan", "Astaná", "Almaty", "Bishkek", "Tashkent"],
    ["Myanmar", "Naypyidaw", "Yangon", "Mandalay", "Bagan"],
    ["Sri Lanka", "Sri Jayawardenepura Kotte", "Colombo", "Kandy", "Galle"],
    ["Mongolia", "Ulán Bator", "Darkhan", "Erdenet", "Choibalsan"],
    ["Etiopia", "Adis Abeba", "Lalibela", "Dire Dawa", "Mekele"],
    ["Tanzania", "Dodoma", "Dar es Salaam", "Arusha", "Mwanza"],
    ["Nigeria", "Abuya", "Lagos", "Kano", "Ibadan"],
    ["Costa de Marfil", "Yamusukro", "Abiyan", "Bouake", "Daloa"],
    ["Bolivia", "Sucre", "La Paz", "Cochabamba", "Santa Cruz"],
    ["Belice", "Belmopan", "Belize City", "San Ignacio", "Corozal"],
    ["Guyana", "Georgetown", "Linden", "Bartica", "New Amsterdam"],
    ["Surinam", "Paramaribo", "Nieuw Nickerie", "Lelydorp", "Moengo"],
    ["Brunei", "Bandar Seri Begawan", "Kuala Belait", "Tutong", "Seria"],
    ["Laos", "Vientian", "Luang Prabang", "Pakse", "Savannakhet"],
    ["Camboya", "Nom Pen", "Siem Reap", "Battambang", "Sihanoukville"],
    ["Mali", "Bamako", "Timbuktu", "Gao", "Sikasso"],
    ["Niger", "Niamey", "Agadez", "Zinder", "Maradi"],
    ["Botsuana", "Gaborone", "Francistown", "Maun", "Lobatse"],
    ["Namibia", "Windhoek", "Walvis Bay", "Swakopmund", "Rundu"],
    ["Mozambique", "Maputo", "Beira", "Nampula", "Tete"],
  ];
  capitalsHard.forEach((c, i) => q.push(makeQ("Geografia", i < 8 ? "Dificil" : "Experto", `Cual es la capital de ${c[0]}?`, c[1], c[2], c[3], c[4])));

  const philosophy = [
    ["Quien escribio Critica de la razon pura?", "Immanuel Kant", "G. W. F. Hegel", "Edmund Husserl", "Arthur Schopenhauer", "Medio"],
    ["Quien fue maestro de Alejandro Magno?", "Aristoteles", "Platon", "Socrates", "Epicuro", "Facil"],
    ["Autor de Asi hablo Zaratustra?", "Friedrich Nietzsche", "Soren Kierkegaard", "Martin Heidegger", "Karl Jaspers", "Medio"],
    ["Filosofo del cogito ergo sum?", "Rene Descartes", "Spinoza", "Leibniz", "Pascal", "Facil"],
    ["Obra central de John Rawls publicada en 1971?", "A Theory of Justice", "Anarchy, State, and Utopia", "Political Liberalism", "The Open Society", "Dificil"],
    ["Quien escribio Ser y tiempo?", "Martin Heidegger", "Karl Jaspers", "Hans-Georg Gadamer", "Paul Ricoeur", "Dificil"],
    ["Que filosofo defendio el utilitarismo clasico junto a Bentham?", "John Stuart Mill", "Henry Sidgwick", "G. E. Moore", "R. M. Hare", "Medio"],
    ["Quien formulo el imperativo categorico?", "Immanuel Kant", "David Hume", "Thomas Hobbes", "Jean-Jacques Rousseau", "Medio"],
    ["Obra principal de Spinoza?", "Etica demostrada segun el orden geometrico", "Leviatan", "Monadologia", "Novum Organum", "Dificil"],
    ["Que filosofo griego fundo el Liceo?", "Aristoteles", "Platon", "Zenon de Citio", "Antistenes", "Medio"],
    ["Autor de Tractatus Logico-Philosophicus?", "Ludwig Wittgenstein", "Bertrand Russell", "Gottlob Frege", "Rudolf Carnap", "Dificil"],
    ["Que escuela represento Pirron de Elis?", "Escepticismo", "Estoicismo", "Epicureismo", "Cinismo", "Medio"],
    ["Filosofo de la caverna en La Republica?", "Platon", "Aristoteles", "Heraclito", "Parmenides", "Facil"],
    ["Quien escribio El ser y la nada?", "Jean-Paul Sartre", "Albert Camus", "Maurice Merleau-Ponty", "Simone de Beauvoir", "Dificil"],
    ["Autor de La condicion humana (1958)?", "Hannah Arendt", "Simone Weil", "Martha Nussbaum", "Judith Butler", "Dificil"],
    ["Filosofo de la voluntad de poder?", "Friedrich Nietzsche", "Arthur Schopenhauer", "Max Stirner", "Henri Bergson", "Dificil"],
    ["Que filosofo medieval escribio Suma Teologica?", "Tomas de Aquino", "Guillermo de Ockham", "Duns Escoto", "Anselmo", "Medio"],
    ["Creador del positivismo?", "Auguste Comte", "Emile Durkheim", "Saint-Simon", "Alexis de Tocqueville", "Medio"],
    ["Autor de Vigilar y castigar?", "Michel Foucault", "Jacques Derrida", "Gilles Deleuze", "Pierre Bourdieu", "Dificil"],
    ["Quien acuño el termino dasein en filosofia existencial?", "Martin Heidegger", "Karl Jaspers", "Sartre", "Kierkegaard", "Experto"],
    ["Obra de Kierkegaard de 1843?", "Temor y temblor", "La enfermedad mortal", "Migajas filosoficas", "O lo uno o lo otro", "Dificil"],
    ["Que filosofo escribio Investigaciones filosoficas?", "Ludwig Wittgenstein", "G. E. Moore", "Russell", "Ayer", "Dificil"],
    ["Quien desarrollo la teoria de los actos de habla?", "J. L. Austin", "Willard Quine", "P. F. Strawson", "Saul Kripke", "Experto"],
    ["Autor de Verdad y metodo?", "Hans-Georg Gadamer", "Paul Ricoeur", "Karl-Otto Apel", "Habermas", "Experto"],
    ["Filosofo de El contrato social?", "Jean-Jacques Rousseau", "Montesquieu", "Voltaire", "Diderot", "Medio"],
    ["Quien propuso el velo de la ignorancia?", "John Rawls", "Robert Nozick", "Ronald Dworkin", "Amartya Sen", "Dificil"],
    ["Autor de Leviatan (1651)?", "Thomas Hobbes", "John Locke", "David Hume", "Edmund Burke", "Medio"],
    ["Filosofo asociado con monadas?", "Gottfried Wilhelm Leibniz", "Nicolas Malebranche", "Spinoza", "Berkeley", "Dificil"],
    ["Quien escribio Fenomenologia del espiritu?", "G. W. F. Hegel", "Schelling", "Feuerbach", "Fichte", "Dificil"],
    ["Obra clave de Simone de Beauvoir (1949)?", "El segundo sexo", "La invitada", "Memorias de una joven formal", "Pyrrhus et Cineas", "Medio"],
    ["Filosofo del panoptico como modelo disciplinario?", "Michel Foucault", "Jeremy Bentham", "Althusser", "Lacan", "Experto"],
    ["Quien escribio De anima?", "Aristoteles", "Platon", "Plotino", "Epicuro", "Experto"]
  ];
  philosophy.forEach((p) => q.push(makeQ("Filosofia", p[5], p[0], p[1], p[2], p[3], p[4])));

  const economics = [
    ["Autor de La riqueza de las naciones (1776)?", "Adam Smith", "David Ricardo", "Thomas Malthus", "John Stuart Mill", "Medio"],
    ["Quien formulo la ventaja comparativa?", "David Ricardo", "Adam Smith", "Heckscher", "Paul Samuelson", "Dificil"],
    ["Que banco central emite el euro?", "Banco Central Europeo", "Bundesbank", "Banco de Francia", "Banco de Inglaterra", "Facil"],
    ["Indicador que mide inflacion de precios al consumidor?", "IPC", "PBI", "IDH", "PMI", "Facil"],
    ["Que economista escribio Teoria general del empleo, el interes y el dinero?", "John Maynard Keynes", "Friedrich Hayek", "Milton Friedman", "Irving Fisher", "Dificil"],
    ["Que curva relaciona inflacion y desempleo en el corto plazo?", "Curva de Phillips", "Curva de Laffer", "IS-LM", "Curva de Lorenz", "Medio"],
    ["Que sigla designa producto interno bruto?", "PIB", "IPC", "PPA", "TIR", "Facil"],
    ["Teoria monetarista asociada principalmente a...", "Milton Friedman", "James Tobin", "Joan Robinson", "Michal Kalecki", "Medio"],
    ["Que organismo publica Perspectivas de la economia mundial (WEO)?", "FMI", "OCDE", "OMC", "BID", "Dificil"],
    ["Autor de El capital?", "Karl Marx", "Friedrich Engels", "Proudhon", "Lassalle", "Medio"],
    ["Que indice bursatil representa 500 grandes empresas de EE. UU.?", "S&P 500", "Dow Jones Transport", "FTSE 100", "Nikkei 225", "Facil"],
    ["Que significa PPA en macroeconomia internacional?", "Paridad del poder adquisitivo", "Precio promedio anual", "Paridad publico-privada", "Politica de precios administrados", "Dificil"],
    ["Modelo de comercio internacional con factores capital-trabajo?", "Heckscher-Ohlin", "Solow", "Ramsey-Cass-Koopmans", "Mundell-Fleming", "Experto"],
    ["Quien desarrollo el concepto de destruccion creativa?", "Joseph Schumpeter", "Alfred Marshall", "Keynes", "Pigou", "Dificil"],
    ["Curva que representa desigualdad de ingresos?", "Curva de Lorenz", "Curva de Engel", "Curva de Phillips", "Curva IS", "Medio"],
    ["Que tasa usa la FED como referencia de corto plazo?", "Federal Funds Rate", "Prime Rate", "LIBOR", "SOFR", "Experto"],
    ["Autor de Principios de economia politica y tributacion (1817)?", "David Ricardo", "Adam Smith", "Jean-Baptiste Say", "John Stuart Mill", "Experto"],
    ["Que significa stagflation?", "Inflacion alta con estancamiento", "Deflacion con crecimiento", "Superavit comercial", "Pleno empleo con baja inflacion", "Medio"],
    ["Instrumento de deuda emitido por estados para financiarse?", "Bono soberano", "ETF", "Swap", "Futuro", "Facil"],
    ["Que economista propuso preferencias reveladas?", "Paul Samuelson", "Kenneth Arrow", "Hicks", "Tinbergen", "Experto"],
    ["Indice de desigualdad mas usado globalmente?", "Coeficiente de Gini", "Indice Big Mac", "Indice Báltico", "Indice Herfindahl", "Medio"],
    ["Que representa la balanza por cuenta corriente?", "Intercambio de bienes, servicios y rentas", "Solo exportaciones de bienes", "Solo flujo de capitales de cartera", "Reservas internacionales netas", "Dificil"],
    ["Que escuela economica defendia la mano invisible?", "Clasica", "Institucionalista", "Marxista", "Poskeynesiana", "Facil"],
    ["Que organismo regula comercio internacional multilateral?", "OMC", "FMI", "Banco Mundial", "BIS", "Facil"],
    ["Autor del teorema de imposibilidad en eleccion social?", "Kenneth Arrow", "John Nash", "Amartya Sen", "Elinor Ostrom", "Experto"],
    ["Que significa riesgo pais EMBI?", "Spread de deuda soberana emergente", "Inflacion subyacente", "Balance comercial mensual", "Liquidez bancaria interna", "Experto"],
    ["Economista asociado a expectativas racionales?", "Robert Lucas Jr.", "Krugman", "Samuelson", "Stiglitz", "Dificil"],
    ["Que mide la TIR en finanzas?", "Rentabilidad anualizada que iguala VAN a cero", "Inflacion mensual", "Liquidez corriente", "Volatilidad historica", "Medio"],
    ["Quien escribio Capital in the Twenty-First Century?", "Thomas Piketty", "Branko Milanovic", "Daron Acemoglu", "Angus Deaton", "Medio"],
    ["Que tratado de 1944 creo FMI y Banco Mundial?", "Bretton Woods", "Versalles", "Maastricht", "GATT", "Dificil"],
    ["Modelo de crecimiento con progreso tecnologico exogeno?", "Solow", "Harrod-Domar", "AK endogeno", "Romer", "Dificil"],
    ["Que moneda adopto Ecuador en 2000?", "Dolar estadounidense", "Sucre nuevo", "Peso andino", "Euro", "Medio"]
  ];
  economics.forEach((e) => q.push(makeQ("Economia", e[5], e[0], e[1], e[2], e[3], e[4])));

  const videogames = [
    ["Compania creadora de The Legend of Zelda?", "Nintendo", "Sega", "Capcom", "Square Enix", "Facil"],
    ["Estudio desarrollador de The Witcher 3?", "CD Projekt Red", "BioWare", "Larian", "Bethesda", "Medio"],
    ["Ano de lanzamiento de Super Mario Bros. (NES, Japon)?", "1985", "1983", "1987", "1989", "Dificil"],
    ["Motor usado ampliamente por Fortnite?", "Unreal Engine", "Unity", "Source", "CryEngine", "Medio"],
    ["Protagonista de Metal Gear Solid?", "Solid Snake", "Big Boss", "Raiden", "Otacon", "Facil"],
    ["Saga donde aparece el planeta Zebes?", "Metroid", "Halo", "Mass Effect", "Star Fox", "Dificil"],
    ["Empresa creadora de PlayStation?", "Sony", "Nintendo", "Microsoft", "Panasonic", "Facil"],
    ["Director de Elden Ring junto a Miyazaki en lore?", "George R. R. Martin", "Hideo Kojima", "Yoko Taro", "Hidetaka Suehiro", "Medio"],
    ["Primer videojuego comercialmente exitoso de arcade de Atari (1972)?", "Pong", "Breakout", "Asteroids", "Centipede", "Dificil"],
    ["Que estudio hizo Half-Life 2?", "Valve", "id Software", "Epic Games", "Bungie", "Facil"],
    ["Plataforma original de Demon's Souls (2009)?", "PlayStation 3", "Xbox 360", "PC", "PSP", "Dificil"],
    ["Nombre del continente principal en The Elder Scrolls?", "Tamriel", "Azeroth", "Thedas", "Valoran", "Medio"],
    ["Juego de 1998 que popularizo battle royale modder?", "No aplica", "PlayerUnknown's Battlegrounds", "Arma 2 mod DayZ", "Minecraft Hunger Games", "Experto"],
    ["Estudio de Hades (2020)?", "Supergiant Games", "Motion Twin", "Klei", "Team Cherry", "Medio"],
    ["Que saga usa la Trifuerza como reliquia?", "The Legend of Zelda", "Final Fantasy", "Dragon Quest", "Fire Emblem", "Facil"],
    ["Ano de salida de Minecraft (version completa 1.0)?", "2011", "2009", "2010", "2012", "Dificil"],
    ["Desarrollador de Dark Souls?", "FromSoftware", "PlatinumGames", "Ninja Theory", "Arc System Works", "Facil"],
    ["Empresa de League of Legends?", "Riot Games", "Blizzard", "Valve", "Tencent Games Studio", "Facil"],
    ["Director creativo de Death Stranding?", "Hideo Kojima", "Shinji Mikami", "Keiji Inafune", "Suda51", "Medio"],
    ["Que consola introdujo cartuchos UMD?", "PSP", "Nintendo DS", "PS Vita", "Game Boy Advance", "Dificil"],
    ["Estudio de Disco Elysium?", "ZA/UM", "Obsidian", "inXile", "Paradox Tectonic", "Experto"],
    ["Genero principal de Civilization VI?", "Estrategia por turnos 4X", "RTS", "Roguelike", "MOBA", "Medio"],
    ["Compania original de Sonic the Hedgehog?", "Sega", "Nintendo", "Konami", "SNK", "Facil"],
    ["Juego ganador GOTY 2022 en The Game Awards?", "Elden Ring", "God of War Ragnarok", "Stray", "A Plague Tale: Requiem", "Medio"],
    ["Que estudio desarrollo Portal 2?", "Valve", "Naughty Dog", "Respawn", "Arkane", "Medio"],
    ["Nombre del protagonista de Red Dead Redemption 2?", "Arthur Morgan", "John Marston", "Dutch van der Linde", "Micah Bell", "Facil"],
    ["Que empresa publica regularmente FIFA/EA Sports FC?", "Electronic Arts", "Konami", "2K", "Ubisoft", "Facil"],
    ["Ano de lanzamiento original de Doom?", "1993", "1991", "1995", "1997", "Dificil"],
    ["Saga de estrategia con facciones Zerg y Protoss?", "StarCraft", "Warcraft", "Command & Conquer", "Total War", "Medio"],
    ["Autor del diseño de Tetris?", "Alexey Pajitnov", "Henk Rogers", "Shigeru Miyamoto", "John Carmack", "Dificil"],
    ["Que estudio hizo The Last of Us?", "Naughty Dog", "Santa Monica Studio", "Insomniac", "Guerrilla", "Facil"],
    ["Juego independiente de Team Cherry?", "Hollow Knight", "Celeste", "Dead Cells", "Undertale", "Medio"]
  ];
  videogames.forEach((v) => q.push(makeQ("Videojuegos", v[5], v[0], v[1], v[2], v[3], v[4])));

  const tvSeries = [
    ["Creador principal de Breaking Bad?", "Vince Gilligan", "David Chase", "Matthew Weiner", "Sam Esmail", "Medio"],
    ["Serie basada en Poniente de George R. R. Martin?", "Game of Thrones", "The Witcher", "The Rings of Power", "Shadow and Bone", "Facil"],
    ["Ano de estreno de The Sopranos?", "1999", "1997", "2001", "2003", "Dificil"],
    ["Actor que interpreta a Don Draper en Mad Men?", "Jon Hamm", "Bryan Cranston", "Michael C. Hall", "James Gandolfini", "Medio"],
    ["Servicio de streaming que produjo Stranger Things?", "Netflix", "HBO", "Prime Video", "Hulu", "Facil"],
    ["Serie de ciencia ficcion creada por Rod Serling en 1959?", "The Twilight Zone", "The Outer Limits", "Star Trek", "Lost in Space", "Experto"],
    ["Personaje principal de House M.D.?", "Gregory House", "John Watson", "Hannibal Lecter", "Meredith Grey", "Facil"],
    ["Serie donde aparece Walter White?", "Breaking Bad", "Better Call Saul", "Ozark", "Narcos", "Facil"],
    ["Creador de The Wire?", "David Simon", "Alan Ball", "Noah Hawley", "Craig Mazin", "Dificil"],
    ["Serie britanica con Benedict Cumberbatch como detective?", "Sherlock", "Luther", "Broadchurch", "Doctor Who", "Medio"],
    ["Ano de estreno de Friends?", "1994", "1992", "1996", "1998", "Dificil"],
    ["Serie antologica de Charlie Brooker?", "Black Mirror", "Love Death + Robots", "Inside No. 9", "Years and Years", "Medio"],
    ["Creador de Twin Peaks junto a Mark Frost?", "David Lynch", "David Fincher", "Lars von Trier", "Nicolas Winding Refn", "Experto"],
    ["Serie sobre un parque tematico de androides?", "Westworld", "Humans", "Devs", "Raised by Wolves", "Facil"],
    ["Actor protagonista de Mr. Robot?", "Rami Malek", "Elliot Page", "Jared Leto", "Andrew Scott", "Medio"],
    ["Serie historica sobre Chernobyl (2019) fue creada por...", "Craig Mazin", "Johan Renck", "Sam Levinson", "Tom Fontana", "Dificil"],
    ["En que serie aparece Tony Soprano?", "The Sopranos", "Boardwalk Empire", "Ray Donovan", "Succession", "Facil"],
    ["Serie de anime de Shinichiro Watanabe de 1998?", "Cowboy Bebop", "Samurai Champloo", "Space Dandy", "Ergo Proxy", "Dificil"],
    ["Creador de Succession?", "Jesse Armstrong", "Armando Iannucci", "Adam McKay", "David Mandel", "Experto"],
    ["Serie de HBO sobre dragones y Targaryen estrenada en 2022?", "House of the Dragon", "Game of Thrones", "The Last Kingdom", "Vikings", "Facil"],
    ["Quien interpreta a Eleven en Stranger Things?", "Millie Bobby Brown", "Sadie Sink", "Natalia Dyer", "Maya Hawke", "Medio"],
    ["Serie sobre oficina de papel con Michael Scott?", "The Office (US)", "Parks and Recreation", "Brooklyn Nine-Nine", "Arrested Development", "Facil"],
    ["En que serie aparece el personaje Omar Little?", "The Wire", "Breaking Bad", "Oz", "Snowfall", "Experto"],
    ["Creador de Fargo (serie)?", "Noah Hawley", "Ryan Murphy", "Sam Esmail", "Nic Pizzolatto", "Dificil"],
    ["Serie con detectives Rust Cohle y Marty Hart (T1)?", "True Detective", "Mindhunter", "The Killing", "Broadchurch", "Medio"],
    ["Ano de estreno de Lost?", "2004", "2002", "2006", "2008", "Dificil"],
    ["Serie de Matt Groening ambientada en Springfield?", "The Simpsons", "Futurama", "Disenchantment", "South Park", "Facil"],
    ["Creador de The X-Files?", "Chris Carter", "J. J. Abrams", "Joss Whedon", "Damon Lindelof", "Dificil"],
    ["Serie de espias protagonizada por Keri Russell como Elizabeth Jennings?", "The Americans", "Homeland", "Berlin Station", "Tehran", "Experto"],
    ["Serie coreana de 2021 sobre juegos mortales?", "Squid Game", "Alice in Borderland", "Hellbound", "Kingdom", "Facil"],
    ["Showrunner de The Last of Us (HBO) junto a Neil Druckmann?", "Craig Mazin", "Damon Lindelof", "Vince Gilligan", "Eric Kripke", "Dificil"],
    ["Serie de ciencia ficcion de los hermanos Duffer?", "Stranger Things", "Dark", "Fringe", "1899", "Facil"]
  ];
  tvSeries.forEach((s) => q.push(makeQ("Series de TV", s[5], s[0], s[1], s[2], s[3], s[4])));

  const inventionsCat = [
    ["Quien invento la imprenta de tipos moviles en Europa?", "Johannes Gutenberg", "Aldo Manuzio", "William Caxton", "Lorenzo Valla", "Facil"],
    ["Inventor de la dinamita (patente 1867)?", "Alfred Nobel", "Nikola Tesla", "Robert Bunsen", "Michael Faraday", "Medio"],
    ["Quien invento el telefono segun patente de 1876 en EE. UU.?", "Alexander Graham Bell", "Elisha Gray", "Antonio Meucci", "Thomas Edison", "Dificil"],
    ["Quien desarrollo la World Wide Web en CERN?", "Tim Berners-Lee", "Vint Cerf", "Robert Kahn", "Marc Andreessen", "Facil"],
    ["Inventor asociado al motor diesel?", "Rudolf Diesel", "Nikolaus Otto", "James Watt", "Karl Benz", "Medio"],
    ["Inventor de la pila voltaica?", "Alessandro Volta", "Luigi Galvani", "André-Marie Ampère", "Ohm", "Medio"],
    ["Quien invento el fonografo?", "Thomas Edison", "Graham Bell", "Emile Berliner", "Marconi", "Dificil"],
    ["Inventor del telescopio de refraccion moderno temprano atribuido en 1608?", "Hans Lippershey", "Galileo", "Kepler", "Huygens", "Experto"],
    ["Quien invento el algoritmo de compresion ZIP deflate co-creado con Gailly?", "Phil Katz", "Tim Berners-Lee", "Donald Knuth", "Brendan Eich", "Experto"],
    ["Inventor del transistor (equipo Bell Labs, 1947) liderado por...", "Bardeen-Brattain-Shockley", "Fermi-Hahn-Meitner", "Watson-Crick-Franklin", "Lorentz-Planck-Einstein", "Experto"],
    ["Quien patento el cinematografo junto a su hermano?", "Auguste y Louis Lumiere", "Georges Melies", "Thomas Edison", "Muybridge", "Dificil"],
    ["Inventor de la vacuna contra la polio inactivada?", "Jonas Salk", "Albert Sabin", "Pasteur", "Koch", "Medio"],
    ["Quien invento el pararrayos?", "Benjamin Franklin", "Nikola Tesla", "Faraday", "Maxwell", "Facil"],
    ["Inventor del motor de combustion de cuatro tiempos (ciclo Otto)?", "Nikolaus Otto", "Rudolf Diesel", "Karl Benz", "Gottlieb Daimler", "Dificil"],
    ["Quien invento la fotografia daguerrotipo?", "Louis Daguerre", "Niepce", "Talbot", "Eastman", "Dificil"],
    ["Inventora del lavavajillas mecanico en 1886?", "Josephine Cochrane", "Margaret Knight", "Ada Lovelace", "Mary Anderson", "Experto"],
    ["Inventor de la maquina de coser funcional de 1846?", "Elias Howe", "Isaac Singer", "Barthelemy Thimonnier", "James Gibbs", "Experto"],
    ["Quien invento el primer marcapasos implantable portable?", "Wilson Greatbatch", "Paul Zoll", "Rune Elmqvist", "John Hopps", "Experto"],
    ["Inventor de la radio comunicacion transatlantica temprana?", "Guglielmo Marconi", "Nikola Tesla", "Reginald Fessenden", "Lee De Forest", "Medio"],
    ["Quien invento el limpiaparabrisas de automovil (patente temprana)?", "Mary Anderson", "Josephine Cochrane", "Margaret Knight", "Bette Nesmith Graham", "Dificil"],
    ["Inventor del bisturi electrico moderno (electrocirugia)?", "William T. Bovie", "Harvey Cushing", "Lister", "Pasteur", "Experto"],
    ["Quien desarrollo Post-it Notes en 3M junto a Spencer Silver?", "Art Fry", "George de Mestral", "Chester Carlson", "Douglas Engelbart", "Dificil"],
    ["Inventor de velcro?", "George de Mestral", "Karl Elsener", "Otis Boykin", "Leo Baekeland", "Medio"],
    ["Quien invento la baquelita (primer plastico sintetico de uso masivo)?", "Leo Baekeland", "Wallace Carothers", "Staudinger", "Natta", "Dificil"],
    ["Quien invento la calculadora pascalina?", "Blaise Pascal", "Leibniz", "Babbage", "Napier", "Medio"],
    ["Inventor de la imprenta rotativa moderna de 1843?", "Richard March Hoe", "Gutenberg", "Koenig", "Stanhope", "Experto"],
    ["Quien invento la banda de rodamiento transportadora moderna para industria automotriz?", "Henry Ford (adopcion en linea de ensamblaje)", "Frederick Taylor", "Elon Musk", "Ransom Olds", "Experto"],
    ["Inventor del helicoptero practical VS-300?", "Igor Sikorsky", "Bell", "Santos-Dumont", "Bleriot", "Dificil"],
    ["Quien invento el codigo Morse junto a Alfred Vail?", "Samuel Morse", "Marconi", "Bell", "Edison", "Medio"],
    ["Inventor del codigo QR (1994)?", "Masahiro Hara", "Hiroshi Yamauchi", "Akio Morita", "Satoru Iwata", "Experto"],
    ["Inventor del sistema de refrigeracion por compresion de vapor aplicado industrialmente?", "Jacob Perkins", "Carl von Linde", "Willis Carrier", "James Joule", "Experto"],
    ["Quien invento el aire acondicionado moderno en 1902?", "Willis Carrier", "Nikola Tesla", "Thomas Edison", "Westinghouse", "Dificil"]
  ];
  inventionsCat.forEach((i) => q.push(makeQ("Inventos", i[5], i[0], i[1], i[2], i[3], i[4])));

  const popCulture = [
    ["Banda de Freddie Mercury?", "Queen", "U2", "The Who", "Pink Floyd", "Facil"],
    ["Artista de Thriller (1982)?", "Michael Jackson", "Prince", "Madonna", "David Bowie", "Facil"],
    ["Cantante conocida como Queen of Pop?", "Madonna", "Cher", "Whitney Houston", "Celine Dion", "Medio"],
    ["Ano de lanzamiento del primer iPhone?", "2007", "2005", "2006", "2008", "Medio"],
    ["Película del Universo Marvel que inicia la saga Infinity en 2008?", "Iron Man", "The Incredible Hulk", "Thor", "Captain America", "Facil"],
    ["Banda autora de Bohemian Rhapsody?", "Queen", "The Beatles", "Led Zeppelin", "The Rolling Stones", "Facil"],
    ["Cantante de Like a Prayer?", "Madonna", "Janet Jackson", "Kylie Minogue", "Annie Lennox", "Medio"],
    ["Plataforma de videos cortos dominante desde 2020?", "TikTok", "Vine", "Snapchat", "Tumblr", "Facil"],
    ["Serie animada creada por Matt Groening en 1989?", "The Simpsons", "Futurama", "Family Guy", "South Park", "Facil"],
    ["Rapper que lanzó To Pimp a Butterfly (2015)?", "Kendrick Lamar", "J. Cole", "Drake", "Kanye West", "Dificil"],
    ["Grupo k-pop de Dynamite (2020)?", "BTS", "EXO", "BLACKPINK", "Seventeen", "Medio"],
    ["Artista del album Lemonade (2016)?", "Beyonce", "Rihanna", "Adele", "Lady Gaga", "Medio"],
    ["Ano de estreno de Star Wars Episode IV?", "1977", "1975", "1979", "1981", "Dificil"],
    ["Cantante de Purple Rain?", "Prince", "David Bowie", "George Michael", "Elton John", "Medio"],
    ["Franquicia de muñecas creada por Ruth Handler?", "Barbie", "Bratz", "Polly Pocket", "My Little Pony", "Facil"],
    ["Empresa propietaria de Instagram?", "Meta", "Google", "Snap", "ByteDance", "Facil"],
    ["Artista del album Back to Black?", "Amy Winehouse", "Adele", "Duffy", "Lana Del Rey", "Dificil"],
    ["Nombre del fandom de Taylor Swift?", "Swifties", "Beliebers", "Directioners", "Arianators", "Facil"],
    ["Ano en que MTV se lanzó en EE. UU.?", "1981", "1979", "1983", "1985", "Dificil"],
    ["Primer videoclip emitido por MTV?", "Video Killed the Radio Star", "Take On Me", "Thriller", "Billie Jean", "Experto"],
    ["Artista detrás de Bad Romance?", "Lady Gaga", "Katy Perry", "Rihanna", "Sia", "Facil"],
    ["Fenomeno global juvenil de 1997 creado por J. K. Rowling?", "Harry Potter", "Twilight", "Narnia", "Percy Jackson", "Facil"],
    ["Creador del personaje Spider-Man junto a Steve Ditko?", "Stan Lee", "Jack Kirby", "Jim Lee", "Todd McFarlane", "Medio"],
    ["Ano de salida de Nevermind de Nirvana?", "1991", "1989", "1993", "1995", "Dificil"],
    ["Cantante principal de The Smiths?", "Morrissey", "Robert Smith", "Ian Curtis", "Jarvis Cocker", "Experto"],
    ["Artista de Rolling in the Deep?", "Adele", "Sia", "Sam Smith", "Dua Lipa", "Facil"],
    ["Banda de rock alternativo liderada por Thom Yorke?", "Radiohead", "Blur", "Oasis", "Pulp", "Dificil"],
    ["Grupo de K-pop de How You Like That?", "BLACKPINK", "Red Velvet", "TWICE", "ITZY", "Medio"],
    ["Ano de lanzamiento de Facebook para publico general?", "2006", "2004", "2005", "2007", "Dificil"],
    ["Plataforma comprada por Elon Musk en 2022?", "Twitter", "Instagram", "Reddit", "Discord", "Facil"],
    ["Nombre artistico de Abel Tesfaye?", "The Weeknd", "Drake", "Childish Gambino", "Frank Ocean", "Medio"],
    ["Artista de Born This Way?", "Lady Gaga", "Madonna", "Kesha", "P!nk", "Facil"]
  ];
  popCulture.forEach((p) => q.push(makeQ("Cultura pop", p[5], p[0], p[1], p[2], p[3], p[4])));

  const mathematics = [
    ["Valor aproximado de pi a dos decimales?", "3.14", "3.41", "3.04", "3.24", "Facil"],
    ["Teorema que relaciona catetos e hipotenusa?", "Teorema de Pitagoras", "Teorema de Tales", "Teorema de Euler", "Teorema de Bayes", "Facil"],
    ["Resultado de derivada de x^2?", "2x", "x", "x^2", "2", "Facil"],
    ["Quien demostro el ultimo teorema de Fermat en 1994?", "Andrew Wiles", "Terence Tao", "John Nash", "Godel", "Dificil"],
    ["Constante e aproximada?", "2.71828", "1.61803", "3.14159", "0.57721", "Medio"],
    ["Que simbolo representa sumatoria?", "Sigma mayuscula", "Pi mayuscula", "Delta", "Lambda", "Facil"],
    ["Integral de 1/x dx?", "ln|x| + C", "x + C", "1/(x^2) + C", "e^x + C", "Medio"],
    ["Quien introdujo la notacion moderna de funciones f(x)?", "Leonhard Euler", "Lagrange", "Gauss", "Cauchy", "Dificil"],
    ["Conjetura resuelta por Grigori Perelman?", "Conjetura de Poincare", "Hipotesis de Riemann", "Conjetura de Goldbach", "Conjetura de Collatz", "Experto"],
    ["Axiomatica de conjuntos mas usada (sigla)?", "ZFC", "PA", "RCA", "NBG", "Experto"],
    ["Numero primo par unico?", "2", "3", "5", "11", "Facil"],
    ["Determinante de matriz identidad 3x3?", "1", "0", "3", "-1", "Facil"],
    ["Logaritmo natural de e?", "1", "0", "e", "10", "Facil"],
    ["Teorema central del limite se refiere a distribucion de...", "Media muestral", "Varianza poblacional exacta", "Moda", "Mediana", "Dificil"],
    ["Quien desarrollo geometria no euclidiana hiperbólica junto a Bolyai?", "Lobachevski", "Riemann", "Hilbert", "Cantor", "Experto"],
    ["Significado de sigma-algebra en probabilidad?", "Coleccion cerrada bajo complemento y uniones numerables", "Conjunto finito de eventos", "Matriz diagonal", "Distribucion discreta", "Experto"],
    ["Dimension del espacio vectorial nulo?", "0", "1", "n", "No definida", "Medio"],
    ["Si A y B son independientes, P(A∩B) = ?", "P(A)P(B)", "P(A)+P(B)", "P(A)-P(B)", "P(B)/P(A)", "Medio"],
    ["Quien formuló el metodo de multiplicadores con su nombre?", "Lagrange", "Cauchy", "Fourier", "Laplace", "Dificil"],
    ["Ecuacion de Euler (analisis complejo) famosa?", "e^(i pi) + 1 = 0", "a^2 + b^2 = c^2", "F = ma", "E = mc^2", "Facil"],
    ["Teorema de incompletitud asociado a?", "Kurt Godel", "David Hilbert", "Alan Turing", "Alonzo Church", "Dificil"],
    ["En teoria de grupos, grupo abeliano implica operacion...", "Conmutativa", "Idempotente", "Asociativa únicamente", "No invertible", "Medio"],
    ["Distribucion limite de suma de Bernoullis normalizadas?", "Normal", "Poisson", "Exponencial", "Cauchy", "Dificil"],
    ["Quien introdujo fractales modernos y conjunto de Mandelbrot?", "Benoit Mandelbrot", "Julia", "Poincare", "Kolmogorov", "Medio"],
    ["Derivada de sin(x)?", "cos(x)", "-sin(x)", "-cos(x)", "tan(x)", "Facil"],
    ["Que es un numero trascendente?", "No raiz de ningun polinomio no nulo con coeficientes racionales", "No entero", "No racional", "No negativo", "Experto"],
    ["Base del logaritmo natural?", "e", "10", "2", "pi", "Facil"],
    ["Metodo de prueba por contradiccion tambien llamado?", "Reductio ad absurdum", "Induccion fuerte", "Exhaustion", "Descent infinito", "Medio"],
    ["Hipotesis sobre ceros no triviales de zeta de Riemann?", "Parte real 1/2", "Parte real 1", "Parte imaginaria 0", "Modulo 1", "Experto"],
    ["Resultado de 7! ?", "5040", "720", "40320", "840", "Facil"],
    ["Que matematica propuso Noether theorem en fisica matematica?", "Emmy Noether", "Sofia Kovalevskaya", "Hypatia", "Mary Cartwright", "Experto"],
    ["Campo matematico de estudiar anillos, ideales y modulos?", "Algebra abstracta", "Topologia diferencial", "Analisis numerico", "Teoria ergodica", "Dificil"]
  ];
  mathematics.forEach((m) => q.push(makeQ("Matematicas", m[5], m[0], m[1], m[2], m[3], m[4])));

  const linguistics = [
    ["Familia linguistica del espanol?", "Romance", "Germanica", "Eslava", "Uralica", "Facil"],
    ["Alfabeto usado por el ruso moderno?", "Cirilico", "Latino", "Griego", "Arabe", "Facil"],
    ["Lingüista asociado a gramatica generativa?", "Noam Chomsky", "Ferdinand de Saussure", "Roman Jakobson", "Edward Sapir", "Medio"],
    ["Lengua con mayor numero de hablantes nativos?", "Mandarin", "Ingles", "Hindi", "Espanol", "Medio"],
    ["Significado de IPA en linguistica?", "Alfabeto Fonetico Internacional", "Instituto de Pronunciacion Anglo", "Indice de Prosodia Aplicada", "Asociacion de Idiomas Panamericanos", "Dificil"],
    ["Que estudia la morfologia?", "Estructura interna de palabras", "Orden de palabras en oracion", "Sonidos del habla", "Cambio semantico histórico", "Facil"],
    ["Que estudia la sintaxis?", "Estructura de oraciones", "Articulacion de fonemas", "Historia de lenguas", "Entonacion", "Facil"],
    ["Lengua semitica clasica del Coran?", "Arabe clasico", "Hebreo", "Arameo", "Amharico", "Medio"],
    ["Sistema de escritura del japones combina kanji con...", "Kana (hiragana y katakana)", "Hangul", "Pinyin", "Bopomofo", "Facil"],
    ["Quien escribio Curso de linguistica general?", "Ferdinand de Saussure", "Chomsky", "Bloomfield", "Jakobson", "Dificil"],
    ["Lengua aislada de Europa occidental?", "Euskera", "Catalan", "Gallego", "Bretón", "Medio"],
    ["Que es un falso amigo en traduccion?", "Palabra similar en forma pero distinto significado", "Prestamo lexical", "Neologismo tecnico", "Arcaísmo", "Facil"],
    ["Termino para palabras opuestas en significado?", "Antonimos", "Homonimos", "Paronimos", "Hiperonimos", "Facil"],
    ["Que es diglosia?", "Coexistencia funcional de dos variedades en una comunidad", "Bilinguismo individual puro", "Perdida total de idioma", "Cambio fonetico aislado", "Experto"],
    ["Familia del hungaro?", "Uralica", "Indoeuropea", "Altaica", "Caucasica", "Dificil"],
    ["Lengua clasica de liturgia hindu y muchos textos antiguos?", "Sanscrito", "Pali", "Pracrito", "Tamil", "Medio"],
    ["Fenomeno de cambio de codigo entre idiomas en una misma charla?", "Code-switching", "Pidginizacion", "Metatesis", "Diptongacion", "Dificil"],
    ["Quien propuso la hipotesis Sapir-Whorf junto a Whorf?", "Edward Sapir", "Bloomfield", "Saussure", "Hjelmslev", "Experto"],
    ["Que es un morfema?", "Unidad minima con significado", "Sonido aislado", "Frase subordinada", "Silaba tonica", "Facil"],
    ["Lengua oficial de Etiopia mayoritaria?", "Amharico", "Somali", "Tigrinya", "Oromo", "Medio"],
    ["Que es una lengua criolla?", "Lengua estabilizada nacida de contacto y pidgin", "Dialecto rural antiguo", "Lengua inventada artística", "Idioma sin escritura", "Dificil"],
    ["Sistema de escritura de Corea?", "Hangul", "Kanji", "Hanzi", "Cirilico", "Facil"],
    ["Lengua indoeuropea con mas casos gramaticales entre las comunes (aprox.)?", "Ruso", "Ingles", "Espanol", "Frances", "Dificil"],
    ["Que estudia la pragmatica?", "Uso del lenguaje en contexto", "Sonidos del habla", "Origen biologico del lenguaje", "Etymologia", "Medio"],
    ["Concepto de lengua y habla (langue/parole) se asocia a...", "Saussure", "Chomsky", "Jakobson", "Labov", "Experto"],
    ["Familia del finlandes?", "Uralica", "Eslava", "Baltica", "Romance", "Medio"],
    ["Que son cognados verdaderos?", "Palabras de origen comun historico", "Palabras iguales por azar", "Prestamos modernos exclusivamente", "Errores de traduccion", "Dificil"],
    ["Alfabeto usado por el griego moderno?", "Griego", "Latino", "Cirilico", "Armeno", "Facil"],
    ["Que significa glotofagia en sociolinguistica?", "Desplazamiento de una lengua por otra dominante", "Variacion dialectal interna", "Neologismo juvenil", "Cambio de acento individual", "Experto"],
    ["Lengua mas hablada de Brasil?", "Portugues", "Espanol", "Guarani", "Ingles", "Facil"],
    ["Que son pares minimos en fonologia?", "Palabras que difieren en un solo fonema", "Palabras de un solo morfema", "Sinonimos perfectos", "Palabras compuestas", "Medio"],
    ["Sistema tonal muy marcado entre estas lenguas?", "Mandarin", "Aleman", "Italiano", "Turco", "Medio"]
  ];
  linguistics.forEach((l) => q.push(makeQ("Idiomas y linguistica", l[5], l[0], l[1], l[2], l[3], l[4])));

  const unique = [];
  const seen = new Set();
  q.forEach((item) => {
    if (!seen.has(item.question)) {
      seen.add(item.question);
      unique.push(item);
    }
  });
  return unique;
}

const questions = buildQuestionBank();
const iconByCategory = {
  "Historia mundial": "🏛️", Ciencia: "🧪", Tecnologia: "💻", Cine: "🎬", Musica: "🎵",
  Literatura: "📚", Geografia: "🌍", Deportes: "🏅", Arte: "🎨", Naturaleza: "🌿",
  Gastronomia: "🍽️", Mitologia: "⚡", Astronomia: "🌌",
  Filosofia: "🤔", Economia: "📈", Videojuegos: "🎮", "Series de TV": "📺",
  Inventos: "💡", "Cultura pop": "✨", Matematicas: "➗", "Idiomas y linguistica": "🗣️",
};

function initAudio() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = Ctx ? new Ctx() : null;
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
function tone(freq, duration, type = "sine", volume = 0.05, when = 0) {
  if (!audioCtx) return;
  const t0 = audioCtx.currentTime + when;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain); gain.connect(audioCtx.destination); osc.start(t0); osc.stop(t0 + duration + 0.03);
}
const sfx = {
  correct() { tone(520, 0.08, "triangle", 0.045); tone(760, 0.12, "triangle", 0.05, 0.08); tone(980, 0.16, "triangle", 0.055, 0.2); },
  wrong() { tone(280, 0.14, "sawtooth", 0.05); tone(210, 0.2, "sawtooth", 0.055, 0.1); },
  tick() { tone(960, 0.05, "square", 0.03); },
  gameOver() { tone(250, 0.18, "sine", 0.05); tone(180, 0.24, "sine", 0.05, 0.18); },
  highScore() { tone(660, 0.08, "triangle", 0.045); tone(880, 0.1, "triangle", 0.05, 0.08); tone(1120, 0.14, "triangle", 0.06, 0.19); },
};

function triggerConfetti(count = 70) {
  const colors = ["#67e8f9", "#a78bfa", "#34d399", "#f472b6", "#fbbf24", "#60a5fa"];
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.transform = `translateY(-10px) rotate(${Math.random() * 140}deg)`;
    piece.style.animationDuration = `${1.3 + Math.random() * 1.2}s`;
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 2600);
  }
}

function showScreen(screen) {
  [startScreen, gameScreen, gameOverScreen].forEach((el) => el.classList.remove("active"));
  screen.classList.add("active");
}
function getQuestionSet() {
  const groups = difficultyOrder.map((d) => shuffle(questions.filter((q) => q.difficulty === d)).slice(0, QUESTIONS_PER_LEVEL));
  return groups.flat();
}
function getSelectedMode() {
  const checked = document.querySelector("input[name='mode']:checked");
  return checked ? Number(checked.value) : 1;
}
function makePlayer(name) {
  return { name, lives: TOTAL_LIVES, score: 0, correct: 0, streak: 0, bestStreak: 0, answered: 0 };
}
function currentPlayer() { return gameState.players[gameState.turn]; }
function isAlive(idx) { return gameState.players[idx].lives > 0; }
function nextAliveTurn() {
  if (gameState.mode === 1) return 0;
  const other = gameState.turn === 0 ? 1 : 0;
  if (isAlive(other)) return other;
  return isAlive(gameState.turn) ? gameState.turn : other;
}
function getDifficultyMultiplier(d) {
  if (d === "Facil") return 1;
  if (d === "Medio") return 1.5;
  if (d === "Dificil") return 2.1;
  return 3;
}

function updatePanels() {
  p1ScoreEl.textContent = String(gameState.players[0].score);
  p2ScoreEl.textContent = String(gameState.players[1].score);
  p1LivesEl.textContent = "❤".repeat(Math.max(0, gameState.players[0].lives)) + "♡".repeat(TOTAL_LIVES - Math.max(0, gameState.players[0].lives));
  p2LivesEl.textContent = "❤".repeat(Math.max(0, gameState.players[1].lives)) + "♡".repeat(TOTAL_LIVES - Math.max(0, gameState.players[1].lives));
  const panels = document.querySelectorAll(".panel");
  panels[0].classList.toggle("active-turn", gameState.turn === 0);
  panels[1].classList.toggle("active-turn", gameState.turn === 1 && gameState.mode === 2);
  panels[1].style.opacity = gameState.mode === 2 ? "1" : ".5";
  turnPlayerEl.textContent = gameState.mode === 1 ? gameState.players[0].name : currentPlayer().name;
}
function initGame() {
  initAudio();
  const mode = getSelectedMode();
  const p1 = (p1NameInput.value.trim().slice(0, 18) || "Jugador 1");
  const p2 = (p2NameInput.value.trim().slice(0, 18) || "Jugador 2");
  gameState = {
    mode, questions: getQuestionSet(), currentIndex: 0, turn: 0, timeLeft: QUESTION_TIME, answeredCurrent: false,
    totalAnswered: 0, totalCorrect: 0, players: [makePlayer(p1), makePlayer(p2)],
  };
  qTotalEl.textContent = String(gameState.questions.length);
  p1LabelEl.textContent = p1; p2LabelEl.textContent = p2; playerNameInput.value = p1;
  showScreen(gameScreen); renderQuestion();
}
function disableOptions() { [...optionsEl.children].forEach((b) => { b.disabled = true; }); }
function renderQuestion() {
  clearInterval(timerInterval);
  const qq = gameState.questions[gameState.currentIndex];
  gameState.timeLeft = QUESTION_TIME; gameState.answeredCurrent = false;
  feedbackEl.textContent = ""; feedbackEl.className = "feedback";
  qIndexEl.textContent = String(gameState.currentIndex + 1);
  difficultyTagEl.textContent = qq.difficulty; timerEl.textContent = String(gameState.timeLeft);
  catIconEl.textContent = iconByCategory[qq.category] || "🧠"; catTextEl.textContent = qq.category;
  questionTextEl.textContent = qq.question;
  timeBarEl.style.width = "100%";
  optionsEl.innerHTML = ""; updatePanels();
  qq.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn"; btn.textContent = opt;
    btn.addEventListener("click", () => answerQuestion(idx, btn));
    optionsEl.appendChild(btn);
  });
  timerInterval = setInterval(() => {
    gameState.timeLeft -= 1; timerEl.textContent = String(gameState.timeLeft);
    timeBarEl.style.width = `${(gameState.timeLeft / QUESTION_TIME) * 100}%`;
    if (gameState.timeLeft <= 8) timeBarEl.style.filter = "hue-rotate(-30deg) saturate(1.2)";
    else timeBarEl.style.filter = "none";
    if (gameState.timeLeft > 0 && gameState.timeLeft <= 5) sfx.tick();
    if (gameState.timeLeft <= 0) { clearInterval(timerInterval); if (!gameState.answeredCurrent) handleTimeout(); }
  }, 1000);
}

function penalizeLife(playerIndex) {
  const panels = document.querySelectorAll(".panel");
  panels[playerIndex].classList.add("shake");
  setTimeout(() => panels[playerIndex].classList.remove("shake"), 420);
}
function answerQuestion(choice, btn) {
  if (gameState.answeredCurrent) return;
  gameState.answeredCurrent = true; clearInterval(timerInterval);
  const qq = gameState.questions[gameState.currentIndex];
  const player = currentPlayer();
  const buttons = [...optionsEl.children];
  disableOptions(); player.answered += 1; gameState.totalAnswered += 1;
  if (choice === qq.answer) {
    btn.classList.add("correct");
    const gain = Math.round((120 + Math.max(0, gameState.timeLeft) * 9) * getDifficultyMultiplier(qq.difficulty));
    player.score += gain; player.correct += 1; gameState.totalCorrect += 1;
    player.streak += 1; player.bestStreak = Math.max(player.bestStreak, player.streak);
    feedbackEl.textContent = `Correcto! ${player.name} +${gain}`; feedbackEl.className = "feedback ok"; sfx.correct();
  } else {
    btn.classList.add("wrong"); buttons[qq.answer].classList.add("correct");
    player.lives -= 1; player.streak = 0; penalizeLife(gameState.turn);
    feedbackEl.textContent = `Incorrecto. Respuesta: ${qq.options[qq.answer]}`; feedbackEl.className = "feedback bad"; sfx.wrong();
  }
  updatePanels(); setTimeout(nextStep, 1200);
}
function handleTimeout() {
  gameState.answeredCurrent = true; disableOptions();
  const qq = gameState.questions[gameState.currentIndex]; const player = currentPlayer();
  const buttons = [...optionsEl.children];
  if (buttons[qq.answer]) buttons[qq.answer].classList.add("correct");
  player.lives -= 1; player.answered += 1; player.streak = 0; gameState.totalAnswered += 1;
  penalizeLife(gameState.turn);
  feedbackEl.textContent = `Tiempo agotado. Respuesta: ${qq.options[qq.answer]}`; feedbackEl.className = "feedback bad"; sfx.wrong();
  updatePanels(); setTimeout(nextStep, 1200);
}
function shouldEndGame() {
  const p1Alive = isAlive(0); const p2Alive = gameState.mode === 1 ? false : isAlive(1);
  const noAlive = gameState.mode === 1 ? !p1Alive : (!p1Alive && !p2Alive);
  return noAlive || gameState.currentIndex >= gameState.questions.length - 1;
}
function nextStep() {
  if (shouldEndGame()) { endGame(); return; }
  if (gameState.mode === 2) gameState.turn = nextAliveTurn();
  gameState.currentIndex += 1; renderQuestion();
}
function endGame() {
  clearInterval(timerInterval); sfx.gameOver();
  const p1 = gameState.players[0]; const p2 = gameState.players[1];
  p1FinalEl.textContent = `${p1.name}: ${p1.score} pts | vidas ${Math.max(0, p1.lives)} | aciertos ${p1.correct}`;
  p2FinalEl.textContent = gameState.mode === 2
    ? `${p2.name}: ${p2.score} pts | vidas ${Math.max(0, p2.lives)} | aciertos ${p2.correct}`
    : "Modo 1 jugador";
  finalAnsweredEl.textContent = `Preguntas respondidas: ${gameState.totalAnswered}`;
  finalCorrectEl.textContent = `Aciertos totales: ${gameState.totalCorrect}`;
  let winner = p1.name;
  if (gameState.mode === 2) {
    if (p2.score > p1.score) winner = p2.name;
    if (p1.score === p2.score) winner = "Empate tecnico";
  }
  winnerLineEl.textContent = winner === "Empate tecnico" ? winner : `Ganador: ${winner}`;
  if (winner !== "Empate tecnico") triggerConfetti(80);
  playerNameInput.value = winner === "Empate tecnico" ? p1.name : winner;
  renderScores(); showScreen(gameOverScreen);
}

function getScores() {
  try {
    const raw = localStorage.getItem(HIGH_SCORES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
function saveScore(name, score) {
  const arr = getScores(); const prevTop = arr[0] ? arr[0].score : -1;
  arr.push({ name: name.trim().slice(0, 18), score, date: new Date().toLocaleDateString("es-ES") });
  arr.sort((a, b) => b.score - a.score);
  const top = arr.slice(0, 10); localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(top));
  if (score > prevTop) { sfx.highScore(); triggerConfetti(40); }
}
function renderScores() {
  const arr = getScores(); scoreListEl.innerHTML = "";
  if (arr.length === 0) {
    const li = document.createElement("li"); li.textContent = "Sin puntajes guardados aun."; scoreListEl.appendChild(li); return;
  }
  arr.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = `${s.name} - ${s.score} pts (${s.date})`;
    scoreListEl.appendChild(li);
  });
}

startBtn.addEventListener("click", initGame);
restartBtn.addEventListener("click", () => { playerNameInput.value = ""; showScreen(startScreen); });
scoreForm.addEventListener("submit", (e) => {
  e.preventDefault(); initAudio();
  const name = playerNameInput.value.trim(); if (!name || !gameState) return;
  const score = Math.max(gameState.players[0].score, gameState.mode === 2 ? gameState.players[1].score : -1);
  saveScore(name, score); renderScores(); scoreForm.reset();
});
renderScores();