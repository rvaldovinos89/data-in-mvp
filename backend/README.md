<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" />
</p>

# Backend Empresa X

## 📌 Descripción
Backend del sistema de gestión financiera de proyectos.

Permite:
- Crear y gestionar proyectos
- Registrar compras asociadas
- Calcular métricas financieras
- Validar reglas de negocio críticas

## Tecnologías utilizadas
- Node.js
- NestJS
- Prisma ORM
- PostgreSQL
- Docker
- JWT

## 🚀 Instalación

Clonar repositorio:

    git clone <URL_DEL_REPOSITORIO>
    cd backend

Instalar dependencias:

    npm install

## ⚙️ Variables de entorno

Crear archivo `.env` en la raíz del proyecto:

    DATABASE_URL="postgresql://usuario:password@localhost:5432/empresax"
    JWT_SECRET="tu_secreto"
    PORT=3000

## 🐘 Base de datos

Levantar PostgreSQL con Docker:

    docker-compose up -d

Ejecutar migraciones:

    npx prisma migrate dev

Generar cliente Prisma:

    npx prisma generate

## Ejecución

Modo desarrollo:

    npm run start:dev

Servidor disponible en:

`http://localhost:3000`

## 🔐 Autenticación

El sistema utiliza JWT.

Flujo:
1. Login para obtener `access_token`
2. Enviar token en headers:

    Authorization: Bearer TU_TOKEN

## Estructura de respuesta API

### Respuesta exitosa

    {
      "success": true,
      "message": "Operación exitosa",
      "data": {}
    }

### Respuesta de error

    {
      "success": false,
      "statusCode": 400,
      "message": "Mensaje de error",
      "error": "Bad Request",
      "path": "/endpoint",
      "timestamp": "2026-01-01T00:00:00.000Z"
    }

## Endpoints principales

### Proyectos
- `POST /proyectos` → Crear proyecto
- `GET /proyectos` → Listar proyectos
- `PATCH /proyectos/:id` → Actualizar proyecto
- `GET /proyectos/:id/resumen` → Resumen financiero
- `GET /proyectos/:id/margen` → Margen del proyecto

### Compras
- `POST /compras` → Crear compra
- `GET /compras/proyecto/:id` → Listar compras por proyecto
- `GET /compras/proyecto/:id/costo-total` → Costo total por proyecto

## Reglas de negocio
- No existen compras sin proyecto
- Proyecto cerrado no permite registrar compras
- Proveedor obligatorio
- Categoría obligatoria
- Monto positivo
- No se almacenan totales, se calculan
- Moneda CLP

## Métricas calculadas
- Costo total
- Saldo disponible
- Porcentaje consumido
- Margen
- Margen porcentual
- Estado financiero

## Testing
El backend fue probado con Postman considerando:
- casos exitosos
- error 400
- error 401
- error 404
- error 409

## Versión
`v0.1 Backend MVP`

## Autor
Raúl Valdovinos