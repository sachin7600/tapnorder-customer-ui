'use client';
import {createContext, useState, useEffect, useContext} from 'react';
import {setAuthToken} from "@/lib/apiServices";
import {useCustomerLoginMutation} from "@/lib/api/CustomerApi";
import {toast} from "sonner";
import {useSearchParams} from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customerLogin] = useCustomerLoginMutation();
    const searchParams = useSearchParams();
    const outletId = searchParams.get("outletId");

    // Check local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("customerLogin");
        const token = localStorage.getItem("authToken");

        if (storedUser && token) {
            setAuthToken(token);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    // Login function
    const login = async (values) => {
        try {
            const payload = {...values, outletId};
            const res = await customerLogin(payload).unwrap();

            if (res.succeeded) {
                setAuthToken(res.data.token);
                setUser(res.data);

                localStorage.setItem("authToken", res.data.token);
                localStorage.setItem("customerLogin", JSON.stringify(res.data));

                toast.success(res.message, {position: "top-center"});
                return {success: true};
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong", {position: "top-center"});
            return {success: false, error: error.message};
        }
    };

    const value = {
        user,
        loading,
        login,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUser = () => useContext(AuthContext);
