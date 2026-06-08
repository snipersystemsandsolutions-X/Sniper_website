import Lottie from "lottie-react";
import customerService from "@/assets/lottie/Customer-Service.json";

export default function CustomerService() {
  return (
    <div className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[550px] mx-auto">
      <Lottie
        animationData={customerService}
        loop={true}
        className="w-full h-auto"
      />
    </div>
  );
}
