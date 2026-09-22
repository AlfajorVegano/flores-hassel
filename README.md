# Para Hassel · 21 de septiembre de 2026

Dedicatoria de Alexis para Hassel Alejandra Mirada Aliaga. Sitio estático sin dependencias ni descargas externas.

Abrir `index.html` en un navegador o servir esta carpeta con `python -m http.server 8080`.

Al abrir el regalo, cinco escenas muestran el mensaje solicitado: agradecimiento, lluvia, nieve, tormentas de arenas y «TE AMO», con la firma «TE AMA - ALEXIS -». El ramo SVG original se conserva. Las partículas y el ambiente cambian con cada frase. La secuencia dura unos 23 segundos y el cierre permanece visible.

Controles: pausar/continuar, avanzar, repetir y activar/desactivar la melodía original sintetizada. El audio está apagado inicialmente. Al cambiar de pestaña, la secuencia y el sonido se suspenden. Cada visita permite ver el regalo completo; no se guardan datos.

Diseño adaptable a móvil y escritorio. Se respeta la preferencia de movimiento reducido, también disponible con `?motion=off`. En ese modo se mantienen las escenas y la lectura, sin movimiento decorativo.

Para publicar, subir los archivos estáticos junto con `.nojekyll` y los avisos de terceros. Se conservan `THIRD_PARTY_RESOURCES.md` y `THIRD_PARTY_LICENSES.md` por la base de animación original.

## Full motion

El botón superior alterna entre todos los efectos y movimiento suave. `?motion=full` activa los efectos completos al abrir el enlace; `?motion=off` los desactiva. Sin parámetro se respeta la preferencia de accesibilidad del dispositivo.

Incluye pétalos dorados con giro y profundidad, movimiento independiente de cabezas y hojas, sombras, lazo y envoltorio animados, luz ambiental y una nueva lluvia de pétalos al llegar a «TE AMO». La pausa también detiene estos efectos. El botón de repetición vuelve a dibujar el crecimiento del ramo.

El paquete `flores-hassel-github-pages.zip` contiene los siete archivos necesarios para publicar, incluida `.nojekyll`. Extraer y subir su contenido a la raíz del repositorio, no el ZIP. No se necesita compilación ni servidor backend.
