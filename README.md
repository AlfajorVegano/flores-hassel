# Para Hassel · 21 de septiembre de 2026

Dedicatoria de Alexis para Hassel Alejandra Mirada Aliaga. Sitio estático sin dependencias ni descargas externas.

Abrir `index.html` en un navegador o servir esta carpeta con `python -m http.server 8080`.

Al abrir el regalo, cinco escenas muestran el mensaje solicitado: agradecimiento, lluvia, nieve, tormentas de arenas y «TE AMO», con la firma «TE AMA - ALEXIS -». El ramo SVG original se conserva. Las partículas y el ambiente cambian con cada frase. La secuencia dura unos 23 segundos y el cierre permanece visible.

Controles: pausar/continuar, avanzar, repetir y activar/desactivar la melodía original sintetizada. La música comienza al tocar Abrir o Continuar, con volumen inicial del 80 %. Al cambiar de pestaña, la secuencia y el sonido se suspenden. Se guarda el progreso localmente por código de regalo para continuar al regresar.

Diseño adaptable a móvil y escritorio. Full motion está activado por defecto. Se puede reducir el movimiento con el botón superior o con `?motion=off`. En ese modo se mantienen las escenas y la lectura, sin movimiento decorativo.

Para publicar, subir los archivos estáticos junto con `.nojekyll` y los avisos de terceros. Se conservan `THIRD_PARTY_RESOURCES.md` y `THIRD_PARTY_LICENSES.md` por la base de animación original.

## Full motion

El botón superior alterna entre todos los efectos y movimiento suave. `?motion=full` activa los efectos completos al abrir el enlace; `?motion=off` los desactiva. Sin parámetro se activa Full motion o se recupera la elección guardada para ese código.

Incluye pétalos dorados con giro y profundidad, movimiento independiente de cabezas y hojas, sombras, lazo y envoltorio animados, luz ambiental y una nueva lluvia de pétalos al llegar a «TE AMO». La pausa también detiene estos efectos. El botón de repetición vuelve a dibujar el crecimiento del ramo.

El paquete `flores-hassel-github-pages.zip` contiene los siete archivos necesarios para publicar, incluida `.nojekyll`. Extraer y subir su contenido a la raíz del repositorio, no el ZIP. No se necesita compilación ni servidor backend.


## Códigos y regreso

- Hassel: https://alfajorvegano.github.io/flores-hassel/?g=861405297314
- Pruebas de Alexis: https://alfajorvegano.github.io/flores-hassel/?g=alexis-test-2026
- Reiniciar solo la prueba: https://alfajorvegano.github.io/flores-hassel/?g=alexis-test-2026&reset=1

La primera visita requiere tocar «Abrir mi regalo»; las escenas avanzan automáticamente. Al regresar se ofrece continuar la escena guardada o empezar de nuevo. Si se llegó al cierre, el botón lleva al ramo final. Los controles tienen áreas táctiles de al menos 52 px.

El código separa el progreso, el tiempo dentro de cada escena y la preferencia de movimiento en localStorage. Se guarda cada segundo y al salir. Funciona por navegador, dispositivo y origen: las pruebas en localhost no afectan a GitHub Pages. Si se borran los datos o se usa otro dispositivo, empieza una visita nueva. Sin almacenamiento disponible la experiencia sigue funcionando, sin recordar visitas. El código no autentica personas ni hace privado un sitio público.

Full motion está activo por defecto incluso si el sistema solicita movimiento reducido, según la configuración solicitada para este regalo. El botón permite desactivarlo; esa elección se recuerda. Un parámetro explícito `motion=full` o `motion=off` prevalece al abrir la página. El sonido se activa al abrir el regalo, salvo que se haya silenciado expresamente antes de abrirlo.


## Música mejorada

Composición original sintetizada: melodía de 32 notas, acompañamiento arpegiado y bajos. Timbre triangular con armónicos suaves, envolventes sin clics y compresión dinámica para controlar los picos. No requiere recursos externos ni nuevas licencias. Control de volumen 0–100 % y botón explícito para activar/silenciar. Se inicia mediante el toque en Abrir/Continuar, necesario para que los navegadores permitan reproducir audio. Se suspende al ocultar la pestaña.
