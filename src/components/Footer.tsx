// src/components/Footer.tsx
import { Github, Twitter, Linkedin, Mail, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  const Item = ({
    href,
    children,
    label,
  }: {
    href: string;
    children: React.ReactNode;
    label: string;
  }) => (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
    >
      {children}
    </Link>
  );

  return (
    <footer className="border-t border-white/10 bg-slate-900/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="text-lg font-semibold">CodeStudy</div>
            <p className="text-sm opacity-70">
              Learn modern web development with interactive paths, live editors,
              and smart progress tracking.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Explore</div>
            <ul className="space-y-1 text-sm opacity-80">
              <li>
                <Link href="/paths">Paths</Link>
              </li>
              <li>
                <Link href="/playground">Playground</Link>
              </li>
              <li>
                <Link href="/news">News</Link>
              </li>
              <li>
                <Link href="/quiz">Quiz</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Contact</div>
            <ul className="space-y-1 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> hello@codestudy.example
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4" /> codestudy.example
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Follow</div>
            <div className="flex items-center gap-3">
              <Item href="https://github.com/" label="GitHub">
                <Github className="w-4 h-4" />
              </Item>
              <Item href="https://twitter.com/" label="Twitter / X">
                <Twitter className="w-4 h-4" />
              </Item>
              <Item href="https://linkedin.com/" label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </Item>
              <Item href="mailto:hello@codestudy.example" label="Email">
                <Mail className="w-4 h-4" />
              </Item>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-sm opacity-60">
          © {year} CodeStudy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
