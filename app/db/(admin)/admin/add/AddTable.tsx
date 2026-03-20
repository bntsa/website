import supabase from "@/app/db/lib/supabaseClient";
import supabaseClient from "@/app/db/lib/supabaseClient";
import {getHeaders, getRows} from "@/app/db/components/Load";

let names: string[][] = []
let namesToAdd: Object[] = []
let comp: string

export async function addContest(name: string, subject: string, year: number, month: number, day: number, grade: number, international: boolean, link: string, name_col: string, rank_col: string, award_col: string) {

    const email: string | undefined = (await supabaseClient.auth.getSession()).data.session?.user.email
    var cols: string[] = []

    getHeaders().forEach((h: string) => {
        if([name_col, rank_col, award_col].includes(h)){
            if(h == name_col){
                cols.push("Contestant")
            }else if (h == rank_col){
                cols.push("Rank")
            }else{
                cols.push("Award")
            }
        }else cols.push(h)
    })

    const { data, error } = await supabase
        .from('comps')
        .insert([{name: name, subject: subject, year: year, month: month, day: day, grade: grade, international: international, link: link, cols: cols, email: require('crypto').createHash('sha256').update(email).digest('hex')}])
        .select('id_comp, name, year')
        .maybeSingle()
    if(error){
        console.log("Contest upload error", error)
        await Promise.reject("An error occurred in uploading the contest")
    }
    if(data){
        console.log("Contest upload successful", data)
        comp = data.id_comp
    }

    return data
}

export const formatName = (name: string) => {
    name = name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return name;
}

export async function addProfiles(name_col: string){
    names = []
    namesToAdd = []

    getRows().forEach(function (r: any) {
        r = r.trim();

        if (!r) {
            return;
        }

        var cols = r.split(',');

        let name: string = cols[getHeaders().indexOf(name_col)]

        let keywords = formatName(name).split(' ');
        names.push(keywords)
        namesToAdd.push({keywords: keywords, name: name})
    })

    const {data, error} = await supabase
        .from('profiles')
        .upsert(namesToAdd, {onConflict: 'name', ignoreDuplicates: true})

    if (error) {
        console.log("Profile upload error", error)
        await Promise.reject("An error occurred in uploading the profiles")
    }
    if (data) {
        console.log("Profile upload successful", data)
    }

}

export async function addResults(name_col: string, rank_col: string, award_col: string) {
    console.log("ind", getHeaders().indexOf(rank_col))
    console.log("ind", getHeaders().indexOf(award_col))
    console.log("rows", getRows())

    const prepareResults = async () => {


        const { data, error } = await supabase
            .from('profiles')
            .select()
            .containedBy('keywords', names)

        if(error){
            console.log("Profile fetch error", error)
            await Promise.reject("An error occurred in fetching the profile")
        }

        if(data){
            console.log("Profile fetch successful", data)
        }

        let output: any[] = []

        getRows().forEach(function (r: any) {
            r = r.trim();

            if (!r) {
                return;
            }

            var cols: any[] = r.split(',');
            let id_profile: number = -1
            let name: string[] = formatName(cols[getHeaders().indexOf(name_col)]).split(' ')
            let rank: any
            if(rank_col != 'None' && cols[getHeaders().indexOf(rank_col)]) rank = cols[getHeaders().indexOf(rank_col)];
            else rank = null
            let award: any
            if(award_col != 'None') award = cols[getHeaders().indexOf(award_col)]
            else award = null


            data?.forEach((obj)=>{
                if(JSON.stringify(name) == JSON.stringify(obj.keywords)){
                    id_profile = obj.id_profile
                }
            })

            let meta: any = {}

            getHeaders().forEach((h: string) => {
                if([name_col, rank_col, award_col].includes(h)){
                    if(h == name_col){
                        meta["Contestant"] = cols[getHeaders().indexOf(h)];
                    }else if (h == rank_col){
                        meta["Rank"] = cols[getHeaders().indexOf(h)];
                    }else{
                        meta["Award"] = cols[getHeaders().indexOf(h)];
                    }
                }else meta[h] = cols[getHeaders().indexOf(h)];
            })

            output.push({id_comp: comp, id_profile: id_profile, rank: rank, award: award, data: meta})

        })

        return output
    }

    prepareResults().then(async (output)=>{
        const {data, error} = await supabase
            .from('results')
            .upsert(output, {onConflict: 'id_comp, id_profile', ignoreDuplicates: true})
            .select()

        if(error){
            console.log("Result upload error", error)
            await Promise.reject("An error occurred in uploading the results")
        }

        if(data){
            console.log("Result upload successful", data)
        }
    })
}