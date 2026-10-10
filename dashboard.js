const STORAGE_KEY = "emsEmployees";

const employeeForm = document.getElementById("employeeForm");
const employeeTable = document.getElementById("employeeTable");
const totalEmployees = document.getElementById("totalEmployees");
const formMessage = document.getElementById("formMessage");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const departmentInput = document.getElementById("department");
const phoneInput = document.getElementById("phone");
const employeeIdInput = document.getElementById("employeeId");

let employees = [];

try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    employees = Array.isArray(stored) ? stored : [];
} catch {
    employees = [];
}

function saveEmployees() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

function renderEmployees() {
    employeeTable.replaceChildren();
    totalEmployees.textContent = employees.length;

    employees.forEach((employee) => {
        const row = document.createElement("tr");

        [
            employee.name,
            employee.email,
            employee.department,
            employee.phone
        ].forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.addEventListener("click", () => editEmployee(employee.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.addEventListener("click", () => deleteEmployee(employee.id));

        actions.append(editButton, deleteButton);
        row.appendChild(actions);
        employeeTable.appendChild(row);
    });
}

employeeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "";

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const department = departmentInput.value;
    const phone = phoneInput.value.trim();
    const editingId = employeeIdInput.value;

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMessage.textContent = "Enter a valid name and email.";
        return;
    }

    if (!department || !phone) {
        formMessage.textContent = "Please fill all fields.";
        return;
    }

    const duplicate = employees.some(
        (employee) =>
            employee.email === email &&
            employee.id !== editingId
    );

    if (duplicate) {
        formMessage.textContent = "This email already exists.";
        return;
    }

    if (editingId) {
        employees = employees.map((employee) =>
            employee.id === editingId
                ? { ...employee, name, email, department, phone }
                : employee
        );
        formMessage.textContent = "Employee updated successfully!";
    } else {
        employees.push({
            id: crypto.randomUUID(),
            name,
            email,
            department,
            phone
        });
        formMessage.textContent = "Employee added successfully!";
    }

    saveEmployees();
    renderEmployees();
    resetForm();
});

function editEmployee(id) {
    const employee = employees.find((item) => item.id === id);
    if (!employee) return;

    employeeIdInput.value = employee.id;
    nameInput.value = employee.name;
    emailInput.value = employee.email;
    departmentInput.value = employee.department;
    phoneInput.value = employee.phone;

    document.getElementById("formTitle").textContent = "Edit Employee";
    document.getElementById("saveBtn").textContent = "Update Employee";
    document.getElementById("cancelBtn").hidden = false;

    document.getElementById("addEmployee").scrollIntoView({
        behavior: "smooth"
    });
}

function deleteEmployee(id) {
    const confirmed = confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;

    employees = employees.filter((employee) => employee.id !== id);
    saveEmployees();
    renderEmployees();
    formMessage.textContent = "Employee deleted.";
}

function resetForm() {
    employeeForm.reset();
    employeeIdInput.value = "";
    document.getElementById("formTitle").textContent = "Add Employee";
    document.getElementById("saveBtn").textContent = "Add Employee";
    document.getElementById("cancelBtn").hidden = true;
}

document.getElementById("cancelBtn").addEventListener("click", resetForm);

document.getElementById("logoutBtn").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "index.html";
});

const loggedInUser = localStorage.getItem("loggedInUser");
document.getElementById("welcomeMessage").textContent =
    loggedInUser ? `Welcome back, ${loggedInUser}!` : "Welcome to Employee Management";

renderEmployees();

