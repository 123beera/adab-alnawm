import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// بيانات خطوات آداب النوم
// ============================================================
const steps = [
  {
    id: 1,
    title: "الوضوء",
    description: "نتوضأ قبل النوم ونطهّر أنفسنا",
    detail: "قال النبي ﷺ: «إذا أتيتَ مضجعك فتوضأ وضوءك للصلاة»",
    image: "/manus-storage/char_wudu_23368fd9.png",
    color: "#4FC3F7",
    bgGlow: "rgba(79, 195, 247, 0.2)",
    emoji: "💧",
    number: "١",
  },
  {
    id: 2,
    title: "السواك",
    description: "نستخدم السواك لتنظيف أسناننا",
    detail: "السواك مطهرة للفم ومرضاة للرب",
    image: "/manus-storage/char_siwak_bf06d5cf.png",
    color: "#A5D6A7",
    bgGlow: "rgba(165, 214, 167, 0.2)",
    emoji: "🌿",
    number: "٢",
  },
  {
    id: 3,
    title: "قراءة آية الكرسي",
    description: "نقرأ آية الكرسي قبل النوم",
    detail: "من قرأ آية الكرسي حين يأوي إلى فراشه لم يزل عليه من الله حافظ",
    image: "/manus-storage/char_quran_92c052e0.png",
    color: "#CE93D8",
    bgGlow: "rgba(206, 147, 216, 0.2)",
    emoji: "📖",
    number: "٣",
  },
  {
    id: 4,
    title: "دعاء النوم",
    description: "نقول دعاء النوم بخشوع",
    detail: "«اللهم باسمك أموت وأحيا»",
    image: "/manus-storage/char_dua_fbdcd331.png",
    color: "#FFD54F",
    bgGlow: "rgba(255, 213, 79, 0.2)",
    emoji: "🤲",
    number: "٤",
  },
  {
    id: 5,
    title: "إطفاء الأنوار",
    description: "نطفئ الأنوار قبل النوم",
    detail: "قال النبي ﷺ: «أطفئوا المصابيح إذا رقدتم»",
    image: "/manus-storage/char_lights_29a21d78.png",
    color: "#80DEEA",
    bgGlow: "rgba(128, 222, 234, 0.2)",
    emoji: "🌙",
    number: "٥",
  },
  {
    id: 6,
    title: "النوم على الجانب الأيمن",
    description: "ننام على جانبنا الأيمن",
    detail: "كان النبي ﷺ إذا أوى إلى فراشه نام على شقه الأيمن",
    image: "/manus-storage/char_sleep_731b1194.png",
    color: "#F48FB1",
    bgGlow: "rgba(244, 143, 177, 0.2)",
    emoji: "😴",
    number: "٦",
  },
  {
    id: 7,
    title: "بسم الله",
    description: "نقول بسم الله قبل النوم",
    detail: "نذكر الله ونستعين به في كل أمورنا",
    image: "/manus-storage/char_bismillah_41c644bc.png",
    color: "#FFCC80",
    bgGlow: "rgba(255, 204, 128, 0.2)",
    emoji: "✨",
    number: "٧",
  },
];

// ============================================================
// مكوّن النجوم المتحركة في الخلفية
// ============================================================
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// مكوّن الكونفيتي عند إتمام خطوة
// ============================================================
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#F5C842", "#4FC3F7", "#A5D6A7", "#CE93D8", "#F48FB1"][Math.floor(Math.random() * 5)],
    delay: Math.random() * 0.5,
    size: Math.random() * 10 + 6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animation: `confettiFall 1.5s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// الصفحة الرئيسية
// ============================================================
export default function Home() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = شاشة البداية
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFinish, setShowFinish] = useState(false);

  const step = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }
    // mark current as done
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1600);
    }
    if (currentStep < steps.length) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowFinish(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setShowFinish(false);
  };

  return (
    <div className="night-bg min-h-screen flex flex-col items-center justify-center px-4 py-6" dir="rtl">
      <StarField />
      <Confetti active={showConfetti} />

      {/* القمر الزخرفي */}
      <div
        className="fixed top-6 left-8 text-6xl select-none pointer-events-none"
        style={{ filter: "drop-shadow(0 0 20px rgba(255,220,100,0.8))" }}
      >
        🌙
      </div>

      <AnimatePresence mode="wait">
        {/* ===== شاشة البداية ===== */}
        {currentStep === 0 && !showFinish && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="glass-card p-8 md:p-12 max-w-lg w-full text-center relative z-10"
          >
            <div className="text-7xl mb-4 animate-float">🌙</div>
            <h1
              className="text-4xl md:text-5xl font-black mb-3"
              style={{ fontFamily: "Tajawal, sans-serif", color: "#F5C842", textShadow: "0 0 30px rgba(245,200,66,0.5)" }}
            >
              آداب النوم
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-2" style={{ fontFamily: "Tajawal, sans-serif" }}>
              تعلّم معنا كيف ينام المسلم الصغير
            </p>
            <p className="text-white/50 text-base mb-8" style={{ fontFamily: "Tajawal, sans-serif" }}>
              ٧ خطوات رائعة قبل النوم ✨
            </p>

            {/* معاينة الخطوات */}
            <div className="grid grid-cols-7 gap-1 mb-8">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className="rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto"
                  style={{ background: s.color + "33", border: `2px solid ${s.color}`, color: s.color, fontFamily: "Tajawal, sans-serif" }}
                >
                  {s.number}
                </div>
              ))}
            </div>

            <button
              className="gold-btn px-10 py-4 text-xl w-full"
              onClick={handleNext}
              style={{ fontFamily: "Tajawal, sans-serif" }}
            >
              ابدأ الرحلة 🚀
            </button>
          </motion.div>
        )}

        {/* ===== شاشة الخطوة ===== */}
        {currentStep > 0 && !showFinish && step && (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="glass-card p-6 md:p-10 max-w-lg w-full relative z-10"
            style={{ boxShadow: `0 8px 40px ${step.bgGlow}, 0 0 0 1px rgba(255,255,255,0.1)` }}
          >
            {/* مؤشر التقدم */}
            <div className="flex gap-2 justify-center mb-6">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: s.id === currentStep ? "2rem" : "0.5rem",
                    background: completedSteps.includes(s.id)
                      ? "#F5C842"
                      : s.id === currentStep
                      ? step.color
                      : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            {/* رقم الخطوة */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black"
                style={{ background: step.color + "33", border: `2px solid ${step.color}`, color: step.color, fontFamily: "Tajawal, sans-serif" }}
              >
                {step.number}
              </div>
              <div>
                <p className="text-white/50 text-sm" style={{ fontFamily: "Tajawal, sans-serif" }}>
                  الخطوة {step.number} من ٧
                </p>
                <h2
                  className="text-2xl md:text-3xl font-black"
                  style={{ fontFamily: "Tajawal, sans-serif", color: step.color }}
                >
                  {step.emoji} {step.title}
                </h2>
              </div>
            </div>

            {/* صورة الشخصية */}
            <div className="flex justify-center mb-4">
              <motion.img
                src={step.image}
                alt={step.title}
                className="w-52 h-52 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                style={{ filter: `drop-shadow(0 0 20px ${step.bgGlow})` }}
              />
            </div>

            {/* الوصف */}
            <div
              className="rounded-2xl p-4 mb-4 text-center"
              style={{ background: step.color + "18", border: `1px solid ${step.color}44` }}
            >
              <p className="text-white text-lg font-bold mb-1" style={{ fontFamily: "Tajawal, sans-serif" }}>
                {step.description}
              </p>
              <p className="text-white/60 text-sm" style={{ fontFamily: "Tajawal, sans-serif" }}>
                {step.detail}
              </p>
            </div>

            {/* أزرار التنقل */}
            <div className="flex gap-3 items-center">
              {currentStep > 1 && (
                <button
                  onClick={handlePrev}
                  className="flex-1 py-3 rounded-full text-white/70 font-bold text-lg border border-white/20 hover:bg-white/10 transition-all"
                  style={{ fontFamily: "Tajawal, sans-serif" }}
                >
                  ← السابق
                </button>
              )}
              <button
                className="gold-btn flex-1 py-4 text-lg"
                onClick={handleNext}
                style={{ fontFamily: "Tajawal, sans-serif" }}
              >
                {currentStep === steps.length ? "🎉 أنهيت!" : "التالي →"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ===== شاشة الإنهاء ===== */}
        {showFinish && (
          <motion.div
            key="finish"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="glass-card p-8 md:p-12 max-w-lg w-full text-center relative z-10"
          >
            <div className="text-7xl mb-4 animate-float">🏆</div>
            <h2
              className="text-4xl font-black mb-3"
              style={{ fontFamily: "Tajawal, sans-serif", color: "#F5C842", textShadow: "0 0 30px rgba(245,200,66,0.5)" }}
            >
              أحسنت! 🌟
            </h2>
            <p className="text-white/80 text-xl mb-6" style={{ fontFamily: "Tajawal, sans-serif" }}>
              تعلّمت جميع آداب النوم الإسلامية
            </p>

            {/* ملخص الخطوات */}
            <div className="grid grid-cols-1 gap-2 mb-8 text-right">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-2"
                  style={{ background: s.color + "18", border: `1px solid ${s.color}33` }}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <span className="font-bold text-white" style={{ fontFamily: "Tajawal, sans-serif" }}>
                    {s.title}
                  </span>
                  <span className="mr-auto text-green-400 text-lg">✓</span>
                </div>
              ))}
            </div>

            <button
              className="gold-btn px-10 py-4 text-xl w-full"
              onClick={handleRestart}
              style={{ fontFamily: "Tajawal, sans-serif" }}
            >
              🔄 أعد من البداية
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
