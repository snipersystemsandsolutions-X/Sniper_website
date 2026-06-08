import Lottie from "lottie-react";
import animationData from "@/assets/lottie/animation.json";

export default function LottieAnimation() {
  return (
    <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto">
      <Lottie
        animationData={animationData}
        loop={true}
        className="w-full h-auto"
      />
    </div>
  );
}
