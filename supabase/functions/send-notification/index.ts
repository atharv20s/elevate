import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TARGET_EMAIL = "support.bnslegal@gmail.com";

// ═══════════════════════════════════════════
// RATE LIMITING — Prevent DDoS / email spam
// ═══════════════════════════════════════════

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory rate limit stores (reset on cold start, but still effective against bursts)
const sessionChatCounts = new Map<string, number>();        // session → total chat messages
const sessionLeadCounts = new Map<string, number>();         // session → total lead emails sent
const ipLeadLimits = new Map<string, RateLimitEntry>();      // IP → lead emails in current hour
let globalLeadCount: RateLimitEntry = { count: 0, windowStart: Date.now() };

const LIMITS = {
  CHAT_PER_SESSION: 50,      // Max chat messages saved per session
  LEADS_PER_SESSION: 3,      // Max lead emails per session
  LEADS_PER_IP_PER_HOUR: 5,  // Max lead emails per IP per hour
  GLOBAL_LEADS_PER_HOUR: 30, // Max lead emails across ALL users per hour
};

const ONE_HOUR = 60 * 60 * 1000;

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function checkSessionChatLimit(sessionId: string): boolean {
  const count = sessionChatCounts.get(sessionId) || 0;
  return count < LIMITS.CHAT_PER_SESSION;
}

function incrementSessionChat(sessionId: string): void {
  sessionChatCounts.set(sessionId, (sessionChatCounts.get(sessionId) || 0) + 1);
}

function checkLeadLimits(sessionId: string, ip: string): { allowed: boolean; reason?: string } {
  // Check session lead limit
  const sessionLeads = sessionLeadCounts.get(sessionId) || 0;
  if (sessionLeads >= LIMITS.LEADS_PER_SESSION) {
    return { allowed: false, reason: "Maximum lead submissions reached for this session" };
  }

  // Check IP hourly limit
  const now = Date.now();
  const ipEntry = ipLeadLimits.get(ip);
  if (ipEntry) {
    if (now - ipEntry.windowStart > ONE_HOUR) {
      // Reset window
      ipLeadLimits.set(ip, { count: 0, windowStart: now });
    } else if (ipEntry.count >= LIMITS.LEADS_PER_IP_PER_HOUR) {
      return { allowed: false, reason: "Too many submissions from your network. Please try again later." };
    }
  }

  // Check global hourly limit
  if (now - globalLeadCount.windowStart > ONE_HOUR) {
    globalLeadCount = { count: 0, windowStart: now };
  }
  if (globalLeadCount.count >= LIMITS.GLOBAL_LEADS_PER_HOUR) {
    return { allowed: false, reason: "Our system is currently busy. Please try again in a few minutes." };
  }

  return { allowed: true };
}

function incrementLeadCounters(sessionId: string, ip: string): void {
  // Session
  sessionLeadCounts.set(sessionId, (sessionLeadCounts.get(sessionId) || 0) + 1);

  // IP
  const now = Date.now();
  const ipEntry = ipLeadLimits.get(ip);
  if (!ipEntry || now - ipEntry.windowStart > ONE_HOUR) {
    ipLeadLimits.set(ip, { count: 1, windowStart: now });
  } else {
    ipEntry.count++;
  }

  // Global
  if (now - globalLeadCount.windowStart > ONE_HOUR) {
    globalLeadCount = { count: 1, windowStart: now };
  } else {
    globalLeadCount.count++;
  }
}

// ═══════════════════════════════════════════
// RESEND EMAIL SENDER
// ═══════════════════════════════════════════

async function sendEmailViaResend(subject: string, body: string): Promise<boolean> {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.error("RESEND_API_KEY not set — email not sent");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BNS Legal Website <onboarding@resend.dev>",
        to: [TARGET_EMAIL],
        subject,
        html: body.includes("<") ? body : body.replace(/\n/g, "<br>"),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", err);
      return false;
    }

    console.log(`Email sent successfully: ${subject}`);
    return true;
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
    return false;
  }
}

// ═══════════════════════════════════════════
// ADVOCATE MAP — Practice area → Advocate
// ═══════════════════════════════════════════

const advocateMap: Record<string, { name: string; phone: string }> = {
  "Redevelopment / Co-operative Society": { name: "Mr. Sandeep Shukla", phone: "9220473363" },
  "Family & Matrimonial": { name: "Ms. Neelam S. Shukla", phone: "9479256501" },
  "Civil / Property": { name: "Mr. B. N. Shukla", phone: "9223438655" },
  "Criminal": { name: "Mr. Sandeep Shukla", phone: "9220473363" },
  "Consumer Protection": { name: "Mr. Sandeep Shukla", phone: "9220473363" },
  "Motor Accident / Insurance": { name: "Mr. Vinayak Shukla", phone: "8655890872" },
  "RERA": { name: "Mr. Deepak Shukla", phone: "9967713812" },
  "High Court": { name: "Mr. Deepak Shukla", phone: "9967713812" },
  "Corporate / Tribunal": { name: "Mr. Deepak Shukla", phone: "9967713812" },
  "Labour Law": { name: "Mr. Vinayak Shukla", phone: "8655890872" },
  "Cyber Crime": { name: "Mr. Sandeep Shukla", phone: "9220473363" },
  "Tax & Revenue": { name: "Mr. Deepak Shukla", phone: "9967713812" },
  "Constitutional & Public Law": { name: "Mr. Deepak Shukla", phone: "9967713812" },
  "Banking & Finance": { name: "Mr. B. N. Shukla", phone: "9223438655" },
  "Senior Citizen": { name: "Ms. Neelam S. Shukla", phone: "9479256501" },
  "Matrimonial Property": { name: "Ms. Neelam S. Shukla", phone: "9479256501" },
};

function getAdvocateInfo(practiceArea: string): { name: string; phone: string; display: string } {
  const advocate = advocateMap[practiceArea];
  if (advocate) {
    return { ...advocate, display: `${advocate.name} (${advocate.phone})` };
  }
  return { name: "General", phone: "", display: "General — assign as appropriate" };
}

// ═══════════════════════════════════════════
// MAIN REQUEST HANDLER
// ═══════════════════════════════════════════

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const clientIP = getClientIP(req);

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

      const clientName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || "Visitor";
      subject = `[TASK TYPE- CONSULTATION REQUEST] - ${clientName}`;
      body = `
<h2>New Consultation Request — BNS Legal Website</h2>
<p><strong>Name:</strong> ${clientName}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Phone:</strong> ${data.phone}</p>
<p><strong>Legal Matter:</strong> ${data.message || "Not specified"}</p>
<hr>
<p><em>BNS LEGAL — Justice for All<br>Advocates, Legal Consultants &amp; Notary Public</em></p>
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

      const clientName = data.fullName || "Applicant";
      subject = `[TASK TYPE- INTERN APPLICATION] - ${clientName}`;
      body = `
<h2>New Internship Application — BNS Legal Website</h2>
<p><strong>Name:</strong> ${clientName}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Phone:</strong> ${data.phone}</p>
<p><strong>College:</strong> ${data.college}</p>
<p><strong>Year of Study:</strong> ${data.yearOfStudy}</p>
<p><strong>Area of Interest:</strong> ${data.areaOfInterest}</p>
<p><strong>Message:</strong> ${data.message || "Not specified"}</p>
<hr>
<p><em>BNS LEGAL - Justice for All<br>Advocates, Legal Consultants & Notary Public</em></p>
      `.trim();
    } else if (type === "chat_lead") {
      // High-priority lead from chatbot - user shared phone number
      const phoneDigits = (data.phone || "").replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid phone number" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ── Rate limit check ──
      const sessionId = data.sessionId || "unknown";
      const rateCheck = checkLeadLimits(sessionId, clientIP);
      if (!rateCheck.allowed) {
        console.warn(`Rate limited: session=${sessionId}, ip=${clientIP}, reason=${rateCheck.reason}`);
        return new Response(
          JSON.stringify({ success: false, error: rateCheck.reason, rateLimited: true }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Store lead in DB
      const { error: dbError } = await supabaseAdmin
        .from("chat_queries")
        .insert({
          user_message: `[LEAD] Name: ${data.name || "N/A"} | Phone: ${data.phone} | Email: ${data.email || "N/A"} | Area: ${data.practiceArea}`,
          bot_response: data.conversationSummary || "",
          session_id: data.sessionId || null,
        });

      if (dbError) {
        console.error("DB insert error:", dbError);
      }

      // Get advocate info for subject line and body
      const advocate = getAdvocateInfo(data.practiceArea);
      const clientName = data.name || "Visitor";

      subject = `[TASK TYPE- AI CHAT] - ${clientName}`;

      body = `
<h2>🔔 New Consultation Lead — BNS Legal AI Chatbot</h2>
<table style="border-collapse:collapse;width:100%;max-width:500px;">
  <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">Client Name</td><td style="padding:8px;border-bottom:1px solid #ddd;">${clientName}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">Phone</td><td style="padding:8px;border-bottom:1px solid #ddd;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
  <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">Email</td><td style="padding:8px;border-bottom:1px solid #ddd;">${data.email || "Not provided"}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">Practice Area</td><td style="padding:8px;border-bottom:1px solid #ddd;">${data.practiceArea}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #ddd;">Recommended Advocate</td><td style="padding:8px;border-bottom:1px solid #ddd;">${advocate.display}</td></tr>
</table>
<h3>Client's Latest Query</h3>
<p>${data.userMessage}</p>
<h3>Full Chat Transcript</h3>
<pre style="background:#f5f5f5;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:13px;line-height:1.5;color:#333;">${data.conversationSummary || "N/A"}</pre>
<hr>
<p><strong>⚡ Action Required:</strong> Call the client at <a href="tel:${data.phone}">${data.phone}</a> to schedule a consultation.</p>
<p><em>Auto-captured by BNS Legal AI Chatbot</em><br>Session: ${data.sessionId}</p>
      `.trim();

      // Increment rate limit counters AFTER successful processing
      incrementLeadCounters(sessionId, clientIP);

    } else if (type === "chat_query") {
      // ── Rate limit check for chat messages ──
      const sessionId = data.sessionId || "unknown";
      if (!checkSessionChatLimit(sessionId)) {
        return new Response(
          JSON.stringify({ success: false, error: "Session message limit reached", rateLimited: true }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      incrementSessionChat(sessionId);

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
        const clientName = data.name || "Visitor";
        subject = `[TASK TYPE- AI CHAT] - ${clientName}`;
        body = `
<h2>New Chat Query — BNS Legal Website</h2>
<p><strong>Client Name:</strong> ${clientName}</p>
<p><strong>Email:</strong> ${data.email || "Not provided"}</p>
<p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
<p><strong>User's Question:</strong> ${data.userMessage}</p>
<p><strong>Bot Response:</strong> ${data.botResponse}</p>
<hr>
<p><em>BNS LEGAL - Justice for All</em></p>
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

    // Send actual email notification via Resend
    const emailSent = await sendEmailViaResend(subject, body);

    return new Response(
      JSON.stringify({ success: true, emailSent, message: "Request submitted successfully" }),
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
