# LEM-BOX Platform — Caso técnico

[English version](case-study.md)

## 1. Contexto

LEM-BOX es una empresa logística real con operación entre Estados Unidos, Uruguay y Argentina. Su actividad requiere coordinar información operativa a través de esos países y conservar una visión consistente de cada proceso.

Rodrigo Opalo es fundador y responsable de la operación. También definió y desarrolló el ecosistema digital que la sostiene, por lo que el caso se observa desde una combinación concreta de operación, producto y desarrollo.

Este documento presenta el contexto y las decisiones generales del caso. No describe el sistema productivo completo ni funciona como documentación operativa.

## 2. Problema operativo

Una operación logística necesita relacionar cargas, clientes, pagos, roles y trazabilidad sin perder el contexto que une esos elementos. El problema de producto consiste en transformar esas necesidades en flujos comprensibles y mantenibles, con información disponible para las responsabilidades autorizadas en cada etapa.

La plataforma busca centralizar ese contexto. El caso público se concentra en cómo se define y evoluciona el producto, no en exponer datos, reglas internas o detalles comerciales.

## 3. Por qué no alcanzaba con una simple reescritura

La nueva plataforma reemplaza progresivamente un sistema anterior que forma parte de una operación activa. Una sustitución inmediata trataría el trabajo como un proyecto aislado de software y dejaría en segundo plano la continuidad del servicio, la adaptación de los flujos y la transición de quienes operan el sistema.

Por eso el esfuerzo no se plantea como una copia técnica ni como una reescritura total de una sola vez. Requiere entender el comportamiento existente, decidir qué debe preservarse, introducir capacidades de forma controlada y revisar su encaje operativo antes de avanzar.

## 4. Enfoque de migración progresiva

La migración prioriza la continuidad operativa, la seguridad y una evolución controlada por etapas. A nivel de producto, esto implica:

- partir de necesidades y procesos reales;
- delimitar capacidades que puedan evolucionar de manera controlada;
- permitir una transición progresiva desde el sistema anterior;
- mantener la trazabilidad como parte del flujo de trabajo;
- revisar cada incorporación antes de ampliar su alcance.

Este repositorio documenta únicamente decisiones y patrones aptos para publicación. La [arquitectura pública sanitizada](architecture.es.md) presenta la migración como un modelo conceptual y progresivo, y los [flujos públicos seleccionados](selected-workflows.es.md) utilizan actores y estados generalizados. Ninguno reconstruye la secuencia interna de cambios ni la configuración utilizada en producción.

## 5. Alcance de la plataforma

La plataforma centraliza cinco áreas generales del trabajo:

- cargas;
- clientes;
- pagos;
- roles;
- trazabilidad.

Estas áreas se mencionan para explicar el alcance del producto. El repositorio incluye la [arquitectura sanitizada de alto nivel](architecture.es.md) y los [flujos simplificados seleccionados](selected-workflows.es.md) de la Fase 2, ambos con límites públicos explícitos, y los [ejemplos técnicos reimplementados de manera independiente](technical-examples.es.md) de la Fase 3, sostenidos únicamente por [datos creados expresamente como ficticios](synthetic-data.es.md). El caso no documenta esquemas completos, reglas de negocio sensibles, datos reales ni implementaciones de pago o autorización.

## 6. Responsabilidades de producto y operación

El rol de Rodrigo combina tres perspectivas:

- **Operación:** reconocer necesidades, restricciones y prioridades del trabajo cotidiano.
- **Producto:** convertir ese contexto en flujos, criterios y una secuencia de evolución.
- **Desarrollo:** diseñar e implementar el ecosistema digital que materializa esas decisiones.

Esta combinación permite presentar el producto como una respuesta a una operación concreta. El caso no atribuye métricas, impactos financieros ni resultados que no puedan sustentarse públicamente.

## 7. Integraciones y herramientas internas

El ecosistema incluye integraciones y automatizaciones que acompañan la operación. También existen asistentes internos conectados a datos operativos y financieros autorizados.

El caso público sólo reconoce su existencia y su función general. Las integraciones privadas, los datos, los prompts, la implementación de asistentes y los mecanismos internos quedan fuera de alcance.

## 8. Consideraciones de seguridad y continuidad

La seguridad y la continuidad forman parte de la estrategia de migración, no son agregados editoriales del caso público. Cada material futuro deberá seleccionarse de manera que pueda explicar una decisión sin revelar credenciales, datos, identificadores productivos, reglas completas de autorización ni hallazgos internos.

Publicar una explicación de alto nivel tampoco equivale a validar el sistema productivo ni a reemplazar sus procesos privados de revisión. La documentación pública y la operación real permanecen deliberadamente separadas.

## 9. Qué demuestra este caso

Dentro de límites verificables, el caso permite observar:

- cómo una operación real se traduce en decisiones de producto y software;
- por qué una migración progresiva requiere considerar continuidad además de implementación;
- cómo se relacionan operación, producto y desarrollo cuando una misma responsabilidad atraviesa las tres áreas;
- cómo puede prepararse documentación técnica pública sin trasladar el repositorio ni el historial de producción.

No se presentan métricas, mejoras porcentuales, resultados económicos ni afirmaciones de escala.

## 10. Limitaciones actuales del caso público

La cobertura incluye la base documental de la Fase 1, la arquitectura sanitizada y los flujos de la Fase 2, los datos ficticios y ejemplos técnicos aislados de la Fase 3, y el snapshot web fechado aceptado de la Fase 4A. Las vistas seleccionadas de la interfaz web real, pobladas únicamente con datos ficticios creados expresamente, están disponibles en [Snapshot web actual v1](current-web-snapshot.es.md); permanecen como evidencia fechada y no afirman que la interfaz sea final.

Cualquier incorporación futura podrá ampliar el caso sólo después de aplicar estos cinco controles, en este orden:

1. Revisión individual.
2. Sanitización.
3. Análisis de secretos.
4. Revisión de datos personales.
5. Aprobación independiente para publicación.

Incluso entonces, este repositorio seguirá siendo una presentación técnica curada: no contendrá el sistema completo, no será equivalente a producción y no permitirá inferir su configuración interna.
