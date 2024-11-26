import { NextResponse } from "next/server";
import db from "../../config/db"
export async function GET(){
    try{
        const result = await new Promise((resolve, reject)=> {
            db.query("SELECT * FROM city", (err, results)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(results);
                }
            });
        });
        return NextResponse.json(result);

    }catch(error){
        return NextResponse.json(
            {message: error},
            {status: 500}
        )
    }

}
export function POST(){

}
export function DELETE(){

}
export function UPDATE(){

}