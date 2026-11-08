# StockSmart

Prototipo básico de inventario para pequeños negocios. Para usarlo, abre `index.html` en un navegador moderno; no requiere instalación, servidor ni conexión a internet.

## Funciones

- Agregar, editar y eliminar productos.
- Registrar categoría, cantidad, stock mínimo, costo y precio de venta.
- Buscar por nombre o categoría y filtrar productos con stock bajo.
- Ver unidades, cantidad de productos, capital valorizado al costo, venta potencial y ganancia potencial.
- Consultar margen por producto y exportar el inventario a CSV.
- Calcular descuentos desde un precio ingresado o desde el precio de venta de un producto.
- Guardar los datos en el almacenamiento local del navegador.

## Matemáticas aplicadas

- **Función de descuento:** precio final = precio original × (1 − descuento / 100). Por ejemplo, $2.000 con 15% de descuento resulta en $1.700.
- **Sumatoria y vectores:** el capital se calcula como Σ(cantidadᵢ × costoᵢ), equivalente al producto elemento a elemento de los vectores de cantidades y costos, sumado.
- **Margen:** (precio de venta − costo) / precio de venta × 100. Si el precio es cero, se muestra 0%.
- **Venta potencial:** Σ(cantidadᵢ × precio de ventaᵢ), suponiendo que se venda todo el stock al precio registrado.
- **Ganancia potencial:** Σ(cantidadᵢ × (precio de ventaᵢ − costoᵢ)), antes de otros gastos.
- **Matriz:** cada producto se organiza como una fila con sus atributos para calcular el resumen y revisar el stock.

## Alcance de esta versión

La alerta se activa cuando la cantidad es igual o menor al stock mínimo definido. La venta y ganancia potenciales son estimaciones, no ventas registradas, y no consideran gastos adicionales. No se predice demanda, no se calculan precios óptimos automáticamente y no se registran ventas ni pagos. Por eso, las cantidades se actualizan editando el producto. Los datos quedan guardados en el navegador y dispositivo donde se ingresan; el CSV es una copia exportada, no una sincronización.

## Uso

Abre `index.html` en un navegador moderno. No requiere instalación, servidor ni conexión a internet. Para la demostración, se recomienda agregar varios productos, buscar uno por nombre/categoría, probar el filtro de stock bajo, revisar los cálculos y exportar el CSV.

## Descargar y actualizar el proyecto

Clona el repositorio para obtener una copia:

```bash
git clone https://github.com/JosemaVer/StockSmart.git
```

Cuando haya cambios nuevos, entra a la carpeta del proyecto y ejecuta:

```bash
git pull
```

También se puede descargar una copia desde el botón **Code > Download ZIP** en GitHub. Después, abre `index.html` en el navegador.
