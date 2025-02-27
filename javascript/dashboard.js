import { supabaseConfig } from "./config.js";

var information = document.getElementById("info");
var Username = localStorage.getItem("Username");
var logout = document.getElementById("out");

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



// update a user

var update = document.getElementById("UpdateProfile");
update.addEventListener("click", async () => {
    try {
        const { data, error } = await supabaseConfig.auth.updateUser({
            email: 'new@email.com'
          })
            console.log(data);  
            console.log(error);
                    
    } catch (error) {
        console.log(error);
        
    }
});