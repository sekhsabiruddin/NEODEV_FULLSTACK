import React from "react";
import { ScaleLoader } from "react-spinners";
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ScaleLoader color="#4A90E2" loading={true} size={150} />
    </div>
  );
};

export default Loading;
