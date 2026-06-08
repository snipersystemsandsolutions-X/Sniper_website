import { useEffect } from "react";

const Apple = () => {
  useEffect(() => {
    // Use replace instead of href to not add to history
    window.location.replace("/partners/apple/index.html");
  }, []);


};

export default Apple;
