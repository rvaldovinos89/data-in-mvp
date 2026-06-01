# Contrato API

Este documento define la estructura oficial de respuestas del backend Empresa X.

## Respuesta exitosa

Todas las respuestas exitosas deben seguir esta estructura:

    {
      "success": true,
      "message": "Operación exitosa",
      "data": {}
    }

## Respuesta de error

Todas las respuestas de error deben seguir esta estructura:

    {
      "success": false,
      "statusCode": 400,
      "message": "Mensaje de error",
      "error": "Bad Request",
      "path": "/endpoint",
      "timestamp": "2026-01-01T00:00:00.000Z"
    }

## Reglas del contrato

- `success` indica si la operación fue exitosa o no.
- `message` explica el resultado o el error.
- `data` contiene la información útil cuando la operación es exitosa.
- `statusCode` representa el código HTTP cuando existe error.
- `error` indica el tipo de error.
- `path` informa el endpoint ejecutado.
- `timestamp` registra el momento de la respuesta.

## Endpoints protegidos

Los endpoints protegidos requieren JWT en el header:

    Authorization: Bearer TU_TOKEN

## Nota para frontend

El frontend debe consumir las respuestas asumiendo esta estructura estándar y no depender de formatos alternativos.

## Alcance actual

Este contrato aplica a los endpoints principales del MVP backend:

- autenticación
- proyectos
- compras
- resumen financiero
- margen