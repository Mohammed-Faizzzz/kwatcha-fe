import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-lg bg-black/50 border-b border-white/10 shadow-lg z-50 px-8 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-xl font-bold text-white">MSE Trade</div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-6 text-sm font-medium">
        {["Market", "Companies", "Insights", "Portfolio"].map((section) => (
          <a
            key={section}
            href={`#${section.toLowerCase()}`}
            className="text-white/70 hover:text-blue-400 transition-colors"
          >
            {section}
          </a>
        ))}
      </div>

      {/* Button */}
      <Button
        variant="link"
        className="button-primary hidden md:inline-flex"
        onClick={() => router.push(`/pages/AccountCreationPage`)}
      >
        Get Started
      </Button>

      {/* Mobile menu placeholder */}
      {/* You can add a hamburger menu here for smaller screens */}
    </nav>
  );
}
