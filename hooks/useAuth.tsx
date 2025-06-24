'use client';

import Loader from "@/components/layout/Loader";
import { AuthProps, User } from "@/types/types";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { toast, Toaster } from "sonner";

export const Auth = createContext<AuthProps | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser]: any = useState<User | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [authorization, setAuthorization]: any = useState<string | null>(null);

    function setToken(token: string) {
        localStorage.setItem('authToken', token);
        setAuthorization(token);
    }

    async function fetchUser() {
        if (authorization) {
            try {
                const req = await axios.post("/api/me", null, {
                    headers: {
                        Authorization: `Bearer ${authorization}`
                    }
                });

                if (req.status === 200 && req.data.success) {
                    setUser(req.data.user);
                }
            } catch (err: any) {

                if (err.response.status == 401) {
                    logout();
                }

            }
        }
    }

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            setAuthorization(localStorage.getItem('authToken'))
        }
    }, [])

    useEffect(() => {
        (async () => {
            if (authorization) {
                await fetchUser();
            }
            setLoading(false);
        })()
    }, [authorization])

    async function reqLogin(data: User): Promise<true | string> {
        try {
            const req = await axios.post("/api/login", data);

            if (req.status === 200 && req.data.success) {
                setUser(data);
                setToken(req.data.authorization)
                return true;
            }

            setUser(null);
            setAuthorization(null);
            return req.data.error ?? "Login failed";
        } catch (err: any) {
            return err.response?.data?.error ?? err?.message ?? "Unknown error";
        }
    }

    function logout() {
        localStorage.removeItem('authToken')
        setAuthorization(null)
        setUser(null);
    }

    return (
        <Auth.Provider value={{ setToken, user, logout, reqLogin, setUser, authorization, setLoading, authorized: Boolean(authorization) }}>
            <>
                <Toaster />
                {isLoading && <Loader />}
                {!isLoading && children}
            </>
        </Auth.Provider>
    )
}

export function useAuth(): AuthProps {
    const context = useContext(Auth);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}