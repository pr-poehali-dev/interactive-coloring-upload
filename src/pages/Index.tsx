import { useState, useCallback } from "react";
import ColoringEditor from "@/components/ColoringEditor";
import ColoringGallery from "@/components/ColoringGallery";
import ColoringUpload from "@/components/ColoringUpload";
import ColoringHelp from "@/components/ColoringHelp";
import Icon from "@/components/ui/icon";

type Tab = "editor" | "gallery" | "upload" | "help";

const ADMIN_PIN = "1234";

const publicTabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "editor", label: "Редактор", emoji: "🎨" },
  { id: "gallery", label: "Галерея", emoji: "🖼️" },
  { id: "help", label: "Справка", emoji: "💡" },
];

const adminTabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "editor", label: "Редактор", emoji: "🎨" },
  { id: "gallery", label: "Галерея", emoji: "🖼️" },
  { id: "upload", label: "Загрузка", emoji: "📂" },
  { id: "help", label: "Справка", emoji: "💡" },
];

function AdminPinModal({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);

  const handleInput = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      if (next === ADMIN_PIN) {
        setTimeout(onSuccess, 200);
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => { setPin(""); setShake(false); }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative rounded-3xl p-8 flex flex-col items-center gap-6 w-80"
        style={{
          background: "var(--color-card)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          animation: shake ? "shake 0.5s ease" : "fade-in 0.25s ease",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 transition-all hover:scale-110"
          style={{ background: "var(--color-border)", color: "var(--color-text-muted)" }}
        >
          <Icon name="X" size={16} />
        </button>

        <div className="text-4xl">🔐</div>
        <div className="text-center">
          <h3 className="font-heading font-black text-xl" style={{ color: "var(--color-text)" }}>
            Режим администратора
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            Введите пин-код для доступа
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full transition-all duration-200"
              style={{
                background: i < pin.length
                  ? error ? "#EF4444" : "var(--color-primary)"
                  : "var(--color-border)",
                transform: i < pin.length ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {digits.map((d, i) => (
            <button
              key={i}
              disabled={d === ""}
              onClick={() => d === "⌫" ? handleDelete() : d !== "" ? handleInput(d) : null}
              className="h-14 rounded-2xl font-bold text-xl transition-all duration-150 select-none disabled:opacity-0"
              style={{
                background: d === "⌫" ? "var(--color-border)" : "var(--color-nav-btn)",
                color: d === "⌫" ? "var(--color-text-muted)" : "var(--color-text)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {d}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>
            Неверный пин-код, попробуйте снова
          </p>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [gallery, setGallery] = useState<{ id: string; svg: string; name: string; date: string }[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const tabs = isAdmin ? adminTabs : publicTabs;

  const handleSave = useCallback((svg: string, name: string) => {
    const item = {
      id: Date.now().toString(),
      svg,
      name,
      date: new Date().toLocaleDateString("ru-RU"),
    };
    setGallery((prev) => [item, ...prev]);
  }, []);

  const handleLoadFromGallery = useCallback((svg: string) => {
    setSvgContent(svg);
    setActiveTab("editor");
  }, []);

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setShowPinModal(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    if (activeTab === "upload") setActiveTab("editor");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      {showPinModal && (
        <AdminPinModal onSuccess={handleAdminSuccess} onClose={() => setShowPinModal(false)} />
      )}

      {/* Header */}
      <header className="relative overflow-hidden" style={{ background: "var(--color-header)" }}>
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${20 + (i * 13) % 40}px`,
                height: `${20 + (i * 13) % 40}px`,
                background: ["#FF6B9D", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6B6B", "#C77DFF"][i % 6],
                left: `${(i * 8.5) % 100}%`,
                top: `${(i * 17) % 80}%`,
                animation: `float ${3 + (i % 3)}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 container mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl select-none" style={{ animation: "wiggle 3s ease-in-out infinite" }}>🎨</div>
            <div>
              <h1 className="font-heading text-3xl font-black text-white leading-tight drop-shadow-md">
                КрасиМир
              </h1>
              <p className="text-white/80 text-sm font-semibold mt-0.5">Интерактивная раскраска</p>
            </div>
          </div>

          {/* Admin toggle */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(8px)" }}
              >
                <Icon name="ShieldOff" size={15} />
                Выйти из режима admin
              </button>
            ) : (
              <button
                onClick={() => setShowPinModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.15)", color: "white", backdropFilter: "blur(8px)" }}
              >
                <Icon name="Shield" size={15} />
                Для администратора
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-30 shadow-md" style={{ background: "var(--color-nav-bg)", borderBottom: "3px solid var(--color-primary)" }}>
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-200 select-none"
                style={{
                  background: activeTab === tab.id ? "var(--color-primary)" : "var(--color-nav-btn)",
                  color: activeTab === tab.id ? "white" : "var(--color-nav-text)",
                  transform: activeTab === tab.id ? "scale(1.06)" : "scale(1)",
                  boxShadow: activeTab === tab.id ? "0 4px 14px var(--color-primary-shadow)" : "none",
                }}
              >
                <span className="text-base">{tab.emoji}</span>
                {tab.label}
                {tab.id === "upload" && isAdmin && (
                  <span
                    className="ml-1 text-xs px-1.5 py-0.5 rounded-lg font-black"
                    style={{
                      background: activeTab === "upload" ? "rgba(255,255,255,0.25)" : "var(--color-primary)",
                      color: "white",
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </button>
            ))}

            {isAdmin && (
              <div
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: "var(--color-primary)", color: "white", opacity: 0.85 }}
              >
                <Icon name="ShieldCheck" size={13} />
                Режим admin
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {activeTab === "editor" && (
          <ColoringEditor
            svgContent={svgContent}
            onSave={handleSave}
            onClear={() => setSvgContent(null)}
          />
        )}
        {activeTab === "gallery" && (
          <ColoringGallery
            items={gallery}
            onLoad={handleLoadFromGallery}
            onDelete={(id) => setGallery((prev) => prev.filter((i) => i.id !== id))}
          />
        )}
        {activeTab === "upload" && isAdmin && (
          <ColoringUpload
            onUpload={(svg) => {
              setSvgContent(svg);
              setActiveTab("editor");
            }}
          />
        )}
        {activeTab === "help" && <ColoringHelp />}
      </main>
    </div>
  );
}
