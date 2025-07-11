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

const updatePage = document.getElementById("Updatedata");
const updateBackBtn = document.getElementById("updateBackBtn");
const updateDataBtn = document.getElementById("updateDataBtn");
const updateName = document.getElementById("updateName");
const updatePhone = document.getElementById("updatePhone");
const updateDesc = document.getElementById("updateDescription");

const searchInput = document.getElementById("search");

let currentUpdateId = null; // to store ID of item being updated

// 🧑‍💼 Display logged-in user info
(async () => {
  const { data: { user }, error } = await supabaseConfig.auth.getUser();
  if (error) return console.log("User Error:", error.message);
  info.innerHTML = `<h2>Username : ${Username}</h2><h2>Email : ${user.email}</h2>`;
})();

// 📥 Fetch data from Supabase
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
        <p id="num">#${post.id}</p>
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

// 🔗 Attach delete and update button handlers
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
  nameInput.value = "";
  phoneInput.value = "";
  descInput.value = "";
  fetchData();
});

// ➕ Insert data to Supabase
insertDataBtn.addEventListener("click", async () => {
  if (!nameInput.value || !phoneInput.value || !descInput.value) {
    return Swal.fire("Error", "Please fill all fields", "warning");
  }

  const { error } = await supabaseConfig.from("data").insert({
    name: nameInput.value,
    phone: phoneInput.value,
    description: descInput.value
  });

  if (error) return Swal.fire("Error", error.message, "error");

  Swal.fire("Inserted ✅", "Data added successfully", "success");
  insertPage.style.display = "none";
  main.style.display = "flex";
  nameInput.value = "";
  phoneInput.value = "";
  descInput.value = "";
  fetchData();
});

// ❌ Delete data
const DeleteData = async (id) => {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the data!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (!confirm.isConfirmed) return;

  const { error } = await supabaseConfig.from("data").delete().eq("id", id);
  if (error) return Swal.fire("Error", error.message, "error");

  Swal.fire("Deleted ✅", "Data deleted successfully", "success");
  fetchData();
};

// 🔄 Show update page with pre-filled data
const UpdateData = async (id) => {
  currentUpdateId = id;

  const { data, error } = await supabaseConfig.from("data").select().eq("id", id).single();
  if (error) return Swal.fire("Error", "Failed to load data", "error");

  updateName.value = data.name;
  updatePhone.value = data.phone;
  updateDesc.value = data.description;

  main.style.display = "none";
  updatePage.style.display = "block";
};

// 🔙 Back from update page
updateBackBtn.addEventListener("click", () => {
  updatePage.style.display = "none";
  main.style.display = "flex";
  fetchData();
});

// ✅ Update data in Supabase
updateDataBtn.addEventListener("click", async () => {
  if (!updateName.value || !updatePhone.value || !updateDesc.value) {
    return Swal.fire("Error", "Please fill all fields", "warning");
  }

  const { error } = await supabaseConfig
    .from("data")
    .update({
      name: updateName.value,
      phone: updatePhone.value,
      description: updateDesc.value,
    })
    .eq("id", currentUpdateId);

  if (error) return Swal.fire("Error", error.message, "error");

  Swal.fire("Updated ✅", "Data updated successfully", "success");
  updatePage.style.display = "none";
  main.style.display = "flex";
  fetchData();
});

// 🔍 Search functionality
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

// 🔓 Logout
logoutBtn.addEventListener("click", async () => {
  const { error } = await supabaseConfig.auth.signOut();
  if (error) return Swal.fire("Error", "Logout failed", "error");

  Swal.fire("Logged Out", "See you soon!", "success").then(() => {
    window.location.href = "login.html";
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
