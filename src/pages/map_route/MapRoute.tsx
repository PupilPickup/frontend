import RouteMap from "../../components/RouteMap";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";


export default function MapRoute() {

    const navigate = useNavigate();
    const token: string | null = sessionStorage.getItem("token");
    const { user, isLoggedIn, logout } = useUser();

    console.log("Current User in MapRoute:", user);

    useEffect(()=> {
        if(!token || user === null || user === undefined || !isLoggedIn){
            sessionStorage.removeItem("token");
            logout();
            navigate("/");
            return;
        }
    },[token, user, logout, isLoggedIn, navigate]);
    
    if(!user || !token || !isLoggedIn){
        return (
            <>
                <p>Redirecting to login...</p>
            </>
        )
    }

    return (
        <>
                    <RouteMap
                        userId ={user.userId}
                        userName = {user.username}
                        token = {token} />
        </>
    )
}