import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const Motion = motion

const Icon = ({ name }) => {
  const common = { className: "h-8 w-8" };
  switch (name) {
    case "register":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 20a8 8 0 0116 0" />
        </svg>
      );
    case "tender":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6M12 5v14" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      );
    case "bid":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 6l-4 4 4 4" />
        </svg>
      );
    case "evaluate":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-6a3 3 0 013-3h0a3 3 0 013 3v6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 21h14" />
        </svg>
      );
    case "dash":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 13h4v6H3zM10 7h4v12h-4zM17 3h4v16h-4z" />
        </svg>
      );
    case "notify":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
        </svg>
      );
    default:
      return null;
  }
};

const features = [
  { id: "register", title: "User Registration", desc: "Fast, role-based onboarding for buyers and suppliers." },
  { id: "tender", title: "Tender Creation", desc: "Create detailed tenders with attachments, timelines, and scoring rules." },
  { id: "bid", title: "Bid Submission", desc: "Secure, time-stamped bids with encryption and audit trails." },
  { id: "evaluate", title: "Evaluation", desc: "Automated scoring workflows with configurable evaluators." },
  { id: "dash", title: "Dashboards", desc: "Role-based analytics for insights, spend and supplier performance." },
  { id: "notify", title: "Notifications", desc: "Real-time alerts, reminders and communications across channels." },
];

const RoleCard = ({ role, subtitle, items }) => (
  <motion.div whileHover={{ y: -6 }} className="bg-white/6 backdrop-blur-md border border-white/6 rounded-2xl p-6 shadow-lg">
    <h4 className="text-xl font-semibold text-white">{role}</h4>
    <p className="text-sm text-slate-200 mt-2">{subtitle}</p>
    <ul className="mt-4 space-y-2 text-slate-200 text-sm">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-1 text-amber-200">•</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-black text-neutral-100 antialiased">
      {/* load Manrope for this page only */}
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      {/* NAV */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] p-1 shadow-md">
            <div className="bg-black/60 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
              <span className="font-bold text-amber-100">EB</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">EasyBid</h1>
            <p className="text-xs text-slate-500">Online Tender Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/auth')} className="px-4 py-2 rounded-lg text-amber-800 bg-white/90 shadow-sm hover:scale-105 transition">Login</button>
          <button onClick={() => navigate('/auth')} className="px-4 py-2 rounded-lg bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white shadow-md hover:scale-105 transition">Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <header className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1950&q=80"
            alt="tendering workspace"
            className="w-full h-[720px] object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/70"></div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 flex items-center">
            <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-start gap-8">
              <div className="flex-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-lg">
                <h2 className="text-5xl md:text-6xl font-extrabold text-amber-100">Digitize Your Tendering — Fast, Fair, and Transparent</h2>
                <p className="mt-4 text-amber-200 text-xl md:text-2xl">EasyBid automates tender creation, secure bid submission and impartial evaluation — saving time and improving outcomes.</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => navigate('/auth')} className="px-6 py-3 rounded-lg bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white font-semibold shadow-md hover:scale-105 transition" aria-label="Get Started">Get Started</button>
                  <button className="px-6 py-3 rounded-lg bg-white/90 text-[#7a2b00] border border-white/80 hover:scale-105 transition" aria-label="Watch Demo">Watch Demo</button>
                </div>
              </div>

              <div className="w-full lg:w-80 bg-black/40 backdrop-blur-md border border-white/6 rounded-2xl p-4 shadow-lg">
                <h3 className="text-sm md:text-base font-semibold text-amber-100">Trusted by procurement teams</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/20 rounded">Logo</div>
                  <div className="p-3 bg-white/20 rounded">Logo</div>
                  <div className="p-3 bg-white/20 rounded">Logo</div>
                  <div className="p-3 bg-white/20 rounded">Logo</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Problem / Solution */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h3 className="text-2xl font-bold text-amber-100">The problem with manual tendering</h3>
            <ul className="mt-4 space-y-3 text-neutral-300">
              <li>Paper-based processes and slow approvals.</li>
              <li>Lack of standardized evaluation and audit trails.</li>
              <li>Poor supplier engagement and transparency.</li>
            </ul>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-md">
              <h4 className="text-xl font-semibold text-amber-100">How EasyBid solves it</h4>
              <ul className="mt-4 space-y-3 text-neutral-300">
                <li>End-to-end digitization with role-based workflows.</li>
                <li>Automated scoring, secure time-stamped bids and audit logs.</li>
                <li>Notifications, dashboards and compliance-ready records.</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
  <h3 className="text-2xl font-bold text-amber-100 text-center">Core features</h3>
  <p className="text-center text-neutral-300 mt-2">Everything procurement teams need to run efficient, transparent tenders.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <motion.article key={f.id} whileHover={{ scale: 1.03 }} className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-linear-to-tr from-[#ff8a4c] to-[#ff5c2e] text-white">
                  <Icon name={f.id} />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-100 text-xl">{f.title}</h4>
                  <p className="text-sm md:text-base text-amber-200 mt-1">{f.desc}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Role-based previews */}
      <section className="max-w-7xl mx-auto px-6 py-12">
  <h3 className="text-3xl md:text-4xl font-bold text-amber-100 text-center">Role-based dashboards</h3>
  <p className="text-center text-amber-200 mt-2 text-lg">Tailored experiences for Buyers, Suppliers and Admins.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoleCard role="Buyer" subtitle="Create tenders, evaluate bids and award contracts." items={["Create tenders","Manage evaluations","Download audit trail"]} />
          <RoleCard role="Supplier" subtitle="Discover relevant tenders and submit compliant bids." items={["Tender browsing","Secure bid upload","Track awards"]} />
          <RoleCard role="Admin" subtitle="Configure security, users and integrations." items={["User & role mgmt","Security & logs","Integrations & API"]} />
        </div>
      </section>

      {/* Trust & Compliance */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="rounded-2xl p-8 bg-white/30 backdrop-blur-md border border-white/20 shadow-md">
          <h3 className="text-xl md:text-2xl font-semibold text-amber-100">Trust & Compliance</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-white/6 rounded text-amber-200 font-medium">ISO 27001</div>
            <div className="p-4 bg-white/6 rounded text-amber-200 font-medium">GDPR</div>
            <div className="p-4 bg-white/6 rounded text-amber-200 font-medium">Blockchain-ready security</div>
            <div className="p-4 bg-white/6 rounded text-amber-200 font-medium">99.9% uptime SLA</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-3xl md:text-4xl font-bold text-amber-100 text-center">What customers say</h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.blockquote whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 shadow-md">
            <p className="text-amber-200 text-lg">“EasyBid reduced our procurement cycle by 60% and improved transparency across stakeholders.”</p>
            <footer className="mt-4 text-sm text-amber-200">— Procurement Lead, Acme Corp</footer>
          </motion.blockquote>

          <motion.blockquote whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 shadow-md">
            <p className="text-amber-200 text-lg">“The evaluation workflows are straightforward and the audit logs give us confidence.”</p>
            <footer className="mt-4 text-sm text-amber-200">— Head of Sourcing, Gov Agency</footer>
          </motion.blockquote>

          <motion.blockquote whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} className="p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 shadow-md">
            <p className="text-amber-200 text-lg">“Our suppliers appreciate the clear process and secure bid submission.”</p>
            <footer className="mt-4 text-sm text-amber-200">— Vendor Manager, SupplyCo</footer>
          </motion.blockquote>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 py-12">
  <div className="rounded-2xl p-8 bg-linear-to-r from-[#ff8a4c] to-[#ff5c2e] text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-2xl font-bold">Ready to modernize your tendering?</h4>
            <p className="mt-2 text-amber-50">Start a free trial or book a demo to see EasyBid in action.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/auth')} className="px-5 py-3 rounded-lg bg-white text-amber-900 font-semibold hover:scale-105 transition">Start Free Trial</button>
            <button className="px-5 py-3 rounded-lg border border-white/40 text-white hover:scale-105 transition">Book a Demo</button>
          </div>
        </div>
      </section>

  <footer className="max-w-7xl mx-auto px-6 py-8 text-sm text-neutral-400">
        <div className="flex items-center justify-between">
          <div>© {new Date().getFullYear()} EasyBid — All rights reserved</div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
