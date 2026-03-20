/*
export default function UserDetails(){
    const fetchProfiles = async () => {
        const res = await fetch('http://localhost:3000/db/api/profiles')
        return await res.json()
    }

    const [profiles, setProfiles] = useState([])

    useEffect(()=>{
        fetchProfiles().then((profiles)=>{
            setProfiles(profiles)
        })
    }, [])

    return (
        <div>
            <h1>Profiles</h1>
            {profiles.map((profile: any)=>(
                <div key={profile._id}>
                    <h2>{profile.name}</h2>
                    <p>{profile.displayName}</p>
                </div>
            ))}
        </div>
    )
}*/


/*
const UserDetails = async ({params}: {params: Promise<{name: string}>}) => {
    const {name} = await params;
    console.log("NAME OF THE PERSON: " + name)
    return (
        <div>Bro, your name is {name}</div>
    )
}
export default UserDetails*/


import LoadProfile from "@/app/db/(main)/LoadProfile";
import SearchBtn from "@/app/db/components/SearchBtn";
import {formatName} from "@/app/db/(admin)/admin/add/AddTable";

const UserDetails = async ({params}: {params: Promise<{name: string}>}) => {
    const {name} = await params;
    console.log("Querying profile: " + decodeURI(name).normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    let comp: string[] = formatName(decodeURI(name)).split(' ')

    return(
        <div>
            <SearchBtn/>
            <LoadProfile props={comp}/>
        </div>

    )
}
export default UserDetails