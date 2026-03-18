import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  className?: string;
}

export default function NotFound({ className = "" }: Props) {
  return (
    <main className={`relative grid min-h-screen place-items-center bg-background overflow-hidden ${className}`}>
      
    
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/404.png" 
          alt="Background"
          width={500}
          height={400}
          quality={30}
          className="blur-sm opacity-40 scale-110 object-contain"
        />
      </div>

   
      <div className="relative z-10 text-center px-6 ">
        <p className="text-base font-semibold text-primary animate-bounce">
          Упс :(
        </p>
        
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Здесь пусто
        </h1>
        
        <p className="mt-6 text-base leading-7 text-muted-foreground max-w-md mx-auto">
          
        </p>
        
        <div className="mt-10 translate-y-0">
          <Link
            href="/"
            className="inline-block rounded-2xl bg-primary px-10 py-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  );
}