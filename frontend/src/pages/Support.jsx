import React, { useState } from "react";

export default function Support() {

  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {

    e.preventDefault();

    setSubmitted(true);

    setForm({
      subject: "",
      message: "",
    });

  };

  return (
    <section className="page-section">

      <div className="support-container">

        <span className="page-eyebrow">
          Help Center
        </span>

        <h1>
          How can we help?
        </h1>

        <p>
          Contact the Smart Interview support team
          if you need assistance.
        </p>

        <div className="support-grid">

          <div className="support-info">

            <div className="support-card">
              <span>📧</span>

              <h2>
                Email Support
              </h2>

              <p>
                support@smartinterview.com
              </p>
            </div>

            <div className="support-card">
              <span>💬</span>

              <h2>
                Technical Help
              </h2>

              <p>
                Get help with coding tests,
                MCQs and platform issues.
              </p>
            </div>

            <div className="support-card">
              <span>🔐</span>

              <h2>
                Account Help
              </h2>

              <p>
                Get assistance with login,
                registration and password recovery.
              </p>
            </div>

          </div>

          <form
            className="support-form"
            onSubmit={handleSubmit}
          >

            <h2>
              Send us a message
            </h2>

            <label>
              Subject
            </label>

            <input
              type="text"
              value={form.subject}
              onChange={(e) =>
                setForm({
                  ...form,
                  subject: e.target.value,
                })
              }
              placeholder="What do you need help with?"
              required
            />

            <label>
              Message
            </label>

            <textarea
              value={form.message}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }
              placeholder="Describe your problem..."
              rows="6"
              required
            />

            <button
              type="submit"
              className="page-primary-btn"
            >
              Send Message
            </button>

            {submitted && (
              <p className="support-success">
                ✓ Your message has been submitted.
              </p>
            )}

          </form>

        </div>

      </div>

    </section>
  );
}