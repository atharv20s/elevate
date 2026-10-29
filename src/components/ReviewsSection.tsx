import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Star, ExternalLink, MessageCircle } from "lucide-react";
import ScrollStoryWrapper from "./ScrollStoryWrapper";

const reviews = [
  { name: "Praveen Maurya", reviewsCount: "3 reviews", time: "2 months ago", text: "BNS Legal is a very good law firm. The team is professional, knowledgeable, and supportive. Mr. Sandeep Shukla Sir is a very good advocate—highly experienced, polite, and clear in his legal guidance. I am fully satisfied with the legal services provided and would highly recommend BNS Legal to anyone seeking reliable legal assistance.", rating: 5 },
  { name: "Rani Das", reviewsCount: "10 reviews", time: "4 months ago", text: "Sandeep sir gives proper conclusion and concreate result .he also gives u proper an surity of the case with proper study proper reasearch the he come to accurate result", rating: 5 },
  { name: "Amit Sharma", reviewsCount: "5 reviews", time: "1 year ago", text: "Excellent service! The advocates at BNS Legal handled my property dispute with utmost professionalism. Senior Advocate B. N. Shukla has unparalleled knowledge of civil matters. Highly recommended.", rating: 5 },
  { name: "Sneha Patel", reviewsCount: "2 reviews", time: "11 months ago", text: "Very supportive and transparent team. Mr. Sandeep guided us through a complex family matter smoothly. We felt reassured at every step.", rating: 5 },
  { name: "Rajesh Kumar", reviewsCount: "8 reviews", time: "1 year ago", text: "Best legal firm in Mira Road. Deepak Shukla sir helped me with RERA issues. Very fast and accurate results.", rating: 5 },
  { name: "Priya Desai", reviewsCount: "1 review", time: "6 months ago", text: "The team is very diligent. Neelam ma'am provided excellent counsel for my case. True to their motto, 'Justice for All'.", rating: 5 },
  { name: "Vikram Singh", reviewsCount: "4 reviews", time: "1 year ago", text: "Highly professional advocates. Vinayak sir handled my matter efficiently in the High Court. Got the stay order in the first hearing.", rating: 5 },
  { name: "Meena Jadhav", reviewsCount: "7 reviews", time: "8 months ago", text: "I approached BNS Legal for a consumer dispute. They are very reliable and give honest advice.", rating: 5 },
  { name: "Suresh Menon", reviewsCount: "12 reviews", time: "1 year ago", text: "Solid legal advice. They study the case thoroughly before proceeding. One of the oldest and most trusted firms in the area.", rating: 5 },
  { name: "Neha Gupta", reviewsCount: "3 reviews", time: "9 months ago", text: "Excellent command over Co-operative Society matters. BNS Legal resolved our society's redevelopment issues seamlessly.", rating: 5 },
  { name: "Anil Wagh", reviewsCount: "6 reviews", time: "1 year ago", text: "Very polite and helpful staff. They explain the legal jargon in simple terms. Sandeep sir is very knowledgeable.", rating: 5 },
  { name: "Kavita Rao", reviewsCount: "2 reviews", time: "5 months ago", text: "Got bail for my relative within days. Shivprasad sir is very proactive and dedicated. Thank you BNS Legal.", rating: 5 },
];

const ReviewsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const headingY = useTransform(scrollYProgress, [0, 0.4], [30, -10]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  // Duplicate for seamless marquee
  const row1 = [...reviews.slice(0, 6), ...reviews.slice(0, 6)];
  const row2 = [...reviews.slice(6, 12), ...reviews.slice(6, 12)];

  return (
    <ScrollStoryWrapper
      id="reviews"
      chapter="Chapter IV"
      chapterTitle="Client Voices"
      animationType="fade-up"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      <div ref={sectionRef}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16">
          <motion.div
            style={{ y: headingY, opacity: headingOpacity }}
            className="text-center flex flex-col items-center"
          >
            <p className="text-[hsl(var(--gold-dark))] font-body text-sm uppercase tracking-[0.3em] mb-4 flex items-center gap-2 justify-center">
              <MessageCircle className="w-4 h-4" /> Client Feedback
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Trusted by 20,000+
            </h2>
            <div className="w-24 h-[2px] bg-gradient-to-r from-primary to-primary/40 mx-auto mb-6" />
            <div className="space-y-4 mb-6">
              <p className="font-body text-primary text-lg font-medium tracking-wide">
                Having successfully handled over 20,000+ cases since 1988
              </p>
              <p className="font-body text-muted-foreground max-w-xl mx-auto">
                Hear what our clients have to say about our dedication, professionalism, and results. Our Google Reviews speak for our legacy.
              </p>
            </div>

            {/* Google Rating Badge */}
            <div className="flex items-center gap-3 mb-10 bg-card/40 border border-border/50 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
               <div className="flex gap-1 text-primary">
                  <span className="font-display text-lg font-bold mr-1">4.9</span>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 mt-1 ${i === 4 ? 'opacity-80' : ''} fill-current`} />
                  ))}
               </div>
               <div className="w-px h-6 bg-border mx-2"></div>
               <p className="font-body text-sm font-medium text-foreground tracking-wide">
                  <span className="text-primary font-bold">150+</span> Positive Reviews on Google Maps
               </p>
            </div>

            <a
              href="https://maps.app.goo.gl/v4ARTquhePj1yDiu8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-shrink-0 items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-display text-sm font-semibold tracking-[0.15em] uppercase hover:bg-[hsl(var(--gold-light))] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,191,0,0.2)] rounded-sm"
            >
              Leave a Review <ExternalLink className="w-4 h-4 border-l border-primary-foreground/30 pl-2 ml-1" />
            </a>
          </motion.div>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex flex-col gap-6 py-10">
          
          {/* Fading Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

          {/* Row 1: Moves Left */}
          <div className="flex w-fit animate-marquee-left gap-6 hover:[animation-play-state:paused] group">
            {row1.map((review, i) => (
              <div
                key={`row1-${i}`}
                className="w-[400px] flex-shrink-0 p-8 border border-border bg-card/60 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 rounded-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">{review.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{review.reviewsCount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex text-primary mb-1">
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{review.time}</p>
                  </div>
                </div>
                <p className="font-body text-sm text-[hsl(var(--ivory-muted))] leading-relaxed">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>

          {/* Row 2: Moves Right */}
          <div className="flex w-fit animate-marquee-right gap-6 hover:[animation-play-state:paused] group">
            {row2.map((review, i) => (
              <div
                key={`row2-${i}`}
                className="w-[400px] flex-shrink-0 p-8 border border-border bg-card/60 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 rounded-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-foreground text-sm">{review.name}</h4>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{review.reviewsCount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex text-primary mb-1">
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{review.time}</p>
                  </div>
                </div>
                <p className="font-body text-sm text-[hsl(var(--ivory-muted))] leading-relaxed">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollStoryWrapper>
  );
};

export default ReviewsSection;
