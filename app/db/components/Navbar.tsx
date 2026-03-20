'use client'

import styles from "@/app/db/components/navbar.module.css";

const Navbar = () => {

    return(

        <div className={styles['navbar']}>
            <div className={styles['stripe']}>
                <button onClick={()=>{window.location.href = "/db"}} className={styles['home']}>Home</button>
                <button onClick={()=>{window.location.href = "/db/admin"}} className={styles['admin']}>Admin</button>
            </div>
        </div>


    )
}

export default Navbar