function renderServiceDetail() {
  const root = document.getElementById("service-app");
  const slug = document.body.dataset.service;
  const service = SERVICE_DATA[slug];

  if (!service) {
    root.innerHTML =
      '<section class="section"><div class="container"><h1>Service not found</h1><p>The requested service could not be loaded.</p></div></section>';
    return;
  }

  root.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <span class="page-hero__eyebrow">Service Detail</span>
        <h1 class="page-hero__title">${service.title}</h1>
        <p class="page-hero__copy">${service.heading}</p>
        <p class="page-hero__copy">${service.summary}</p>
        <div class="cta-group">
          <a href="mailto:hello@gayatripatil.com?subject=Book a Call: ${encodeURIComponent(service.title)}" class="btn-primary">Book a Call</a>
          <a href="mailto:hello@gayatripatil.com?subject=Contact About ${encodeURIComponent(service.title)}" class="btn-secondary">Contact Me</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container grid-2">
        <div>
          <h2 class="section-title">The Problem</h2>
          <p class="section-copy">This service is designed to solve the common experience and conversion issues that hold digital products back.</p>
          <ul class="feature-list">
            ${service.problems.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h2 class="section-title">What I Investigate</h2>
          <ul class="feature-list">
            ${service.investigate.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>
    </section>
    <section class="section" style="background: var(--surface-low);">
      <div class="container">
        <h2 class="section-title">My Process</h2>
        <div class="timeline">
          ${service.process
            .map(
              (step) => `
            <article class="timeline-step">
              <div class="timeline-step__meta">${step.step}</div>
              <h3 class="timeline-step__title">${step.step}</h3>
              <p class="timeline-step__text">${step.text}</p>
            </article>
          `,
            )
            .join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container grid-2">
        <div>
          <h2 class="section-title">Deliverables</h2>
          <ul class="deliverables-list">
            ${service.deliverables.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h2 class="section-title">Evidence & Examples</h2>
          <ul class="feature-list">
            ${service.examples.map((item) => `<li><a href="${item.url}" class="btn-ghost">${item.title}</a></li>`).join("")}
          </ul>
        </div>
      </div>
    </section>
    <section class="section" style="background: var(--surface-low);">
      <div class="container">
        <h2 class="section-title">FAQ</h2>
        <div class="faq-list">
          ${service.faqs
            .map(
              (item) => `
            <details class="faq-item">
              <summary>${item.q}</summary>
              <p>${item.a}</p>
            </details>
          `,
            )
            .join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container callout">
        <h2>Ready to move forward?</h2>
        <p class="section-copy">If you want a strategic service detail and a thoughtful implementation plan, let's talk.</p>
        <div class="cta-group">
          <a href="mailto:hello@gayatripatil.com?subject=Book a Call: ${encodeURIComponent(service.title)}" class="btn-primary">Book a Call</a>
          <a href="mailto:hello@gayatripatil.com?subject=Start a Conversation: ${encodeURIComponent(service.title)}" class="btn-secondary">Start a Conversation</a>
        </div>
      </div>
    </section>
  `;
}

window.addEventListener("DOMContentLoaded", renderServiceDetail);
