import { motion } from 'motion/react';
import { QrCode as LucideQrCode } from 'lucide-react';

export function ScanView() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center overflow-hidden relative selection:bg-[#EAFF00]/30 font-sans">
      
      {/* Background decoration from theme */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-[#EAFF00]/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-tr from-[#EAFF00]/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#EAFF00_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none"></div>

      <div className="z-10 text-center px-6 max-w-4xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto w-24 h-24 rounded-[32px] bg-[#EAFF00] p-1 shadow-[0_0_40px_rgba(234,255,0,0.2)]"
        >
          <div className="w-full h-full bg-black/90 backdrop-blur-xl rounded-[28px] border border-[#EAFF00]/30 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#EAFF00] to-orange-500 opacity-20"></div>
            <LucideQrCode className="w-10 h-10 text-[#EAFF00] relative z-10" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-6 font-mono">Decoded Visual Data</p>
          <div className="max-w-2xl p-8 md:p-12 bg-black/80 rounded-[40px] border border-[#EAFF00]/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
            <p className="text-2xl md:text-4xl font-medium leading-relaxed relative z-10 text-center">
              <span className="text-white opacity-90">Create QR codes just like this for your business at</span>
              <br />
              <br />
              <a 
                href="https://zenai.world" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 transition-transform hover:scale-105 active:scale-95"
              >
                <span className="text-[#EAFF00] font-black tracking-tight underline underline-offset-8 decoration-4 decoration-[#EAFF00]/50 drop-shadow-[0_0_15px_rgba(234,255,0,0.6)] animate-pulse">
                  zenai.world
                </span>
              </a>
            </p>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-8 text-center w-full px-6 pointer-events-none">
         <span className="text-[10px] font-mono tracking-[0.4em] text-[#EAFF00]/50 uppercase">Nano Banana Pro v2.0 // Active</span>
      </div>
    </div>
  );
}
