const steps = [
  {
    emoji: "🎨",
    title: "Выбери цвет",
    desc: "В панели справа выбери цвет из палитры или создай свой с помощью пипетки.",
  },
  {
    emoji: "🖱️",
    title: "Кликни на область",
    desc: "Нажми на любую часть картинки — она закрасится выбранным цветом.",
  },
  {
    emoji: "🧹",
    title: "Ластик",
    desc: "Включи ластик чтобы убрать цвет с любой области и вернуть её в белый цвет.",
  },
  {
    emoji: "↩️",
    title: "Отмена",
    desc: "Ошибся? Нажми «Отмена» чтобы вернуть последнее действие (до 20 шагов).",
  },
  {
    emoji: "💾",
    title: "Сохранить",
    desc: "Нажми «Сохранить» чтобы добавить работу в Галерею. Или «Скачать» для сохранения SVG.",
  },
];

const paletteTips = [
  { emoji: "🌈", name: "Радуга", desc: "Яркие насыщенные цвета" },
  { emoji: "🌸", name: "Пастель", desc: "Нежные светлые оттенки" },
  { emoji: "🌿", name: "Лес", desc: "Природные зелёные тона" },
  { emoji: "🌅", name: "Закат", desc: "Тёплые оранжево-красные" },
  { emoji: "🌊", name: "Море", desc: "Синие и голубые тона" },
];

export default function ColoringHelp() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">💡</span>
        <h2 className="font-heading font-black text-2xl" style={{ color: "var(--color-text)" }}>
          Как пользоваться
        </h2>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="rounded-3xl p-5 flex gap-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ background: "var(--color-card)", border: "2px solid var(--color-border)" }}
          >
            <div className="text-3xl select-none mt-0.5">{step.emoji}</div>
            <div>
              <p className="font-black text-base mb-1" style={{ color: "var(--color-text)" }}>{step.title}</p>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Palettes */}
      <div className="rounded-3xl p-5 shadow-sm" style={{ background: "var(--color-card)" }}>
        <p className="font-black text-lg mb-4" style={{ color: "var(--color-text)" }}>🎭 Цветовые палитры</p>
        <div className="flex flex-col gap-3">
          {paletteTips.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-2xl">{p.emoji}</span>
              <div>
                <span className="font-bold text-sm" style={{ color: "var(--color-text)" }}>{p.name}</span>
                <span className="text-sm ml-2 font-medium" style={{ color: "var(--color-text-muted)" }}>— {p.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom color */}
      <div
        className="rounded-3xl p-5 shadow-sm"
        style={{ background: "linear-gradient(135deg, #FFD93D22 0%, #FF6B9D22 100%)", border: "2px solid var(--color-border)" }}
      >
        <p className="font-black text-lg mb-2" style={{ color: "var(--color-text)" }}>✨ Свои цвета</p>
        <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          В разделе «Свои цвета» выбери любой цвет с помощью пипетки и нажми «+ Добавить».
          Твои цвета сохраняются в рабочей сессии и появятся в панели для быстрого доступа.
        </p>
      </div>

      <div className="text-center py-4">
        <p className="text-4xl select-none">🎉</p>
        <p className="font-bold mt-2" style={{ color: "var(--color-text-muted)" }}>Приятного творчества!</p>
      </div>
    </div>
  );
}