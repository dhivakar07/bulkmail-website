import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const handleSignout = () => {
    navigate("/");
  };
  return (
    <>
      <section className="navbar_section">
        <div className="navbar_header">
          <h1>✉ BulkMail</h1>
        </div>
        <div>
          <button className="navbar_signout-btn" onClick={handleSignout}>
            Sign out
          </button>
        </div>
      </section>
    </>
  );
}
export default Navbar;
