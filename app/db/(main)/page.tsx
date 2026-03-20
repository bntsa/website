import Image from "next/image";
import SearchBtn from "@/app/db/components/SearchBtn";
import styles from "@/app/db/(main)/main.module.css";



export default function Home() {
    return (
        <div>
            <h1 className={styles['middle-text']}>Olympiad profile database</h1>
            <div className={styles['middle-search']}>
                <SearchBtn/>
            </div>
        </div>


    );
}
