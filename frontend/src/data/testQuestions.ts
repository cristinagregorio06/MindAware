// Test questions for digital wellbeing assessment
// Based on 7 psychological dimensions: 
// 1. Digital self-esteem, 2. Digital loneliness, 3. Digital anxiety, 
// 4. Depression/discouragement, 5. Information panic, 6. Life satisfaction, 7. Future confidence

export interface TestQuestion {
  id: number;
  text: string;
  dimension: 'digital_self_esteem' | 'digital_loneliness' | 'digital_anxiety' | 'depression' | 'information_panic' | 'life_satisfaction' | 'future_confidence';
  reverse_scored?: boolean; // Some questions need reverse scoring
}

export const TEST_QUESTIONS: TestQuestion[] = [
  // Digital Self-Esteem (5 questions)
  {
    id: 1,
    text: "Siento que mi autoestima depende de los 'likes' o comentarios que recibo en redes sociales",
    dimension: 'digital_self_esteem'
  },
  {
    id: 2,
    text: "Me comparo constantemente con otros usuarios en redes sociales",
    dimension: 'digital_self_esteem'
  },
  {
    id: 3,
    text: "Me siento mal conmigo mismo/a cuando veo que otros tienen más seguidores o engagement que yo",
    dimension: 'digital_self_esteem'
  },
  {
    id: 4,
    text: "Mi estado de ánimo mejora cuando recibo validación en redes sociales",
    dimension: 'digital_self_esteem'
  },
  {
    id: 5,
    text: "Siento confianza en mí mismo/a independientemente de mi actividad en redes sociales",
    dimension: 'digital_self_esteem',
    reverse_scored: true
  },

  // Digital Loneliness (5 questions)
  {
    id: 6,
    text: "A pesar de estar conectado/a constantemente, me siento solo/a",
    dimension: 'digital_loneliness'
  },
  {
    id: 7,
    text: "Prefiero las interacciones digitales que las conversaciones cara a cara",
    dimension: 'digital_loneliness'
  },
  {
    id: 8,
    text: "Siento que mis relaciones online son más superficiales que las presenciales",
    dimension: 'digital_loneliness'
  },
  {
    id: 9,
    text: "Me cuesta mantener conversaciones profundas fuera del entorno digital",
    dimension: 'digital_loneliness'
  },
  {
    id: 10,
    text: "Tengo relaciones significativas y satisfactorias en mi vida offline",
    dimension: 'digital_loneliness',
    reverse_scored: true
  },

  // Digital Anxiety (5 questions)
  {
    id: 11,
    text: "Me pongo nervioso/a cuando no puedo revisar mi teléfono durante un tiempo prolongado",
    dimension: 'digital_anxiety'
  },
  {
    id: 12,
    text: "Las notificaciones constantes me generan estrés",
    dimension: 'digital_anxiety'
  },
  {
    id: 13,
    text: "Tengo miedo de perderme algo importante si no reviso constantemente mis redes sociales (FOMO)",
    dimension: 'digital_anxiety'
  },
  {
    id: 14,
    text: "Me siento ansioso/a cuando veo que alguien ha leído mi mensaje pero no ha respondido",
    dimension: 'digital_anxiety'
  },
  {
    id: 15,
    text: "Puedo desconectarme de mis dispositivos sin sentir ansiedad",
    dimension: 'digital_anxiety',
    reverse_scored: true
  },

  // Depression/Discouragement (5 questions)
  {
    id: 16,
    text: "Paso más tiempo del que me gustaría navegando en internet o redes sociales",
    dimension: 'depression'
  },
  {
    id: 17,
    text: "Uso la tecnología como una forma de escapar de problemas o emociones negativas",
    dimension: 'depression'
  },
  {
    id: 18,
    text: "Me siento cansado/a mentalmente después de pasar mucho tiempo frente a pantallas",
    dimension: 'depression'
  },
  {
    id: 19,
    text: "He perdido interés en actividades que antes disfrutaba debido al tiempo que paso online",
    dimension: 'depression'
  },
  {
    id: 20,
    text: "Tengo energía y motivación para realizar actividades fuera del mundo digital",
    dimension: 'depression',
    reverse_scored: true
  },

  // Information Panic (5 questions)
  {
    id: 21,
    text: "Me siento abrumado/a por la cantidad de información que recibo diariamente",
    dimension: 'information_panic'
  },
  {
    id: 22,
    text: "Las noticias negativas que veo online afectan significativamente mi estado de ánimo",
    dimension: 'information_panic'
  },
  {
    id: 23,
    text: "Tengo dificultades para distinguir entre información confiable y fake news",
    dimension: 'information_panic'
  },
  {
    id: 24,
    text: "Evito consumir noticias porque me generan ansiedad",
    dimension: 'information_panic'
  },
  {
    id: 25,
    text: "Puedo procesar la información que recibo sin sentirme saturado/a",
    dimension: 'information_panic',
    reverse_scored: true
  },

  // Life Satisfaction (5 questions)
  {
    id: 26,
    text: "Estoy satisfecho/a con la calidad de mi vida actual",
    dimension: 'life_satisfaction',
    reverse_scored: true
  },
  {
    id: 27,
    text: "Siento que el tiempo que paso en dispositivos digitales reduce mi bienestar general",
    dimension: 'life_satisfaction'
  },
  {
    id: 28,
    text: "Tengo dificultades para mantener un equilibrio saludable entre mi vida digital y personal",
    dimension: 'life_satisfaction'
  },
  {
    id: 29,
    text: "Mi uso de la tecnología interfiere con mi sueño o descanso",
    dimension: 'life_satisfaction' 
  },
  {
    id: 30,
    text: "Me siento realizado/a con mis logros y relaciones fuera del mundo digital",
    dimension: 'life_satisfaction',
    reverse_scored: true
  },

  // Future Confidence (5 questions)
  {
    id: 31,
    text: "Me siento optimista sobre mi futuro",
    dimension: 'future_confidence',
    reverse_scored: true
  },
  {
    id: 32,
    text: "Las comparaciones sociales en redes me hacen dudar de mis propias capacidades",
    dimension: 'future_confidence'
  },
  {
    id: 33,
    text: "Creo que podré alcanzar mis metas personales y profesionales",
    dimension: 'future_confidence',
    reverse_scored: true
  },
  {
    id: 34,
    text: "La exposición constante a contenido negativo online afecta mi perspectiva del futuro",
    dimension: 'future_confidence'
  },
  {
    id: 35,
    text: "Confío en mi capacidad para manejar los desafíos que puedan surgir",
    dimension: 'future_confidence',
    reverse_scored: true
  }
];

// Likert scale options
export const LIKERT_OPTIONS = [
  { value: 1, label: 'Totalmente en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Ni de acuerdo ni en desacuerdo' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Totalmente de acuerdo' }
];

// Dimension labels in Spanish
export const DIMENSION_LABELS = {
  digital_self_esteem: 'Autoestima Digital',
  digital_loneliness: 'Soledad Digital',
  digital_anxiety: 'Ansiedad Digital',
  depression: 'Desánimo/Depresión',
  information_panic: 'Pánico Informativo',
  life_satisfaction: 'Satisfacción Vital',
  future_confidence: 'Confianza en el Futuro'
};