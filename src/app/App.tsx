import { useState, lazy, Suspense, startTransition } from "react";

const LoginPage = lazy(() => import("./components/login-page").then(m => ({ default: m.LoginPage })));
const AgentSelection = lazy(() => import("./components/agent-selection").then(m => ({ default: m.AgentSelection })));
const ChatScreen = lazy(() => import("./components/chat-screen").then(m => ({ default: m.ChatScreen })));

type Screen = "login" | "agents" | "chat";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [activeAgent, setActiveAgent] = useState<any>(null);

  return (
    <div className="w-full min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Suspense fallback={<div className="flex items-center justify-center size-full"><div className="w-8 h-8 border-3 border-[#7f56d9] border-t-transparent rounded-full animate-spin" /></div>}>
        {screen === "login" && (
          <LoginPage onLogin={() => startTransition(() => setScreen("agents"))} />
        )}
        {screen === "agents" && (
          <AgentSelection
            onSelectAgent={(agent: any) => startTransition(() => { setActiveAgent(agent); setScreen("chat"); })}
            userName="Abdullah"
          />
        )}
        {screen === "chat" && activeAgent && (
          <ChatScreen
            agent={activeAgent}
            onBackToAgents={() => startTransition(() => { setScreen("agents"); setActiveAgent(null); })}
            onSwitchAgent={setActiveAgent}
          />
        )}
      </Suspense>
    </div>
  );
}
