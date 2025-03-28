# MVP Burgers

## Descripción

MVP Burgers es un sistema de procesamiento de mensajes que permite tomar pedidos de hamburguesas de manera automatizada. Se conecta con la API de Google Gemini para interpretar los pedidos en lenguaje natural y devolver un resumen con los productos seleccionados y su precio total.


## Características

- Procesamiento de lenguaje natural para interpretar pedidos.
- Conexión con la API de Google Gemini.
- Cálculo automático del total del pedido.
- Identificación de hamburguesas y extras.


## Uso

Ejecuta el script para procesar un pedido:

```
python pedido_gemini.py
```

### Ejemplo de salida:
```
Has pedido:
- 1 x Jordan doble ($11000)
- 1 x Lebron simple ($10000) + 1 x queso ($2000)
El total es $23000.
```