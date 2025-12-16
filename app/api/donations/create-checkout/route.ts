import { NextRequest, NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, frequency, designation, donorInfo, tributeInfo } = body;

    // Validación básica
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    // Crear sesión de checkout de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: frequency === "monthly" ? "subscription" : "payment",
      
      // Para donaciones únicas
      ...(frequency === "once" && {
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Donation to Hughes Schools - ${designation}`,
                description: `Support ${designation}`,
              },
              unit_amount: Math.round(amount * 100), // Stripe usa centavos
            },
            quantity: 1,
          },
        ],
      }),

      // Para donaciones recurrentes
      ...(frequency === "monthly" && {
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Monthly Donation - ${designation}`,
                description: `Monthly support for ${designation}`,
              },
              unit_amount: Math.round(amount * 100),
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
      }),

      customer_email: donorInfo?.email,
      metadata: {
        designation,
        frequency,
        firstName: donorInfo?.firstName || "",
        lastName: donorInfo?.lastName || "",
        phone: donorInfo?.phone || "",
        address: donorInfo?.address || "",
        city: donorInfo?.city || "",
        tributeType: tributeInfo?.type || "",
        tributeName: tributeInfo?.name || "",
      },

      success_url: `${req.nextUrl.origin}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/donation?canceled=true`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Error creating checkout session" },
      { status: 500 }
    );
  }
}
