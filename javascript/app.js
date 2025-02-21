import { supabaseConfig } from "./config.js";


// Using DOM for get value from input //

let username = document.getElementById("name");
let email = document.getElementById('email');
let password = document.getElementById("password");
let button = document.getElementById("btn");

// Sign in a new user //

button.addEventListener("click", async () => {
    try {
        if (!username.value || !email.value || !password.value) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill All fields",
            });
            return;
        }
        const { data, error } = await supabaseConfig.auth.signUp({
            email: email.value,
            password: password.value,
        })
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
            console.log("error aya hai ->", error.messege);
        }
        else {
            Swal.fire({
                title: "Congratulations🎉🎊🎉",
                text: "You Signed up Successfullly😎!",
                icon: "success"
            }).then(() => {

                window.location.href = "login.html";
            });
            console.log("data added Successfully", data);


        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
        });
        console.log("error agaya ->", error.messege);

    }



});

