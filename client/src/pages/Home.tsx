import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// بيانات خطوات آداب النوم
// ============================================================
const steps = [
  {
    id: 1,
    title: "الوضوء",
    description: "نتوضأ ونغسل يدينا ووجهنا",
    detail: "قال النبي ﷺ: «إذا أتيتَ مضجعك فتوضأ»",
    image: "/manus-storage/char_wudu_23368fd9.png",
    color: "#4FC3F7",
    bgGlow: "rgba(79, 195, 247, 0.2)",
    emoji: "💧",
    number: "١",
  },
  {
    id: 2,
    title: "السواك",
    description: "ننظّف أسناننا بالسواك",
    detail: "السواك مطهرة للفم",
    image: "/manus-storage/char_siwak_bf06d5cf.png",
    color: "#A5D6A7",
    bgGlow: "rgba(165, 214, 167, 0.2)",
    emoji: "🌿",
    number: "٢",
  },
  {
    id: 3,
    title: "آية الكرسي",
    description: "نقرأ آية الكرسي من القرآن",
    detail: "من قرأها حفظه الله طول الليل",
    image: "/manus-storage/char_quran_92c052e0.png",
    color: "#CE93D8",
    bgGlow: "rgba(206, 147, 216, 0.2)",
    emoji: "📖",
    number: "٣",
  },
  {
    id: 4,
    title: "دعاء النوم",
    description: "نرفع يدينا ونقول دعاء النوم",
    detail: "«اللهم باسمك أموت وأحيا»",
    image: "/manus-storage/char_dua_fbdcd331.png",
    color: "#FFD54F",
    bgGlow: "rgba(255, 213, 79, 0.2)",
    emoji: "🤲",
    number: "٤",
  },
  {
    id: 5,
    title: "نطفئ الضوء",
    description: "نضغط على المفتاح ونطفئ الضوء",
    detail: "قال النبي ﷺ: «أطفئوا المصابيح إذا رقدتم»",
    image: "/manus-storage/char_lights_29a21d78.png",
    color: "#80DEEA",
    bgGlow: "rgba(128, 222, 234, 0.2)",
    emoji: "🌙",
    number: "٥",
  },
  {
    id: 6,
    title: "ننام على اليمين",
    description: "ننام على جانبنا الأيمن مثل النبي ﷺ",
    detail: "كان النبي ﷺ ينام على شقه الأيمن",
    image: "/manus-storage/char_sleep_731b1194.png",
    color: "#F48FB1",
    bgGlow: "rgba(244, 143, 177, 0.2)",
    emoji: "😴",
    number: "٦",
  },
  {
    id: 7,
    title: "بسم الله",
    description: "نقول بسم الله ونذكر الله",
    detail: "نذكر الله في كل وقت",
    image: "/manus-storage/char_bismillah_41c644bc.png",
    color: "#FFCC80",
    bgGlow: "rgba(255, 204, 128, 0.2)",
    emoji: "✨",
    number: "٧",
  },
];

// ============================================================
// بيانات لعبة الترتيب - 4 خطوات فقط مناسبة لروضة أولى
// ============================================================
const gameSteps = [
  { id: 1, emoji: "💧", label: "الوضوء",      color: "#4FC3F7" },
  { id: 2, emoji: "🌿", label: "السواك",      color: "#A5D6A7" },
  { id: 3, emoji: "🤲", label: "دعاء النوم",  color: "#FFD54F" },
  { id: 4, emoji: "😴", label: "ننام على اليمين", color: "#F48FB1" },
];

// ============================================================
// مكوّن النجوم المتحركة
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
// مكوّن الكونفيتي
// ============================================================
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#F5C842","#4FC3F7","#A5D6A7","#CE93D8","#F48FB1"][Math.floor(Math.random() * 5)],
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
// لعبة الترتيب بالسحب والإفلات
// ============================================================
function SortingGame({ onDone }: { onDone: () => void }) {
  // نخلط الخطوات عشوائياً مرة واحدة
  const [shuffled] = useState(() => [...gameSteps].sort(() => Math.random() - 0.5));
  const [slots, setSlots] = useState<(typeof gameSteps[0] | null)[]>([null, null, null, null]);
  const [remaining, setRemaining] = useState(shuffled);
  const [dragItem, setDragItem] = useState<typeof gameSteps[0] | null>(null);
  const [dragSource, setDragSource] = useState<"bank" | number>("bank");
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // تحقق من الإجابة
  const checkAnswer = useCallback((newSlots: (typeof gameSteps[0] | null)[]) => {
    const correct = newSlots.every((s, i) => s?.id === gameSteps[i].id);
    if (correct && newSlots.every(Boolean)) {
      setConfetti(true);
      setTimeout(() => { setConfetti(false); setShowSuccess(true); }, 1200);
    }
  }, []);

  // بدء السحب من البنك
  const onDragStartBank = (item: typeof gameSteps[0]) => {
    setDragItem(item);
    setDragSource("bank");
  };

  // بدء السحب من خانة
  const onDragStartSlot = (item: typeof gameSteps[0], idx: number) => {
    setDragItem(item);
    setDragSource(idx);
  };

  // الإفلات في خانة
  const onDropSlot = (idx: number) => {
    if (!dragItem) return;
    const newSlots = [...slots];
    const newRemaining = [...remaining];

    // إذا كانت الخانة ممتلئة، نُعيد محتواها للبنك
    if (newSlots[idx]) {
      newRemaining.push(newSlots[idx]!);
    }
    // إذا كان المصدر خانة أخرى، نفرّغها
    if (typeof dragSource === "number") {
      newSlots[dragSource] = null;
    } else {
      // إزالة من البنك
      const ri = newRemaining.findIndex((r) => r.id === dragItem.id);
      if (ri !== -1) newRemaining.splice(ri, 1);
    }
    newSlots[idx] = dragItem;
    setSlots(newSlots);
    setRemaining(newRemaining);
    setDragItem(null);
    checkAnswer(newSlots);
  };

  // الإفلات في البنك
  const onDropBank = () => {
    if (!dragItem || dragSource === "bank") return;
    const newSlots = [...slots];
    newSlots[dragSource as number] = null;
    setSlots(newSlots);
    setRemaining((prev) => [...prev, dragItem]);
    setDragItem(null);
  };

  // للموبايل: نقر للتحديد ثم نقر للوضع
  const [selected, setSelected] = useState<{ item: typeof gameSteps[0]; source: "bank" | number } | null>(null);

  const handleBankTap = (item: typeof gameSteps[0]) => {
    if (selected) {
      // إذا كان المحدد من خانة، نُعيده ونضع الجديد
      if (typeof selected.source === "number") {
        const newSlots = [...slots];
        newSlots[selected.source as number] = null;
        setSlots(newSlots);
        setRemaining((prev) => [...prev, selected.item]);
      }
      setSelected(null);
    } else {
      setSelected({ item, source: "bank" });
    }
  };

  const handleSlotTap = (idx: number) => {
    if (selected) {
      const newSlots = [...slots];
      const newRemaining = [...remaining];
      if (newSlots[idx]) newRemaining.push(newSlots[idx]!);
      if (typeof selected.source === "number") {
        newSlots[selected.source as number] = null;
      } else {
        const ri = newRemaining.findIndex((r) => r.id === selected.item.id);
        if (ri !== -1) newRemaining.splice(ri, 1);
      }
      newSlots[idx] = selected.item;
      setSlots(newSlots);
      setRemaining(newRemaining);
      setSelected(null);
      checkAnswer(newSlots);
    } else if (slots[idx]) {
      setSelected({ item: slots[idx]!, source: idx });
      const newSlots = [...slots];
      newSlots[idx] = null;
      setSlots(newSlots);
    }
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-md w-full text-center"
      >
        <div className="text-7xl mb-3 animate-float">🏆</div>
        <h2 className="text-4xl font-black mb-2" style={{ fontFamily: "Tajawal, sans-serif", color: "#F5C842" }}>
          يا بطل! 🌟
        </h2>
        <p className="text-white/80 text-xl mb-6" style={{ fontFamily: "Tajawal, sans-serif" }}>
          رتّبت الخطوات صح!
        </p>
        <div className="flex gap-3 justify-center mb-6">
          {gameSteps.map((s) => (
            <div key={s.id} className="text-4xl">{s.emoji}</div>
          ))}
        </div>
        <button className="gold-btn px-8 py-4 text-xl w-full" onClick={onDone} style={{ fontFamily: "Tajawal, sans-serif" }}>
          🎉 انتهينا!
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <Confetti active={confetti} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 max-w-lg w-full relative z-10"
      >
        {/* العنوان */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎮</div>
          <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: "Tajawal, sans-serif" }}>
            رتّب الخطوات!
          </h2>
          <p className="text-white/60 text-base mt-1" style={{ fontFamily: "Tajawal, sans-serif" }}>
            اضغط على الصورة ثم اضغط على المكان الصح 👇
          </p>
        </div>

        {/* الخانات الفارغة */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              onClick={() => handleSlotTap(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropSlot(idx)}
              className="relative rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
              style={{
                height: "90px",
                background: slot ? slot.color + "22" : "rgba(255,255,255,0.05)",
                border: slot
                  ? `2px solid ${slot.color}`
                  : selected
                  ? "2px dashed rgba(245,200,66,0.7)"
                  : "2px dashed rgba(255,255,255,0.2)",
                boxShadow: slot ? `0 0 12px ${slot.color}44` : "none",
                transform: selected && !slot ? "scale(1.04)" : "scale(1)",
              }}
            >
              {/* رقم الخانة */}
              <span
                className="absolute top-1 right-2 text-xs font-bold opacity-50"
                style={{ fontFamily: "Tajawal, sans-serif", color: slot ? slot.color : "#fff" }}
              >
                {["١","٢","٣","٤"][idx]}
              </span>
              {slot ? (
                <>
                  <span className="text-3xl">{slot.emoji}</span>
                  <span className="text-xs text-white/80 mt-1 text-center px-1" style={{ fontFamily: "Tajawal, sans-serif", fontSize: "10px" }}>
                    {slot.label}
                  </span>
                </>
              ) : (
                <span className="text-2xl opacity-20">؟</span>
              )}
            </div>
          ))}
        </div>

        {/* بنك البطاقات */}
        <div
          className="rounded-2xl p-4 mb-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropBank}
        >
          <p className="text-white/40 text-xs text-center mb-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
            اختر من هنا
          </p>
          <div className="flex flex-wrap gap-3 justify-center min-h-[70px]">
            {remaining.map((item) => (
              <motion.div
                key={item.id}
                draggable
                onDragStart={() => onDragStartBank(item)}
                onClick={() => handleBankTap(item)}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.08 }}
                className="rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none"
                style={{
                  width: "72px",
                  height: "72px",
                  background: item.color + "22",
                  border: selected?.item.id === item.id
                    ? `3px solid #F5C842`
                    : `2px solid ${item.color}`,
                  boxShadow: selected?.item.id === item.id
                    ? "0 0 16px rgba(245,200,66,0.6)"
                    : `0 0 8px ${item.color}44`,
                }}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-white/70 mt-1 text-center" style={{ fontFamily: "Tajawal, sans-serif", fontSize: "9px" }}>
                  {item.label}
                </span>
              </motion.div>
            ))}
            {remaining.length === 0 && (
              <p className="text-white/30 text-sm self-center" style={{ fontFamily: "Tajawal, sans-serif" }}>
                وضعت كل البطاقات ✓
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ============================================================
// الصفحة الرئيسية
// ============================================================
export default function Home() {
  // screen: "intro" | "steps" | "game" | "finish"
  const [screen, setScreen] = useState<"intro" | "steps" | "game" | "finish">("intro");
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const step = steps[currentStep - 1];

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1600);
    }
    if (currentStep < steps.length) {
      setCurrentStep((s) => s + 1);
    } else {
      setScreen("game");
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleRestart = () => {
    setScreen("intro");
    setCurrentStep(1);
    setCompletedSteps([]);
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
        {screen === "intro" && (
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
              ٧ خطوات قبل النوم ✨
            </p>
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
              onClick={() => setScreen("steps")}
              style={{ fontFamily: "Tajawal, sans-serif" }}
            >
              يلّا نبدأ! 🚀
            </button>
          </motion.div>
        )}

        {/* ===== شاشة الخطوات ===== */}
        {screen === "steps" && step && (
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

            {/* رقم الخطوة والعنوان */}
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
                {currentStep === steps.length ? "🎮 العب!" : "التالي →"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ===== شاشة اللعبة ===== */}
        {screen === "game" && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full flex justify-center"
          >
            <SortingGame onDone={() => setScreen("finish")} />
          </motion.div>
        )}

        {/* ===== شاشة الإنهاء ===== */}
        {screen === "finish" && (
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
              يا بطل! 🌟
            </h2>
            <p className="text-white/80 text-xl mb-6" style={{ fontFamily: "Tajawal, sans-serif" }}>
              تعلّمت كل آداب النوم وفزت باللعبة!
            </p>
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
              🔄 العب مرة ثانية
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
