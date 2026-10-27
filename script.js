/*
 * Jazeera University Student Complaint & Feedback System
 * Update the CONTACT and ACADEMIC_CONFIG objects when verified university data changes.
 */

const CONTACT = {
  whatsapp: "252610362525", // International format, digits only
  email: "lastkellar@gmail.com"
};

/*
 * Batch maxima supplied by the requester.
 * A null maximum means it has not yet been confirmed; it is intentionally not guessed.
 * The names/relationships should be checked against current university records before public launch.
 */
const ACADEMIC_CONFIG = [
  {
    faculty: "Faculty of Computer Science and IT",
    departments: [
      { name: "Computer Science and Information Technology (CS & IT)", maxBatch: 17 }
    ]
  },
  {
    faculty: "Faculty of Medicine and Surgery",
    departments: [
      { name: "Medicine and Surgery", maxBatch: 17 }
    ]
  },
  {
    faculty: "Faculty of Health Sciences",
    departments: [
      { name: "Health Science", maxBatch: null },
      { name: "Public Health", maxBatch: 14 },
      { name: "Medical Laboratory Sciences", maxBatch: 16 },
      { name: "Nursing", maxBatch: 16 },
      { name: "Midwifery", maxBatch: 12 }
    ]
  },
  {
    faculty: "Faculty of Engineering and Technology",
    departments: [
      { name: "Engineering", maxBatch: 16 }
    ]
  },
  {
    faculty: "Faculty of Agricultural Science",
    departments: [
      { name: "Agriculture", maxBatch: 13 }
    ]
  },
  {
    faculty: "Faculty of Economics and Management Science",
    departments: [
      { name: "Economics", maxBatch: 4 },
      { name: "Accounting", maxBatch: 12 },
      { name: "Business Administration", maxBatch: 13 },
      { name: "Accounting and Finance", maxBatch: null },
      { name: "Public Administration", maxBatch: 2 }
    ]
  },
  {
    faculty: "Faculty of Education",
    departments: [
      { name: "Education", maxBatch: 17 },
      { name: "Biology and Physics", maxBatch: 17 }
    ]
  },
  {
    faculty: "Faculty of Veterinary Science",
    departments: [
      { name: "Veterinary Medicine", maxBatch: 13 }
    ]
  }
];

const form = document.getElementById("complaintForm");
const nameInput = document.getElementById("studentName");
const facultySelect = document.getElementById("faculty");
const departmentSelect = document.getElementById("department");
const batchSelect = document.getElementById("batch");
const categorySelect = document.getElementById("category");
const detailsInput = document.getElementById("details");
const charCount = document.getElementById("charCount");
const formMessage = document.getElementById("formMessage");
const batchHint = document.getElementById("batchHint");

function setOptions(select, placeholder, values) {
  select.replaceChildren();
  const first = document.createElement("option");
  first.value = "";
  first.textContent = placeholder;
  select.appendChild(first);

  values.forEach(value => {
    const option = document.createElement("option");
    if (typeof value === "string") {
      option.value = value;
      option.textContent = value;
    } else {
      option.value = value.name;
      option.textContent = value.name;
    }
    select.appendChild(option);
  });
}

function getFacultyConfig() {
  return ACADEMIC_CONFIG.find(item => item.faculty === facultySelect.value) || null;
}

function getDepartmentConfig() {
  const faculty = getFacultyConfig();
  if (!faculty) return null;
  return faculty.departments.find(item => item.name === departmentSelect.value) || null;
}

function resetDepartment() {
  setOptions(departmentSelect, "Select Faculty first", []);
  departmentSelect.disabled = true;
  resetBatch();
}

function resetBatch() {
  setOptions(batchSelect, "Select Department first", []);
  batchSelect.disabled = true;
  batchHint.textContent = "Choose a faculty and department to see available batches.";
}

function updateDepartmentOptions() {
  const faculty = getFacultyConfig();
  resetBatch();

  if (!faculty) {
    setOptions(departmentSelect, "Select Faculty first", []);
    departmentSelect.disabled = true;
    return;
  }

  setOptions(departmentSelect, "Select Department", faculty.departments);
  departmentSelect.disabled = false;
}

function updateBatchOptions() {
  const department = getDepartmentConfig();
  if (!department) {
    resetBatch();
    return;
  }

  if (!Number.isInteger(department.maxBatch) || department.maxBatch < 1) {
    setOptions(batchSelect, "Batch limit needs confirmation", []);
    batchSelect.disabled = true;
    batchHint.textContent = "The maximum batch for this department has not been confirmed. Please contact the site administrator.";
    return;
  }

  const batches = Array.from({ length: department.maxBatch }, (_, index) => `Batch ${index + 1}`);
  // Add a letter-suffix batch only for departments explicitly configured to use it.
  if (Array.isArray(department.specialBatches)) {
    department.specialBatches.forEach(batch => batches.push(batch));
  }

  setOptions(batchSelect, "Select Batch", batches);
  batchSelect.disabled = false;
  batchHint.textContent = `Available range: Batch 1 to Batch ${department.maxBatch}.`;
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach(element => element.textContent = "");
  document.querySelectorAll(".field.invalid").forEach(element => element.classList.remove("invalid"));
}

function showMessage(message, type = "info") {
  formMessage.textContent = message;
  formMessage.className = `form-message visible ${type}`;
}

function validateForm() {
  clearErrors();
  formMessage.className = "form-message";
  let valid = true;

  const checks = [
    { input: nameInput, error: "studentNameError", message: "Please enter your name." },
    { input: facultySelect, error: "facultyError", message: "Please select a faculty." },
    { input: departmentSelect, error: "departmentError", message: "Please select a department." },
    { input: batchSelect, error: "batchError", message: "Please select a permitted batch." },
    { input: categorySelect, error: "categoryError", message: "Please select a complaint category." },
    { input: detailsInput, error: "detailsError", message: "Please describe your complaint or feedback." }
  ];

  checks.forEach(check => {
    const field = check.input.closest(".field");
    if (!check.input.value.trim() || check.input.disabled) {
      document.getElementById(check.error).textContent = check.message;
      if (field) field.classList.add("invalid");
      valid = false;
    }
  });

  const faculty = getFacultyConfig();
  const department = getDepartmentConfig();
  if (faculty && department && !faculty.departments.some(item => item.name === department.name)) {
    document.getElementById("departmentError").textContent = "This department does not belong to the selected faculty.";
    valid = false;
  }

  if (department && Number.isInteger(department.maxBatch)) {
    const match = batchSelect.value.match(/^Batch (\d+)$/);
    if (!match || Number(match[1]) < 1 || Number(match[1]) > department.maxBatch) {
      document.getElementById("batchError").textContent = "Choose a batch within the permitted range.";
      valid = false;
    }
  }

  if (!valid) {
    showMessage("Please correct the highlighted fields before continuing.", "error");
    const firstInvalid = document.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
    if (firstInvalid) firstInvalid.focus();
  }
  return valid;
}

function getComplaintData() {
  return {
    name: nameInput.value.trim(),
    faculty: facultySelect.value,
    department: departmentSelect.value,
    batch: batchSelect.value,
    category: categorySelect.value,
    details: detailsInput.value.trim()
  };
}

function formatComplaint(data) {
  return [
    "JAZEERA UNIVERSITY",
    "STUDENT COMPLAINT / FEEDBACK",
    "",
    `Student Name: ${data.name}`,
    `Faculty: ${data.faculty}`,
    `Department: ${data.department}`,
    `Batch: ${data.batch}`,
    `Complaint Category: ${data.category}`,
    "",
    "Complaint Details:",
    data.details,
    "",
    "Sent through the Jazeera University Student Complaint & Feedback System."
  ].join("\n");
}

function sendWhatsApp() {
  if (!validateForm()) return;
  const message = formatComplaint(getComplaintData());
  const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
  showMessage("WhatsApp will open with your complaint prepared. Review it and press Send in WhatsApp to submit.", "info");
  window.open(url, "_blank", "noopener,noreferrer");
}

function sendEmail() {
  if (!validateForm()) return;
  const data = getComplaintData();
  const subject = `Student Complaint / Feedback - ${data.name}`;
  const body = formatComplaint(data);
  const url = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showMessage("Your email application will open with the complaint prepared. Review it and press Send in your email application.", "info");
  window.location.href = url;
}

ACADEMIC_CONFIG.forEach(item => {
  const option = document.createElement("option");
  option.value = item.faculty;
  option.textContent = item.faculty;
  facultySelect.appendChild(option);
});

facultySelect.addEventListener("change", () => {
  updateDepartmentOptions();
  clearErrors();
});
departmentSelect.addEventListener("change", () => {
  updateBatchOptions();
  clearErrors();
});
detailsInput.addEventListener("input", () => {
  charCount.textContent = `${detailsInput.value.length} / 1000`;
});
document.getElementById("whatsappButton").addEventListener("click", sendWhatsApp);
document.getElementById("emailButton").addEventListener("click", sendEmail);
form.addEventListener("submit", event => event.preventDefault());

setOptions(departmentSelect, "Select Faculty first", []);
resetBatch();
window.addEventListener("DOMContentLoaded", () => nameInput.focus());
