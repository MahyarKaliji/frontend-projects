// "use client";

// import React, {
//   useRef,
//   useState,
//   useEffect,
//   ReactNode,
//   createContext,
//   useContext,
//   useCallback,
// } from "react";

// // ----- ایجاد Context برای اشتراک‌گذاری وضعیت درگ -----
// interface DragContextType {
//   isDragging: boolean;
// }
// const DragContext = createContext<DragContextType>({ isDragging: false });

// // هوکی که آیتم‌ها برای استفاده از آن import می‌کنند
// export const useDrag = () => useContext(DragContext);

// // ----- کامپوننت اصلی کانتینر -----
// interface DraggableScrollProps {
//   children: ReactNode;
//   className?: string;
// }

// const DraggableScrollContainer: React.FC<DraggableScrollProps> = ({
//   children,
//   className = "",
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);

//   // وضعیت درگ
//   const [isDragging, setIsDragging] = useState(false);
//   const startPos = useRef({ x: 0, y: 0 });
//   const scrollLeftStart = useRef(0);

//   // وضعیت اینرسی (اختیاری)
//   const [velocity, setVelocity] = useState(0);
//   const [lastMoveTime, setLastMoveTime] = useState(0);
//   const [lastMoveX, setLastMoveX] = useState(0);
//   const animationFrame = useRef<number | null>(null);

//   // ---------- تابع اینرسی ----------
//   const startInertiaScroll = (initialVelocity: number) => {
//     if (!containerRef.current) return;
//     const element = containerRef.current;
//     let speed = initialVelocity * 12;
//     const friction = 0.95;

//     const step = () => {
//       if (Math.abs(speed) < 0.5) {
//         if (animationFrame.current)
//           cancelAnimationFrame(animationFrame.current);
//         return;
//       }
//       element.scrollLeft += speed;
//       speed *= friction;
//       if (
//         element.scrollLeft <= 0 ||
//         element.scrollLeft >= element.scrollWidth - element.clientWidth
//       ) {
//         if (animationFrame.current)
//           cancelAnimationFrame(animationFrame.current);
//         return;
//       }
//       animationFrame.current = requestAnimationFrame(step);
//     };
//     if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
//     animationFrame.current = requestAnimationFrame(step);
//   };

//   // ---------- ماوس ----------
//   const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!containerRef.current || e.button !== 0) return;
//     e.preventDefault();

//     const element = containerRef.current;
//     setIsDragging(false); // ریست وضعیت درگ
//     startPos.current = { x: e.pageX, y: e.pageY };
//     scrollLeftStart.current = element.scrollLeft;
//     setVelocity(0);
//     element.style.cursor = "grabbing";
//   };

//   const onMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (!containerRef.current) return;
//       const element = containerRef.current;

//       // اگر هنوز درگ تشخیص داده نشده، فاصله را چک کن
//       if (!isDragging) {
//         const dx = Math.abs(e.pageX - startPos.current.x);
//         const dy = Math.abs(e.pageY - startPos.current.y);
//         if (dx > 5 || dy > 5) {
//           // آستانه ۵ پیکسل
//           setIsDragging(true);
//         }
//       }

//       // اگر درگ فعال است، اسکرول کن
//       if (isDragging) {
//         e.preventDefault();
//         const dx = e.pageX - startPos.current.x;
//         element.scrollLeft = scrollLeftStart.current - dx;

//         // محاسبه سرعت برای اینرسی
//         const now = Date.now();
//         if (now - lastMoveTime > 10) {
//           setVelocity((e.pageX - lastMoveX) / (now - lastMoveTime));
//           setLastMoveTime(now);
//           setLastMoveX(e.pageX);
//         }
//       }
//     },
//     [isDragging, lastMoveTime, lastMoveX],
//   );

//   const onMouseUp = useCallback(() => {
//     if (!containerRef.current) return;
//     containerRef.current.style.cursor = "grab";
//     if (Math.abs(velocity) > 0.1) startInertiaScroll(velocity);
//     setVelocity(0);
//     // (توجه: isDragging را اینجا ریست نمی‌کنیم تا آیتم‌ها در onClick بعدی آن را ببینند)
//   }, [velocity]);

//   // ---------- لمسی (موبایل) ----------
//   const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
//     if (!containerRef.current) return;
//     const touch = e.touches[0];
//     setIsDragging(false);
//     startPos.current = { x: touch.pageX, y: touch.pageY };
//     scrollLeftStart.current = containerRef.current.scrollLeft;
//     setVelocity(0);
//   };

//   const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
//     if (!containerRef.current) return;
//     const touch = e.touches[0];
//     const element = containerRef.current;

//     if (!isDragging) {
//       const dx = Math.abs(touch.pageX - startPos.current.x);
//       const dy = Math.abs(touch.pageY - startPos.current.y);
//       if (dx > 5 || dy > 5) setIsDragging(true);
//     }

//     if (isDragging) {
//       const dx = touch.pageX - startPos.current.x;
//       element.scrollLeft = scrollLeftStart.current - dx;

//       const now = Date.now();
//       if (now - lastMoveTime > 10) {
//         setVelocity((touch.pageX - lastMoveX) / (now - lastMoveTime));
//         setLastMoveTime(now);
//         setLastMoveX(touch.pageX);
//       }
//     }
//   };

//   const onTouchEnd = () => {
//     if (Math.abs(velocity) > 0.1) startInertiaScroll(velocity);
//     setVelocity(0);
//   };

//   // ---------- اتصال رویدادهای گلوبال ----------
//   useEffect(() => {
//     if (isDragging) {
//       window.addEventListener("mousemove", onMouseMove);
//       window.addEventListener("mouseup", onMouseUp);
//     } else {
//       window.removeEventListener("mousemove", onMouseMove);
//       window.removeEventListener("mouseup", onMouseUp);
//     }
//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//       window.removeEventListener("mouseup", onMouseUp);
//       if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
//     };
//   }, [isDragging, onMouseMove, onMouseUp]);

//   return (
//     <DragContext.Provider value={{ isDragging }}>
//       <div
//         ref={containerRef}
//         className={`overflow-x-auto select-none ${className}`}
//         style={{
//           cursor: "grab",
//           scrollbarWidth: "none",
//           msOverflowStyle: "none",
//         }}
//         onMouseDown={onMouseDown}
//         onTouchStart={onTouchStart}
//         onTouchMove={onTouchMove}
//         onTouchEnd={onTouchEnd}
//       >
//         <style jsx>{`
//           div::-webkit-scrollbar {
//             display: none;
//           }
//         `}</style>
//         {children}
//       </div>
//     </DragContext.Provider>
//   );
// };

// export default DraggableScrollContainer;
"use client";

import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface DraggableScrollProps {
  children: ReactNode;
  className?: string;
}

const DraggableScrollContainer: React.FC<DraggableScrollProps> = ({
  children,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // State های مربوط به درگ
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  // State های مربوط به اینرسی (برای حرکت نرم بعد از رها کردن)
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [lastMoveX, setLastMoveX] = useState(0);
  const animationFrame = useRef<number | null>(null);

  // ---------- تابع اینرسی (شتاب‌گیری و کاهش سرعت نرم) ----------
  const startInertiaScroll = (initialVelocity: number) => {
    if (!containerRef.current) return;
    const element = containerRef.current;
    let speed = initialVelocity * 12; // ضریب سرعت
    const friction = 0.95; // میزان اصطکاک (هرچه کمتر، زودتر متوقف شود)

    const step = () => {
      if (Math.abs(speed) < 0.5) {
        if (animationFrame.current)
          cancelAnimationFrame(animationFrame.current);
        return;
      }

      element.scrollLeft += speed;
      speed *= friction; // کاهش سرعت

      // اگر به ته یا اول اسکرول رسید، متوقف کن
      if (
        element.scrollLeft <= 0 ||
        element.scrollLeft >= element.scrollWidth - element.clientWidth
      ) {
        if (animationFrame.current)
          cancelAnimationFrame(animationFrame.current);
        return;
      }

      animationFrame.current = requestAnimationFrame(step);
    };

    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(step);
  };

  // ---------- رویدادهای ماوس ----------
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    // فقط کلیک چپ
    if (e.button !== 0) return;

    // جلوگیری از انتخاب متن هنگام درگ کردن
    e.preventDefault();

    const element = containerRef.current;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeftStart(element.scrollLeft);
    setVelocity(0);

    // تغییر حالت کرسر برای بازخورد بصری
    element.style.cursor = "grabbing";
  };

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      e.preventDefault();

      const element = containerRef.current;
      const dx = e.pageX - startX;
      element.scrollLeft = scrollLeftStart - dx;

      // محاسبه سرعت برای اینرسی
      const now = Date.now();
      if (now - lastMoveTime > 10) {
        setVelocity((e.pageX - lastMoveX) / (now - lastMoveTime));
        setLastMoveTime(now);
        setLastMoveX(e.pageX);
      }
    },
    [isDragging, lastMoveTime, lastMoveX, startX, scrollLeftStart],
  );

  const onMouseUp = useCallback(() => {
    if (!containerRef.current) return;
    setIsDragging(false);
    containerRef.current.style.cursor = "grab";

    // اعمال اینرسی بعد از رها کردن
    if (Math.abs(velocity) > 0.1) {
      startInertiaScroll(velocity);
    }
    setVelocity(0);
  }, [velocity]);

  // ---------- رویدادهای لمسی (موبایل) ----------
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const element = containerRef.current;
    setIsDragging(true);
    setStartX(touch.pageX);
    setScrollLeftStart(element.scrollLeft);
    setVelocity(0);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const touch = e.touches[0];
    const element = containerRef.current;
    const dx = touch.pageX - startX;
    element.scrollLeft = scrollLeftStart - dx;

    const now = Date.now();
    if (now - lastMoveTime > 10) {
      setVelocity((touch.pageX - lastMoveX) / (now - lastMoveTime));
      setLastMoveTime(now);
      setLastMoveX(touch.pageX);
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(velocity) > 0.1) {
      startInertiaScroll(velocity);
    }
    setVelocity(0);
  };

  // ---------- اتصال و قطع رویدادهای گلوبال (Mouse) ----------
  useEffect(() => {
    // اگر درگ فعال بود، موس را حتی اگر خارج از باکس رفت، دنبال کن
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  return (
    <div
      ref={containerRef}
      className={`overflow-x-auto select-none ${className}`}
      style={{
        cursor: "grab",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* استایل مخفی‌سازی اسکرولبار برای مرورگرهای Webkit */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {children}
    </div>
  );
};

export default DraggableScrollContainer;
