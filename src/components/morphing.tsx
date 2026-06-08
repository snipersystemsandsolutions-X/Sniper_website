import Lottie from "lottie-react";
import morphingAnimation from "@/assets/lottie/Morphing.json";

export default function Morphing() {
  return (
    <div className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[550px] mx-auto">
      <Lottie
        animationData={morphingAnimation}
        loop={true}
        className="w-full h-auto"
      />
    </div>
  );
}
