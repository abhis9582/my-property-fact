import Image from 'next/image';
import './common.css';
export default function WebStory() {
    return (
        <div className="container-fluid bg-dark p-0 m-0">
            <h2 className="text-center m-0 p-0">My Web Story</h2>
            <div className='d-flex justify-content-center'>
                <div className="webstory-container pt-3">
                    <Image src="/dream-cities/agra.jpg" width={400} height={500} alt='image' />
                </div>
            </div>
        </div>
    );
}
