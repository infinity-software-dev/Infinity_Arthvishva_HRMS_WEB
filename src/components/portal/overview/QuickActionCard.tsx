import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function QuickActionCard({ icon, title, desc, href }: { icon: React.ReactNode, title: string, desc: string, href: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white dark:bg-primary rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800 transition-transform group-hover:-translate-y-1">
        <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-4">
          {icon}
        </div>
        <h3 className="text-base font-bold text-primary dark:text-white mb-1">{title}</h3>
        <p className="text-xs font-medium text-secondary mb-5">{desc}</p>
        <div className="text-xs font-bold text-brand-green flex items-center gap-1">
          Go <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
