# StockSmart

Prototipo básico de inventario para pequeños negocios. Para usarlo, abre `index.html` en un navegador moderno; no requiere instalación, servidor ni conexión a internet.

## Funciones

- Agregar, editar y eliminar productos.
- Registrar categoría, cantidad, stock mínimo, costo y precio de venta.
- Evitar nombres de producto duplicados, sin distinguir mayúsculas, acentos o espacios repetidos.
- Buscar por nombre o categoría y filtrar productos sin stock, con stock bajo o disponibles.
- Ver el costo unitario y el costo total de cada producto (cantidad × costo unitario).
- Alertar cuando el precio de venta está por debajo del costo unitario, incluso si la ganancia global sigue siendo positiva.
- Ver unidades, cantidad de productos, capital valorizado al costo, venta potencial y ganancia potencial.
- Consultar margen por producto y exportar el inventario a CSV.
- Calcular descuentos desde un precio ingresado o desde el precio de venta de un producto.
- Guardar los datos en el almacenamiento local del navegador.

## Matemáticas aplicadas

- **Función de descuento:** precio final = precio original × (1 − descuento / 100). Por ejemplo, $2.000 con 15% de descuento resulta en $1.700.
- **Costo total por producto:** costo totalᵢ = cantidadᵢ × costo unitarioᵢ. La tabla muestra este valor aparte del costo unitario.
- **Sumatoria del capital en inventario:** capital = Σ(cantidadᵢ × costo unitarioᵢ), es decir, la suma de los costos totales de todos los productos. También puede representarse como el producto elemento a elemento de los vectores de cantidades y costos, seguido de una sumatoria.
- **Margen sobre el precio de venta:** margen (%) = ((precio de venta − costo unitario) / precio de venta) × 100. Si el precio de venta es cero, se muestra 0% para evitar una división por cero.
- **Venta potencial:** venta potencial = Σ(cantidadᵢ × precio de ventaᵢ), suponiendo que se venda todo el stock al precio registrado.
- **Ganancia o pérdida potencial:** resultado = Σ(cantidadᵢ × (precio de ventaᵢ − costo unitarioᵢ)). Un resultado negativo indica pérdida potencial antes de otros gastos. Además, se alerta por producto cuando precio de venta < costo unitario, aunque el resultado global no sea negativo.
- **Matriz de inventario:** cada fila representa un producto y sus columnas contienen nombre, categoría, cantidad, costo unitario, precio de venta y stock mínimo; esta organización permite consultar y calcular los valores por producto.
- **Clasificación del stock:** sin stock si cantidad = 0; stock bajo si 0 < cantidad ≤ mínimo; disponible si cantidad > mínimo.

## Alcance de esta versión

Los productos se clasifican como **Sin stock** (cantidad cero), **Stock bajo** (cantidad mayor que cero e igual o menor al mínimo) o **Disponible**. También se alerta individualmente cuando el precio de venta es inferior al costo unitario. La venta y ganancia potenciales son estimaciones, no ventas registradas, y no consideran gastos adicionales. No se predice demanda, no se calculan precios óptimos automáticamente y no se registran ventas ni pagos. Por eso, las cantidades se actualizan editando el producto. Los datos quedan guardados en el navegador y dispositivo donde se ingresan; el CSV es una copia exportada, no una sincronización.

## Uso

Abre `index.html` en un navegador moderno. No requiere instalación, servidor ni conexión a internet. Para la demostración, se recomienda agregar varios productos, probar la validación de nombres repetidos, buscar por nombre/categoría, revisar las alertas de costo y stock, y exportar el CSV.

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
