import Image from "next/image";
import HomepagePages from "../components/Homepage/Pages.jsx";
import AboutPages from "@/components/AboutPage/Pages.jsx";
import CommentPages from "../components/Commend.jsx/Pages.jsx";

export default function Home() {
  return (
    <div className="font-sans dark:bg-black">
      <HomepagePages />
      <AboutPages />
      <CommentPages />
    </div>
  );
}
