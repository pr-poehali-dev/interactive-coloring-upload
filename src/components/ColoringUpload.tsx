import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onUpload: (svg: string) => void;
}

export default function ColoringUpload({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const processSvg = (text: string) => {
    if (!text.includes("<svg") && !text.includes("<SVG")) {
      setError("Файл не является SVG. Пожалуйста, загрузите файл с расширением .svg");
      setPreview(null);
      return;
    }
    setError(null);
    setPreview(text);
  };

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".svg")) {
      setError("Пожалуйста, загрузите файл формата SVG (.svg)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => processSvg(e.target?.result as string);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">📂</span>
        <h2 className="font-heading font-black text-2xl" style={{ color: "var(--color-text)" }}>
          Загрузить картинку
        </h2>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="rounded-3xl flex flex-col items-center justify-center gap-4 py-16 cursor-pointer transition-all"
        style={{
          border: `3px dashed ${dragging ? "var(--color-primary)" : "var(--color-border)"}`,
          background: dragging ? "var(--color-primary-light)" : "var(--color-card)",
          transform: dragging ? "scale(1.02)" : "scale(1)",
        }}
      >
        <div className="text-6xl select-none">{dragging ? "🎯" : "📤"}</div>
        <div className="text-center">
          <p className="font-heading font-black text-xl mb-1" style={{ color: "var(--color-text)" }}>
            {dragging ? "Отпусти файл!" : "Перетащи SVG сюда"}
          </p>
          <p className="font-medium text-sm" style={{ color: "var(--color-text-muted)" }}>
            или нажми для выбора файла
          </p>
        </div>
        <div
          className="px-5 py-2.5 rounded-2xl font-bold text-sm text-white"
          style={{ background: "var(--color-primary)", boxShadow: "0 4px 12px var(--color-primary-shadow)" }}
        >
          <Icon name="FolderOpen" size={16} className="inline mr-2" />
          Выбрать файл
        </div>
        <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
          Поддерживается формат: .svg
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".svg,image/svg+xml"
          className="hidden"
          onChange={handleInput}
        />
      </div>

      {error && (
        <div className="rounded-2xl px-4 py-3 font-semibold text-sm flex items-center gap-2" style={{ background: "#FFE5E5", color: "#D62828" }}>
          <Icon name="AlertCircle" size={16} />
          {error}
        </div>
      )}

      {preview && (
        <div className="rounded-3xl overflow-hidden shadow-md" style={{ background: "var(--color-card)", border: "2px solid var(--color-border)" }}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: "2px solid var(--color-border)" }}>
            <span className="font-bold" style={{ color: "var(--color-text)" }}>✅ Файл готов к редактированию</span>
          </div>
          <div className="bg-white p-4 flex items-center justify-center" style={{ maxHeight: "300px" }}>
            <div
              style={{ maxWidth: "100%", maxHeight: "260px" }}
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
          <div className="p-4">
            <button
              onClick={() => onUpload(preview)}
              className="w-full py-3 rounded-2xl font-black text-lg text-white transition-all hover:scale-[1.02]"
              style={{ background: "var(--color-primary)", boxShadow: "0 6px 18px var(--color-primary-shadow)" }}
            >
              🎨 Открыть в редакторе
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-3xl p-5 shadow-sm" style={{ background: "var(--color-card)" }}>
        <p className="font-bold text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>💡 Советы</p>
        <ul className="flex flex-col gap-2">
          {[
            "Лучше всего работают SVG с контурами без заливки (stroke, no fill)",
            "Можно найти бесплатные раскраски на сайте freepik.com или flaticon.com",
            "После загрузки можно красить любую область кликом мыши",
          ].map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
              <span className="mt-0.5">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
