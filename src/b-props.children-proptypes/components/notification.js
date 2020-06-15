import React from "react";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return message ? <div className="error">{message}</div> : null;
};

export default Notification;
