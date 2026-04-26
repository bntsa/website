import SearchBtn from "@/app/db/components/SearchBtn";
import styles from "@/app/db/(main)/main.module.css";



export default function Home() {
    return (
        <div className={styles['page']}>
            <form action='/'>
            <button className={styles['return']}>Return to bentsa.eu</button>
            </form>
            <h1 className={styles['middle-text']}>Olympiad profile database</h1>
            <div className={styles['middle-search']}>
                <SearchBtn/>
            </div>
        </div>


    );
}
