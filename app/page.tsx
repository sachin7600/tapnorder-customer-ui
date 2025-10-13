"use client";
import Image from "next/image";
import {ArrowRight} from "lucide-react";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="relative mx-auto min-h-screen">
        <div className="absolute inset-0 z-0">
          <Image
            src={"/Images/bg-image.jpg"}
            alt={"background image"}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute z-10 flex flex-col items-center justify-center top-1/8 w-full">
          <span className="text-3xl font-bold text-white md:text-5xl lg:text-7xl flex flex-col">
            <span className={'mr-3'}>
              Café Haven
            </span>
          <span className="ml-8 h-0.5 bg-white"></span>
          </span>
        </div>

        <div className="absolute inset-0 z-20">
          <Image
            src={"/Images/bg-image2.svg"}
            alt={"overlay image"}
            fill
            priority
            className="object-cover"
          />
          <div className={'absolute h-full flex flex-col items-center justify-center w-full gap-5 pt-12'}>
            <Image
              src={"/Icons/logo.png"}
              alt={"overlay image"}
              width={84}
              height={84}
              priority
              className="rounded-2xl"
            />

            <span className={'font-bold px-24 text-center text-[22px] text-gray-800'}>
              Make Your Day With Food
            </span>

            <span className={'h-14 w-14 bg-teal-800 rounded-full flex justify-center items-center'} onClick={()=> router.replace('/dashboard')}>
              <ArrowRight color={'white'} size={32}/>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
