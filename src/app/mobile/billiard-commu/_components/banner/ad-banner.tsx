import Image from 'next/image';

export default function AdBanner() {
  return (
    <div className="relative mb-2 w-full bg-white">
      <div className="relative h-[140px] w-full overflow-hidden">
        <Image
          alt="매칭배너"
          src="/ad/org1.png"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
