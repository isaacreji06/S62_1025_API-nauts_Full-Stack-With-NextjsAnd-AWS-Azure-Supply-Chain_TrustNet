"use client";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-[#f5f8ff] dark:bg-gray-900 
                    px-4 transition-colors duration-300">
      {/* Register Container */}
      <div className="bg-white dark:bg-gray-800 
                      p-8 sm:p-10 rounded-2xl shadow-md 
                      w-full max-w-sm sm:max-w-md md:max-w-lg 
                      transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl font-bold 
                       text-gray-800 dark:text-white 
                       mb-2 text-center">
          Create an Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 
                      mb-8 text-center text-sm sm:text-base">
          Join{" "}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            TrustNet
          </span>{" "}
          and build verified credibility for your business.
        </p>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Phone Number"
            className="border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100 
                       rounded-lg px-4 py-2 text-sm sm:text-base 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       transition"
          />
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100 
                       rounded-lg px-4 py-2 text-sm sm:text-base 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       transition"
          />
          <input
            type="text"
            placeholder="Business Name"
            className="border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100 
                       rounded-lg px-4 py-2 text-sm sm:text-base 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       transition"
          />
          <select
            className="border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100 
                       rounded-lg px-4 py-2 text-sm sm:text-base 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       transition"
          >
            <option value="Customer">Customer</option>
            <option value="Business_Owner">Business Owner</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 
                       text-white font-medium py-2 rounded-lg 
                       text-sm sm:text-base transition"
          >
            Register
          </button>
        </form>

        <p className="text-gray-600 dark:text-gray-400 
                      mt-6 text-sm sm:text-base text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
