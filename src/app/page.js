
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Hello world</h1>
      <Link href='/components'>home</Link>
    </div>
  );
}