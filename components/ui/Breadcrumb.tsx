import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm mb-6 overflow-x-auto scrollbar-none">
      <Link href="/" className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 flex-shrink-0">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5 flex-shrink-0">
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          {item.href ? (
            <Link href={item.href} className="text-gray-500 hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-300 font-medium truncate max-w-[200px]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
