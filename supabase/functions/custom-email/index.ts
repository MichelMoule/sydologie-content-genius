
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "reset_password";
  email: string;
  token: string;
  redirectTo: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, token, redirectTo }: EmailRequest = await req.json();

    console.log("Processing email request:", { type, email, redirectTo });

    if (type === "reset_password") {
      const resetUrl = `${redirectTo}#type=recovery&token=${token}`;
      
      const emailResponse = await resend.emails.send({
        from: "Sydologie.ai <no-reply@sydologie.ai>",
        to: [email],
        subject: "Réinitialisation de votre mot de passe Sydologie.ai",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00FF00; font-size: 24px; margin-bottom: 10px;">Sydologie.ai</h1>
              <p style="font-size: 18px; font-weight: bold;">Réinitialisation de votre mot de passe</p>
            </div>
            
            <p>Bonjour,</p>
            
            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Sydologie.ai.</p>
            
            <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #00FF00; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
            
            <p>Ce lien expirera dans 24 heures.</p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
              <p>© 2025 Sydologie.ai - Tous droits réservés</p>
            </div>
          </div>
        `,
      });

      console.log("Email sent successfully:", emailResponse);

      return new Response(JSON.stringify(emailResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    return new Response(
      JSON.stringify({ error: "Type d'email non pris en charge" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in custom-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
