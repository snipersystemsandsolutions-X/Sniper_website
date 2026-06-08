import serviceAnimation from "@/assets/lottie/services-animation.json";
import Lottie from "lottie-react";

export default function ServicesAnimation() {
  return (
    <div className="w-full max-w-[550px] sm:max-w-[600px] md:max-w-[700px] mx-auto">
      <Lottie
        animationData={serviceAnimation}
        loop={true}
        className="w-full h-auto"
      />
    </div>
  );
}
