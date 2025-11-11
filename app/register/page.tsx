"use client";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center  bg-[#f5f8ff]">
      {/* Register Container */}
      <div className="mt-24 bg-white p-10 rounded-2xl shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h2>
        <p className="text-gray-600 mb-8">
          Join <span className="text-blue-600 font-semibold">TrustNet</span> and build verified credibility for your business.
        </p>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Phone Number"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Business Name"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Customer">Customer</option>
            <option value="Business_Owner">Business Owner</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
