import { useState, useCallback } from "react";
import ColoringEditor from "@/components/ColoringEditor";
import ColoringGallery from "@/components/ColoringGallery";
import ColoringUpload from "@/components/ColoringUpload";
import ColoringHelp from "@/components/ColoringHelp";

type Tab = "editor" | "gallery" | "upload" | "help";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "editor", label: "Редактор", emoji: "🎨" },
  { id: "gallery", label: "Галерея", emoji: "🖼️" },
  { id: "upload", label: "Загрузка", emoji: "📂" },
  { id: "help", label: "Справка", emoji: "💡" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("editor");
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [gallery, setGallery] = useState<{ id: string; svg: string; name: string; date: string }[]>([]);

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

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
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
        <div className="relative z-10 container mx-auto px-6 py-5 flex items-center gap-4">
          <div className="text-5xl select-none" style={{ animation: "wiggle 3s ease-in-out infinite" }}>🎨</div>
          <div>
            <h1 className="font-heading text-3xl font-black text-white leading-tight drop-shadow-md">
              КрасиМир
            </h1>
            <p className="text-white/80 text-sm font-semibold mt-0.5">Интерактивная раскраска</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-30 shadow-md" style={{ background: "var(--color-nav-bg)", borderBottom: "3px solid var(--color-primary)" }}>
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
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
              </button>
            ))}
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
        {activeTab === "upload" && (
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
