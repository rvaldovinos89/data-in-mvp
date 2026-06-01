# Documentación de Endpoints

Este documento describe los endpoints disponibles en el backend Empresa X.

---

## 🔹 Proyectos

### Crear proyecto

**POST** `/proyectos`

**Descripción:**  
Crea un nuevo proyecto.

**Body:**
{
  "nombre": "Proyecto ejemplo",
  "presupuesto": 500000,
  "precioVenta": 800000
}

**Respuesta exitosa:**
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Proyecto ejemplo",
    "estado": "abierto"
  }
}

---

### Listar proyectos

**GET** `/proyectos`

**Descripción:**  
Obtiene todos los proyectos.

---

### Actualizar proyecto

**PATCH** `/proyectos/:id`

**Descripción:**  
Actualiza un proyecto.

**Restricción:**  
No se puede editar si el proyecto está cerrado.

---

### Resumen financiero

**GET** `/proyectos/:id/resumen`

**Descripción:**  
Obtiene métricas financieras del proyecto.

**Respuesta ejemplo:**
{
  "success": true,
  "data": {
    "proyectoId": 1,
    "finanzas": {
      "presupuesto": 500000,
      "precioVenta": 800000,
      "costoTotal": 600000,
      "saldoDisponible": -100000
    },
    "rendimiento": {
      "porcentajeConsumido": 120,
      "margen": 200000,
      "margenPorcentaje": 25
    },
    "estado": {
      "estadoFinanciero": "SOBRECONSUMO",
      "tieneSobreconsumo": true,
      "tieneMargenNegativo": false
    }
  }
}

---

### Margen del proyecto

**GET** `/proyectos/:id/margen`

**Descripción:**  
Obtiene el margen del proyecto.

---

## 🔹 Compras

### Crear compra

**POST** `/compras`

**Descripción:**  
Registra una compra asociada a un proyecto.

**Body:**
{
  "nombre": "Compra ejemplo",
  "monto": 10000,
  "proveedor": "Sodimac",
  "categoria": "materiales",
  "proyectoId": 1
}

**Validaciones:**
- proveedor obligatorio  
- categoría obligatoria  
- monto mayor a 0  
- proyecto debe existir  
- proyecto no puede estar cerrado  

---

### Listar compras por proyecto

**GET** `/compras/proyecto/:id`

**Descripción:**  
Obtiene todas las compras de un proyecto.

---

### Costo total por proyecto

**GET** `/compras/proyecto/:id/costo-total`

**Descripción:**  
Calcula el costo total del proyecto.

---

## 🔐 Autenticación

Los endpoints protegidos requieren token JWT.

**Header:**
Authorization: Bearer TU_TOKEN

---

## ⚠️ Manejo de errores

Las respuestas de error siguen el formato:

{
  "success": false,
  "statusCode": 400,
  "message": "Mensaje de error",
  "error": "Bad Request",
  "path": "/endpoint",
  "timestamp": "2026-01-01T00:00:00.000Z"
}