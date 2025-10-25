import React from 'react';
import Image from "next/image";

function NoItemPresent({title='' , description=''}) {
  return (
    <div className={'w-full flex flex-col justify-center items-center min-h-full'}>
      <div className={'relative w-40 h-40'}>
        <Image
          src="/Icons/no-match-food.svg"
          alt="no match food"
          fill
          priority
          sizes="160px"
        />
      </div>

      <div className={'flex flex-col items-center gap-2'}>
        <span className={'font-bold text-2xl font-sans'}>{title}</span>
        <span
          className={'font-sans text-primary font-semibold'}>{description}</span>
      </div>
    </div>
  );
}

export default NoItemPresent;
