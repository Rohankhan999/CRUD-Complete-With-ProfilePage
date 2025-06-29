import { supabaseConfig } from "./config.js";

// DOM Elements
const info = document.getElementById("info");
const Username = localStorage.getItem("Username");
const logoutBtn = document.getElementById("logout");
const main = document.getElementById("data");
const insertPage = document.getElementById("insertPage");
const insertBtn = document.getElementById("Insert");
const backBtn = document.getElementById("back");
const insertDataBtn = document.getElementById("insertData");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const descInput = document.getElementById("description");
const searchInput = document.getElementById("search");

// 🧑‍💼 Display logged-in user info
(async () => {
  const { data: { user } } = await supabaseConfig.auth.getUser();
  info.innerHTML = `<h2>Username : ${Username}</h2><h2>Email : ${user.email}</h2>`;
})();

// 📥 Fetch data
const fetchData = async () => {
  const { data, error } = await supabaseConfig.from("data").select();
  if (error) return console.log("Fetch Error:", error.message);

  main.innerHTML = "";
  data.forEach(post => {
    main.innerHTML += `
      <div class="subpost">
        <h3>${post.name}</h3>
        <p>${post.phone}</p>
        <p>${post.description}</p>
        <p id="num">${post.id}</p>
        <div id="btn">
          <button class="deleteBtn subPostBtn" data-id="${post.id}">Delete</button>
          <button class="updateBtn subPostBtn" data-id="${post.id}">Update</button>
        </div>
      </div>
    `;
  });
  attachEventListeners();
};
fetchData();

// 🔗 Attach button event listeners
function attachEventListeners() {
  document.querySelectorAll(".deleteBtn").forEach(btn =>
    btn.addEventListener("click", e => DeleteData(e.target.dataset.id))
  );
  document.querySelectorAll(".updateBtn").forEach(btn =>
    btn.addEventListener("click", e => UpdateData(e.target.dataset.id))
  );
}

// ➕ Insert page toggle
insertBtn.addEventListener("click", () => {
  main.style.display = "none";
  insertPage.style.display = "block";
});

backBtn.addEventListener("click", () => {
  insertPage.style.display = "none";
  main.style.display = "flex";
  fetchData();
});

// ➕ Insert data
insertDataBtn.addEventListener("click", async () => {
  const { error } = await supabaseConfig.from("data").insert({
    name: nameInput.value,
    phone: phoneInput.value,
    description: descInput.value
  });

  if (error) return Swal.fire("Error", error.message, "error");

  Swal.fire("Inserted ✅", "Data added successfully", "success");
  insertPage.style.display = "none";
  main.style.display = "flex";
  fetchData();
});

// ❌ Delete data
const DeleteData = async (id) => {
  const { error } = await supabaseConfig.from("data").delete().eq("id", id);
  if (error) return Swal.fire("Error", error.message, "error");
  fetchData();
};

// 🔄 Update data
const UpdateData = async (id) => {
  const name = prompt("New Name?");
  const phone = prompt("New Phone?");
  const description = prompt("New Description?");

  if (!name || !phone || !description) {
    return Swal.fire("Error", "All fields are required", "error");
  }

  const { error } = await supabaseConfig
    .from("data")
    .update({ name, phone, description })
    .eq("id", id);

  if (error) return Swal.fire("Error", error.message, "error");
  fetchData();
};

// 🔓 Logout
logoutBtn.addEventListener("click", async () => {
  const { error } = await supabaseConfig.auth.signOut();
  if (error) return Swal.fire("Error", "Logout failed", "error");

  Swal.fire("Logged Out", "See you soon!", "success").then(() => {
    window.location.href = "login.html";
  });
});

// 🔍 Search
searchInput.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll(".subpost").forEach(post => {
    const name = post.querySelector("h3").textContent.toLowerCase();
    const phone = post.querySelectorAll("p")[0].textContent.toLowerCase();
    const description = post.querySelectorAll("p")[1].textContent.toLowerCase();

    if (name.includes(q) || phone.includes(q) || description.includes(q)) {
      post.style.display = "block";
    } else {
      post.style.display = "none";
    }
  });
});

// 🔁 Realtime Listener
supabaseConfig
  .channel("realtime-data")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "data"
  }, () => {
    console.log("🔄 Realtime update detected");
    fetchData();
  })
  .subscribe();
const toggleBtn = document.getElementById("toggleMenu");
const aside = document.querySelector("aside");

toggleBtn.addEventListener("click", () => {
  aside.classList.toggle("active");
});
