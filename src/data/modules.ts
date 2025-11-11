export type ModuleDefinition = {
  number: number;
  title: string;
  subtitle?: string;
  highlights: string[];
  location?: string;
  materials?: string[];
  materialsNote?: string;
  modalContent?: string;
};

const createDefaultModalContent = (module: ModuleDefinition) => {
  const sections: string[] = [];

  if (module.highlights?.length) {
    sections.push(`
      <section class="space-y-3">
        <h3 class="font-heading text-lg font-semibold text-accent">En este módulo:</h3>
        <ol class="space-y-2 text-base leading-relaxed text-accent/90">
          ${module.highlights
            .map(
              (highlight, idx) =>
                `<li class=\"flex gap-2\"><span class=\"font-semibold text-accent\">${idx + 1}.</span><span>${highlight}</span></li>`
            )
            .join("")}
        </ol>
      </section>
    `);
  }

  if (module.location) {
    sections.push(`
      <section class="space-y-2">
        <h3 class="font-heading text-lg font-semibold text-accent">Lugar sugerido</h3>
        <p>${module.location}</p>
      </section>
    `);
  }

  if (module.materials?.length) {
    sections.push(`
      <section class="space-y-2">
        <h3 class="font-heading text-lg font-semibold text-accent">Material sugerido</h3>
        <ul class="space-y-1 list-disc pl-5 text-base leading-relaxed text-accent/80">
          ${module.materials.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        ${module.materialsNote ? `<p class=\"text-sm italic text-accent/70\">${module.materialsNote}</p>` : ""}
      </section>
    `);
  }

  return `<div class="space-y-6">${sections.join("")}</div>`;
};

const MODULE_DEFINITIONS: ModuleDefinition[] = [
  {
    number: 1,
    title: "Sintonización energética",
    subtitle: "Introducción y apertura del círculo",
    highlights: [
      "Nos presentaremos y abriremos el círculo de manifestación.",
      "Realizaremos una meditación de sintonización energética con respiración consciente y cuencos tibetanos para preparar nuestro cuerpo, mente y alma a la manifestación.",
      "Cerraremos con una reflexión y agradecimiento.",
    ],
    location:
      "Prepara un espacio cómodo y tranquilo. Puede ser un lugar donde te sientas en paz, ya sea sentado en una silla o un cojín, o acostado sobre una colchoneta o cama. Lo importante es que tu cuerpo esté relajado y tu mente pueda enfocarse en la meditación.",
    materials: ["Un cuaderno de manifestación y pluma.", "Cuenco tibetano*"],
    materialsNote:
      "*Material opcional. Puedes adquirirlo conmigo o, si ya tienes uno, tenlo a la mano para hacer prácticas adicionales.",
    modalContent: `
      <div class="space-y-6 text-base leading-relaxed text-accent/90">
        <section class="space-y-3">
          <h3 class="font-heading text-lg font-semibold text-accent">En este módulo:</h3>
          <ol class="space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-accent">1 -</span><span>Nos presentaremos y abriremos el círculo de manifestación.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">2 -</span><span>Realizaremos una meditación de sintonización energética con respiración consciente y cuencos tibetanos para preparar nuestro cuerpo, mente y alma a la manifestación.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">3 -</span><span>Cerraremos con una reflexión y agradecimiento.</span></li>
          </ol>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Lugar sugerido</h3>
          <p>
            Prepara un espacio cómodo y tranquilo. Puede ser un lugar donde te sientas en paz, ya sea sentado en una silla o un cojín,
            o acostado sobre una colchoneta o cama. Lo importante es que tu cuerpo esté relajado y tu mente pueda enfocarse en la meditación.
          </p>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Material</h3>
          <ul class="space-y-1 list-disc pl-5">
            <li>Un cuaderno de manifestación y pluma.</li>
            <li>Cuenco tibetano (opcional), o si ya tienes uno, te invitamos a tenerlo a la mano para practicar.</li>
          </ul>
        </section>
      </div>
    `.trim(),
  },
  {
    number: 2,
    title: "Alineación y vibración consciente",
    subtitle: "Reconectar con el propósito",
    highlights: [
      "Exploramos nuestra intención principal de manifestación.",
      "Practicamos visualizaciones activas para elevar la vibración.",
      "Integramos afirmaciones para sostener la energía.",
    ],
    materials: ["Cuaderno de manifestación", "Velas o inciensos (opcional)"],
  },
  {
    number: 3,
    title: "Manifestación y vibración del aquí y ahora",
    subtitle: "Habitar el presente",
    highlights: [
      "Identificamos pensamientos y emociones que sostienen el deseo.",
      "Utilizamos el sonido como ancla al presente.",
      "Creamos un ritual personal de manifestación diaria.",
    ],
    materials: ["Cuaderno de manifestación"],
  },
  {
    number: 4,
    title: "Transformación consciente de creencias",
    subtitle: "Reescritura de patrones",
    highlights: [
      "Reconocemos creencias limitantes que frenan el proceso.",
      "Aplicamos técnicas de liberación con sonido y respiración.",
      "Diseñamos nuevas declaraciones que expanden nuestra realidad.",
    ],
    materials: ["Cuaderno de manifestación", "Tarjetas o post-its"],
  },
  {
    number: 5,
    title: "Visualización sensorial del sueño",
    subtitle: "Expansión imaginativa",
    highlights: [
      "Integramos los sentidos en la visualización consciente.",
      "Exploramos el viaje sonoro como portal creativo.",
      "Creamos un mapa sensorial de manifestación.",
    ],
    materials: ["Cuaderno de manifestación", "Elementos sensoriales (opcional)"],
  },
  {
    number: 6,
    title: "Soltar y confiar en el proceso",
    subtitle: "Entrega amorosa",
    highlights: [
      "Identificamos apegos que dificultan la manifestación.",
      "Practicamos meditaciones para soltar con amor.",
      "Anclamos una nueva relación con la confianza.",
    ],
    materials: ["Cuaderno de manifestación"],
  },
  {
    number: 7,
    title: "Vibrar en gratitud consciente",
    subtitle: "Celebrar el camino",
    highlights: [
      "Profundizamos en la gratitud como estado vibracional.",
      "Creamos rituales de agradecimiento diario.",
      "Compartimos testimonios y descubrimientos.",
    ],
    materials: ["Cuaderno de manifestación", "Pluma"],
  },
  {
    number: 8,
    title: "Integración y manifestación celebrada",
    subtitle: "Cierre del proceso",
    highlights: [
      "Integramos aprendizajes y resonancias de cada módulo.",
      "Diseñamos un plan de acción alineado con el sueño.",
      "Celebramos la manifestación con un viaje sonoro final.",
    ],
    materials: ["Cuaderno de manifestación", "Elemento simbólico personal"],
  },
];

export const MODULES = MODULE_DEFINITIONS.map((module) => ({
  ...module,
  modalContent: module.modalContent ?? createDefaultModalContent(module),
}));

export type Module = (typeof MODULES)[number];
