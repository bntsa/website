'use client'

import supabase from "@/app/db/lib/supabaseClient";
import {useEffect, useState} from "react";
import styles from "@/app/db/(main)/profile.module.css"

const LoadProfile = ({props}: { props: string[] }) => {
    const [fetchError, setFetchError] = useState<any | null>(null)
    const [profiles, setProfiles] = useState<any[] | null>([])
    const [results, setResults] = useState<any[] | null>(null)
    const [profileCount, setProfileCount] = useState<any | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            console.log("PROPS", props)
            const {data, error} = await supabase
                .from('profiles')
                .select()
                .contains('keywords', props)

            if (error) {
                console.log("Error check", error)
                setFetchError('Could not fetch the profile')
                setProfiles(null)
                console.log(error)
            }

            if (data) {
                console.log("DATA", data)
                setProfiles(data)
                setFetchError(null)
            } else {
                setFetchError('No profile found')
                setProfiles(null)
                console.log(error)
            }

            return data
        }

        const fetchResults = async (id_profile: any) => {
            const {data, error} = await supabase
                .from('results')
                .select(
                    `
                    rank,
                    award,
                    id_comp,
                    comps (name, grade, year, link)
                    `
                )
                .eq('id_profile', id_profile)
                .order('comps(year)', {ascending: false})

            if (error) {
                setFetchError('Could not fetch any competitions')
                setResults(null)
                console.log(error)
            }

            if (data) {
                console.log("got data", data)
                setResults(data)
                setFetchError(null)
            }

            console.log("Data", data)
            return data
        }

        fetchProfile().then((p) => {
            setProfileCount(p?.length)
            console.log("plength", p)

            if (p?.length == 1) fetchResults(p[0].id_profile).then((res) => {
                function sort_by_key(array: any[] | null, key: any)
                {
                    if(!array) return null;
                    return array.sort(function(a, b)
                    {
                        var x = a.comps[key]; var y = b.comps[key];
                        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                    });
                }

                setResults(sort_by_key(res, "year"))
            })
        }).catch((err) => {
            console.log("error", err)

        })

        console.log("t2")

    }, []);

    if (profiles) {
        if (profileCount == 1 && profiles[0].id_profile) {
            return (
                <div>
                    <h1 className={styles['profile-name']}>{profiles[0].name}</h1>
                    <div>
                        {fetchError && (<p>{fetchError}</p>)}
                        {results && (
                            <div className={styles['table-container']}>
                                <table className={styles['result-table']}>
                                    <thead>
                                    <tr key="description">
                                        <th className={styles['competition-th']}>Competition Name</th>
                                        <th className={styles['competition-th']}>Year</th>
                                        <th className={styles['competition-th']}>Rank</th>
                                        <th className={styles['competition-th']}>Award</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {results.map(result => (
                                        <tr key={result.id_comp}>
                                            <td className={styles['competition-td']}>
                                                {result.comps.link && (<a href={result.comps.link} className={styles['competition-link']}>{result.comps.name} </a>)}
                                                {!result.comps.link && (<div>{result.comps.name}</div>)}
                                            </td>
                                            <td className={styles['competition-td']}>{result.comps.year}</td>
                                            <td className={styles['competition-td']}>{result.rank}</td>
                                            <td className={styles['competition-td']}>{result.award}</td>
                                        </tr>
                                    ))}
                                    </tbody>

                                </table>
                            </div>

                        )}
                    </div>

                </div>
            )
        }
        if (profileCount && profileCount > 1) {
            return (
                <div>
                    <h2 className={styles['profile-name']}>Multiple profiles found</h2>
                    <div className={styles['table-container']}>
                        <table className={styles['profile-table']}>
                            <thead>
                                <tr key="description">
                                    <th className={styles['competition-th']}>Profile Name</th>

                                </tr>
                            </thead>
                            <tbody>
                            {profiles.map(profile => (
                                <tr key={profile.name}>
                                    <td className={styles['competition-td']}>
                                        <a href={'/db/profile/'+profile.name} className={styles['profile-link']}>{profile.name}</a></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            )
        }

        if(profileCount==0){
            return (
                <div>
                    <p>Unable to fetch profile</p>
                </div>

            )
        }

    }

    return(
        <div>

            <p>Loading profile</p>
        </div>
    )


}

export default LoadProfile