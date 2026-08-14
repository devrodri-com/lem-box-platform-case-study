# Alcance público y seguridad

[English version](public-scope-and-security.md)

**Estado:** límites de publicación aplicados a las Fases 1 a 4A aceptadas y a toda actualización pública futura.

## Propósito

Este documento establece los límites de publicación del compañero técnico de LEM-BOX. El compañero tiene una historia Git independiente y está separado del sistema productivo privado. Su propósito es presentar un caso técnico seleccionado, no distribuir ni reconstruir la plataforma productiva.

La presencia de una categoría dentro del alcance no significa que futuras incorporaciones estén aprobadas automáticamente. La cobertura incluye la base documental aceptada de la Fase 1, la arquitectura y los flujos de la Fase 2, los fixtures ficticios y ejemplos reimplementados de manera independiente de la Fase 3, y Current Web Snapshot v1 de la Fase 4A.

## Dentro del alcance

Las siguientes categorías podrán incluirse en futuras actualizaciones públicas únicamente después de una revisión individual:

- contexto del sistema en alto nivel;
- documentación de arquitectura de alto nivel;
- decisiones de producto seleccionadas;
- estrategia de migración;
- flujos de trabajo seleccionados;
- enfoque de pruebas;
- material visual sanitizado;
- conjuntos de datos completamente ficticios;
- ejemplos aislados y revisados; y
- documentación técnica destinada al público.

Todo material deberá explicar el caso sin reproducir el sistema productivo ni revelar información operativa sensible.

El contenido de la Fase 2 incluye [arquitectura pública sanitizada y no exhaustiva](architecture.es.md) y [flujos públicos seleccionados y simplificados](selected-workflows.es.md). La Fase 3 incluye [ejemplos técnicos públicos](technical-examples.es.md) y [datos creados expresamente como ficticios](synthetic-data.es.md). La Fase 4A incluye [Snapshot web actual v1](current-web-snapshot.es.md) como evidencia visual fechada aceptada; la evidencia completa de flujos y cualquier demo permanecen fuera de este repositorio.

## Fuera del alcance

El repositorio no contendrá:

- código fuente de producción;
- historial Git de producción;
- datos de producción;
- credenciales;
- datos de clientes;
- datos de personal;
- datos financieros;
- integraciones privadas;
- implementación de pagos;
- scripts administrativos;
- reglas completas de autorización;
- identificadores de entornos productivos;
- configuración de despliegue;
- prompts internos;
- implementación de asistentes;
- precios operativos;
- lógica sensible del negocio;
- hallazgos de seguridad;
- vulnerabilidades actuales o históricas.

Estas exclusiones se aplican a archivos visibles, historial Git, metadatos, ejemplos, capturas, logs, comentarios y material generado, incluso cuando un elemento de origen parezca inofensivo de forma aislada. El contenido debe evaluarse en contexto, incluida la información que podría inferirse al combinarlo con otro material público.

## Revisión obligatoria para futuras incorporaciones

Cada incorporación futura requiere los cinco controles siguientes:

1. **Revisión individual** — evaluar el archivo o cambio específico y su contexto; la aprobación de una categoría no es suficiente.
2. **Sanitización** — eliminar o reemplazar detalles privados, identificatorios, sensibles para la operación o vinculados con producción.
3. **Análisis de secretos** — comprobar el contenido candidato y su historia Git independiente en busca de credenciales o material similar antes de la publicación.
4. **Revisión de datos personales** — confirmar que no existan datos de clientes, personal u otras personas, ni combinaciones que permitan inferirlos.
5. **Aprobación independiente para publicación** — obtener una decisión explícita de una persona revisora que no haya preparado el material.

Superar un control no reemplaza a los demás. Un material puede seguir siendo inadecuado para publicación por su contexto, procedencia o nivel de detalle, incluso cuando sea técnicamente correcto.

Cualquier material candidato con un hallazgo bloqueante sin resolver permanece excluido. Sólo podrá reconsiderarse después de resolver el hallazgo, repetir las validaciones aplicables y obtener una nueva aprobación independiente de publicación.

El material candidato debe permanecer fuera de una actualización pública aprobada hasta completar los cinco controles. Los controles deben revalidarse sobre el candidato de lanzamiento exacto antes de publicarlo.

## Datos y ejemplos

Los fixtures de la Fase 3 son completamente ficticios. Sus ejemplos técnicos están aislados y fueron reimplementados de manera independiente para este repositorio; ninguno se copió desde producción.

Los nombres, identificadores, eventos y valores utilizados en los ejemplos deben ser ficticios y no conservar correspondencia con datos operativos reales. Los ejemplos no deben codificar lógica completa o sensible del negocio ni reconstruir integraciones privadas.

No se anonimizaron, transformaron, muestrearon ni exportaron datos de producción para crear estos fixtures. La validación aplica el namespace público, la ventana temporal, las estructuras cerradas y las exclusiones de contenido sensible descritas en [Datos ficticios](synthetic-data.es.md).

## Evidencia visual

La evidencia visual sólo puede incluirse como snapshots fechados, versionados y sanitizados provenientes de una fuente segura, con registros visibles creados expresamente como datos ficticios. Las capturas y los datos de producción permanecen excluidos, y difuminar datos productivos no vuelve elegible una captura.

Current Web Snapshot v1 está incluido como evidencia fechada aceptada. Una atestación dirigida de la Fase 4B para esta versión no encontró cambios materiales posteriores al baseline en las dos vistas candidatas condicionales, por lo que no fue necesario un refresh selectivo. Cualquier cambio material futuro en una superficie representada deberá superar los mismos gates de refresh condicional, privacidad, manifest y revisión independiente. La evidencia móvil y la Fase 4A2 permanecen como trabajo futuro separado.

## Integraciones y asistentes internos

El caso público puede indicar que el ecosistema incluye integraciones, automatizaciones y asistentes internos conectados a datos operativos y financieros autorizados. No identificará integraciones privadas ni expondrá su implementación, prompts, datos conectados, flujos completos o detalles financieros.

## Separación respecto de producción

Este compañero no es un fork, mirror, clon sanitizado, distribución ni reconstrucción completa del sistema productivo. La historia Git de producción nunca se importará ni transferirá al compañero, y tampoco se reescribirá para trasladarla. No se copiarán commits, ramas, referencias de pull requests ni objetos Git de producción. Todo contenido público se incorporará únicamente mediante la historia independiente del compañero y cada incorporación se revisará individualmente.

Los futuros ejemplos deberán permanecer aislados y revisados; los datos deberán seguir siendo ficticios y el material visual deberá provenir de fuentes seguras.

La documentación pública podrá describir decisiones de alto nivel, pero no servirá como fuente para configurar, acceder, desplegar u operar el sistema productivo.

## Seguridad, publicación y licencia

La visibilidad pública no convierte al compañero en el sistema productivo, un equivalente ejecutable ni una distribución de código abierto; tampoco constituye una afirmación sobre la seguridad de producción ni otorga permiso general para reutilizar documentación, imágenes o ejemplos. Los límites de derechos se definen en [Licenciamiento](licensing.md). El sistema productivo permanece privado. Toda actualización pública futura deberá superar la revisión de seguridad y publicación aplicable y recibir aprobación explícita.
