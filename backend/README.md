# MindAware – Backend API

API REST para la aplicación de bienestar digital **MindAware**.  
Desarrollado con **Node.js + Express**, base de datos **Supabase (PostgreSQL)** y autenticación mediante **Supabase Auth**.

---

## Configuración inicial

### 1. Variables de entorno

Copia `.env.example` y rellena los valores reales de tu proyecto Supabase:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL de tu proyecto Supabase (`https://<id>.supabase.co`) |
| `SUPABASE_ANON_KEY` | Clave pública anon (para validar tokens JWT en el middleware) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (tiene acceso completo, bypass RLS) |
| `PORT` | Puerto del servidor (por defecto `3001`) |
| `CORS_ORIGIN` | URL del frontend permitida (por defecto `http://localhost:5173`) |

### 2. Crear las tablas en Supabase

En el **SQL Editor** de tu proyecto Supabase, ejecuta el contenido de:

```
scripts/schema.sql
```

Esto crea las tablas `usuario`, `pregunta`, `respuesta`, `resultado`, `recomendacion` y `actividad_usuario`, junto con sus políticas RLS y el trigger para sincronizar `auth.users` → `usuario`.

### 3. Instalar dependencias

```bash
npm install
```

### 4. Cargar datos iniciales (seed)

Inserta las 35 preguntas del test y recomendaciones de ejemplo:

```bash
npm run seed
```

### 5. Iniciar el servidor

```bash
# Producción
npm start

# Desarrollo (recarga automática con nodemon)
npm run dev
```

El servidor estará disponible en `http://localhost:3001`.

---

## Endpoints de la API

### Autenticación

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | No | Registrar nuevo usuario |
| `POST` | `/auth/login` | No | Iniciar sesión |
| `POST` | `/auth/logout` | Sí | Cerrar sesión |

**POST `/auth/register`**
```json
Body: { "email": "u@example.com", "password": "secret123", "nombre": "María" }
Respuesta 201: { "message": "...", "user": {...}, "session": {...} }
```

**POST `/auth/login`**
```json
Body: { "email": "u@example.com", "password": "secret123" }
Respuesta 200: { "user": {...}, "session": { "access_token": "...", ... } }
```

---

### Preguntas del test

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/preguntas` | No | Obtener todas las preguntas |

---

### Respuestas y resultados

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/respuestas` | Sí | Enviar respuestas del test y calcular resultados |
| `GET` | `/resultados` | Sí | Historial de resultados agrupados por test |

**POST `/respuestas`**  
Header: `Authorization: Bearer <access_token>`
```json
Body: {
  "respuestas": [
    { "pregunta_id": 1, "valor": 3 },
    { "pregunta_id": 2, "valor": 4 },
    ...  // 35 respuestas, valores entre 1 y 5
  ]
}
Respuesta 201: {
  "message": "Respuestas guardadas correctamente",
  "resultados": [
    { "categoria": "ansiedad", "puntaje": 3.5, "nivel": "medio" },
    ...
  ]
}
```

---

### Recomendaciones

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/recomendaciones` | Sí | Recomendaciones personalizadas según último test |
| `GET` | `/recomendaciones?categoria=ansiedad&nivel=alto` | Sí | Filtro manual |

---

### Perfil y actividades

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/perfil` | Sí | Datos del usuario autenticado |
| `PUT` | `/perfil` | Sí | Actualizar nombre del perfil |
| `GET` | `/perfil/actividades` | Sí | Listar actividades del usuario |
| `POST` | `/perfil/actividades` | Sí | Registrar nueva actividad |

**POST `/perfil/actividades`**  
Header: `Authorization: Bearer <access_token>`
```json
Body: { "tipo": "ejercicio", "descripcion": "Meditación 10 minutos" }
// tipo: "pauta" | "ejercicio" | "medida"
Respuesta 201: { "id": 1, "tipo": "ejercicio", "descripcion": "...", "fecha": "..." }
```

---

### Health check

```
GET /health → { "status": "ok", "timestamp": "..." }
```

---

## Umbrales de nivel

| Puntaje promedio | Nivel |
|---|---|
| < 2.5 | `bajo` |
| 2.5 – 3.99 | `medio` |
| ≥ 4.0 | `alto` |

---

## Estructura del proyecto

```
backend/
├── server.js                 # Punto de entrada, configuración Express
├── .env                      # Variables de entorno (no subir a git)
├── .env.example              # Plantilla de variables
├── package.json
├── scripts/
│   ├── schema.sql            # SQL para crear tablas en Supabase
│   └── seed.js               # Script de carga inicial de datos
└── src/
    ├── config/
    │   └── supabase.js       # Cliente Supabase (service_role)
    ├── middleware/
    │   └── auth.js           # Middleware JWT
    └── routes/
        ├── auth.js           # /auth/*
        ├── preguntas.js      # /preguntas
        ├── respuestas.js     # /respuestas, /resultados
        ├── recomendaciones.js # /recomendaciones
        └── perfil.js         # /perfil, /perfil/actividades
```
