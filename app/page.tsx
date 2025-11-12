// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Build Trust for Your
            <span className="text-blue-600 dark:text-blue-400"> Local Business</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            TrustNet helps small businesses establish verified digital identities through
            community validation and UPI transaction verification. No paperwork, just real credibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Register Your Business
            </Link>
            <Link
              href="/discover"
              className="border border-gray-300 bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              Discover Local Businesses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-colors">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 dark:text-blue-400 text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Community Verified
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get endorsed by customers and local community members
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-lg bg-green-50 dark:bg-green-900/20 transition-colors">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 dark:text-green-400 text-2xl">₹</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                UPI Verified
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Verify business activity through transaction patterns
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 transition-colors">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 dark:text-purple-400 text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Trust Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your credibility score and customer insights
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
