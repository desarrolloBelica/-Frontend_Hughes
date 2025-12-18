import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * 🔄 WEBHOOK DE STRIPE - ACTUALMENTE DESHABILITADO
 * 
 * Este webhook es la forma MÁS SEGURA de confirmar donaciones en producción.
 * Stripe envía automáticamente notificaciones cuando un pago se completa.
 * 
 * ✅ VENTAJAS:
 * - No depende del frontend (funciona aunque el usuario cierre la ventana)
 * - Stripe garantiza la entrega del evento
 * - Más seguro y confiable
 * 
 * 📋 PARA ACTIVAR EN PRODUCCIÓN:
 * 1. Configurar webhook en Stripe Dashboard:
 *    - URL: https://tu-dominio.com/api/donations/webhook
 *    - Evento: checkout.session.completed
 * 2. Copiar el Webhook Secret y agregarlo a .env
 * 3. Actualizar donation/page.tsx para usar /api/donations/create-checkout
 * 4. Eliminar la llamada a /confirm en donation/success/page.tsx
 * 
 * 🚧 ACTUALMENTE: Usando controller de Strapi con /confirm manual
 */

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Manejar diferentes tipos de eventos
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // 1. Crear o buscar donador en Strapi
      const donatorData = {
        firstName: session.metadata.firstName,
        lastName: session.metadata.lastName,
        email: session.customer_email || session.customer_details?.email,
        phone: session.metadata.phone,
        address: session.metadata.address,
        city: session.metadata.city,
      };

      // Buscar si el donador ya existe
      const existingDonator = await fetch(
        `${STRAPI_URL}/api/donators?filters[email][$eq]=${donatorData.email}`,
        {
          headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
        }
      );

      const existingData = await existingDonator.json();
      let donatorId;

      if (existingData.data && existingData.data.length > 0) {
        donatorId = existingData.data[0].id;
      } else {
        // Crear nuevo donador
        const createDonator = await fetch(`${STRAPI_URL}/api/donators`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: donatorData }),
        });

        const newDonator = await createDonator.json();
        donatorId = newDonator.data.id;
      }

      // 2. Crear registro de donación en Strapi
      const donationData = {
        donator: donatorId,
        amount: session.amount_total / 100, // Convertir de centavos a dólares
        donationDestiny: session.metadata.designation,
        donationDate: new Date().toISOString(),
        succesfull: true,
        frecuency: session.metadata.frequency,
        comments: session.metadata.tributeName
          ? `${session.metadata.tributeType}: ${session.metadata.tributeName}`
          : "",
      };

      await fetch(`${STRAPI_URL}/api/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({ data: donationData }),
      });

      console.log("Donation recorded successfully");
    } catch (error) {
      console.error("Error recording donation in Strapi:", error);
    }
  }

  return NextResponse.json({ received: true });
}
