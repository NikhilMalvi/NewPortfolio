import React from "react";
import { IoLocationOutline, IoMailOutline } from "react-icons/io5";
import "./Contact.css";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext"; // adjust path if needed

const Contact = () => {
  const [result, setResult] = React.useState("");
  const [name, setName] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { axios } = useAppContext(); // use your configured axios

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setResult("Sending...");

      const { data } = await axios.post("/api/contact/send", {
        name,
        email,
        subject,
        message,
      });

      if (data.success) {
        toast.success(data.message || "Message sent successfully!");
        setResult(data.message || "Message sent successfully!");

        // clear inputs
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        console.log("Error", data);
        toast.error(data.message || "Something went wrong.");
        setResult(data.message || "Something went wrong.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      setResult("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Contact | Nikhil Malviya - Web Developer</title>

      <meta
        name="description"
        content="Let's work together! Contact Nikhil Malviya, a passionate web developer, for your next website or WordPress project. Available for freelance and collaboration."
      />
      <div className="contact section_container">
        <div className="contact_heading">
          <h1>Contact</h1>
          <p>Let's start right now!</p>
        </div>
        <div className="contact_data">
          <div className="max_container contact_container">
            <div className="col1">
              <h1 className="primery_heading headings">Contact Detail</h1>
              <div className="box_icon">
                <IoLocationOutline size={22} color="var(--text-color)" />
                <h1 className="location">Ahmedabad | India</h1>
              </div>
              <div className="box_icon">
                <IoMailOutline size={22} color="var(--text-color)" />
                <h1 className="email">
                  <a href="mailto:nikhilmalvi845@gmail.com">
                    nikhilmalvi845@gmail.com
                  </a>
                </h1>
              </div>
            </div>

            <div className="col2">
              <div className="form_container">
                <h1>Send Message</h1>
                <form onSubmit={onSubmit}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    placeholder="Enter your subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />

                  <label htmlFor="message">Message</label>
                  <textarea
                    name="message" // 🔥 changed from "messages"
                    id="message"
                    rows="6"
                    required
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>

                  <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Sending..." : "Submit"}
                  </button>
                </form>
                <span className="send_message">{result}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
