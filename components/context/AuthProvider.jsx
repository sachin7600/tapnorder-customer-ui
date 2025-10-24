"use client";

import { Suspense } from "react";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
    return (
        <Suspense fallback={null}>
            <AuthContext>{children}</AuthContext>
        </Suspense>
    );
}

