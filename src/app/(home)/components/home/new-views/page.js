"use client";
import "./newviews.css";
import Image from "next/image";
import { useState } from "react";
import CommonPopUpform from "../../common/popupform";
export default function NewsViews() {
  const [isOpen, setIsOpen] = useState(false);
  //defining arry of datas
  const dataArray = [
    {
      id: 1,
      title: "Highway Construction",
      src: "/news-views/Highway_const.jpg",
      alt: "highway_construction",
      title2: "NOIDA Airport to get Connectivity Boost ",
      desc: "Yamuna Expressway is all set to gain additional connectivity with a direct link between Noida Airport and IGI."
    },
    {
      id: 2,
      title: "Metro Station",
      src: "/news-views/Metro_Station.jpg",
      alt: "Metro_Station",
      title2: "NOIDA Metro to decongest soon",
      desc: "Noida authority has accepted a fresh application from NOIDA Metro Rail Corporation for an additional metro line to connect Sector 142 and Botanical Garden."
    },
    {
      id: 3,
      title: "Money",
      src: "/news-views/mne.jpg",
      alt: "mne",
      title2: "Noida Dealers & Developers Rejoice ",
      desc: "Noida Authority has approved an additional hike of 30% in property circle rates. Bringing great joy to investors and developers."
    },
    {
      id: 4,
      title: "Money Distribution",
      src: "/news-views/Money_Distributiuon.jpg",
      alt: "Money_Distribution",
      title2: "YEIDA launches Plotted housing",
      desc: "YEIDA has recently launched a new plotted housing scheme that will offer plots at a subsidies rate. The allotment will be done through a lottery system."
    },
  ]
  return (
    <>
      <div className="container">
        <div className="row">
          {dataArray.map((item, index) => (
            <div key={`${item.id}-${index}`} className="col-12 col-sm-6 col-md-4 col-lg-3 mt-3">
              <div className="flip-card">
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="flip-card-front">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      className="img-fluid"
                      height={400}
                      width={350}
                    />
                    <div className="title-3d">
                      <p className="text-center m-0 p-2">{item.title2}</p>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="flip-card-back">
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            </div>

          ))}
        </div>
      </div >
      <CommonPopUpform show={isOpen} handleClose={setIsOpen} />
    </>
  );
}
