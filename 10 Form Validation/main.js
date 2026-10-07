"use strict";

/* ------------------------------------------------------------------ */
/*  Element references                                                 */
/* ------------------------------------------------------------------ */
const form = document.getElementById("regForm");
const successPanel = document.getElementById("successPanel");
const successSummary = document.getElementById("successSummary");
const resetBtn = document.getElementById("resetBtn");

const fields = {
  fullName: document.getElementById("fullName"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  dob: document.getElementById("dob"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword"),
  terms: document.getElementById("terms"),
};

const errors = {
  fullName: document.getElementById("fullNameError"),
  email: document.getElementById("emailError"),
  phone: document.getElementById("phoneError"),
  dob: document.getElementById("dobError"),
  password: document.getElementById("passwordError"),
  confirmPassword: document.getElementById("confirmPasswordError"),
  terms: document.getElementById("termsError"),
};

const strengthBar = document.getElementById("strengthBar");
const ruleItems = {
  length: document.getElementById("rule-length"),
  upper: document.getElementById("rule-upper"),
  lower: document.getElementById("rule-lower"),
  number: document.getElementById("rule-number"),
  special: document.getElementById("rule-special"),
};

/* ------------------------------------------------------------------ */
/*  Regex patterns                                                     */
/* ------------------------------------------------------------------ */
const NAME_RE = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/; // letters, spaces, dots, apostrophes, hyphens
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/; // 10-digit Indian mobile style

/* ------------------------------------------------------------------ */
/*  Validators — each returns an error string ("" means valid)         */
/* ------------------------------------------------------------------ */
const validators = {
  fullName(value) {
    if (!value.trim()) return "Full name is required.";
    if (!NAME_RE.test(value.trim()))
      return "Use only letters and spaces (2–50 chars, no digits).";
    return "";
  },

  email(value) {
    if (!value.trim()) return "Email address is required.";
    if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address.";
    return "";
  },

  phone(value) {
    const digits = value.replace(/[\s-]/g, "");
    if (!digits) return "Phone number is required.";
    if (!/^\d+$/.test(digits)) return "Phone must contain digits only.";
    if (digits.length !== 10) return "Phone number must be exactly 10 digits.";
    if (!PHONE_RE.test(digits)) return "Phone must start with digit 6–9.";
    return "";
  },

  dob(value) {
    if (!value) return "Date of birth is required.";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Invalid date.";
    const today = new Date();
    if (date > today) return "Date of birth cannot be in the future.";
    // Age between 10 and 120 years
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
    if (age < 10) return "You must be at least 10 years old.";
    if (age > 120) return "Please enter a realistic date of birth.";
    return "";
  },

  password(value) {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter.";
    if (!/[a-z]/.test(value)) return "Add at least one lowercase letter.";
    if (!/\d/.test(value)) return "Add at least one number.";
    if (!/[^A-Za-z0-9]/.test(value))
      return "Add at least one special character.";
    return "";
  },

  confirmPassword(value) {
    if (!value) return "Please confirm your password.";
    if (value !== fields.password.value) return "Passwords do not match.";
    return "";
  },

  terms(checked) {
    if (!checked) return "You must accept the terms to continue.";
    return "";
  },
};

/* ------------------------------------------------------------------ */
/*  Field state helpers                                                */
/* ------------------------------------------------------------------ */
function setFieldState(name, message) {
  const input = fields[name];
  const errorEl = errors[name];
  errorEl.textContent = message;
  if (message) {
    input.classList.add("invalid");
    input.classList.remove("valid");
  } else {
    input.classList.add("valid");
    input.classList.remove("invalid");
  }
  return !message;
}

function validateField(name) {
  const input = fields[name];
  const value = input.type === "checkbox" ? input.checked : input.value;
  return setFieldState(name, validators[name](value));
}

/* ------------------------------------------------------------------ */
/*  Password strength meter                                            */
/* ------------------------------------------------------------------ */
function updateStrength(value) {
  const checks = {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };

  Object.entries(checks).forEach(([key, ok]) => {
    ruleItems[key].classList.toggle("met", ok);
  });

  const score = Object.values(checks).filter(Boolean).length;
  const pct = (score / 5) * 100;
  strengthBar.style.width = value ? `${Math.max(pct, 8)}%` : "0%";

  if (score <= 2) strengthBar.style.background = "#dc2626";
  else if (score <= 3) strengthBar.style.background = "#f59e0b";
  else if (score === 4) strengthBar.style.background = "#84cc16";
  else strengthBar.style.background = "#16a34a";
}

/* ------------------------------------------------------------------ */
/*  Live validation wiring                                             */
/* ------------------------------------------------------------------ */
Object.keys(fields).forEach((name) => {
  const input = fields[name];
  const evtType =
    input.type === "checkbox" || input.type === "date" ? "change" : "input";

  input.addEventListener(evtType, () => {
    if (name === "password") {
      updateStrength(input.value);
      // Re-check confirm when password changes
      if (fields.confirmPassword.value) validateField("confirmPassword");
    }
    validateField(name);
  });

  // Show errors as soon as user leaves a touched field
  input.addEventListener("blur", () => {
    if (input.dataset.touched) validateField(name);
  });
  input.addEventListener("input", () => {
    input.dataset.touched = "1";
  });
});

/* ------------------------------------------------------------------ */
/*  Submit                                                             */
/* ------------------------------------------------------------------ */
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const results = Object.keys(fields).map((name) => validateField(name));
  const allValid = results.every(Boolean);

  if (!allValid) {
    const firstInvalid = form.querySelector(".invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  successSummary.innerHTML =
    `Welcome, <strong>${escapeHtml(fields.fullName.value.trim())}</strong>!<br>` +
    `Account created for <strong>${escapeHtml(fields.email.value.trim())}</strong>.`;

  form.classList.add("hidden");
  successPanel.classList.remove("hidden");
});

resetBtn.addEventListener("click", () => {
  form.reset();
  Object.keys(fields).forEach((name) => {
    fields[name].classList.remove("valid", "invalid");
    delete fields[name].dataset.touched;
    errors[name].textContent = "";
  });
  updateStrength("");
  successPanel.classList.add("hidden");
  form.classList.remove("hidden");
  fields.fullName.focus();
});

/* Simple HTML escaping for safe rendering of user input */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
