import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Login() {
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const navigate = useNavigate();

  const [emailerror, setemailerror] = useState(false);
  const [passerror, setpasserror] = useState(false);
  const [status, setstatus] = useState(false);
  const handleLogin = () => {
    setstatus(true);
    let hasError = false;
    if (email.trim() == "") {
      setemailerror(true);
      hasError = true;
    } else {
      setemailerror(false);
    }
    if (pass.trim() == "") {
      setpasserror(true);
      hasError = true;
    } else {
      setpasserror(false);
    }
    if (hasError) {
      setstatus(false);
      return;
    }
    axios
      .post(`${import.meta.env.VITE_API_URL}/login`, {
        email: email,
        pass: pass,
      })
      .then((res) => {
        if (res.data == true) {
          navigate("/bulkmail");
        } else {
          alert("Enter the correct admin email and password.");
          setemail("");
          setpass("");
          setstatus(false);
        }
      });
  };
  const handleEmail = (e) => {
    setemail(e.target.value);
  };
  const handlePass = (e) => {
    setpass(e.target.value);
  };
  return (
    <>
      <section className="login_section">
        <header>
          <h1>✉ BulkMail</h1>
          <p>Enterprise Admin Portal</p>
        </header>
        <div className="login_input-box">
          <h2>Login</h2>
          <div className="login_input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              onChange={handleEmail}
              value={email}
            />
            {emailerror && (
              <span className={`email-error ${emailerror ? "show" : ""}`}>
                Please enter email address
              </span>
            )}
          </div>
          <div className="login_input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={handlePass}
              value={pass}
            />
            {passerror && (
              <span className={`password-error ${passerror ? "show" : ""}`}>
                Please enter password
              </span>
            )}
          </div>
          <button onClick={handleLogin}>
            {status ? "Logging In.." : "Login"}
          </button>
        </div>
      </section>
    </>
  );
}
export default Login;
