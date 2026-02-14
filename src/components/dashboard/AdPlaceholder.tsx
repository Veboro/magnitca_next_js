import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  className?: string;
  size?: "banner" | "sidebar" | "inline";
}

const sizeStyles = {
  banner: "h-[90px] w-full",
  sidebar: "h-[250px] w-full",
  inline: "h-[100px] w-full",
};

export const AdPlaceholder = ({ className, size = "banner" }: AdPlaceholderProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border/40 bg-secondary/20 flex items-center justify-center",
        sizeStyles[size],
        className
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
        Реклама
      </span>
    </div>
  );
};
