import Lottie from "lottie-react";
import peopleAnimation from "@/assets/lottie/people.json";

export default function People() {
  return (
    <div className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[450px] mx-auto">
      <Lottie
        animationData={peopleAnimation}
        loop={true}
        className="w-full h-auto"
      />
    </div>
  );
}
