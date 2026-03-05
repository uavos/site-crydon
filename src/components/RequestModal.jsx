'use client'

export default function RequestModal({ open, setOpen }) {
  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Form submitted!')
    setOpen(false)
  }

  return (
    <div className="request-overlay">
      <div className="request-modal">
        <button className="request-close" onClick={() => setOpen(false)}>
          ×
        </button>

        <h2 className="request-title">Make a Request</h2>

        <form onSubmit={handleSubmit} className="request-form">
          <div className="input-block">
            <label>
              Subject of Request<span className="req">*</span>
            </label>
            <select required>
              <option value="">Select subject</option>
              <option>General Inquiry</option>
              <option>Partnership</option>
              <option>Technical Support</option>
              <option>Media / Press</option>
            </select>
          </div>

          <div className="input-block">
            <label>
              Full Name<span className="req">*</span>
            </label>
            <input type="text" required placeholder="John Smith" />
          </div>

          <div className="input-block">
            <label>
              Company<span className="req">*</span>
            </label>
            <input type="text" required placeholder="Company Inc." />
          </div>

          <div className="input-block">
            <label>
              Country<span className="req">*</span>
            </label>
            <select required>
              <option value="">Select country</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Germany</option>
              <option>France</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>Japan</option>
              <option>China</option>
            </select>
          </div>

          <div className="input-block">
            <label>Website</label>
            <input type="url" placeholder="https://example.com" />
          </div>

          <div className="input-block">
            <label>
              Phone<span className="req">*</span>
            </label>
            <input type="tel" required placeholder="+1 234 567 890" />
          </div>

          <div className="input-block">
            <label>
              Email<span className="req">*</span>
            </label>
            <input type="email" required placeholder="you@example.com" />
          </div>

          <div className="input-block">
            <label>Message</label>
            <textarea
              maxLength="350"
              rows="3"
              placeholder="Your message (optional)"
            />
          </div>

          <div className="request-actions">
            <button
              type="button"
              className="cancel"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="send">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
