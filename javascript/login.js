import { supabaseConfig } from "./config.js";



// Using DOM for get value from input //


let email = document.getElementById('email');
let password = document.getElementById("password");
let button = document.getElementById("btn");

// Sign in a new user //

button.addEventListener("click", async () => {
    try {
        if ( !email.value || !password.value) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill All fields",
            });
            return;
        }
       
          
        const { data, error } = await supabaseConfig.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.messege,
            });
            console.log("error aya hai ->", error.messege);
        }
        else {
            Swal.fire({
                title: "Welcome Back 👏🏻",
                text: "We're Redirecting you to a Dashboard!",
                icon: "success"
            }).then(() => {

                window.location.href = "dashboard.html";
            });
            console.log("data added Successfully", data);


        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.messege,
        });
        console.log("error agaya ->", error.messege);

    }



});

