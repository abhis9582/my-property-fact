import Media from "./page";

export const metadata = {
    title: "Media",
    description: "Media",
    robots: "noindex, nofollow",
  };

export default function MediaLayout(){
    return(
        <>
        {<Media />}
        </>
    )
}