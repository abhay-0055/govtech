// src/app/page.tsx

import Link from "next/link";

const roles = [
  {
    title: "Citizen",
    description:
      "Register and submit service requests. Track the status of your applications and receive officer feedback.",
    capabilities: [
      "Submit new service requests",
      "View your request history",
      "See approval/rejection notes from officers",
    ],
  },
  {
    title: "Officer",
    description:
      "Review and action citizen requests. Approve or reject with notes.",
    capabilities: [
      "View all pending requests",
      "Approve or reject with officer notes",
      "Update request status",
    ],
  },
  {
    title: "Admin",
    description:
      "Manage users and roles. Monitor all system activity via audit logs.",
    capabilities: [
      "List and manage all users",
      "Assign or change user roles",
      "View full audit log (read-only)",
    ],
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero */}
      <section className="bg-blue-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">GovTech Citizen Services</h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          A secure, role-based platform for citizens to submit service requests,
          officers to review them, and admins to oversee the system.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Get Started — Sign Up
          </Link>
          <Link
            href="/login"
            className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Role Capabilities */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          What can you do?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.title}
              className="bg-white rounded-xl shadow p-6 flex flex-col gap-3"
            >
              <h3 className="text-xl font-semibold text-blue-700">
                {role.title}
              </h3>
              <p className="text-sm text-gray-600">{role.description}</p>
              <ul className="mt-2 space-y-1">
                {role.capabilities.map((cap) => (
                  <li key={cap} className="text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-blue-50 py-12 text-center px-6">
        <h2 className="text-xl font-semibold mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-6">
          Citizens can sign up instantly. Officers and Admins are provisioned by
          the system administrator.
        </p>
        <Link
          href="/signup"
          className="bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition"
        >
          Create a Citizen Account
        </Link>
      </section>
    </main>
  );
}