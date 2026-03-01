import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  try {
    const {
      customerPhone,
      customerName,
      orderId,
      totalPrice,
      items,
    } = await req.json();

    // Validate inputs
    if (!customerPhone || !orderId || totalPrice === undefined) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: customerPhone, orderId, totalPrice',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Twilio credentials from Supabase secrets
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_PHONE = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE) {
      console.error('Missing Twilio credentials in Supabase secrets');
      // Don't block checkout if WhatsApp fails
      return new Response(
        JSON.stringify({
          success: false,
          message: 'WhatsApp service unavailable',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Format message
    const message = `🚀 *Ordine Dloop Confermato!*

Ciao ${customerName}! 👋

Il tuo ordine #${orderId.substring(0, 8)} è stato creato con successo.

📦 *Prodotti:* ${items}
💰 *Totale:* €${totalPrice.toFixed(2)}

Un rider prenderà presto il tuo ordine e lo consegnerà al tuo indirizzo.

Puoi tracciare il tuo ordine qui:
https://dloop-pwa.vercel.app/order/${orderId}

Grazie per aver scelto Dloop! 🎉`;

    // Send via Twilio WhatsApp
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':
          'Basic ' +
          btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
      },
      body: new URLSearchParams({
        From: `whatsapp:${TWILIO_PHONE}`,
        To: `whatsapp:${customerPhone}`,
        Body: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twilio API error:', errorText);
      // Don't block checkout - log and continue
      return new Response(
        JSON.stringify({
          success: false,
          message: 'WhatsApp message failed to send',
          error: errorText,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } } // Return 200 to not block checkout
      );
    }

    const data = await response.json();

    console.log('WhatsApp message sent successfully:', {
      orderId,
      customerPhone,
      messageSid: (data as any).sid,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'WhatsApp notification sent',
        messageSid: (data as any).sid,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('WhatsApp notification error:', error);
    // Don't block checkout on error
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error sending WhatsApp notification',
        error: error.message,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } } // Return 200 to not block checkout
    );
  }
});
