import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Welcome to BNS Legal! How can we help you today? You can ask about our practice areas, office locations, or team." },
  ]);
  const [input, setInput] = useState("");

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("practice") || q.includes("area") || q.includes("service") || q.includes("what do you do"))
      return "We practice in: Civil Litigation, Criminal Law, High Court Practice, Family & Matrimonial, Consumer Law, Co-operative Society, Corporate & Tribunal, Legal Advisory, Redevelopment, and Labour Laws. Which area interests you?";

    if (q.includes("office") || q.includes("location") || q.includes("address") || q.includes("where"))
      return "We have 3 offices:\n\n📍 Head Office: 103, Laxmi Classic CHS Ltd., Mira Road (E), Thane – 401105\n📍 Dadar: 4, Prabhadevi Building, Sayani Road, Dadar (W) – 400025\n📍 Fort: 102, Parikh Mansion, Janmabhoomi Marg, Fort – 400001";

    if (q.includes("team") || q.includes("lawyer") || q.includes("advocate") || q.includes("partner"))
      return "Our team is led by Shri B. N. Shukla (Founder, since 1988), along with Shri Deepak Shukla, Shri Sandeep Shukla, Ms. Neelam Shukla, Shri Vinayak Shukla, and Shri Shivprasad Pathak, plus 4 associate advocates.";

    if (q.includes("intern") || q.includes("internship") || q.includes("training"))
      return "BNS LEGAL offers structured internship programs for law students. 5 full-time interns currently train under our senior advocates. Scroll down and fill our internship form or email us at bnslegal01@gmail.com.";

    if (q.includes("contact") || q.includes("phone") || q.includes("email") || q.includes("call"))
      return "📞 9223438655 / 9967713812 / 9220473363\n📧 bnslegal01@gmail.com\n\nYou can also fill out the consultation form on this page!";

    if (q.includes("consult") || q.includes("free") || q.includes("appointment"))
      return "We offer free consultations! Simply scroll to our contact section and fill out the form, or call us directly at 9223438655.";

    if (q.includes("criminal") || q.includes("bail") || q.includes("fir"))
      return "We handle criminal matters including cheating, fraud, breach of trust, assault, domestic violence, bail applications, FIR quashing, and full trial defense.";

    if (q.includes("divorce") || q.includes("family") || q.includes("custody") || q.includes("maintenance"))
      return "Our family law practice covers divorce, maintenance, custody, domestic violence, mediation, and women's rights protection.";

    if (q.includes("redevelop") || q.includes("society") || q.includes("cooperative"))
      return "We specialize in co-operative society and redevelopment law — title verification, agreement drafting, compliance with Maharashtra guidelines, and dispute resolution before Co-operative Courts and High Court.";

    if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
      return "Hello! Welcome to BNS Legal. How can we assist you today?";

    return "Thank you for your query. For detailed assistance, please call us at 9223438655 or email bnslegal01@gmail.com. You can also fill out our consultation form below!";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: getBotResponse(userMsg) }]);
    }, 600);
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
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
              <div>
                <p className="font-display text-sm font-semibold text-foreground">BNS Legal</p>
                <p className="font-body text-xs text-muted-foreground">Ask us anything</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 bg-background border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={handleSend}
                className="px-3 py-2 bg-primary text-primary-foreground hover:bg-[hsl(var(--gold-light))] transition-colors"
              >
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
