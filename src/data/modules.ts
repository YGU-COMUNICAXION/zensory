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
    materials: ["Un cuaderno de manifestación y pluma", "Cuenco tibetano"],
    materialsNote:
      "* Material opcional. Lo puedes adquirir conmigo o, si ya tienes uno, tenerlo a la mano para hacer diferentes prácticas.",
    modalContent: `
      <div class="space-y-6 text-base leading-relaxed text-accent/90">
        <section class="space-y-3">
          <h3 class="font-heading text-lg font-semibold text-accent">En este módulo:</h3>
          <ol class="space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-accent">1 .-</span><span>Nos presentaremos y abriremos el círculo de manifestación.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">2 .-</span><span>Realizaremos una meditación de sintonización energética con respiración consciente y cuencos tibetanos para preparar nuestro cuerpo, mente y alma a la manifestación.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">3 .-</span><span>Cerraremos con una reflexión y agradecimiento.</span></li>
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
            <li>Un cuaderno de manifestación y pluma</li>
            <li>Cuenco tibetano</li>
          </ul>
          <p class="text-sm italic text-accent/70">* Material opcional. Lo puedes adquirir conmigo o, si ya tienes uno, tenerlo a la mano para hacer diferentes prácticas.</p>
        </section>
      </div>
    `.trim(),
  },
  {
    number: 2,
    title: "Alineación y vibración consciente",
    subtitle: "Reconectar con el propósito",
    highlights: [
      "Realizarás un ejercicio escrito en una hoja con dos columnas: una para lo que no deseas atraer y otra para lo que sí.",
      "Llevarás a cabo un ritual de liberación con el sonido de los cuencos tibetanos y frases empoderadas para soltar lo que ya no funciona y reforzar lo que sí quieres atraer.",
      "Cortarás la hoja que está dividida y quemarás o romperás la parte negativa, dejando solamente la positiva.",
    ],
    location:
      "Un espacio seguro y tranquilo donde puedas escribir y realizar el ritual con calma. Puede ser tu escritorio o una mesa ventilada donde sea seguro encender una vela o usar un encendedor.",
    materials: [
      "Cuaderno de manifestación y pluma",
      "Hoja de trabajo descargable con las dos columnas para manifestar",
      "Tijeras para cortar la hoja",
      "Una vela, encendedor o cerillos para quemar la parte de lo que no deseas, con la opción de que si no la quieres quemar, también la podrías romper y tirar a la basura",
      "Tu cuenco tibetano opcional, pero recomendado para acompañar el ritual con vibración sanadora",
    ],
    modalContent: `
      <div class="space-y-6 text-base leading-relaxed text-accent/90">
        <section class="space-y-3">
          <h3 class="font-heading text-lg font-semibold text-accent">En este módulo:</h3>
          <ol class="space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-accent">1 .-</span><span>Realizarás un ejercicio escrito en una hoja con dos columnas: una para lo que no deseas atraer y otra para lo que sí.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">2 .-</span><span>Llevarás a cabo un ritual de liberación con el sonido de los cuencos tibetanos y frases empoderadas para soltar lo que ya no funciona y reforzar lo que sí quieres atraer.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">3 .-</span><span>Cortarás la hoja que está dividida y quemarás o romperás la parte negativa, dejando solamente la positiva.</span></li>
          </ol>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Lugar sugerido</h3>
          <p>
            Un espacio seguro y tranquilo donde puedas escribir y realizar el ritual con calma. Puede ser tu escritorio o una mesa ventilada donde sea seguro encender una vela o usar un encendedor.
          </p>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Material</h3>
          <ul class="space-y-1 list-disc pl-5">
            <li>Cuaderno de manifestación y pluma</li>
            <li>Hoja de trabajo descargable con las dos columnas para manifestar</li>
            <li>Tijeras para cortar la hoja</li>
            <li>Una vela, encendedor o cerillos para quemar la parte de lo que no deseas, con la opción de que si no la quieres quemar, también la podrías romper y tirar a la basura</li>
            <li>Tu cuenco tibetano opcional, pero recomendado para acompañar el ritual con vibración sanadora</li>
          </ul>
        </section>
      </div>
    `.trim(),
  },
  {
    number: 3,
    title: "Manifestación y vibración del aquí y ahora",
    subtitle: "Habitar el presente",
    highlights: [
      "Redactarás una carta de manifestación en positivo, presente y como si ya lo tuvieras.",
      "Practicarás la energía de la gratitud y aprenderás su importancia como puente para recibir más bendiciones.",
      "Potenciarás tu carta con el sonido de los cuencos tibetanos, integrándose en una meditación para magnificar su vibración.",
    ],
    location:
      "Un espacio tranquilo donde puedas escribir con calma y conectar contigo mismo. Puede ser tu rincón de meditación, tu habitación o cualquier lugar donde sientas paz y puedas concentrarte.",
    materials: [
      "Cuaderno de manifestación y una pluma",
      "La hoja del módulo 2 como guía de inspiración para tu carta de manifestación",
      "Hoja descargable con el ejemplo de una frase de cómo escribir en positivo, presente y como si ya lo tuvieras",
      "Si tienes un cuenco tibetano, tráelo para acompañar y amplificar la vibración de tu práctica",
    ],
    modalContent: `
      <div class="space-y-6 text-base leading-relaxed text-accent/90">
        <p>
          En este módulo aprenderás a manifestar tus sueños en positivo, en presente y como si ya estuvieran en tu vida. Cuando te
          enfocas en el futuro, aparece la ansiedad y la sensación de carencia. En cambio, al escribir como si ya lo tuvieras, te
          alineas con la vibración del aquí y el ahora, donde todo se manifiesta.
        </p>
        <section class="space-y-3">
          <h3 class="font-heading text-lg font-semibold text-accent">En este módulo:</h3>
          <ol class="space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-accent">1 .-</span><span>Redactarás una carta de manifestación en positivo, presente y como si ya lo tuvieras.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">2 .-</span><span>Practicarás la energía de la gratitud y aprenderás su importancia como puente para recibir más bendiciones.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">3 .-</span><span>Potenciarás tu carta con el sonido de los cuencos tibetanos, integrándose en una meditación para magnificar su vibración.</span></li>
          </ol>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Lugar sugerido</h3>
          <p>
            Un espacio tranquilo donde puedas escribir con calma y conectar contigo mismo. Puede ser tu rincón de meditación, tu habitación o cualquier lugar donde sientas paz y puedas concentrarte.
          </p>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Material</h3>
          <ul class="space-y-1 list-disc pl-5">
            <li>Cuaderno de manifestación y una pluma</li>
            <li>La hoja del módulo 2 como guía de inspiración para tu carta de manifestación</li>
            <li>Hoja descargable con el ejemplo de una frase de cómo escribir en positivo, presente y como si ya lo tuvieras</li>
            <li>Si tienes un cuenco tibetano, tráelo para acompañar y amplificar la vibración de tu práctica</li>
          </ul>
        </section>
      </div>
    `.trim(),
  },
  {
    number: 4,
    title: "Transformación consciente de creencias",
    subtitle: "Reescritura de patrones",
    highlights: [
      "Identificarás las creencias limitantes que bloquean tu energía y tu manifestación.",
      "Aprenderás a transformarlas en pensamientos y frases positivas para expandir tu energía.",
      "Utilizarás el poder del sound healing para liberar pensamientos negativos y anclar con frases empoderadas y positivas, repitiéndolas como decreto vibracional y energético.",
    ],
    location:
      "Un espacio íntimo y seguro donde puedas reflexionar sobre esas creencias limitantes, en calma y sin interrupciones.",
    materials: [
      "Cuaderno de manifestación y pluma",
      "Hoja especial para escribir las creencias limitantes que deseas soltar",
      "Hoja especial para escribir tus frases positivas y empoderadas",
      "Traer tu cuenco tibetano si lo tienes como opcional para acompañar el proceso de liberación y anclaje",
    ],
    modalContent: `
      <div class="space-y-6 text-base leading-relaxed text-accent/90">
        <p>
          Para que tu deseo se manifieste, es importante reconocer las creencias y pensamientos que te limitan, ya sea de forma
          consciente o inconsciente. En este módulo aprenderás a identificarlas y transformarlas a positivo, abriendo el camino
          a nuevas bendiciones.
        </p>
        <section class="space-y-3">
          <h3 class="font-heading text-lg font-semibold text-accent">En este módulo:</h3>
          <ol class="space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-accent">1 .-</span><span>Identificarás las creencias limitantes que bloquean tu energía y tu manifestación.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">2 .-</span><span>Aprenderás a transformarlas en pensamientos y frases positivas para expandir tu energía.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">3 .-</span><span>Utilizarás el poder del sound healing para liberar pensamientos negativos y anclar con frases empoderadas y positivas, repitiéndolas como decreto vibracional y energético.</span></li>
          </ol>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Lugar sugerido</h3>
          <p>
            Un espacio íntimo y seguro donde puedas reflexionar sobre esas creencias limitantes, en calma y sin interrupciones.
          </p>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Material</h3>
          <ul class="space-y-1 list-disc pl-5">
            <li>Cuaderno de manifestación y pluma</li>
            <li>Hoja especial para escribir las creencias limitantes que deseas soltar</li>
            <li>Hoja especial para escribir tus frases positivas y empoderadas</li>
            <li>Traer tu cuenco tibetano si lo tienes como opcional para acompañar el proceso de liberación y anclaje</li>
          </ul>
        </section>
      </div>
    `.trim(),
  },
  {
    number: 5,
    title: "Visualización consciente y sensorial",
    highlights: [
      "Practicarás la visualización consciente y sensorial, integrando imágenes y emociones para conectar profundamente con tu sueño.",
      "Realizarás una meditación guiada que te permitirá experimentar tu deseo como si ya fuera realidad, sintiendo cada emoción que genera.",
      "Darás forma a tu visión de manera creativa, mapeando los detalles sensoriales de tu manifestación con un vision board personal.",
    ],
    location:
      "Un espacio tranquilo en el que puedas meditar cómodamente, cerrar los ojos y dejar fluir tu imaginación y tus sensaciones.",
    materials: [
      "Un cuaderno de manifestación y pluma",
      "Colores, plumones, revistas, impresiones o materiales para crear tu vision board",
      "Un objeto significativo que simbolice tu sueño (imagen, fotografía o amuleto)",
      "Cuenco tibetano o campana (opcional) para acompañar la meditación y elevar la vibración",
    ],
    materialsNote:
      "*Material opcional. Puedes adquirirlo conmigo o, si ya tienes uno, tenlo a la mano para hacer diferentes prácticas.",
    modalContent: `
      <div class="space-y-6 text-base leading-relaxed text-accent/90">
        <p>
          Al visualizar y sentir eso que tu corazón desea, atraerás tu sueño de manera más clara y poderosa. La visualización no
          solamente es imaginarlo, sino experimentarlo con tus sentidos, sentir cómo vibra tu cuerpo, mente y alma por medio de una
          meditación guiada.
        </p>
        <section class="space-y-3">
          <h3 class="font-heading text-lg font-semibold text-accent">En este módulo:</h3>
          <ol class="space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-accent">1 -</span><span>Practicarás la visualización consciente y sensorial, integrando imágenes y emociones para conectar profundamente con tu sueño.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">2 -</span><span>Realizarás una meditación guiada que te permitirá experimentar tu deseo como si ya fuera realidad, sintiendo cada emoción que genera.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">3 -</span><span>Darás forma a tu visión de manera creativa, mapeando los detalles sensoriales de tu manifestación con un vision board personal.</span></li>
          </ol>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Lugar sugerido</h3>
          <p>
            Un espacio tranquilo en el que puedas meditar cómodamente, cerrar los ojos y dejar fluir tu imaginación y tus sensaciones.
          </p>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Material</h3>
          <ul class="space-y-1 list-disc pl-5">
            <li>Un cuaderno de manifestación y pluma</li>
            <li>Colores, plumones, revistas, impresiones o materiales para crear tu vision board</li>
            <li>Un objeto significativo que simbolice tu sueño (imagen, fotografía o amuleto)</li>
            <li>Cuenco tibetano o campana (opcional) para acompañar la meditación y elevar la vibración</li>
          </ul>
          <p class="text-sm italic text-accent/70">*Material opcional. Puedes adquirirlo conmigo o, si ya tienes uno, tenlo a la mano para hacer diferentes prácticas.</p>
        </section>
      </div>
    `.trim(),
  },
  {
    number: 6,
    title: "Soltar y confiar en la vibración divina",
    subtitle: "Entrega amorosa",
    highlights: [
      "Reflexionarás sobre la importancia de soltar el control para permitir que tus sueños se manifiesten.",
      "Practicarás el arte de confiar y rendirte a la fe y voluntad divina.",
      "Realizaremos una meditación guiada para soltar y confiar, conectando con tu fe y tus ángeles.",
      "Recibirás un mensaje divino a través de una carta de ángeles y kabbalah como recordatorio de que no estás solo en tu camino.",
    ],
    location:
      "Un espacio tranquilo y sagrado en donde te sientas abierta/o a la introspección, la meditación y la conexión espiritual.",
    materials: [
      "Cuaderno de manifestación y pluma",
      "Carta de ángeles (puede ser una carta de ángeles y kabbalah)",
      "Cuenco tibetano o campana (opcional) para complementar la meditación",
    ],
    materialsNote:
      "*Material opcional. Lo puedes adquirir conmigo o, si ya tienes uno, tenlo a la mano para hacer diferentes prácticas.",
    modalContent: `
      <div class="space-y-6 text-base leading-relaxed text-accent/90">
        <p>
          Cuando soltamos y confiamos, abrimos espacio para que la magia del universo actúe. La verdadera fe surge al rendirnos
          a la vibración divina del universo, confiando en que todo llega en su momento divino.
        </p>
        <section class="space-y-3">
          <h3 class="font-heading text-lg font-semibold text-accent">En este módulo:</h3>
          <ol class="space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-accent">1 -</span><span>Reflexionarás sobre la importancia de soltar el control para permitir que tus sueños se manifiesten.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">2 -</span><span>Practicarás el arte de confiar y rendirte a la fe y voluntad divina.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">3 -</span><span>Realizaremos una meditación guiada para soltar y confiar, conectando con tu fe y tus ángeles.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">4 -</span><span>Recibirás un mensaje divino a través de una carta de ángeles y kabbalah, como recordatorio de que no estás solo en tu camino.</span></li>
          </ol>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Lugar sugerido</h3>
          <p>
            Un espacio tranquilo y sagrado en donde te sientas abierta/o a la introspección, la meditación y la conexión espiritual.
          </p>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Material</h3>
          <ul class="space-y-1 list-disc pl-5">
            <li>Cuaderno de manifestación y pluma</li>
            <li>Carta de ángeles (puede ser una carta de ángeles y kabbalah)</li>
            <li>Cuenco tibetano o campana (opcional) para complementar la meditación</li>
          </ul>
          <p class="text-sm italic text-accent/70">*Material opcional. Lo puedes adquirir conmigo o, si ya tienes uno, tenlo a la mano para hacer diferentes prácticas.</p>
        </section>
      </div>
    `.trim(),
  },
  {
    number: 7,
    title: "Vibrar en gratitud consciente",
    subtitle: "Celebrar el camino",
    highlights: [
      "Reflexionarás sobre la importancia de agradecer y cómo la práctica diaria eleva tu vibración y atrae abundancia.",
      "Escribirás en tu cuaderno de manifestación agradeciendo por todo lo que tienes en tu vida aquí y ahora.",
      "Practicarás el hábito de la gratitud consciente y honrarás tus sueños, visualizando cómo agradecerás al universo.",
      "Realizaremos una meditación guiada de gratitud para anclar esta energía amorosa en tu corazón.",
    ],
    location:
      "Un espacio tranquilo y amoroso donde sientas calma y conexión; tu rincón favorito en casa, un jardín o un lugar sagrado que te inspire paz.",
    materials: [
      "Cuaderno de manifestación y pluma",
      "Hoja adicional o tarjetas para tu práctica diaria de gratitud",
      "Vela, incienso o spray de limpieza energética para crear el ambiente",
      "Cuenco tibetano o campana (opcional) para cerrar la práctica",
    ],
    materialsNote:
      "*Material opcional. Puedes adquirirlo conmigo o, si ya tienes uno, tenlo a la mano para acompañar tus rituales de gratitud.",
    modalContent: `
      <div class="space-y-6 text-base leading-relaxed text-accent/90">
        <p>
          Cuando agradecemos, nos damos cuenta de todo lo que tenemos en nuestra vida. La gratitud nos conecta con el presente,
          abre nuestro corazón y nos alinea con una frecuencia divina que nos llena de amor y abre las puertas para recibir más
          bendiciones.
        </p>
        <section class="space-y-3">
          <h3 class="font-heading text-lg font-semibold text-accent">En este módulo:</h3>
          <ol class="space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-accent">1 -</span><span>Reflexionarás sobre la importancia de agradecer y cómo esa práctica diaria eleva tu vibración y atrae abundancia.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">2 -</span><span>Escribirás en tu cuaderno de manifestación, agradeciendo por todo lo que tienes en tu vida aquí y ahora.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">3 -</span><span>Practicarás el hábito de la gratitud consciente y honrarás tus sueños, visualizando cómo agradecerás al universo.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">4 -</span><span>Realizaremos una meditación guiada de gratitud para anclar esta energía amorosa en tu corazón.</span></li>
          </ol>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Lugar sugerido</h3>
          <p>
            Un espacio tranquilo y amoroso donde sientas calma y conexión; tu rincón favorito en casa, un jardín o un lugar sagrado que te inspire paz.
          </p>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Material</h3>
          <ul class="space-y-1 list-disc pl-5">
            <li>Cuaderno de manifestación y pluma</li>
            <li>Hoja adicional o tarjetas para tu práctica diaria de gratitud</li>
            <li>Vela, incienso o spray de limpieza energética para crear el ambiente</li>
            <li>Cuenco tibetano o campana (opcional) para cerrar la práctica</li>
          </ul>
          <p class="text-sm italic text-accent/70">*Material opcional. Puedes adquirirlo conmigo o, si ya tienes uno, tenlo a la mano para acompañar tus rituales de gratitud.</p>
        </section>
      </div>
    `.trim(),
  },
  {
    number: 8,
    title: "Cierre mágico de manifestación con sonidos sagrados",
    subtitle: "Cierre del proceso",
    highlights: [
      "Integrarás todo lo trabajado en los módulos anteriores en una experiencia sonora única y transformadora.",
      "Vibrarás con la magia de los sonidos sagrados por medio de una meditación que abre tu corazón y te conecta con tu sueño.",
      "Manifestarás tu sueño desde un estado de certeza, gratitud y amor infinito.",
      "Compartirás tu experiencia y cerrarás el círculo compartido consciente del inicio del proceso.",
    ],
    location:
      "Escoge tu ceremonial sagrado, sala de meditación, jardín, habitación o cualquier lugar donde puedas expandirte y envolver tu ser.",
    materials: [
      "Cuenco tibetano o set de cuencos (flores, cuarzos, intenciones, vela)",
      "Hangpan o Jiuri Drum (si cuentas con ellos)",
      "Audio guía del módulo",
      "Manta ligera",
    ],
    materialsNote:
      "*Material opcional. Puedes adquirirlo conmigo o, si ya tienes uno, tenlo a la mano para hacer diferentes prácticas.",
    modalContent: `
      <div class="space-y-6 text-base leading-relaxed text-accent/90">
        <p>
          Integramos lo aprendido a través de una meditación sonora sagrada. Los cuencos tibetanos, el hangpan, el jiuri drum
          y otros instrumentos sagrados resuenan en tu alma para acompañarte a manifestar ese sueño de manera consciente y
          elevada. El sonido es oración, es frecuencia divina, es el lenguaje del alma. Con cada vibración, tu energía se alinea
          con el universo y tu manifestación se siembra en la realidad.
        </p>
        <section class="space-y-3">
          <h3 class="font-heading text-lg font-semibold text-accent">En este módulo:</h3>
          <ol class="space-y-2">
            <li class="flex gap-2"><span class="font-semibold text-accent">1 -</span><span>Integrarás todo lo trabajado en los módulos anteriores en una experiencia sonora única y transformadora.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">2 -</span><span>Vibrarás con la magia de los sonidos sagrados por medio de una meditación que abre tu corazón y te conecta con tu sueño.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">3 -</span><span>Manifestarás tu sueño desde un estado de certeza, gratitud y amor infinito.</span></li>
            <li class="flex gap-2"><span class="font-semibold text-accent">4 -</span><span>Compartirás tu experiencia y cerrarás el círculo compartido consciente del inicio del proceso.</span></li>
          </ol>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Lugar sugerido</h3>
          <p>
            Escoge tu ceremonial sagrado, sala de meditación, jardín, habitación o cualquier lugar donde puedas expandirte y
            envolver tu ser.
          </p>
        </section>
        <section class="space-y-2">
          <h3 class="font-heading text-lg font-semibold text-accent">Material</h3>
          <ul class="space-y-1 list-disc pl-5">
            <li>Cuenco tibetano o set de cuencos (flores, cuarzos, intenciones, vela)</li>
            <li>Hangpan o Jiuri Drum (si cuentas con ellos)</li>
            <li>Audio guía del módulo</li>
            <li>Manta ligera</li>
          </ul>
          <p class="text-sm italic text-accent/70">*Material opcional. Puedes adquirirlo conmigo o, si ya tienes uno, tenlo a la mano para hacer diferentes prácticas.</p>
        </section>
      </div>
    `.trim(),
  },
];

export const MODULES = MODULE_DEFINITIONS.map((module) => ({
  ...module,
  modalContent: module.modalContent ?? createDefaultModalContent(module),
}));

export type Module = (typeof MODULES)[number];
