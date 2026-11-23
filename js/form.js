document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const fields = Array.from(form.querySelectorAll("[data-validate]"));
  const status = form.querySelector("#contact-form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = form.querySelector("[data-submit-label]");
  const submitSpinner = form.querySelector("[data-submit-spinner]");
  const honeypot = form.elements.namedItem("bot-field");
  const submittedAt = form.elements.namedItem("submission-date-time-utc");
  let isSubmitting = false;

  form.noValidate = true;

  const getFieldError = (field) => form.querySelector(`[data-error-for="${field.name}"]`);

  const validateField = (field) => {
    const errorElement = getFieldError(field);
    const label = field.labels && field.labels[0]
      ? field.labels[0].textContent.replace(/\s*\*/g, "").replace(/\s*\(optional\)/i, "").trim()
      : "This field";
    const value = field.value.trim();
    let message = "";

    if (field.required && !value) {
      message = `${label} is required.`;
    } else if (field.type === "email" && value && field.validity.typeMismatch) {
      message = "Enter a valid email address.";
    } else if (field.minLength > 0 && value && value.length < field.minLength) {
      message = `Enter at least ${field.minLength} characters.`;
    } else if (field.maxLength > 0 && value.length > field.maxLength) {
      message = `Use no more than ${field.maxLength} characters.`;
    } else if (!field.validity.valid) {
      message = `Check the ${label.toLowerCase()} field.`;
    }

    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.hidden = !message;
    }

    return !message;
  };

  const showStatus = (message, type) => {
    status.textContent = message;
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-success", type === "success");
  };

  const setSubmitting = (submitting) => {
    isSubmitting = submitting;
    submitButton.disabled = submitting;
    form.setAttribute("aria-busy", String(submitting));
    submitLabel.textContent = submitting ? "Sending..." : "Send Project Inquiry";
    submitSpinner.hidden = !submitting;
  };

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
    field.addEventListener("change", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const invalidFields = fields.filter((field) => !validateField(field));
    if (invalidFields.length) {
      showStatus("Please review the highlighted fields before submitting.", "error");
      invalidFields[0].focus();
      return;
    }

    if (honeypot && typeof honeypot.value === "string" && honeypot.value.trim()) {
      showStatus("This submission could not be verified. Please leave the hidden field empty.", "error");
      return;
    }

    if (window.location.protocol === "file:") {
      showStatus("This local preview cannot deliver submissions. Deploy to Netlify with Forms enabled, then verify the submission there.", "error");
      return;
    }

    setSubmitting(true);
    showStatus("Sending your project inquiry...", "");

    try {
      if (submittedAt instanceof HTMLInputElement) {
        submittedAt.value = new Date().toISOString();
      }

      const body = new URLSearchParams(new FormData(form)).toString();
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      });

      if (!response.ok) {
        showStatus(`The form endpoint did not accept your submission (HTTP ${response.status}). Verify Netlify Forms is enabled on the deployed site and try again.`, "error");
        return;
      }

      form.reset();
      fields.forEach((field) => {
        field.removeAttribute("aria-invalid");
        const errorElement = getFieldError(field);
        if (errorElement) {
          errorElement.textContent = "";
          errorElement.hidden = true;
        }
      });
      showStatus("Your inquiry was accepted by the form endpoint. Verify it in Netlify Forms; email delivery requires the notification to be configured in your site settings.", "success");
    } catch (error) {
      showStatus("We couldn't confirm your submission. No success is recorded; verify Netlify Forms on the deployed site and try again.", "error");
    } finally {
      setSubmitting(false);
    }
  });
});