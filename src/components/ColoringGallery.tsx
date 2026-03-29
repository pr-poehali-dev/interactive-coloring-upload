import Icon from "@/components/ui/icon";

interface GalleryItem {
  id: string;
  svg: string;
  name: string;
  date: string;
}

interface Props {
  items: GalleryItem[];
  onLoad: (svg: string) => void;
  onDelete: (id: string) => void;
}

export default function ColoringGallery({ items, onLoad, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-7xl select-none" style={{ animation: "wiggle 3s ease-in-out infinite" }}>🖼️</div>
        <h2 className="font-heading font-black text-2xl" style={{ color: "var(--color-text)" }}>
          Галерея пуста
        </h2>
        <p className="text-center max-w-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
          Раскрась картинку в редакторе и нажми «Сохранить» — она появится здесь!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🖼️</span>
        <h2 className="font-heading font-black text-2xl" style={{ color: "var(--color-text)" }}>
          Мои работы
        </h2>
        <span
          className="px-3 py-1 rounded-full font-bold text-sm text-white"
          style={{ background: "var(--color-primary)" }}
        >
          {items.length}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl overflow-hidden shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
            style={{ background: "var(--color-card)", border: "2px solid var(--color-border)" }}
          >
            <div
              className="w-full aspect-square flex items-center justify-center p-2 bg-white"
              dangerouslySetInnerHTML={{ __html: item.svg }}
            />
            <div className="p-4">
              <p className="font-bold truncate mb-1" style={{ color: "var(--color-text)" }}>{item.name}</p>
              <p className="text-xs mb-3 font-medium" style={{ color: "var(--color-text-muted)" }}>{item.date}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onLoad(item.svg)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl font-bold text-sm text-white transition-all"
                  style={{ background: "var(--color-primary)", boxShadow: "0 3px 10px var(--color-primary-shadow)" }}
                >
                  <Icon name="Paintbrush" size={14} /> Редактировать
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 rounded-2xl transition-all hover:bg-red-50"
                  style={{ color: "#FF6B6B" }}
                  title="Удалить"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
