import { useEffect } from "react";

const Unity = () => {
  useEffect(() => {
    window.location.replace("/partners/unity/index.html");
  }, []);

  return null; // ✅ Add this
};

export default Unity;
