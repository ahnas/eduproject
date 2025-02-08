import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import "./ResumeChat.css";

const ResumeChat = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [input, setInput] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.trim() || !name.trim() || !phoneNumber.trim()) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/resume/', {
        name: name,
        email: email,
        phone_number: phoneNumber,
        content: input,
      });
      setResume(response.data);
      setInput('');
    } catch (error) {
      setError('Error generating resume. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    
    doc.setFontSize(22);
    doc.text("AI-Generated Resume", 15, 20);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Name: ${resume.name}`, 15, 40);
    doc.text(`Email: ${resume.email}`, 15, 50);
    doc.text(`Phone: ${resume.phone_number}`, 15, 60);

    doc.setFont("helvetica", "bold");
    doc.text("Resume Content:", 15, 80);
    doc.setFont("helvetica", "normal");

    const splitText = doc.splitTextToSize(resume.content, 180);
    doc.text(splitText, 15, 90);

    doc.save(`${resume.name}_Resume.pdf`);
  };

  return (
    <div className="resume-container">
      <h1>AI Resume Builder</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <textarea
          placeholder="Describe your skills, experience, and education..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="5"
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Create Resume'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {resume && (
        <div className="resume-output">
          <h3>Your AI-Generated Resume</h3>
          <p><strong>Name:</strong> {resume.name}</p>
          <p><strong>Email:</strong> {resume.email}</p>
          <p><strong>Phone:</strong> {resume.phone_number}</p>
          <p><strong>Content:</strong></p>
          <p>{resume.content}</p>
          <button onClick={handleDownloadPDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default ResumeChat;
