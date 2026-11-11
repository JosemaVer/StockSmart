# Bitácora del proyecto StockSmart

## 3 de noviembre de 2026 — Idea inicial

Comenzamos a trabajar en papel la idea de un sistema sencillo para ayudar a pequeños almacenes y minimarkets a ordenar su inventario. Identificamos problemas frecuentes del registro manual: errores en cantidades y precios, dificultad para consultar el valor de la mercadería y demoras al calcular descuentos.

## 5 de noviembre de 2026 — Planteamiento del proyecto

Desarrollamos la propuesta en la tabla de lanzamiento: definimos el objetivo, el problema, las preguntas de investigación y las funcionalidades iniciales. También relacionamos la solución con funciones para descuentos, sumatorias, vectores y matrices.

## 8 de noviembre de 2026 — Inicio de la programación

Iniciamos la construcción del prototipo web StockSmart. Se implementaron el registro, la edición y la eliminación de productos; el resumen de inventario; las alertas por stock mínimo; la calculadora de descuentos; y el almacenamiento local en el navegador.

Para fortalecer el prototipo sin ampliar demasiado el alcance, agregamos búsqueda por nombre o categoría, filtro de productos con stock bajo, exportación del inventario a CSV, y cálculos de margen, venta potencial y ganancia potencial. Probamos los cálculos, las búsquedas, el filtro y la exportación con datos de ejemplo.

## 11 de noviembre de 2026 — Costos, alertas y presentación del inventario

Se agregó el costo total de las unidades disponibles por producto, calculado como cantidad × costo unitario, y se mantuvo el costo unitario como un dato separado. También se incorporó una alerta cuando el precio de venta es inferior al costo unitario, para advertir de pérdidas por producto incluso si la ganancia potencial general es positiva.

Para evitar confusiones en el catálogo, se impide registrar nombres duplicados aunque cambien las mayúsculas, los acentos o los espacios repetidos. El inventario ahora distingue entre productos sin stock, con stock bajo y disponibles, permite filtrar por cada estado y muestra el costo total y el estado en la exportación CSV.

Se actualizó la presentación de la tabla y los indicadores de estado tomando como referencia las imágenes del sistema de punto de venta compartidas para el proyecto. Se documentaron las fórmulas del costo total, capital, margen, venta y ganancia o pérdida potencial, además de la regla de clasificación del stock. Se verificaron en el navegador los cálculos, las alertas, los nombres duplicados, los filtros y la visualización adaptable.

## Alcance acordado

El prototipo no predice la demanda, no optimiza precios automáticamente y no registra ventas ni pagos. La ganancia potencial es una estimación antes de otros gastos. Los datos se guardan en el navegador donde se usan; el archivo CSV permite conservar una copia, pero no sincroniza ni restaura los datos dentro de la aplicación.
