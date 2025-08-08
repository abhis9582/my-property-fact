import { Suspense } from "react";
import HeaderClient from "./HeaderClient ";

const Header = () => {
  return (
    <Suspense fallback={<div>Loading header...</div>}>
      <HeaderClient />
    </Suspense>
  );
};

export default Header;
