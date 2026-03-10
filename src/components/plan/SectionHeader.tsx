import { useEffect, useState } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  const [isPasifika, setIsPasifika] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsPasifika(document.documentElement.getAttribute("data-theme") === "pasifika");
    });
    setIsPasifika(document.documentElement.getAttribute("data-theme") === "pasifika");
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  if (isPasifika) {
    return (
      <div className="relative overflow-hidden rounded-xl mb-2 -mx-8 -mt-8">
        <div
          className="flex items-center justify-between px-10 py-4"
          style={{
            background: "linear-gradient(135deg, hsl(190 85% 50%), hsl(160 70% 45%), hsl(80 65% 50%))",
          }}
        >
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-md">
              {title}
            </h2>
            <p className="text-white/80 text-sm drop-shadow-sm">{subtitle}</p>
          </div>
          <div className="relative flex-shrink-0 mr-16">
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/pasifika-turtle.jpg"
                alt="Pasifika turtle motif"
                className="w-28 h-28 object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
};
