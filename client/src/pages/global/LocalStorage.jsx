import { httpGetUser } from "../../hooks/users.requests";

export const storeUserDataToLocalStorage = async (username) => {
    try {
        const userData = await httpGetUser(username);
        console.log("Fetched User Data:", userData);

        localStorage.setItem("firstname", userData.firstName);
        localStorage.setItem("role", userData.role);

        return {
            firstName: userData.firstName,
            role: userData.role,
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw new Error("Failed to load user data.");
    }
};
