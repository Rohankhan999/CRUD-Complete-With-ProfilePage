import { supabaseConfig } from "./config.js";

var information = document.getElementById("info");
var Username = localStorage.getItem("Username");
var logout = document.getElementById("logout");
var main = document.getElementById("data");


// Aside Data;
let data = async () => {
    try {
        const { data: { user } } = await supabaseConfig.auth.getUser()
        information.innerHTML = `
        <h2>Username : ${Username}</h2>
        <h2>Email :  ${user.email} </h2> `;

    } catch (error) {
        console.log(error);

    }
}
data();

// log out user //

logout.addEventListener("click", async () => {
    try {
        const { error } = await supabaseConfig.auth.signOut();

        if (error) {
            console.log("Error while logging out:", error);
            Swal.fire({
                title: "Error ❌",
                text: "Failed to log out. Please try again.",
                icon: "error"
            });
            return;
        }

        Swal.fire({
            title: "Logged Out 🤦🏻‍♂️",
            text: "See you Soon 🤏🏻",
            icon: "success"
        }).then(() => {
            window.location.href = "login.html";
        });

        console.log("User logged out successfully");

    } catch (error) {
        console.log("Unexpected error occurred:", error);
        Swal.fire({
            title: "Error ❌",
            text: "Something went wrong!",
            icon: "error"
        });
    }
});



// fetch data from the database//
const fetchData = async () => {
    try {
        const { data, error } = await supabaseConfig
            .from('data')
            .select()
        // console.log("data Fetch Succesfully", data);
        if (error) {
            console.log("Error agaya Data nhi aya", error);
        }
        else {
            // console.log("data add successfully!");
            console.log(data);
            main.innerHTML = "";
            data.forEach(post => {
                main.innerHTML += `<div class="subpost">
                <h3>${post.Name}</h3>
                <p>${post.Phone}</p>
                <p>${post.Description}</p>
                  <p id='num'>${post.id}</p>
                  <div id="btn">
                   <button id="delete" class="subPostBtn" data-id="${post.id}">Delete</button>
                <button id="Update" class="subPostBtn" data-id="${post.id}">Update</button>
                </div>
                </div>`;
            });
            eventlistner();
        }

    } catch (error) {
        console.log("Error agaya Data nhi aya", error.message);

    }

}
fetchData();



// insert page open//

var insert = document.getElementById("Insert");
var insertpage = document.getElementById("insertPage");
insert.addEventListener("click", async () => {
    main.style.display = "none";
    insertpage.style.display = "block";
});

var name = document.getElementById("name");
var phone = document.getElementById("phone");
var description = document.getElementById("description");
var backbtn = document.getElementById("back");
var insertdata = document.getElementById("insertData");
insertdata.addEventListener("click", async () => {
    try {
        const { error } = await supabaseConfig
            .from('data')
            .insert({ Name: name.value, Phone: phone.value, Description: description.value })
        console.log("Data Inserted Succesfully");
        if (error) {
            console.log("Error agaya Data nhi aya", error);
        }
        else {
            console.log("data add successfully!");
            Swal.fire({
                title: "Data Added 🎉",
                text: "Data has been added successfully!",
                icon: "success"
            });
            main.style.display = "flex";
           insertpage.style.display = "none";
        }
    } catch (error) {
        console.log("Error agaya Data nhi aya", error.message);
    }
});

backbtn.addEventListener("click", async () => {
    main.style.display = "flex";
    insertpage.style.display = "none";
    fetchData();
});

const DeleteData = (async (postId) => {
    try {
        const response = await supabaseConfig
            .from('data')
            .delete()
            .eq('id', postId)

        if (error) {
            console.log("error -->", error.message);
        }
        else {
            console.log("data add successfully!");
            console.log(response);
        }
    }
    catch (error) {
        console.log(error);

    }
});


// Update Method
const UpdateData = (async (postId) => {
    let newTitle = prompt("add new title");
    let newDescription = prompt("add new Description");
    let newphone = prompt("add new phone number");
    if(!newTitle || !newDescription || !newphone){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all Fields",
            
          });
          return;
    }
  
    try {
        const { error } = await supabaseConfig
        .from('data')
        .update({Name: newTitle, Description: newDescription, Phone : newphone}) 
        .eq('id', postId)      

        if (error) {
            console.log("error -->", error.message);
        }
        else {
            console.log("data add successfully!");
            console.log(data);
            fetchData();
        }
        
    }
    catch (error) {
        console.log(error);

    }
});


// Event Handlers
const eventlistner = () => {
let UpdateButtons = document.querySelectorAll('#Update');
let DeleteButtons = document.querySelectorAll('#delete');
UpdateButtons.forEach((Update) =>{
    Update.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        UpdateData(id);
    });

    DeleteButtons.forEach((del) =>{
        del.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            DeleteData(id);
        });
    
});
})
};


// Search Functionality
var searchInput = document.getElementById("search");

searchInput.addEventListener("input", function () {
    let query = searchInput.value.toLowerCase();
    let subposts = document.querySelectorAll(".subpost");

    subposts.forEach((post) => {
        let name = post.querySelector("h3").textContent.toLowerCase();
        let phone = post.querySelector("p").textContent.toLowerCase();
        let description = post.querySelectorAll("p")[1].textContent.toLowerCase();

        if (name.includes(query) || phone.includes(query) || description.includes(query)) {
            post.style.display = "block";  // Show if matches
        } else {
            post.style.display = "none";   // Hide if not matches
        }
    });
});
