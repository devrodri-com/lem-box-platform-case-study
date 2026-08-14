# Plataforma LEM-BOX — Ejemplos técnicos públicos

[English version](technical-examples.md)

> Estos son ejemplos públicos de referencia con vocabulario y datos ficticios, reimplementados de manera independiente a partir de la arquitectura y los flujos públicos aprobados. No son código fuente ni permisos de producción, ni una implementación completa del negocio productivo.

## 1. Propósito

La Fase 3 incluye un conjunto acotado de evidencia técnica ejecutable aceptada para el caso. Los ejemplos muestran modelado de dominio, validación explícita de transiciones, decisiones con denegación por defecto, separación de responsabilidades, normalización de información externa, minimización de campos, inmutabilidad y capacidad de prueba. Su propósito es pedagógico: vuelven concretos algunos conceptos de la Fase 2 sin reconstruir la plataforma privada.

## 2. Independencia respecto de producción

Los módulos y sus pruebas se escribieron desde cero para este repositorio. Se basan únicamente en la arquitectura pública sanitizada y los flujos públicos seleccionados ya aprobados, junto con nuevas decisiones ficticias tomadas para la Fase 3.

No se leyó ni copió código, pruebas, fixtures, esquemas, configuraciones, rutas, reglas, identidades o historial Git de producción. No se anonimizaron, transformaron, muestrearon, exportaron ni incluyeron datos de producción. Los nombres públicos de actores, recursos, acciones, estados, eventos, categorías de consulta, campos y códigos de resultado no reproducen vocabulario productivo. No se busca ni se afirma equivalencia funcional.

## 3. Herramientas

Las herramientas están aisladas dentro de [`examples/`](../examples/):

- TypeScript estricto con resolución ESM moderna para Node.js;
- Vitest para pruebas automatizadas locales;
- tipos de Node.js para el validador de solo lectura; y
- versiones exactas de dependencias de desarrollo registradas en el lockfile.

El paquete no tiene dependencias de ejecución, framework web, biblioteca de autorización, SDK externo, biblioteca de sistemas generativos ni herramientas cloud. La ejecución de los ejemplos no requiere acceso a red.

## 4. Estructura de directorios

```text
examples/
  src/
    shared/
    shipment-lifecycle.ts
    role-scoped-access.ts
    tracking-timeline.ts
    scoped-internal-query.ts
    synthetic-fixture-validator.ts
  test/
fixtures/
  synthetic/
```

Los módulos exponen funciones pequeñas y tipadas. Las pruebas permanecen dentro del paquete aislado, mientras que los fixtures quedan en el nivel del repositorio para que su condición ficticia sea visible sin depender de las herramientas.

## 5. Ejemplo de ciclo de vida de una carga

El módulo utiliza un conjunto inventado de estados para demostrar la validación mediante funciones puras. Una transición válida crea un nuevo valor y agrega al historial mínimo el timestamp recibido del llamador. Una transición inválida o desde un estado terminal devuelve un rechazo tipado, sin modificar el valor original.

El grafo es incompleto y deliberadamente ficticio. No representa el modelo de estados productivo y omite trazabilidad, atributos físicos, tarifas, pagos, información de clientes, lotes, persistencia, notificaciones y efectos externos.

## 6. Ejemplo de acceso acotado por rol

El módulo recibe actor, recurso, acción, alcance del actor y alcance del recurso. Devuelve una decisión explícita con un código ficticio y una explicación pública breve. Valida el contexto completo y rechaza combinaciones desconocidas, incompletas, entre alcances distintos o no incluidas expresamente.

La matriz es deliberadamente limitada: un nombre de rol coincidente nunca concede acceso universal, el administrador del negocio conserva un alcance acotado y una referencia de estado financiero sólo permite lecturas estrechamente autorizadas. Es una decisión ilustrativa con denegación por defecto; no es autenticación, una capa de enforcement ni lógica de autorización productiva.

## 7. Ejemplo de línea de tiempo de trazabilidad

El módulo recibe eventos ya ficticios y neutrales respecto de proveedores. Valida timestamps y tipos, transforma los eventos aceptados en etapas públicas generalizadas, elimina duplicados equivalentes, ordena cronológicamente de manera determinista, preserva mensajes ficticios seguros y registra rechazos sin modificar la entrada.

No contiene couriers, identificadores reales de trazabilidad, ubicaciones, códigos externos, requests, webhooks ni mappings de proveedores. El mapping público se inventó para este ejemplo y no es un modelo productivo de eventos.

## 8. Ejemplo de límite para consultas internas acotadas

El módulo recibe un actor, una categoría, un alcance y campos solicitados, todos ficticios. Devuelve campos permitidos y rechazados junto con un plan abstracto que no contiene fuentes ni datos del negocio. Sólo pueden atravesar el límite los campos públicos documentados para cada categoría; se eliminan los campos desconocidos o sensibles y un contexto inválido no genera plan.

El ejemplo demuestra el límite de una consulta acotada. No es una implementación de un asistente y no describe el asistente productivo, su proveedor, prompts ni controles de acceso a datos.

No ejecuta consultas, no genera lenguaje natural, no toma decisiones generativas ni autónomas sobre el negocio, no identifica fuentes de datos y no afirma capacidades de IA. Su única decisión es el límite determinista de contexto y campos descrito arriba.

## 9. Validación de fixtures

El validador de solo lectura comprueba los seis JSON ubicados en [`fixtures/synthetic/`](../fixtures/synthetic/). Aplica el namespace `demo-`, la ventana UTC documentada para 2030, estructuras exactas por archivo, vocabulario ficticio aprobado, claves prohibidas y patrones de valores sospechosos. Los errores indican un código seguro, el archivo y la ruta JSON sin imprimir el valor completo.

La validación no accede a la red ni modifica archivos. La política se describe en [Datos ficticios](synthetic-data.es.md).

## 10. Ejecución

Se requiere Node.js `>=20.19.0 <21`. Validado con Node.js 20.19.4 y npm 9.9.4. Desde `examples/`:

```sh
npm ci
npm run validate
```

El comando combinado ejecuta el typecheck, todas las suites y la validación específica de fixtures. El [README de ejemplos](../examples/README.md) incluye los comandos individuales.

## 11. Qué demuestran los ejemplos

- tipos de dominio pequeños y resultados discriminados;
- transformaciones inmutables y deterministas;
- tiempo controlado por el llamador;
- validación de contexto completo y denegación por defecto;
- tratamiento explícito de entradas inválidas;
- minimización por campo antes del límite de una consulta;
- restricciones ejecutables para datos ficticios; y
- separación entre lógica de dominio, normalización, decisiones de acceso, fixtures y pruebas.

## 12. Qué omiten deliberadamente

Los ejemplos no incluyen una aplicación completa, API, base de datos, persistencia, autenticación o autorización real, esquema productivo, integración privada, comportamiento de pagos, precios operativos, modelo productivo de estados, servicio externo, configuración cloud, implementación de asistentes, proveedor o modelo generativo, prompt, interfaz, captura, demo, despliegue ni comportamiento equivalente a producción.

No realizan afirmaciones sobre seguridad, rendimiento, exhaustividad, escala o calidad de la implementación productiva.

## 13. Estado de licenciamiento

La ausencia de una licencia general para reutilizar, redistribuir, modificar, crear obras derivadas, desplegar o comercializar es intencional, y este repositorio no incluye un archivo `LICENSE`. Si se pone a disposición pública mediante GitHub, los usuarios podrán verlo y crear forks a través de GitHub conforme a los [Términos del Servicio de GitHub](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#5-license-grant-to-other-users); esos permisos de la plataforma no conceden derechos más amplios fuera del Servicio ni con otros fines. Salvo los derechos previstos por la ley aplicable y por esos Términos, cualquier uso adicional requiere autorización del titular de los derechos correspondiente. El repositorio no se presenta como open source ni como código abierto. Cualquier licencia futura para los ejemplos deberá declararse expresamente y limitarse a esos ejemplos; no se extenderá automáticamente a la documentación, las imágenes, la marca ni otros contenidos del repositorio. Véase [Estado de licenciamiento](licensing.md).

## 14. Gate de revisión

Los ejemplos y las pruebas de la Fase 3 están incluidos como evidencia pública aceptada. Cualquier incorporación o cambio futuro deberá superar los gates aplicables de revisión, validación, seguridad, privacidad y aprobación independiente para publicación antes de incluirse.
