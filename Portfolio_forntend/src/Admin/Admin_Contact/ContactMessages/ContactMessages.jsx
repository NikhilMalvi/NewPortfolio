import React, { useState, useEffect } from "react";
import "./ContactMessages.css";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const { axios } = useAppContext();

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get("/api/contact/all");
      if (data.success) {
        setMessages(data.contacts || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchMessagesById = async (id) => {
    try {
      const { data } = await axios.get(`/api/contact/${id}`);
      if (data.success) {
        setSelectedMessage(data.contact);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      const { data } = await axios.delete(`/api/contact/delete/${id}`);

      if (data.success) {
        toast.success("Message deleted successfully.");
        fetchMessages();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((msg) =>
    [msg.name, msg.email, msg.subject, msg.message]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <section className="msgWrapper">
      <div className="msgContainer">
        <h2 className="msgHeading">Inbox Messages</h2>

        <div className="msgSearchBar">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredMessages.length === 0 ? (
          <p className="noMsgText">No messages found.</p>
        ) : (
          <table className="msgTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Preview</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMessages.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.subject}</td>
                  <td className="previewCell">{msg.message.slice(0, 30)}...</td>
                  <td>
                    {new Date(msg.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="actionCell">
                    <button
                      className="viewBtn"
                      onClick={() => fetchMessagesById(msg._id)}
                    >
                      View
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() => deleteMessage(msg._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* MODAL */}
        {selectedMessage && (
          <div className="msgModal">
            <div className="msgModalBox">
              <h3>Message Details</h3>

              <p>
                <strong>Name:</strong> {selectedMessage.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedMessage.email}
              </p>
              <p>
                <strong>Subject:</strong> {selectedMessage.subject}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>

              <p className="fullMessage">
                <strong>Message:</strong> {selectedMessage.message}
              </p>

              <button
                className="closeBtn"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactMessages;
