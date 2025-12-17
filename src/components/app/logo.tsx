import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <Leaf className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold font-headline">Wholesome Nutrition AI</span>
    </Link>
  );
}
