import React, { useState,useImperativeHandle } from "react";

const Togglable =React.forwardRef( (props,ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };
  const ToggleVisibility = () => setVisible(!visible);
useImperativeHandle(ref,()=>{return {ToggleVisibility}})

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={ToggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={ToggleVisibility}>Cancel</button>
      </div>
    </div>
  );
};

export default Togglable;
