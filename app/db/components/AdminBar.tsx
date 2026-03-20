'use client'

import styles from "@/app/db/components/adminBar.module.css";
import {useEffect, useState} from "react";
import supabase from "@/app/db/lib/supabaseClient";


const AdminBar = () => {

    const [session, setSession] = useState<any>(null);

    const fetchSession = async () => {
        const currentSession = await supabase.auth.getSession();
        console.log(currentSession)
        setSession(currentSession.data.session)
    }

    useEffect(()=>{
        fetchSession()

        const { data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    const logout = async () => {
        await supabase.auth.signOut()
    }


    if(session){
        return(
            <div className={styles['navbar']}>
                <div className={styles['stripe']}>
                    <button onClick={()=>{window.location.href = "/db"}} className={styles['home']}>Home</button>
                    <button onClick={logout} className={styles['log-out']}>Log Out</button>
                </div>
            </div>
        )
    }

    return(
        <div className={styles['navbar']}>
            <div className={styles['stripe']}>
                <button onClick={()=>{window.location.href = "/db"}} className={styles['home']}>Home</button>
            </div>
        </div>
    )



}

export default AdminBar