import styles from '@/app/home.module.css'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <div className={styles['placeholder']}>
              Hello! There's not much on this page yet, but I'll add something soon.
              For now, check out my database!
          </div>

          <div className={styles['project-container']}>
              <form action='/db/'>
                  <div>
                      <button className={styles['project-button']}>
                          <h2 className={styles['title']}>Olympiad Profile Database</h2>
                          <p className={styles['description']}>This database contains results from International Olympiads such as the IMO, IOI and IPhO. More will be added soon!</p>
                      </button>
                  </div>
              </form>
          </div>
      </main>
    </div>
  );
}
