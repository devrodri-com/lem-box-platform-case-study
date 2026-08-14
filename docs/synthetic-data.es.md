# Plataforma LEM-BOX — Datos ficticios

[English version](synthetic-data.md)

> Cada fixture de este repositorio fue creado expresamente como dato ficticio. No es un registro productivo sanitizado, anonimizado, muestreado ni transformado.

## Por qué se utilizan datos ficticios

Los ejemplos técnicos públicos necesitan entradas repetibles sin establecer una relación con una persona, cliente, registro del negocio, carga, transacción o sistema privado. Por eso los seis archivos se escribieron desde cero para los contratos públicos acotados de la Fase 3.

No se anonimizaron, transformaron, muestrearon ni exportaron datos de producción para crear estos fixtures.

Los fixtures sólo demuestran casos de prueba. No representan esquemas, volúmenes, distribuciones, relaciones, edge cases, terminología ni comportamiento actual de producción.

## Namespace de identificadores

Todo identificador debe comenzar con `demo-`, tanto los identificadores principales como las referencias entre registros. El namespace es deliberadamente evidente y no conserva ningún mapping con identificadores privados.

Los ejemplos utilizan etiquetas breves como “Demo Account A”, “Synthetic Region A”, “Demo operational record” y “Demo financial reference”. No se permiten nombres de personas, empresas reales, clientes reales ni operaciones atribuibles.

## Ventana temporal ficticia

Todo timestamp debe ser un valor UTC explícito dentro de esta ventana inclusiva:

- inicio: `2030-01-01T00:00:00Z`;
- fin: `2030-12-31T23:59:59Z`.

La ventana futura fija hace que los datos sean reconocibles como un escenario construido e impide que el tiempo actual entre en la lógica central. Las fechas no corresponden a operaciones reales.

## Categorías de fixtures

- [`actors.json`](../fixtures/synthetic/actors.json) incluye las cuatro etiquetas de actores ficticios aprobadas y alcances inventados.
- [`accounts.json`](../fixtures/synthetic/accounts.json) incluye etiquetas evidentemente demo y asociaciones con alcances ficticios.
- [`shipments.json`](../fixtures/synthetic/shipments.json) incluye registros mínimos de ciclo de vida y transiciones candidatas para comportamientos válidos e inválidos desde un estado terminal.
- [`tracking-events.json`](../fixtures/synthetic/tracking-events.json) incluye eventos neutrales respecto de proveedores, deliberadamente desordenados y equivalentes.
- [`internal-query-requests.json`](../fixtures/synthetic/internal-query-requests.json) incluye solicitudes permitidas y rechazadas para el límite por campos.
- [`financial-status-references.json`](../fixtures/synthetic/financial-status-references.json) incluye estado y fecha de referencia sin valores monetarios ni de cuentas.

Los archivos utilizan estructuras cerradas y deliberadamente pequeñas. Los campos desconocidos fallan la validación. Sus nombres fueron inventados para los ejemplos y no deben interpretarse como nombres productivos de campos o esquemas.

## Claves y valores prohibidos

Se prohíben las claves que nombren o impliquen datos de contacto, direcciones, identificadores reales de trazabilidad, valores monetarios o físicos del negocio, facturas, bancos o números de cuenta, credenciales, tokens, claves privadas, secretos externos o prompts. La comparación ignora mayúsculas, minúsculas y separadores para impedir variantes evasivas.

También se rechazan los valores que parezcan direcciones de correo electrónico, teléfonos, URLs, números de tarjeta o cuenta, credenciales, tokens, identificadores reales de trazabilidad, bloques codificados extensos o contenido PEM. El validador no considera seguro un valor sólo porque el registro esté marcado como “demo”.

Un fixture puede contener el nombre de un campo solicitado prohibido únicamente como entrada negativa del límite. Ese marcador no contiene el valor comercial correspondiente y el ejemplo de consultas lo elimina.

## Ausencia deliberada de datos sensibles y valores del negocio

Los fixtures no contienen datos personales, direcciones, lugares reales usados como ubicaciones operativas, información de contacto, valores monetarios, monedas, pesos, tarifas, identificadores de facturas, cuentas financieras, números de trazabilidad, identidades de clientes, credenciales ni secretos.

El fixture de referencias de estado financiero sólo contiene un estado y una fecha inventados. No permite inferir saldos, pagos, transacciones, impuestos, precios ni rendimiento financiero.

## Validador automatizado

[`synthetic-fixture-validator.ts`](../examples/src/synthetic-fixture-validator.ts) lee los seis archivos y aplica:

1. el conjunto exacto de nombres de archivo;
2. JSON válido y la estructura superior documentada;
3. estructuras cerradas específicas por archivo;
4. el namespace `demo-` para identificadores;
5. actores, estados, eventos, categorías y campos ficticios aprobados;
6. la ventana temporal fija de 2030;
7. controles de claves prohibidas; y
8. controles de valores sospechosos y etiquetas ficticias.

El validador no accede a la red ni modifica fixtures. Un error informa un código seguro, el nombre del archivo y la ruta JSON, sin imprimir el contenido completo que lo provocó.

## Ejecución de la validación

Desde `examples/`:

```sh
npm ci
npm run validate:fixtures
```

El gate completo del paquete es `npm run validate`, que también ejecuta el typecheck estricto y todas las pruebas.

## Límites de los fixtures

Superar la validación sólo significa que los archivos propuestos cumplen el contrato público documentado para datos ficticios. No prueba que datos arbitrarios carezcan de sensibilidad, no valida datos productivos, no establece la seguridad de producción ni autoriza la publicación sin revisión humana.

El validador es deliberadamente conservador y específico para estos archivos. Cualquier campo, archivo, vocabulario o escenario nuevo requiere diseño explícito, documentación, pruebas y revisión; no corresponde ampliar el esquema de manera automática.

## Proceso de revisión

Cada fixture debe superar revisión individual, revisión de procedencia ficticia, validación automatizada, análisis de patrones de secretos, revisión de datos personales y aprobación independiente de publicación. Un resultado fallido o ambiguo bloquea el fixture. Nunca se deben copiar datos de producción a este repositorio para crear o depurar un caso.

El conjunto de fixtures ficticios de la Fase 3 está incluido como evidencia pública aceptada. Cualquier incorporación o cambio futuro de fixtures deberá superar el proceso de revisión anterior antes de incluirse; los datos de producción permanecen prohibidos.
