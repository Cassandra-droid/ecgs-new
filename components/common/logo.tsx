import { Briefcase } from "lucide-react";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="flex items-center">
    <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
      <Briefcase size={20} />
    </div>
    <span className="bg-gradient-to-r from-brand to-purple-600 bg-clip-text text-xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
      ECGS
    </span>
  </Link>
);
