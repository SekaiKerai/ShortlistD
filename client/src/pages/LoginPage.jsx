import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

import { motion, useMotionValue, useSpring } from "framer-motion";

import { BriefcaseBusiness, GraduationCap, Trophy } from "lucide-react";

import logo from "@/assets/shortlistd-logo.png";

const LoginPage = () => {
  const { fetchCurrentUser } = useAuth();

  // Mouse responsive background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    damping: 40,
    stiffness: 120,
  });

  const smoothY = useSpring(mouseY, {
    damping: 40,
    stiffness: 120,
  });

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;

    const x = (e.clientX - innerWidth / 2) * 0.03;
    const y = (e.clientY - innerHeight / 2) * 0.03;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        },
      );

      await fetchCurrentUser();
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#F4EFE7] flex overflow-hidden"
    >
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 relative bg-[#ECE4D7] overflow-hidden">
        {/* Moving Background */}
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
      absolute
      top-[-120px]
      left-[-80px]
      w-[480px]
      h-[480px]
      rounded-full
      bg-[#C97B4F]/20
      blur-[120px]
    "
        />

        <motion.div
          animate={{
            x: [0, -50, 20, 0],
            y: [0, 30, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
      absolute
      bottom-[-140px]
      right-[-100px]
      w-[420px]
      h-[420px]
      rounded-full
      bg-[#6E7B58]/15
      blur-[120px]
    "
        />

        {/* Tiny moving particles */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -25, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            className="absolute rounded-full"
            style={{
              width: "5px",
              height: "5px",
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              background: i % 2 === 0 ? "#B36A45" : "#6E7B58",
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full w-full px-20 py-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div
              className="
          w-16 h-16
          rounded-[1.6rem]
          bg-[#22201C]
          flex items-center justify-center
          shadow-lg
        "
            >
              <BriefcaseBusiness className="text-[#F4EFE7]" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-[#22201C]">ShortlistD</h1>

              <p className="text-[#6A6257] text-sm">Placement Portal</p>
            </div>
          </div>

          {/* Main editorial area */}
          <div className="max-w-2xl">
            <motion.p
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="
          uppercase
          tracking-[0.25em]
          text-[#9C775A]
          text-sm
          font-semibold
        "
            >
              Placement Season 2026
            </motion.p>

            <h2
              className="
        mt-6
        text-[5rem]
        leading-[0.95]
        tracking-[-0.05em]
        font-black
        text-[#22201C]
      "
            >
              The next opportunity could already be waiting.
            </h2>

            <p
              className="
        mt-8
        text-xl
        leading-relaxed
        text-[#5D564D]
        max-w-xl
      "
            >
              Check updates, apply to companies, track interviews and stay ready
              for the offer that changes everything.
            </p>

            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="
          mt-12
          flex
          items-center
          gap-4
        "
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#D28758]" />

              <p className="italic text-[#7C7368] text-lg">
                Applications. Interviews. Offers.
              </p>
            </motion.div>
          </div>

          {/* Bottom strip */}
          <div
            className="
      flex
      gap-10
      text-[#5D564D]
      border-t
      border-[#D4CCBF]
      pt-6
    "
          >
            <div>
              <p className="text-3xl font-black text-[#22201C]">100+</p>

              <p className="text-sm">opportunities tracked</p>
            </div>

            <div>
              <p className="text-3xl font-black text-[#22201C]">OA</p>

              <p className="text-sm">interview workflow</p>
            </div>

            <div>
              <p className="text-3xl font-black text-[#22201C]">Real-time</p>

              <p className="text-sm">placement updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 relative flex justify-center items-center overflow-hidden bg-[#F6F1E8]">
        {/* Background Layer */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Big moving glow */}
          <motion.div
            animate={{
              x: [0, 80, -60, 0],
              y: [0, -50, 40, 0],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[10%] left-[5%]
      w-[500px] h-[500px]
      rounded-full
      bg-[#D88B5C]/25
      blur-[120px]"
          />

          <motion.div
            animate={{
              x: [0, -70, 40, 0],
              y: [0, 50, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[5%] right-[0%]
      w-[420px] h-[420px]
      rounded-full
      bg-[#6E7B58]/20
      blur-[110px]"
          />

          {/* Career network */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
          >
            {/* Path 1 */}
            <motion.path
              d="M0 200 Q300 80 550 280 T1200 230"
              stroke="#B36A45"
              strokeWidth="2"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray="10 14"
              animate={{
                strokeDashoffset: [200, 0],
                opacity: [0.15, 0.45, 0.15],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Path 2 */}
            <motion.path
              d="M0 550 Q450 400 700 520 T1200 420"
              stroke="#647652"
              strokeWidth="2"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray="8 14"
              animate={{
                strokeDashoffset: [-200, 0],
                opacity: [0.12, 0.35, 0.12],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Path 3 */}
            <motion.path
              d="M100 700 Q450 500 800 650"
              stroke="#C29B4A"
              strokeWidth="1.8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray="10 10"
              animate={{
                strokeDashoffset: [150, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>

          {/* Floating particles */}
          {[...Array(28)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -40, 0],
                x: [0, 12, -8, 0],
                opacity: [0.2, 0.65, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              className="absolute rounded-full"
              style={{
                width: `${5 + Math.random() * 7}px`,
                height: `${5 + Math.random() * 7}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background:
                  i % 3 === 0 ? "#D88B5C" : i % 2 === 0 ? "#6E7B58" : "#C29B4A",
                opacity: 0.25,
              }}
            />
          ))}
        </div>

        {/* Login Card */}
        <motion.div
          className="relative z-10 w-full max-w-md px-8"
          whileHover={{
            y: -4,
            scale: 1.01,
          }}
        >
          <div
            className="bg-[#FAF7F1]/88
      border border-[#DDD4C7]
      rounded-[2.5rem]
      shadow-[0_30px_90px_rgba(0,0,0,0.12)]
      p-10
      backdrop-blur-md"
          >
            <p
              className="uppercase tracking-[0.25em]
      text-[#A67B5B]
      text-xs font-semibold"
            >
              Welcome Back
            </p>

            <h2
              className="text-5xl font-black
      text-[#22201C]
      mt-3 leading-tight"
            >
              Continue your placement journey.
            </h2>

            <p
              className="text-[#6A6257]
      mt-5 text-lg leading-relaxed"
            >
              Sign in to access placement drives, announcements and
              applications.
            </p>

            <motion.p
              animate={{
                opacity: [0.45, 1, 0.45],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
              }}
              className="italic text-[#8C7A67] mt-5 text-base"
            >
              Waiting for your next opportunity...
            </motion.p>

            <div className="flex justify-center mt-12 scale-[1.28]">
              <GoogleLogin
                size="large"
                width="340"
                onSuccess={handleSuccess}
                onError={() => alert("Google login failed")}
              />
            </div>

            <div className="mt-10 border-t border-[#E5DED3] pt-5">
              <p className="text-[#8A8176] text-sm text-center">
                Secure login powered by Google OAuth
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
