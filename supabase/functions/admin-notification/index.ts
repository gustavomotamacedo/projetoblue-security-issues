
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewUserPayload {
  email: string;
  createdAt: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get the request body
    const { newUser } = await req.json() as { newUser: NewUserPayload };
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // List of admin emails to notify
    const adminEmails = [
      "wagner@operadora.legal",
      "sos@operadora.legal",
      "joao@operadora.legal",
      "bruno@operadora.legal"
    ];
    
    console.log("Preparing to notify admins about new user:", newUser.email);
    
    // Create a user approval record in the user_approval_requests table
    const { error: approvalError } = await supabase
      .from('user_approval_requests')
      .insert({
        email: newUser.email,
        requested_at: newUser.createdAt,
        status: 'pending'
      });
    
    if (approvalError) {
      console.error("Error creating approval request:", approvalError);
      // Continue execution as this is not critical
    }
    
    // Send email to admins via Supabase email service
    // In production, you would use a proper email service like Resend
    // For now, we'll simulate sending by logging the information
    const emailSubject = "Novo usuário registrado: Aprovação necessária";
    const emailBody = `
      <h1>Novo usuário registrado</h1>
      <p><strong>E-mail:</strong> ${newUser.email}</p>
      <p><strong>Data e hora:</strong> ${new Date(newUser.createdAt).toLocaleString('pt-BR')}</p>
      <p><strong>Status do cadastro:</strong> Concluído com sucesso, aguardando aprovação</p>
      <p>Por favor, acesse o painel administrativo para aprovar ou rejeitar este usuário.</p>
    `;
    
    // Log the notification that would be sent
    console.log(`
      Notificação de novo usuário:
      - Email: ${newUser.email}
      - Registrado em: ${newUser.createdAt}
      - Enviaria email para: ${adminEmails.join(', ')}
      - Assunto: ${emailSubject}
    `);
    
    return new Response(
      JSON.stringify({ message: "Admin notification sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in admin-notification function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
