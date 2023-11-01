const ChatResponse = (props) => {
    return (
      <div
        key={props.messages[props.messages.length - 1].id}
        className="whitespace-pre-wrap"
      >
        <h3 className="text-3xl text-slate-200">
          {props.messages[props.messages.length - 1].role === "user" ? "User" : "Answer"}
        </h3>
        <p className="p-2 text-xl text-slate-300">
          {props.messages[props.messages.length - 1].content}
        </p>
      </div>
    );
  };

  export default ChatResponse;