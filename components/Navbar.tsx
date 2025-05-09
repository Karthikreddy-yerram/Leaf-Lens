'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="font-bold text-xl">🌿 Leaf-Lens</h1>
      <div className="space-x-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/identify" className="hover:underline">Identify</Link>
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/logout" className="hover:underline">Logout</Link>
      </div>
    </nav>
  );
}
