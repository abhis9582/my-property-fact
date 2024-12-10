import BuilderPage from "./builderpage";

export default async function Builder({params}){
    const {buildername} = await params;
    return(
        <>
            <BuilderPage builderName={buildername}/>
        </>
    )
}