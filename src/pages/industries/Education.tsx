import { useEffect } from "react";

const Education = () => {
  useEffect(() => {
    // Use replace instead of href to not add to history
    window.location.replace("/partners/apple-education/index.html");
  }, []);


};

export default Education;
