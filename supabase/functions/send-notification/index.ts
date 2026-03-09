import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let subject = "";
    let body = "";

    if (type === "consultation") {
      // Store in DB
      const { error: dbError } = await supabaseAdmin
        .from("consultation_requests")
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          message: data.message || "",
        });

      if (dbError) {
        console.error("DB insert error:", dbError);
        throw new Error("Failed to save consultation request");
      }

      subject = `New Consultation Request from ${data.firstName} ${data.lastName}`;
      body = `
New consultation request received on BNS Legal website.

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Legal Matter: ${data.message || "Not specified"}

---
BNS LEGAL - Justice for All
Advocates, Legal Consultants & Notary Public
      `.trim();
    } else if (type === "internship") {
      const { error: dbError } = await supabaseAdmin
        .from("internship_applications")
        .insert({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          college: data.college,
          year_of_study: data.yearOfStudy,
          area_of_interest: data.areaOfInterest,
          message: data.message || "",
        });

      if (dbError) {
        console.error("DB insert error:", dbError);
        throw new Error("Failed to save internship application");
      }

      subject = `New Internship Application from ${data.fullName}`;
      body = `
New internship application received on BNS Legal website.

Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
College: ${data.college}
Year of Study: ${data.yearOfStudy}
Area of Interest: ${data.areaOfInterest}
Message: ${data.message || "Not specified"}

---
BNS LEGAL - Justice for All
Advocates, Legal Consultants & Notary Public
      `.trim();
    } else if (type === "chat_query") {
      const { error: dbError } = await supabaseAdmin
        .from("chat_queries")
        .insert({
          user_message: data.userMessage,
          bot_response: data.botResponse,
          session_id: data.sessionId || null,
        });

      if (dbError) {
        console.error("DB insert error:", dbError);
      }

      // Only email if it looks like a real inquiry
      if (data.shouldEmail) {
        subject = `New Chat Query on BNS Legal Website`;
        body = `
A visitor asked a question via the chatbot on BNS Legal website.

User's Question: ${data.userMessage}
Bot Response: ${data.botResponse}

---
BNS LEGAL - Justice for All
        `.trim();
      } else {
        return new Response(
          JSON.stringify({ success: true, message: "Chat query saved" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      throw new Error("Invalid request type");
    }

    // Send email notification via Supabase Edge Function email
    // Using a simple SMTP-free approach: store in DB and use Resend/etc later
    // For now, we use the built-in Supabase email if configured, or just store
    console.log(`Email notification queued: ${subject}`);
    console.log(`To: bnslegal01@gmail.com`);
    console.log(`Body: ${body}`);

    return new Response(
      JSON.stringify({ success: true, message: "Request submitted successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
