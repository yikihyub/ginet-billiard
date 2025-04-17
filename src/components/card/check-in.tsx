'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface CheckinEffectProps {
  show: boolean;
  onComplete?: () => void;
}

export function CheckinEffect({ show, onComplete }: CheckinEffectProps) {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show) {
      timer = setTimeout(() => {
        onComplete?.();
      }, 2000); // 2초 후에 효과가 사라집니다
    }
    return () => clearTimeout(timer);
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="rounded-full bg-white p-6 shadow-lg"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="h-20 w-20 text-green-500" />
            </motion.div>
          </motion.div>
          <motion.div
            className="absolute mt-36 text-center text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            체크인 완료!
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
