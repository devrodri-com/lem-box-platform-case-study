# Roadmap de entrega

[English version](roadmap.md)

## Cómo leer este roadmap

Este roadmap define siete fases con gates para el compañero técnico de LEM-BOX. Deliberadamente no establece compromisos de fechas. Completar una fase no autoriza automáticamente la siguiente: cada gate de entrada debe confirmarse y cada gate de salida debe satisfacerse mediante revisión.

El sistema productivo privado permanece fuera de este roadmap. Todo material público debe crearse o seleccionarse para este compañero inicializado de forma independiente, sin historia Git de producción, y evaluarse conforme a los límites de [Alcance público y seguridad](public-scope-and-security.es.md).

Las Fases 1 a 4A están incluidas en el repositorio, revisadas, aceptadas y cerradas. La atestación dirigida de la Fase 4B para esta versión no encontró cambios materiales posteriores al baseline que afectaran las capturas 06 o 09, por lo que no fue necesario un refresh. La Fase 5 define los controles de auditoría, remediación acotada y revisión independiente de la versión exacta que debe superar cada candidato de lanzamiento. Las Fases 6 y 7 son operaciones externas con autorización separada; el árbol versionado no afirma ni autoriza su finalización. La cobertura del repositorio no satisface por sí sola un gate ni autoriza una fase posterior.

## Fase 1 — Base documental

**Cobertura del repositorio:** incluida, revisada, aceptada y cerrada.

### Objetivo

Establecer la identidad, el propósito, los límites públicos, el relato del caso, el roadmap y las decisiones fundamentales del compañero técnico.

### Contenido

- descripciones generales del repositorio en inglés y español;
- documentos del caso técnico en inglés y español;
- límites de alcance público y seguridad;
- este roadmap de entrega;
- registros de decisiones sobre historia, privacidad de producción y entrega centrada en documentación; y
- estado de licenciamiento, aviso, estado de contribuciones y guía para pull requests.

### Gate de entrada de la Fase 1

- existe un repositorio privado, inicializado de forma independiente y con una historia Git nueva;
- el sistema productivo permanece privado y sin cambios; y
- están definidos los hechos públicos autorizados y las categorías excluidas.

### Gate de salida

- todos los documentos fundamentales están completos y son coherentes en inglés y español;
- las afirmaciones públicas están sustentadas y revisadas;
- se validaron la independencia del repositorio y la ausencia de material excluido; y
- el trabajo fue revisado antes de incorporarse a la historia aprobada de la rama por defecto, sin autorizar el lanzamiento público.

### Exclusiones

- código, historia, datos, configuración o recursos de producción;
- diagramas de arquitectura, evidencia de flujos, ejemplos, fixtures o conjuntos de datos ficticios;
- capturas, imágenes, demos, despliegues o GitHub Pages; y
- un lanzamiento público o una promoción externa.

## Fase 2 — Arquitectura sanitizada y flujos seleccionados

**Cobertura del repositorio:** incluida, revisada, aceptada y cerrada.

### Objetivo

Explicar la plataforma en alto nivel y documentar un conjunto acotado de flujos sin exponer la implementación productiva ni detalles sensibles del negocio.

### Contenido

- contexto sanitizado del sistema y arquitectura de alto nivel;
- decisiones seleccionadas de producto y migración; y
- descripciones de flujos seleccionados dentro del alcance público aprobado.

### Gate de entrada de la Fase 2

- la Fase 1 está aprobada;
- cada elemento candidato de arquitectura y flujo tiene un propósito público definido; y
- el material de origen puede describirse sin copiar código, configuración, datos ni recursos de producción.

### Gate de salida

- cada pieza superó revisión individual, sanitización, escaneo de secretos, revisión de información personal y aprobación independiente de publicación;
- los diagramas y las descripciones no contienen identificadores productivos, integraciones privadas, reglas completas de autorización ni lógica sensible del negocio; y
- la documentación en inglés y español mantiene su coherencia.

### Exclusiones

- topología productiva detallada;
- modelos de datos, reglas de autorización o flujos operativos completos;
- identificadores de entornos productivos y configuración de despliegue; y
- detalles de integraciones privadas o de la implementación de pagos.

## Fase 3 — Datos ficticios y ejemplos técnicos reimplementados de forma independiente

**Cobertura del repositorio:** incluida, revisada, aceptada y cerrada.

### Objetivo

Incorporar evidencia técnica limitada que ilustre conceptos seleccionados sin trasladar código productivo ni datos reales.

### Contenido

- conjuntos de datos ficticios creados específicamente para este caso;
- ejemplos técnicos aislados y reimplementados de forma independiente para este repositorio;
- documentación que explica qué demuestra cada ejemplo; y
- una declaración explícita de los límites de cada ejemplo.

### Gate de entrada de la Fase 3

- la Fase 2 está aprobada;
- cada ejemplo candidato corresponde a un concepto público aprobado; y
- los datos ficticios pueden crearse sin conservar una correspondencia con personas, clientes, transacciones, envíos o información financiera reales.

### Gate de salida

- los ejemplos están aislados de producción y no contienen código productivo copiado ni lógica sensible del negocio;
- se confirmó que los conjuntos de datos son ficticios;
- el historial candidato completo supera el escaneo de secretos y la revisión de información personal; y
- cada pieza recibe aprobación independiente de publicación.

### Exclusiones

- código, fixtures, logs, exportaciones o esquemas de producción;
- datos reales o transformados de clientes, personal, envíos, pagos o información financiera;
- credenciales, identificadores, integraciones, prompts o configuración de despliegue de producción; y
- una aplicación equivalente al sistema productivo.

## Fase 4 — Evidencia visual versionada

**Cobertura del repositorio:** Current Web Snapshot v1 de la Fase 4A está incluido, revisado, aceptado y cerrado. La atestación dirigida de la Fase 4B para esta versión está completa. La Fase 4A2 y la evidencia móvil permanecen como trabajo futuro separado; la Fase 4B permanece como gate condicional para futuras actualizaciones públicas afectadas por cambios materiales.

### Objetivo

Publicar evidencia seleccionada de la interfaz únicamente como snapshots fechados y versionados, con datos visibles ficticios y límites explícitos de interpretación.

### Gate de entrada

- las Fases 1, 2 y 3 están revisadas, aceptadas y cerradas;
- el compañero permaneció privado durante la captura y la revisión;
- la fuente visual actual está identificada y verificada de forma privada;
- la superficie de captura está aislada de producción;
- todas las vistas pueden poblarse exclusivamente con datos ficticios creados para este fin;
- el propietario autoriza explícitamente iniciar el trabajo del snapshot;
- el alcance visual, el propósito de cada imagen planificada y la responsabilidad de revisión independiente están definidos antes de la captura; y
- Telegram, la evidencia móvil, la Fase 4A2, la Fase 4B y cualquier otra superficie futura permanecen fuera del alcance de la Fase 4A.

### Fase 4A — Current Web Snapshot v1

- nueve capturas seleccionadas de la interfaz web real de agosto de 2026;
- registros visibles creados expresamente como datos ficticios y sin derivación de datos productivos;
- documentación del snapshot en inglés y español, un manifest público seguro y decisiones sobre snapshots versionados; y
- trazabilidad privada de la fuente y registros de revisión conservados fuera del repositorio versionado.

La cobertura aceptada del repositorio registra únicamente el material del snapshot; los resultados de los tres gates siguientes se completaron por separado.

### Fase 4A2 — Revisión futura separada de evidencia

La Fase 4A2 permanece como una revisión futura separada de otra superficie operativa. Es opcional para la primera publicación pública, no ha comenzado y no forma parte de Current Web Snapshot v1. Puede incorporarse más adelante mediante sus propios gates de implementación acotada, revisión independiente y aprobación. Su ausencia no vuelve incompleto ni falso el caso técnico actual.

### Fase 4B — Atestación dirigida y refresh visual condicional

La atestación dirigida asociada con esta versión revisó las dos candidatas condicionales, `06-customer-history-photos.png` y `09-partner-workspace.png`, y no encontró cambios materiales posteriores al baseline; no fue necesario un refresh selectivo para esta versión.

Antes de cualquier actualización pública futura, la Fase 4B permanece como gate condicional. Los cambios materiales de navegación, identidad visual, composición principal, flujo, alcance por rol, capacidad visible, acción principal, estructura de datos presentada, experiencia según contexto de usuario o plataforma exigen una evaluación dirigida y, cuando corresponda, un reemplazo selectivo revisado o un snapshot nuevo.

### Evidencia móvil futura

La evidencia móvil permanece como una actualización futura separada con sus propios gates de fuente segura, datos ficticios, privacidad y revisión. La evidencia móvil es opcional y no es necesaria para la primera publicación pública. Puede incorporarse más adelante mediante sus propios gates de implementación acotada, revisión independiente y aprobación. Su ausencia no vuelve falso ni incompleto el snapshot web actual.

### Gates de salida consecutivos aceptados de la Fase 4A

La Fase 4A fue aceptada únicamente después de completar los siguientes gates en secuencia.

#### Gate A — Revisión independiente

La revisión independiente verificó:

- la procedencia;
- el aislamiento de producción;
- el uso exclusivo de datos ficticios creados para este fin;
- la privacidad;
- la calidad visual;
- los manifests;
- la documentación en inglés y español;
- el alcance definido; y
- la ausencia de información sensible.

La persona revisora independiente registró un dictamen técnico y cualquier hallazgo bloqueante. El dictamen favorable habilitó el paso del snapshot al Gate B sin sustituir la decisión visual del propietario ni ejecutar su aceptación.

#### Gate B — Aprobación visual del propietario

Rodrigo Opalo revisó las nueve capturas y registró `APPROVED`. Eso satisfizo el Gate B, pero no constituyó por sí solo una autorización para aceptar la versión del snapshot.

#### Gate C — Autorización de aceptación sobre una versión exacta

Solo después de superar el Gate A y registrar `APPROVED` en el Gate B sobre el mismo HEAD, el propietario del repositorio pudo emitir una autorización separada para aceptar únicamente esa versión exacta revisada. Cualquier cambio posterior sigue exigiendo una revisión proporcional antes de emitir una nueva autorización sobre una versión exacta.

### Exclusiones

- capturas provenientes de contextos autenticados de producción o de otros contextos inseguros;
- datos productivos reales, anonimizados, transformados, muestreados o exportados;
- afirmaciones no sustentadas de rendimiento, seguridad, escala, disponibilidad o negocio; y
- recursos de la Fase 4A2, del refresh de la Fase 4B o imágenes móviles en Current Web Snapshot v1.

## Fase 5 — Auditoría independiente de seguridad y publicación

**Cobertura del repositorio:** los hallazgos de auditoría y los requisitos de remediación acotada se reflejan en este árbol. La revisión independiente de la versión exacta permanece como control de lanzamiento para cada candidato, no como una afirmación permanente sobre el estado del contenido.

### Objetivo

Determinar si el repositorio completo del compañero técnico es apto para un lanzamiento público dentro del alcance documentado, remediar los hallazgos acotados y revalidar de manera independiente el candidato exacto.

### Contenido

- revisión de secretos en el árbol completo y en todo el historial;
- revisión de información personal y datos sensibles del negocio;
- revisión de afirmaciones, enlaces, licencia y documentación;
- verificación de Git y de la independencia del repositorio; y
- decisión de publicación con hallazgos bloqueantes y no bloqueantes claramente separados.

### Gate de entrada

- el contenido candidato para publicación está completo e inmovilizado para la auditoría;
- están disponibles todos los registros previos de revisión individual; y
- las decisiones de licencia y contribución están listas para ser evaluadas.

### Gate de salida de la remediación

Para cualquier candidato de lanzamiento, el gate se satisface únicamente cuando esa versión exacta cumple todo lo siguiente:

- cada hallazgo bloqueante está resuelto o el lanzamiento se detiene;
- el estado final del repositorio fue revalidado de forma independiente;
- existe una aprobación explícita de publicación; y
- el commit aprobado está identificado para el lanzamiento sin incorporar cambios que no hayan sido revisados.

### Exclusiones

- cambios en el sistema productivo;
- divulgación de hallazgos de seguridad o vulnerabilidades actuales o históricas;
- considerar una revisión documental como prueba de la seguridad de producción; y
- cambiar la visibilidad del repositorio durante la propia auditoría.

## Fase 6 — Lanzamiento público

**Cobertura del repositorio:** operación externa de lanzamiento; no es contenido del repositorio. Su finalización requiere autorización separada y no se afirma desde el árbol versionado.

### Objetivo

Publicar únicamente el commit aprobado por la auditoría independiente de seguridad y publicación.

### Contenido

- la documentación, arquitectura, flujos, ejemplos, datos ficticios y material visual aprobados;
- los límites finales de licencia y contribución; y
- metadatos públicos del repositorio coherentes con el alcance del caso técnico.

### Gate de entrada

- la Fase 5 concluye con una aprobación explícita;
- el commit aprobado permanece sin cambios;
- están completas las decisiones sobre licencia, aviso, contribuciones y reporte de seguridad; y
- la persona responsable de la publicación autoriza el cambio de visibilidad.

### Gate de salida

- el repositorio es públicamente accesible en el commit exacto aprobado;
- los metadatos públicos y los enlaces de documentación están verificados;
- no se expone ninguna rama, artefacto, release, paquete o despliegue que no haya sido revisado; y
- se supera una verificación posterior a la publicación de alcance y seguridad.

### Exclusiones

- código fuente, historia, datos, integraciones, lógica o configuración de producción;
- publicación automática de trabajo que no formaba parte del commit aprobado;
- un despliegue equivalente al sistema productivo; y
- cambios en LinkedIn o el portfolio dentro de esta misma fase.

## Fase 7 — Integración coordinada con LinkedIn y portfolio

**Cobertura del repositorio:** coordinación externa opcional; no es contenido del repositorio. Su finalización requiere autorización separada y no se afirma desde el árbol versionado.

### Objetivo

Conectar el compañero público aprobado con la presentación existente del caso mediante una actualización única y coherente en LinkedIn y el portfolio.

### Contenido

- enlaces concisos al compañero técnico público;
- redacción alineada sobre el rol de Rodrigo en operaciones, producto y desarrollo;
- una distinción clara entre el compañero público y el sistema productivo privado; y
- una verificación coordinada de los destinos actualizados.

### Gate de entrada

- la Fase 6 está completa;
- la URL del repositorio público y la estructura de documentación son estables;
- la redacción de LinkedIn y el portfolio fue revisada frente a las afirmaciones públicas aprobadas; y
- ambas actualizaciones están listas para publicarse como un único cambio coordinado.

### Gate de salida

- LinkedIn y el portfolio apuntan al compañero público previsto;
- las descripciones son precisas, coherentes y no contienen afirmaciones no sustentadas; y
- todos los enlaces y las rutas de presentación pública se verifican después de la actualización.

### Exclusiones

- promoción antes de que el repositorio supere la revisión de publicación;
- enlaces al sistema productivo privado;
- métricas, resultados o afirmaciones no sustentadas; y
- cambios no relacionados en el perfil, el sitio web, el despliegue o el producto.
