import { motion } from "framer-motion";

const FloatingWhatsApp = () => {
  return (
    <motion.a
      href="https://api.whatsapp.com/send/?phone=919223438655&text=Hello+BNS+Legal%2C+I+need+a+consultation&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[100] flex items-center justify-center p-3 sm:p-4 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:bg-[#20BE5A] transition-all duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="block drop-shadow-sm"
      >
        <path d="M21.16 2.82A10.88 10.88 0 0 0 12 0a10.9 10.9 0 0 0-9.28 16.71L1.13 22.8c-.14.47.33.92.8.8l6.23-1.61A10.86 10.86 0 0 0 12 21.8c6 0 10.88-4.88 10.88-10.88a10.87 10.87 0 0 0-3.18-7.72z" stroke="transparent" fill="currentColor"/>
        <path d="M16.7 13.9c-.27-.14-1.61-.8-1.86-.89-.25-.09-.43-.14-.62.14-.18.28-.71.89-.87 1.07-.16.18-.32.21-.59.07a7.48 7.48 0 0 1-2.2-1.35 8.13 8.13 0 0 1-1.52-1.89c-.16-.28-.02-.43.12-.57.12-.12.27-.32.41-.48.14-.16.19-.28.28-.46.09-.18.05-.35-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.47-.62-.48h-.53c-.18 0-.48.07-.73.35-.25.28-.96.94-.96 2.3s.98 2.68 1.12 2.86c.14.18 1.95 2.98 4.73 4.18.66.28 1.18.46 1.58.58.66.21 1.26.18 1.74.11.53-.08 1.61-.66 1.84-1.3.23-.64.23-1.18.16-1.3-.07-.12-.25-.19-.52-.33z" fill="white"/>
      </svg>
      <span className="absolute left-16 bg-card text-foreground px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-border/50 shadow-lg">
        Chat with us on WhatsApp
      </span>
    </motion.a>
  );
};

export default FloatingWhatsApp;
