import Link from "next/link";

export default function NotFound({
  title = "Page not found",
  message = "The page you are looking for does not exist or has been moved.",
  returnText = "Go Home",
  returnHref = "/",
}: {
  title?: string;
  message?: string;
  returnText?: string;
  returnHref?: string;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-black px-4">
      <div className="text-center max-w-md">
        <h2 className="text-6xl font-black text-[#DC2626] mb-4">404</h2>
        <h1 className="text-2xl font-bold text-white mb-3">{title}</h1>
        <p className="text-gray-400 mb-8">{message}</p>
        <Link
          href={returnHref}
          className="inline-flex px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-full transition-all duration-300"
        >
          {returnText}
        </Link>
      </div>
    </div>
  );
}
