import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";
import Navbar from "./Navbar";
function BulkMail() {
  const [sub, setsub] = useState("");
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setemailList] = useState([]);
  const [history, setHistory] = useState([]);
  const handleChange = (event) => {
    setmsg(event.target.value);
  };
  const handleSub = (event) => {
    setsub(event.target.value);
  };

  const handleSend = async () => {
    if (sub.trim() === "") {
      alert("Please fill in the Subject field.");
      return;
    }
    if (msg.trim() === "") {
      alert("Please fill in the Compose field.");
      return;
    }
    if (!emailList || emailList.length === 0) {
      alert("Please import a recipient email list.");
      return;
    }
    setstatus(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/sendmail`, {
        sub: sub,
        msg: msg,
        emailList: emailList,
      });
      if (res.data === true) {
        alert("Email Sent Successfully.");
        console.log(res.data);
        setHistory((data) => [
          {
            subject: sub,
            body: msg,
            recipients: emailList,
            status: "Success",
            sentAt: new Date().toLocaleString(),
          },
          ...data,
        ]);
        setsub("");
        setmsg("");
      } else {
        alert("Failed to send");
      }
    } catch (err) {
      console.log(err);
      alert("Email Failed To Send");
    } finally {
      setstatus(false);
    }
  };

  const handleFile = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetname = workbook.SheetNames;
      const worksheet = workbook.Sheets[sheetname];
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emaillist.map((item) => {
        return item.A;
      });
      setemailList(totalemail);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <>
      <Navbar />
      <section className="bulkmail_section">
        <header>
          <p>We can help your business with sending multiple emails at once</p>
        </header>
        <div className="bulkmail_container">
          <div className="bulkmail_input-box">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              placeholder="Enter your subject"
              onChange={handleSub}
              value={sub}
            />
            <label htmlFor="compose">Compose Email</label>
            <textarea
              onChange={handleChange}
              value={msg}
              placeholder="Enter the email text..."
            ></textarea>
          </div>
          <div className="bulkmail_input">
            <input
              id="fileUpload"
              onChange={handleFile}
              type="file"
              className="bulkmail_file-input"
            />
            <label htmlFor="fileUpload" className="bulkmail_file-btn">
              📂 Import File
            </label>

            <div className="bulkmail_email-count">
              <h2>{emailList.length}</h2>
              <p>Total email in the file</p>
            </div>
          </div>
          <button
            className="bulkmail_send-btn"
            onClick={handleSend}
            disabled={status}
          >
            {status ? "Sending.." : "Send"}
          </button>
        </div>
      </section>
      <section className="history_container">
        <div className="history-header">
          <h2>📜 Email history</h2>
        </div>
        {history.length === 0 ? (
          <p className="empty-state">No emails sent yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Body</th>
                  <th>Recipients</th>
                  <th>Status</th>
                  <th>Sent at</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, id) => (
                  <tr key={id}>
                    <td className="history_sub" title={item.subject}>
                      {item.subject}
                    </td>
                    <td className="history_body" title={item.body}>
                      {item.body}
                    </td>
                    <td className="history_reci">
                      <span className="rc-pill">
                        👥 {item.recipients.length} recipients
                      </span>
                    </td>
                    <td className="history_status">
                      <span
                        className={`status-pill ${item.status === "Success" ? "success" : "failed"}`}
                      >
                        {item.status === "Success" ? "✓" : "✕"} {item.status}
                      </span>
                    </td>
                    <td className="history_time">
                      {new Date(item.sentAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default BulkMail;
