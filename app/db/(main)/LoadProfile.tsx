'use client'

import supabase from "@/app/db/lib/supabaseClient";
import {useEffect, useState} from "react";
import styles from "@/app/db/(main)/profile.module.css"
import {formatName} from "@/app/db/(admin)/admin/add/AddTable";

const LoadProfile = ({props}: { props: string[] }) => {
    const [fetchError, setFetchError] = useState<any | null>(null)
    const [profiles, setProfiles] = useState<any[] | null>([])
    const [profile, setProfile] = useState<any | null>(null)
    const [results, setResults] = useState<any[] | null>(null)
    const [profileCount, setProfileCount] = useState<number | null>(null)


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

    useEffect(() => {
        fetchProfile().then((p) => {
            console.log("P_length", p?.length)
            if(p) {
                console.log("We are setting profile count to ", p.length)
                if(p.length == 1) setProfile(p[0])
                setProfileCount(p.length)
            }


        }).catch((err) => {
            console.log("error", err)

        })
    }, []);

    useEffect(() => {
        if(profileCount && profiles){
            console.log("plength", profileCount)
            if(profileCount > 1) {
                setProfile(profiles[0])
                profiles.forEach(p => {
                    if(JSON.stringify(formatName(p.name).split(" ")) == JSON.stringify(props)){
                        setProfile(p)
                        setProfileCount(1)
                    }
                })
            }

            if(profileCount == 1){
                fetchResults(profile.id_profile).then((res) => {
                    function sort_by_key(array: any[] | null, key: any) {
                        if (!array) return null;
                        return array.sort(function (a, b) {
                            var x = a.comps[key];
                            var y = b.comps[key];
                            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                        });
                    }

                    setResults(sort_by_key(res, "year"))
                })
            }

        }

    }, [profileCount]);

    if (profiles) {
        if (profileCount == 1 && profile) {
            return (
                <div>
                    <h1 className={styles['profile-name']}>{profile.name}</h1>
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
        if (profileCount && profile && profileCount > 1) {
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
                            {profiles.map(prof => (
                                <tr key={prof.name}>
                                    <td className={styles['competition-td']}>
                                        <a href={'/db/profile/'+prof.name} className={styles['profile-link']}>{prof.name}</a></td>
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
                    <p>No profile found</p>
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