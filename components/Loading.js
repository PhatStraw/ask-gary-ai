import ReactLoading from "react-loading";

const LoadingComp = () => {
  return (
    <div className="flex items-center justify-center">
      <ReactLoading
        type={"balls"}
        color={"#fff"}
        height={"150px"}
        width={"150px"}
      />
    </div>
  );
};

export default LoadingComp;
