import { jwtDecode } from "jwt-decode";

function isAuthenticated() {
    const token = localStorage.getItem("token");

    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds
        
        if(decoded.exp < currentTime) {
            localStorage.removeItem("token");
            return false;
        }

        return true;

    } catch (error) {
        console.log("Invalid token:", error);
        localStorage.removeItem("token");
        return false;   
    }
}

export { isAuthenticated };
