import CryptoJS from "crypto-js";
import React, { createContext, useState, useEffect } from "react";


const secretKey = "mySecretKey123";

export const getDecryptedRole = () => {
    const encryptedRole = localStorage.getItem("Role");
    if (!encryptedRole) return "";

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedRole, secretKey);
        const role = bytes.toString(CryptoJS.enc.Utf8);
        return role;
    } catch (error) {
        console.error("Role decryption failed:", error);
        return "";
    }
};


export const AuthContext = createContext();

export const encryptAndStoreRole = (role) => {
    if (!role) return;
    const encrypted = CryptoJS.AES.encrypt(role, secretKey).toString();
    localStorage.setItem("Role", encrypted);
};


export const AuthProvider = ({ children }) => {
    const [Role, setRole] = useState("");

    useEffect(() => {
        const decryptedRole = getDecryptedRole();
        setRole(decryptedRole);
    }, []);

    return (
        <AuthContext.Provider value={{ Role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};
