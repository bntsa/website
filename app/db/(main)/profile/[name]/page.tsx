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