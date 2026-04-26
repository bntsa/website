'use client'

import {useState, ChangeEvent, useEffect} from 'react'
import supabase from "@/app/db/lib/supabaseClient";
import {Load} from "@/app/db/components/Load";
import {addContest, addProfiles, addResults} from "@/app/db/(admin)/admin/add/AddTable";

import styles from "@/app/db/components/auth.module.css";


export const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [session, setSession] = useState<any>(null)
    const [popup, setPopup] = useState<any>(-1)
    const [comp, setComp] = useState<any>(null)


    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()

        const {error: signInError} = await supabase.auth.signInWithPassword({email, password})
        if(signInError){
            console.error('Error signing in: ', signInError.message)
            return
        }
    }

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


    if(session){
        console.log("bam")
        if(window.location.pathname == "/db/admin"){
            return (
                <div className={styles['selector']}>
                    <button onClick={() => {window.location.href = "/db/admin/add"}} className={styles['add-comp']}>Add competition</button>
                </div>

            )
        }
        return(
            <div className={styles['add-table']}>
                <div>
                    {comp && (<p>Last competition successfully added: {comp.name} {comp.year}</p>)}
                    <input type="file" id="file" className={styles['add-file']}/>
                    <form className={styles['input-comp']} action={async () => {
                        console.log("check box", (document.getElementById("international") as HTMLInputElement))

                        let contestName = (document.getElementById("contest_name") as HTMLInputElement).value
                        let subject = (document.getElementById("subject") as HTMLInputElement).value
                        let year = parseInt((document.getElementById("year") as HTMLInputElement).value)
                        let month = parseInt((document.getElementById("month") as HTMLInputElement).value)
                        let day = parseInt((document.getElementById("day") as HTMLInputElement).value)
                        let grade = parseInt((document.getElementById("grade") as HTMLInputElement).value)
                        let international = (document.getElementById("international") as HTMLInputElement).checked
                        let studentName = (document.getElementById("student_name") as HTMLInputElement).value
                        let rank = (document.getElementById("rank") as HTMLInputElement).value
                        let award = (document.getElementById("award") as HTMLInputElement).value
                        let url = (document.getElementById("url") as HTMLInputElement).value

                        addContest(contestName, subject, year, month, day, grade, international, url, studentName, rank, award).then((lastComp)=>{
                            addProfiles(studentName).then(()=>{
                                addResults(studentName, rank, award).then(()=>{
                                    setComp(lastComp)
                                    setPopup(1)
                                    setTimeout(() => setPopup(-1), 4000)
                                }).catch(() => {
                                    setPopup(0)
                                    setTimeout(() => setPopup(-1), 4000)
                                })
                            }).catch(() => {
                                setPopup(0)
                                setTimeout(() => setPopup(-1), 4000)
                            })
                        }).catch(() => {
                            setPopup(0)
                            setTimeout(() => setPopup(-1), 4000)
                        })
                    }}>
                        <div>
                            <label>Enter the contest name</label>
                            <input type="text" id="contest_name" placeholder="International Rock Throwing Olympiad" required/>
                        </div>
                        <div>
                            <label>Enter the grade of students</label>
                            <input type="number" id="grade"/>
                        </div>
                        <div>
                            <label>Add the contest subject</label>
                            <input type="text" id="subject" placeholder="Rocks" required/>
                        </div>
                        <div>
                            <label>Year</label>
                            <input type="number" id="year" placeholder="2025" required/>
                        </div>
                        <div>
                            <label>Month</label>
                            <input type="number" id="month" placeholder="4"/>
                        </div>
                        <div>
                            <label>Day</label>
                            <input type="number" id="day" placeholder="9"/>
                        </div>
                        <div>
                            <label>Select student name column</label>
                            <select id="student_name">rank</select>
                        </div>
                        <div>
                            <label>Select rank column</label>
                            <select id="rank">rank</select>
                        </div>
                        <div>
                            <label>Select award column</label>
                            <select id="award">award</select>
                        </div>
                        <div>
                            <label>Add a link to the contest</label>
                            <input type="url" id="url"/>
                        </div>
                        <div>
                            <label>Is the contest international?</label>
                            <input type="checkbox" id="international"/>
                        </div>
                        <button type="submit">submit</button>
                    </form>
                    {popup == 1 && (<div className={styles['popup-succ']}>Successfully added competition!</div>)}
                    {popup == 0 && (<div className={styles['popup-fail']}>Competition upload unsuccessful</div>)}
                    <p id="warning" className={styles['warning']}></p>
                    <table id="table"></table>

                </div>

                <div className={styles['load']}>
                    <Load/>
                </div>
            </div>

        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className={styles['login-form']}>
                <input type='email'
                       placeholder='Email'
                       value={email}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
                <input type='password'
                       placeholder='Token'
                       value={password}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
                <button type='submit'>Sign in</button>
            </form>
        </div>
    )
}