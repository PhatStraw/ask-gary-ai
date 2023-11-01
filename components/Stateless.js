import Typewriter from "typewriter-effect";

const Stateless = (props) => {
  return (
    <div className="h-full w-full p-2 pt-1 text-xl md:text-2xl text-slate-300">
      <Typewriter
        options={{
          wrapperClassName: "white-text",
          pauseFor: 0,
          delay: 10,
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString(
              props.message
            )
            .callFunction(() => {
              console.log("String typed out!");
            })
            .pauseFor(2500)
            .callFunction(() => {
              console.log("All strings were deleted");
            })
            .start();
        }}
      />
    </div>
  );
};

export default Stateless;
