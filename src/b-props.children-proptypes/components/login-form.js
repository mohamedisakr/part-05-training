import React from "react";

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      username
      <input
        type="text"
        name="Username"
        value={username}
        onChange={handleUsernameChange}
      />
    </div>
    <div>
      password
      <input
        type="password"
        name="Password"
        value={password}
        onChange={handlePasswordChange}
      />
    </div>
    <button type="submit">Login</button>
  </form>
);

export default LoginForm;
