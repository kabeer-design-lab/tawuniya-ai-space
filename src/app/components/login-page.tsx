import { useState, useEffect } from "react";
import imgLogo from "figma:asset/455d1356f9baed9a176feddf5ae4c24cab21915f.png";
import aiChemistrySvg from "../../imports/ai-chemistry-02-stroke-rounded.svg";
import { Eye, EyeOff, ShieldCheck, BotMessageSquare, ArrowRight } from "lucide-react";

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const autoFill = () => {
    setEmail("abdul@tawuniya.com");
    setPassword("Welcome@123");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    onLogin();
  };

  const features = [
    { icon: null, title: "AI-Powered Agents", desc: "10 specialized agents for every business need" },
    { icon: ShieldCheck, title: "Enterprise Security", desc: "Bank-grade encryption & compliance" },
    { icon: BotMessageSquare, title: "Instant Insights", desc: "Real-time analysis and recommendations" },
  ];

  return (
    <div className="flex w-full min-h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex flex-col justify-between p-[48px] relative overflow-hidden rounded-r-[20px]"
        style={{
          width: "50%",
          backgroundImage: "linear-gradient(135deg, #7f56d9 0%, #6941c6 40%, #4a1fb8 100%)",
        }}
      >
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute rounded-full"
            style={{
              width: 500, height: 500,
              top: -100, right: -100,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 350, height: 350,
              bottom: -50, left: -50,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Top - Logo */}
        <div
          className="relative z-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.6s ease-out",
          }}
        >
          <div className="h-[48px] w-[170px]">
            <img alt="Tawuniya" className="object-contain size-full brightness-0 invert" src={imgLogo} />
          </div>
        </div>

        {/* Center - Hero text */}
        <div
          className="relative z-10 flex flex-col gap-[32px]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out 0.2s",
          }}
        >
          <div className="flex flex-col gap-[16px]">
            
            <h1 className="text-[42px] text-white m-0" style={{ lineHeight: "1.15" }}>
              Your intelligent<br />
              <span className="text-white/80">insurance companion</span>
            </h1>
            <p className="text-[17px] text-white/60 max-w-[400px]" style={{ lineHeight: "1.6" }}>
              Harness the power of AI to streamline operations, analyze policies, and make smarter decisions.
            </p>
          </div>
        </div>

        {/* Bottom - Feature pills */}
        <div
          className="relative z-10 flex flex-row gap-[12px]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease-out 0.4s",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-[12px] rounded-[12px] px-[18px] py-[20px] text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
            >
              <div className="flex items-center justify-center rounded-[8px] size-[36px] shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                {f.icon ? <f.icon size={18} color="white" /> : <img src={aiChemistrySvg} alt="" className="size-[18px] brightness-0 invert" />}
              </div>
              <div>
                <p className="text-[14px] text-white m-0">{f.title}</p>
                <p className="text-[12px] text-white/50 m-0 mt-[4px]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white relative overflow-hidden px-[24px] rounded-[20px] my-[16px] mr-[16px]">
        {/* Subtle top accent */}
        

        <div
          className="flex flex-col gap-[36px] items-center max-w-[380px] w-full"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.6s ease-out 0.3s",
          }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden h-[50px] w-[175px] shrink-0">
            <img alt="Tawuniya" className="object-contain size-full" src={imgLogo} />
          </div>

          {/* Greeting */}
          <div className="flex flex-col gap-[8px] items-center text-center w-full">
            
            <p className="text-[28px] text-[#181d27] m-0" style={{ lineHeight: "1.2" }}>Welcome back</p>
            <p className="text-[15px] text-[#535862] m-0">Sign in to access your AI agents</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] w-full">
            {/* Email */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] text-[#344054]">Email address</label>
              <div
                onClick={autoFill}
                className="relative cursor-pointer group"
              >
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@tawuniya.com"
                  className="w-full px-[14px] py-[11px] text-[15px] border border-[#d0d5dd] rounded-[10px] outline-none bg-white transition-all"
                  style={{
                    color: "#181d27",
                    boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#7f56d9"; e.target.style.boxShadow = "0 0 0 3px rgba(127,86,217,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "#d0d5dd"; e.target.style.boxShadow = "0px 1px 2px rgba(16,24,40,0.05)"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] text-[#344054]">Password</label>
              <div
                onClick={autoFill}
                className="relative cursor-pointer"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  className="w-full px-[14px] py-[11px] pr-[42px] text-[15px] border border-[#d0d5dd] rounded-[10px] outline-none bg-white transition-all"
                  style={{
                    color: "#181d27",
                    boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#7f56d9"; e.target.style.boxShadow = "0 0 0 3px rgba(127,86,217,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = "#d0d5dd"; e.target.style.boxShadow = "0px 1px 2px rgba(16,24,40,0.05)"; }}
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowPassword(!showPassword); }}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 flex items-center"
                >
                  {showPassword
                    ? <EyeOff size={18} color="#98a2b3" />
                    : <Eye size={18} color="#98a2b3" />
                  }
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-[8px] cursor-pointer">
                <input type="checkbox" className="accent-[#7f56d9] size-[16px] cursor-pointer rounded-[4px]" />
                <span className="text-[13px] text-[#344054]">Remember me</span>
              </label>
              <button type="button" className="bg-transparent border-none cursor-pointer p-0">
                <span className="text-[13px] text-[#6941c6] hover:text-[#7f56d9] transition-colors">Forgot password?</span>
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-[8px] rounded-[8px] px-[12px] py-[10px]" style={{ backgroundColor: "#fef3f2", border: "1px solid #fecdca" }}>
                <p className="text-[#b42318] text-[13px] m-0">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="flex items-center justify-center gap-[8px] rounded-[10px] w-full cursor-pointer border-none py-[12px] px-[18px] transition-all hover:opacity-90 active:scale-[0.99]"
              style={{
                backgroundImage: "linear-gradient(135deg, #7f56d9 0%, #6941c6 100%)",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05), inset 0px -2px 0px rgba(0,0,0,0.1)",
              }}
            >
              <span className="text-[15px] text-white">Sign in</span>
              <ArrowRight size={16} color="white" />
            </button>
          </form>

          {/* Divider */}
          

          {/* Footer */}
          
        </div>
      </div>
    </div>
  );
}
