import Sidebar from "../components/Sidebar";
import MetaData from "../components/MetaData"
import Main from "../components/Main"
const styles = {
  container : `h-full w-full flex bg-[#fff]`
}

export default function Home() {
  return (
    <div className={styles.container}>
      <MetaData />
      <Sidebar />
      <Main />
    </div>
  );
}
