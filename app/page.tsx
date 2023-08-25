import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-around'>
      <div className='text-2xl font-bold text-center text-gray-800 mt-10'>
        Pinard Web Management Tool Prototype
      </div>
      <Image
        src='/marca/marca-vertical/marca-vertical_1.png'
        width={200}
        height={200}
        alt="Pinard's vertical logo"
      />
      <LoginForm />
    </main>
  );
}
