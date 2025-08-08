'use client';

import useSWR from "swr";
import axios from "axios";
import HeaderComponent from "./headerComponent";

// Axios fetcher
const fetcher = (url) => axios.get(url).then((res) => res.data);

const HeaderClient = () => {
  const { data: cityList } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}city/all`,
    fetcher,
  );

  const { data: projectTypes } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`,
    fetcher,
  );

  const { data: builderData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}builder/get-all`,
    fetcher,
  );

  const builderList = builderData?.builders || [];

  return (
    <HeaderComponent
      cityList={cityList}
      projectTypes={projectTypes}
      builderList={builderList}
    />
  );
};

export default HeaderClient;
