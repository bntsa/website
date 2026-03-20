'use client'

import styles from '@/app/db/components/searchBtn.module.css'

const Button= () => {
    return(

            <form className={styles['search-container']} autoComplete="off" action={() => {

                const name = (document.getElementById("search-field") as HTMLInputElement).value

                if(name) window.location.href = "/db/profile/"+name
            }}>
                <input id="search-field" type="text" placeholder="Name" className={styles['search-field']}/>
                <input
                    type="submit"
                    rel="noopener noreferrer"
                    value="Search"
                    className={styles['search-btn']}
                />

            </form>

    )
}
export default Button