import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Welcome to BNS Legal! How can we help you today? You can ask about our practice areas, office locations, or team." },
  ]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotResponse = (query: string): { text: string; shouldEmail: boolean } => {
    const q = query.toLowerCase();

    if (q.includes("practice") || q.includes("area") || q.includes("service") || q.includes("what do you do"))
      return { text: "We practice in: Civil Litigation, Criminal Law, High Court Practice, Family & Matrimonial, Consumer Law, Co-operative Society, Corporate & Tribunal, Legal Advisory, Redevelopment, and Labour Laws. Which area interests you?", shouldEmail: false };

    if (q.includes("office") || q.includes("location") || q.includes("address") || q.includes("where"))
      return { text: "We have 3 offices:\n\n📍 Head Office: 103, Laxmi Classic CHS Ltd., Mira Road (E), Thane – 401105\n📍 Dadar: 4, Prabhadevi Building, Sayani Road, Dadar (W) – 400025\n📍 Fort: 102, Parikh Mansion, Janmabhoomi Marg, Fort – 400001", shouldEmail: false };

    if (q.includes("team") || q.includes("lawyer") || q.includes("advocate") || q.includes("partner"))
      return { text: "Our team is led by Shri B. N. Shukla (Founder, since 1988), along with Shri Deepak Shukla, Shri Sandeep Shukla, Ms. Neelam Shukla, Shri Vinayak Shukla, and Shri Shivprasad Pathak, plus 4 associate advocates.", shouldEmail: false };

    if (q.includes("intern") || q.includes("internship") || q.includes("training"))
      return { text: "BNS LEGAL offers structured internship programs for law students. 5 full-time interns currently train under our senior advocates. Scroll down to the Internship section to apply, or email us at bnslegal01@gmail.com.", shouldEmail: false };

    if (q.includes("contact") || q.includes("phone") || q.includes("email") || q.includes("call"))
      return { text: "📞 9223438655 / 9967713812 / 9220473363\n📧 bnslegal01@gmail.com\n\nYou can also fill out the consultation form on this page!", shouldEmail: false };

    if (q.includes("consult") || q.includes("free") || q.includes("appointment"))
      return { text: "We offer free consultations! Simply scroll to our contact section and fill out the form, or call us directly at 9223438655.", shouldEmail: false };

    if (q.includes("criminal") || q.includes("bail") || q.includes("fir"))
      return { text: "We handle criminal matters including cheating, fraud, breach of trust, assault, domestic violence, bail applications, FIR quashing, and full trial defense.", shouldEmail: false };

    if (q.includes("divorce") || q.includes("family") || q.includes("custody") || q.includes("maintenance"))
      return { text: "Our family law practice covers divorce, maintenance, custody, domestic violence, mediation, and women's rights protection.", shouldEmail: false };

    if (q.includes("redevelop") || q.includes("society") || q.includes("cooperative"))
      return { text: "We specialize in co-operative society and redevelopment law — title verification, agreement drafting, compliance with Maharashtra guidelines, and dispute resolution before Co-operative Courts and High Court.", shouldEmail: false };

    if (q.includes("rera") || q.includes("real estate") || q.includes("property"))
      return { text: "We handle RERA matters, property disputes, redevelopment issues, title verification, and all real estate related litigation.", shouldEmail: false };

    if (q.includes("consumer"))
      return { text: "We handle consumer disputes, deficiency of services, unfair trade practices, and consumer appellate proceedings.", shouldEmail: false };

    if (q.includes("labour") || q.includes("labor") || q.includes("employment"))
      return { text: "We provide comprehensive advisory, compliance, and litigation support in Labour & Employment Laws for corporate entities, societies, contractors, and employees.", shouldEmail: false };

    if (q.includes("high court") || q.includes("bombay"))
      return { text: "We have expert representation before the Bombay High Court (Original & Appellate Side) — including writ petitions, appeals, revisions, and PILs.", shouldEmail: false };

    if (q.includes("about") || q.includes("firm") || q.includes("history") || q.includes("founded"))
      return { text: "BNS LEGAL was founded in 1988 by Senior Advocate Shri B. N. Shukla. Registered with Bar Council of Maharashtra & Goa (MAH-LF/802/2024), we have 10 associate advocates and 5 legal interns. Our vision: professional legal services to all with dedication, compassion, and honesty.", shouldEmail: false };

    if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
      return { text: "Hello! Welcome to BNS Legal. How can we assist you today?", shouldEmail: false };

    // For unrecognized queries, flag for email
    return { text: "Thank you for your query. I've forwarded it to our legal team. For immediate assistance, please call us at 9223438655 or email bnslegal01@gmail.com.", shouldEmail: true };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    const { text: botResponse, shouldEmail } = getBotResponse(userMsg);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
    }, 600);

    // Save to DB and optionally email
    try {
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "chat_query",
          data: {
            userMessage: userMsg,
            botResponse,
            sessionId,
            shouldEmail,
          },
        },
      });
    } catch (err) {
      console.error("Failed to save chat query:", err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-card border border-border shadow-2xl flex flex-col max-h-[70vh]"
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
              <div>
                <p className="font-display text-sm font-semibold text-foreground">BNS Legal</p>
                <p className="font-body text-xs text-muted-foreground">Ask us anything</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 text-sm whitespace-pre-line ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 bg-background border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button onClick={handleSend} className="px-3 py-2 bg-primary text-primary-foreground hover:bg-[hsl(var(--gold-light))] transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
};

export default ChatButton;
