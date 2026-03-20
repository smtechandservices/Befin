"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Script from "next/script";
import { Mail, Linkedin, MapPin } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const WEB3FORMS_ACCESS_KEY = "3b31ec38-086a-466b-a36b-05d4e94419b2"; // Replace with your actual key

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    return name.trim() !== "" && email.trim() !== "" && message.trim() !== "";
  }, [name, email, message]);

  return (
    <>
      <Navbar activePage="contact" />
      <Script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" strategy="afterInteractive" />
      
      <section className="pb-16 md:pb-0 flex items-center bg-[aliceblue] w-full">
        <div className="w-full px-4 md:px-8">
          <motion.div
            className="max-w-9xl mx-auto py-14 sm:py-16"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-lg lg:text-xl text-[#2563eb] font-medium">
              We’d love to hear from you! 
            </p>
            <h1 className="mt-2 text-3xl lg:text-5xl font-semibold leading-tight bg-gradient-to-r from-[#30a5fa] to-[#2563eb] text-transparent bg-clip-text">
              Contact Us
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed max-w-5xl">
              Whether it's a question, feedback, or a partnership inquiry, our dedicated team is here to assist you. Expect a prompt response within 24 hours.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#2563eb]">
                    <Mail className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-semibold text-gray-900">Email</h2>
                </div>
                <p className="mt-3 text-sm text-gray-600">Write to us anytime.</p>
                <a
                  href="mailto:info@befin.in"
                  className="mt-3 inline-block text-[#2563eb] font-medium hover:underline"
                >
                  info@befin.in
                </a>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#2563eb]">
                    <Linkedin className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-semibold text-gray-900">LinkedIn</h2>
                </div>
                <p className="mt-3 text-sm text-gray-600">Follow updates and message us.</p>
                <a
                  href="https://www.linkedin.com/company/befin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[#2563eb] font-medium hover:underline"
                >
                  linkedin.com/company/befin
                </a>
              </motion.div>

              <motion.div
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#2563eb]">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-semibold text-gray-900">Location</h2>
                </div>
                <p className="mt-3 text-sm text-gray-600">Technology Hub, India</p>
                <span className="mt-3 inline-block bg-[#e8f0fe] text-[#2563eb] text-xs font-semibold px-2 py-1 rounded-full border border-gray-300">
                  Technology Hub, India
                </span>
              </motion.div>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
              <motion.div
                className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <h2 className="text-xl font-semibold text-gray-900">Send a message</h2>
                <p className="mt-2 text-sm text-gray-600">We typically respond within 1 business day.</p>

                <form
                  className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5"
                  onSubmit={async (e) => {
                    e.preventDefault();

                    if (!isFormValid || isSubmitting) return;

                    setIsSubmitting(true);
                    try {
                      const formData = new FormData();
                      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
                      formData.append("name", name);
                      formData.append("email", email);
                      formData.append("company", company);
                      formData.append("message", message);
                      formData.append("subject", `New Contact Form Submission from ${name}`);
                      formData.append("from_name", "Befin Contact Form");
                      formData.append("botcheck", "");

                      const response = await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        body: formData,
                      });

                      const result = await response.json();

                      if (result?.success) {
                        const swal = typeof window !== "undefined" ? window.Swal : undefined;

                        swal?.fire({
                          icon: "success",
                          title: "Message Sent!",
                          text: "Thank you! Your message has been successfully sent. We'll get back to you soon.",
                          confirmButtonText: "OK",
                        });
                        // Reset form
                        setName("");
                        setEmail("");
                        setCompany("");
                        setMessage("");
                      } else {
                        console.error("Form submission error:", result);
                        const swal = typeof window !== "undefined" ? window.Swal : undefined;

                        swal?.fire({
                          icon: "error",
                          title: "Submission Failed",
                          text: result.message || "Something went wrong. Please try again.",
                          confirmButtonText: "OK",
                        });
                      }
                    } catch (error) {
                      console.error("Network error:", error);
                      const swal = typeof window !== "undefined" ? window.Swal : undefined;

                      swal?.fire({
                        icon: "error",
                        title: "Network Error",
                        text: "Unable to send message. Please check your connection and try again.",
                        confirmButtonText: "OK",
                      });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
                  <input type="hidden" name="botcheck" value="" />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Full name *</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb]"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">Email *</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb]"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-900">Company (optional)</label>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb]"
                      placeholder="Company name"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-900">Message *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb]"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end pt-2">
                    <button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="bg-gradient-to-r from-[#1173eb] to-[#1d4ed8] text-white border-none px-6 py-3 rounded-full text-base font-semibold cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </motion.div>

              <motion.div
                className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
              >
                <h2 className="text-xl font-semibold text-gray-900">What to include</h2>
                <p className="mt-2 text-sm text-gray-600">
                  For faster turnaround, share the basics below.
                </p>
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <span className="font-medium text-gray-900">Scope & desired outcomes</span>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <span className="font-medium text-gray-900">Timeline & milestones</span>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <span className="font-medium text-gray-900">Security requirements & compliance</span>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <span className="font-medium text-gray-900">Expected scale (users, traffic, regions)</span>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <span className="font-medium text-gray-900">Existing systems & integrations</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}