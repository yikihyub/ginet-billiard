import Image from "next/image";

const ImageSlider = () => {
  return (
    <div className="relative w-full h-[300px]">
      <Image
        src="/main/당구장 내부사진.jpg"
        alt="당구장 이미지"
        fill
        className="object-cover"
      />
      <div className="absolute bottom-4 right-4 text-white bg-black/50 px-2 py-1 rounded">
        1/2
      </div>
    </div>
  );
};

export default ImageSlider;
