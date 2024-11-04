// Signup Function
async function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    try {
        await axios.post("http://localhost:3000/signup", {
            username: username,
            password: password
        });
        alert("Signed up successfully");
        window.location.href = "signin.html"; // Redirect to signin page
    } catch (error) {
        console.error("Signup failed:", error);
        alert("Signup failed. Please try again.");
    }
}

// Signin Function
async function signin() {
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    try {
        const response = await axios.post("http://localhost:3000/signin", {
            username: username,
            password: password
        });
        localStorage.setItem("token", response.data.token); // Store token in local storage
        alert("Signed in successfully");
        window.location.href = "todo.html"; // Redirect to main page after signin
    } catch (error) {
        console.error("Signin failed:", error);
        alert("Signin failed. Please try again.");
    }
}

// Fetch User Information for Main Page
async function getUserInfo() {
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    if (token) {
        try {
            const response = await axios.get("http://localhost:3000/me", {
                headers: {
                    token: token // Include token in headers
                }
            });
            document.getElementById("information").innerHTML = response.data.username+"'s";
        } catch (error) {
            console.error("Error fetching user info:", error);
            alert("Session expired. Please sign in again.");
            window.location.href = "signin.html"; // Redirect to signin page if token is invalid
        }
    } else {
        window.location.href = "signin.html"; // Redirect to signin if no token
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("token"); // Clear token from local storage
    window.location.href = "signin.html"; // Redirect to signin page on logout
}

// Call getUserInfo() only if on main.html
if (window.location.pathname.endsWith("todo.html")) {
    getUserInfo();
}
