import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to the Restaurant QR Ordering System
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Please scan a QR code at your table to begin.
      </p>

      <div className="flex gap-4">
        <Link href="/(customer)/scan">
          <span className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors cursor-pointer">
            Go to Scanner
          </span>
        </Link>
        <Link href="/admin/dashboard">
          <span className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors cursor-pointer">
            Go to Admin
          </span>
        </Link>
      </div>
    </main>
  );
}
