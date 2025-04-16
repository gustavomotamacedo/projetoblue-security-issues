
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewUserPayload {
  email: string;
  username: string;
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
    
    // Fetch admin emails
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('email')
      .eq('role', 'admin')
      .eq('is_active', true);
    
    if (adminsError) {
      console.error("Error fetching admins:", adminsError);
      throw new Error("Failed to fetch admin emails");
    }
    
    if (!admins || admins.length === 0) {
      console.warn("No admin users found to notify");
      return new Response(
        JSON.stringify({ message: "No admin users found to notify" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Send email via Supabase Edge Function
    // Note: In a real implementation, you would use an email service like Resend
    // For now, we'll simulate sending by logging the information
    console.log(`
      New user registration notification:
      - User: ${newUser.username}
      - Email: ${newUser.email}
      - Registered at: ${newUser.createdAt}
      - Would send email to admins: ${admins.map(a => a.email).join(', ')}
    `);
    
    // Create a user approval record in a new table
    const { error: approvalError } = await supabase
      .from('user_approval_requests')
      .insert({
        user_id: null, // We don't have the user ID yet as it's a pre-registration check
        username: newUser.username,
        email: newUser.email,
        requested_at: newUser.createdAt,
        status: 'pending'
      });
    
    if (approvalError) {
      console.error("Error creating approval request:", approvalError);
      // Continue execution as this is not critical
    }
    
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
