# Hughes Schools - Donation System with Stripe

## 📋 Overview

Sistema completo de donaciones integrado con Stripe para Hughes Schools Foundation (501c3). Incluye:

- ✅ Procesamiento de pagos one-time y recurrentes (monthly)
- ✅ Designaciones de donación (Student Application, Teacher Development, Travel Fund)
- ✅ Tribute gifts (In Honor Of / In Memory Of)
- ✅ Integración completa con Strapi para almacenar donadores y donaciones
- ✅ Páginas de éxito y cancelación
- ✅ Webhooks para sincronización automática

---

## 🚀 Configuración Rápida

### 1. Variables de Entorno

Agrega estas variables a tu archivo `.env`:

\`\`\`env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Tu clave pública de Stripe
STRIPE_SECRET_KEY=sk_test_...                   # Tu clave secreta de Stripe
STRIPE_WEBHOOK_SECRET=whsec_...                 # Tu webhook secret de Stripe

# Strapi Backend
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=tu_token_aqui
\`\`\`

### 2. Obtener Claves de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. En **Developers → API keys**, copia:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### 3. Configurar Webhook

1. En Stripe Dashboard, ve a **Developers → Webhooks**
2. Click **Add endpoint**
3. URL del endpoint: `https://tu-dominio.com/api/donations/webhook`
4. Eventos a escuchar:
   - `checkout.session.completed`
5. Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 📦 Schemas de Strapi

### Donator Schema

Crea en Strapi: **Content-Type Builder → Create new collection type → Donator**

\`\`\`json
{
  "kind": "collectionType",
  "collectionName": "donators",
  "info": {
    "singularName": "donator",
    "pluralName": "donators",
    "displayName": "Donator"
  },
  "attributes": {
    "firstName": { "type": "string", "required": true },
    "lastName": { "type": "string", "required": true },
    "email": { "type": "email", "required": true },
    "address": { "type": "string", "required": true },
    "city": { "type": "string", "required": true },
    "phone": { "type": "string", "required": false }
  }
}
\`\`\`

### Donation Schema

\`\`\`json
{
  "kind": "collectionType",
  "collectionName": "donations",
  "info": {
    "singularName": "donation",
    "pluralName": "donations",
    "displayName": "Donation"
  },
  "attributes": {
    "donator": {
      "type": "relation",
      "relation": "oneToOne",
      "target": "api::donator.donator"
    },
    "amount": { "type": "integer", "required": true },
    "donationDestiny": { "type": "string", "required": true },
    "donationDate": { "type": "date", "required": true },
    "succesfull": { "type": "boolean", "required": true },
    "frecuency": { "type": "string", "required": true },
    "comments": { "type": "text", "required": false }
  }
}
\`\`\`

### Impact Story Schema (Opcional)

Para las historias de éxito en la página de donaciones:

\`\`\`json
{
  "kind": "collectionType",
  "collectionName": "impact_stories",
  "info": {
    "singularName": "impact-story",
    "pluralName": "impact-stories",
    "displayName": "Impact Story"
  },
  "attributes": {
    "name": { "type": "string", "required": true },
    "role": { "type": "string", "required": true },
    "quote": { "type": "text", "required": true },
    "photo": { "type": "media", "multiple": false, "allowedTypes": ["images"] },
    "category": { 
      "type": "enumeration", 
      "enum": ["student", "teacher", "alumni"],
      "required": true 
    },
    "year": { "type": "integer" },
    "featured": { "type": "boolean", "default": false }
  }
}
\`\`\`

---

## 🔄 Flujo de Donación

### Usuario:
1. Visita `/donation`
2. Completa el formulario:
   - Selecciona designación (Student, Teacher, Travel)
   - Elige frecuencia (One-time o Monthly)
   - Ingresa monto
   - Llena información personal
   - Opcional: Tribute gift
3. Click en "Complete Donation"

### Sistema:
1. Frontend llama a `/api/donations/create-checkout`
2. API crea sesión de Stripe Checkout
3. Usuario es redirigido a Stripe
4. Completa pago en Stripe
5. Stripe redirige a `/donation/success`
6. Webhook de Stripe notifica al backend
7. Backend guarda donador y donación en Strapi

---

## 🛠️ Estructura de Archivos

\`\`\`
app/
├── donation/
│   ├── page.tsx                    # Página principal de donaciones
│   └── success/
│       ├── page.tsx                # Página de éxito
│       └── layout.tsx              # Layout de success
├── api/
│   └── donations/
│       ├── create-checkout/
│       │   └── route.ts           # Crea sesión de Stripe
│       └── webhook/
│           └── route.ts           # Recibe eventos de Stripe
\`\`\`

---

## 📝 Designaciones de Donación

| Designación | Descripción |
|------------|-------------|
| **Student Application Fund** | Application fees and documentation costs |
| **Teacher Development & Training** | Professional development and training abroad |
| **Travel & Cultural Exchange Fund** | Airfare and travel for transformative experiences |

---

## 🧪 Testing

### Modo Test de Stripe

Usa estas tarjetas de prueba:

| Card Number | Resultado |
|------------|-----------|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requiere 3D Secure |

- **Fecha de expiración**: Cualquier fecha futura
- **CVC**: Cualquier 3 dígitos
- **ZIP**: Cualquier 5 dígitos

### Testing Local del Webhook

1. Instala Stripe CLI:
   \`\`\`bash
   # Windows (con Scoop)
   scoop install stripe
   
   # Mac
   brew install stripe/stripe-cli/stripe
   \`\`\`

2. Login:
   \`\`\`bash
   stripe login
   \`\`\`

3. Forward eventos a tu local:
   \`\`\`bash
   stripe listen --forward-to localhost:3000/api/donations/webhook
   \`\`\`

4. Copia el webhook signing secret que aparece y úsalo en `.env`

---

## 🎨 Personalización

### Montos Predefinidos

Edita en `app/donation/page.tsx`:

\`\`\`typescript
const presets = ["50", "150", "500", "1000"];  // Cambia estos valores
\`\`\`

### Historias de Impacto

Edita en `app/donation/page.tsx` → `ImpactStories()`:

\`\`\`typescript
const stories = [
  {
    name: "Nombre del Estudiante",
    role: "Class of 2024",
    quote: "Tu quote aquí...",
    image: "/ruta-a-imagen.jpg",
  },
  // ... más historias
];
\`\`\`

### Meta del Matching Challenge

Edita en `app/donation/page.tsx` → `MatchingChallenge()`:

\`\`\`typescript
const currentAmount = 45000;  // Cantidad actual
const goalAmount = 100000;    // Meta total
\`\`\`

---

## 🔒 Seguridad

- ✅ Las claves secretas nunca se exponen al cliente
- ✅ Webhooks verifican firma de Stripe
- ✅ Validación de datos en servidor
- ✅ Información sensible solo en variables de entorno

---

## 📊 Monitoreo

### Ver Donaciones en Strapi

1. Login a tu Strapi admin: `http://localhost:1337/admin`
2. Ve a **Content Manager → Donations**
3. Ve a **Content Manager → Donators**

### Ver Transacciones en Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Payments** para ver todas las transacciones
3. **Customers** para ver donadores recurrentes

---

## 🚨 Troubleshooting

### Error: "Missing Stripe env vars"

- Verifica que todas las variables de Stripe estén en `.env`
- Reinicia el servidor: `npm run dev`

### Webhook no funciona

- Verifica que el `STRIPE_WEBHOOK_SECRET` sea correcto
- En producción, asegúrate de que la URL del webhook sea accesible públicamente
- Verifica los logs del webhook en Stripe Dashboard

### Donación no aparece en Strapi

- Verifica que el webhook esté configurado
- Revisa los logs de la consola del servidor
- Verifica que `STRAPI_TOKEN` tenga permisos de escritura

---

## 📞 Soporte

Para problemas o preguntas:
- Email: dev@hughesschools.edu
- Documentación de Stripe: https://stripe.com/docs
- Documentación de Strapi: https://docs.strapi.io

---

## 📄 Licencia

© 2025 Hughes Schools Foundation. All rights reserved.
