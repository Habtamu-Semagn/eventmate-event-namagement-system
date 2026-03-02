'use client';

import Link from 'next/link';
import { HelpCircle, FileQuestion } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo and Copyright */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-foreground">
                            Event<span className="text-[#AC1212]">Mate</span>
                        </h2>
                        <span className="text-sm text-muted-foreground">
                            © 2024 All rights reserved.
                        </span>
                    </div>

                    {/* Footer Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/faq"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#AC1212] transition-colors"
                        >
                            <FileQuestion className="h-4 w-4" />
                            FAQ
                        </Link>
                        <Link
                            href="/help"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#AC1212] transition-colors"
                        >
                            <HelpCircle className="h-4 w-4" />
                            Get Help
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
