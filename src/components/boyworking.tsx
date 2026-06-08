import Lottie from "lottie-react";
import boyWorkingAnimation from "@/assets/lottie/Boy-working.json";

export default function BoyWorking() {
  return (
    <div className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[550px] mx-auto">
      <Lottie
        animationData={boyWorkingAnimation}
        loop={true}
        className="w-full h-auto"
      />
    </div>
  );
}
