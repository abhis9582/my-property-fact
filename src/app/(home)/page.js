import HomePage from "./components/home/page";
import styles from "../page.module.css";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div className={styles.page}>
      <HomePage />
      <ToastContainer />
    </div>
  );
}
