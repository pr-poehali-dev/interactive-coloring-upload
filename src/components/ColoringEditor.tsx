import { useState, useRef, useCallback, useEffect } from "react";
import Icon from "@/components/ui/icon";

const PALETTES = [
  {
    name: "Радуга",
    emoji: "🌈",
    colors: ["#FF6B6B", "#FF9F43", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF", "#FF6B9D", "#48CAE4"],
  },
  {
    name: "Пастель",
    emoji: "🌸",
    colors: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#E8BAFF", "#FFC8DD", "#BDE0FE"],
  },
  {
    name: "Лес",
    emoji: "🌿",
    colors: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2", "#B7E4C7", "#D8F3DC", "#1B4332"],
  },
  {
    name: "Закат",
    emoji: "🌅",
    colors: ["#FF0054", "#FF5400", "#FFBD00", "#390099", "#9E0059", "#FF6B6B", "#F77F00", "#D62828"],
  },
  {
    name: "Море",
    emoji: "🌊",
    colors: ["#03045E", "#023E8A", "#0077B6", "#0096C7", "#00B4D8", "#48CAE4", "#90E0EF", "#ADE8F4"],
  },
];

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="white"/>
  <!-- Солнце -->
  <circle cx="320" cy="80" r="45" fill="white" stroke="#333" stroke-width="3"/>
  <line x1="320" y1="20" x2="320" y2="5" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <line x1="320" y1="140" x2="320" y2="155" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <line x1="260" y1="80" x2="245" y2="80" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <line x1="380" y1="80" x2="395" y2="80" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <line x1="277" y1="37" x2="267" y2="27" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <line x1="363" y1="123" x2="373" y2="133" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <line x1="363" y1="37" x2="373" y2="27" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <line x1="277" y1="123" x2="267" y2="133" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <!-- Облако -->
  <ellipse cx="100" cy="90" rx="60" ry="35" fill="white" stroke="#333" stroke-width="3"/>
  <ellipse cx="70" cy="105" rx="40" ry="28" fill="white" stroke="#333" stroke-width="3"/>
  <ellipse cx="140" cy="105" rx="40" ry="25" fill="white" stroke="#333" stroke-width="3"/>
  <!-- Домик -->
  <rect x="130" y="220" width="140" height="120" fill="white" stroke="#333" stroke-width="3"/>
  <polygon points="100,220 200,140 300,220" fill="white" stroke="#333" stroke-width="3"/>
  <rect x="165" y="290" width="40" height="50" fill="white" stroke="#333" stroke-width="3"/>
  <rect x="145" y="240" width="40" height="40" fill="white" stroke="#333" stroke-width="3"/>
  <rect x="215" y="240" width="40" height="40" fill="white" stroke="#333" stroke-width="3"/>
  <!-- Трава -->
  <rect x="0" y="340" width="400" height="60" fill="white" stroke="#333" stroke-width="3"/>
  <!-- Цветок 1 -->
  <circle cx="50" cy="335" r="12" fill="white" stroke="#333" stroke-width="2.5"/>
  <line x1="50" y1="347" x2="50" y2="380" stroke="#333" stroke-width="2.5"/>
  <ellipse cx="40" cy="360" rx="12" ry="6" fill="white" stroke="#333" stroke-width="2" transform="rotate(-30 40 360)"/>
  <!-- Цветок 2 -->
  <circle cx="360" cy="335" r="12" fill="white" stroke="#333" stroke-width="2.5"/>
  <line x1="360" y1="347" x2="360" y2="380" stroke="#333" stroke-width="2.5"/>
  <ellipse cx="370" cy="360" rx="12" ry="6" fill="white" stroke="#333" stroke-width="2" transform="rotate(30 370 360)"/>
  <!-- Дерево -->
  <rect x="38" y="200" width="14" height="70" fill="white" stroke="#333" stroke-width="2.5"/>
  <circle cx="45" cy="185" r="35" fill="white" stroke="#333" stroke-width="2.5"/>
  <rect x="358" y="200" width="14" height="70" fill="white" stroke="#333" stroke-width="2.5"/>
  <circle cx="365" cy="185" r="30" fill="white" stroke="#333" stroke-width="2.5"/>
</svg>`;

interface Props {
  svgContent: string | null;
  onSave: (svg: string, name: string) => void;
  onClear: () => void;
}

export default function ColoringEditor({ svgContent, onSave, onClear }: Props) {
  const svgRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState("#FFD93D");
  const [activePalette, setActivePalette] = useState(0);
  const [customColors, setCustomColors] = useState<string[]>(["#FF6B6B", "#4D96FF", "#6BCB77"]);
  const [customInput, setCustomInput] = useState("#FF6B6B");
  const [saveName, setSaveName] = useState("Моя картинка");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [currentSvg, setCurrentSvg] = useState(svgContent || DEFAULT_SVG);
  const [tool, setTool] = useState<"fill" | "eraser">("fill");

  useEffect(() => {
    if (svgContent) setCurrentSvg(svgContent);
  }, [svgContent]);

  const handleSvgClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as SVGElement;
    if (target.tagName === "svg" || target.tagName === "SVG") return;
    if (!["path", "circle", "rect", "ellipse", "polygon", "polyline"].includes(target.tagName.toLowerCase())) return;

    setHistory((prev) => [...prev.slice(-19), currentSvg]);

    const fillColor = tool === "eraser" ? "white" : selectedColor;
    target.setAttribute("fill", fillColor);

    if (svgRef.current) {
      const svgEl = svgRef.current.querySelector("svg");
      if (svgEl) setCurrentSvg(svgEl.outerHTML);
    }
  }, [selectedColor, tool, currentSvg]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentSvg(prev);
  };

  const handleReset = () => {
    setHistory((prev) => [...prev, currentSvg]);
    setCurrentSvg(svgContent || DEFAULT_SVG);
  };

  const handleDownload = () => {
    const blob = new Blob([currentSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${saveName}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addCustomColor = () => {
    if (!customColors.includes(customInput)) {
      setCustomColors((prev) => [...prev.slice(-7), customInput]);
    }
    setSelectedColor(customInput);
  };

  return (
    <div
      className="flex gap-3"
      style={{ height: "calc(100vh - 130px)", minHeight: "520px" }}
    >
      {/* Canvas — крупный план */}
      <div
        className="flex-1 rounded-3xl overflow-hidden shadow-lg flex items-center justify-center"
        style={{
          background: "white",
          border: "3px solid var(--color-border)",
          cursor: tool === "fill" ? "crosshair" : "cell",
        }}
      >
        <div
          ref={svgRef}
          className="w-full h-full flex items-center justify-center p-2"
          onClick={handleSvgClick}
          dangerouslySetInnerHTML={{ __html: currentSvg }}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </div>

      {/* Right panel */}
      <div className="w-60 flex flex-col gap-2 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {/* Tools row */}
        <div className="rounded-2xl p-2.5 flex flex-col gap-2 shadow-sm" style={{ background: "var(--color-card)" }}>
          <div className="flex gap-1.5">
            <button
              onClick={() => setTool("fill")}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl font-bold text-xs transition-all"
              style={{
                background: tool === "fill" ? "var(--color-primary)" : "var(--color-btn-bg)",
                color: tool === "fill" ? "white" : "var(--color-btn-text)",
              }}
            >
              <span>🪣</span> Заливка
            </button>
            <button
              onClick={() => setTool("eraser")}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl font-bold text-xs transition-all"
              style={{
                background: tool === "eraser" ? "#FF6B6B" : "var(--color-btn-bg)",
                color: tool === "eraser" ? "white" : "var(--color-btn-text)",
              }}
            >
              <span>🧹</span> Ластик
            </button>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl font-bold text-xs transition-all disabled:opacity-40"
              style={{ background: "var(--color-btn-bg)", color: "var(--color-btn-text)" }}
            >
              <Icon name="Undo2" size={13} /> Отмена
            </button>
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl font-bold text-xs transition-all"
              style={{ background: "var(--color-btn-bg)", color: "var(--color-btn-text)" }}
            >
              <Icon name="RotateCcw" size={13} /> Сброс
            </button>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl font-bold text-xs text-white transition-all"
              style={{ background: "var(--color-primary)" }}
            >
              <Icon name="Save" size={13} /> Сохранить
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl font-bold text-xs transition-all"
              style={{ background: "var(--color-btn-bg)", color: "var(--color-btn-text)" }}
            >
              <Icon name="Download" size={13} /> Скачать
            </button>
          </div>
        </div>

        {/* Selected color */}
        <div className="rounded-2xl px-3 py-2 shadow-sm flex items-center gap-2.5" style={{ background: "var(--color-card)" }}>
          <div
            className="w-9 h-9 rounded-xl flex-shrink-0 border-2 border-white"
            style={{ background: selectedColor, boxShadow: `0 3px 10px ${selectedColor}88` }}
          />
          <div>
            <p className="font-black text-sm leading-tight" style={{ color: "var(--color-text)" }}>{selectedColor}</p>
            <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
              {tool === "fill" ? "🪣 Заливка" : "🧹 Ластик"}
            </p>
          </div>
        </div>

        {/* Palette tabs */}
        <div className="rounded-2xl p-2.5 shadow-sm" style={{ background: "var(--color-card)" }}>
          <div className="flex flex-wrap gap-1 mb-2">
            {PALETTES.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePalette(i)}
                className="px-1.5 py-0.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: activePalette === i ? "var(--color-primary)" : "var(--color-btn-bg)",
                  color: activePalette === i ? "white" : "var(--color-btn-text)",
                }}
              >
                {p.emoji}
              </button>
            ))}
            <span className="text-xs font-bold self-center ml-1" style={{ color: "var(--color-text-muted)" }}>
              {PALETTES[activePalette].name}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {PALETTES[activePalette].colors.map((color) => (
              <button
                key={color}
                onClick={() => { setSelectedColor(color); setTool("fill"); }}
                className="aspect-square rounded-xl transition-all hover:scale-110"
                style={{
                  background: color,
                  boxShadow: selectedColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : `0 2px 6px ${color}55`,
                  transform: selectedColor === color ? "scale(1.15)" : undefined,
                }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Custom palette */}
        <div className="rounded-2xl p-2.5 shadow-sm" style={{ background: "var(--color-card)" }}>
          <p className="font-bold text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>✨ Свои цвета</p>
          <div className="flex gap-1.5 mb-2">
            <input
              type="color"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-10 h-8 rounded-lg cursor-pointer border-2 border-white shadow"
              style={{ padding: "2px" }}
            />
            <button
              onClick={addCustomColor}
              className="flex-1 rounded-xl font-bold text-xs text-white transition-all"
              style={{ background: "var(--color-primary)" }}
            >
              + Добавить
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {customColors.map((color) => (
              <button
                key={color}
                onClick={() => { setSelectedColor(color); setTool("fill"); }}
                className="w-8 h-8 rounded-xl transition-all hover:scale-110"
                style={{
                  background: color,
                  boxShadow: selectedColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : `0 2px 6px ${color}66`,
                  transform: selectedColor === color ? "scale(1.2)" : undefined,
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowSaveModal(false)}
        >
          <div
            className="rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            style={{ background: "var(--color-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading font-black text-xl mb-4" style={{ color: "var(--color-text)" }}>
              💾 Сохранить в галерею
            </h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 font-semibold text-sm mb-4 outline-none border-2 transition-all"
              style={{
                background: "var(--color-input-bg)",
                color: "var(--color-text)",
                borderColor: "var(--color-border)",
              }}
              placeholder="Название работы"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 rounded-2xl py-3 font-bold text-sm transition-all"
                style={{ background: "var(--color-btn-bg)", color: "var(--color-btn-text)" }}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onSave(currentSvg, saveName);
                  setShowSaveModal(false);
                }}
                className="flex-1 rounded-2xl py-3 font-bold text-sm text-white transition-all"
                style={{ background: "var(--color-primary)", boxShadow: "0 4px 12px var(--color-primary-shadow)" }}
              >
                Сохранить 🎉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}