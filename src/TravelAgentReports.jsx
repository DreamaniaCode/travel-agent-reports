import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";

function TravelAgentReports() {
  const travelerSigRef = useRef(null);
  const agentSigRef = useRef(null);

  const [formData, setFormData] = useState({
    bookingNo: "",
    name: "",
    country: "",
    agentName: "",
    stayFrom: "",
    stayTo: "",
    problemType: "",
    reportText: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const clearSignatures = () => {
    travelerSigRef.current.clear();
    agentSigRef.current.clear();
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    pdf.text("Travel Agent Report", 10, 10);
    pdf.text(`Booking No: ${formData.bookingNo}`, 10, 20);
    pdf.text(`Name: ${formData.name}`, 10, 30);
    pdf.text(`Country: ${formData.country}`, 10, 40);
    pdf.text(`Agent Name: ${formData.agentName}`, 10, 50);
    pdf.text(`Stay from: ${formData.stayFrom} to ${formData.stayTo}`, 10, 60);
    pdf.text(`Type of Problem: ${formData.problemType}`, 10, 70);
    pdf.text(`Report: ${formData.reportText}`, 10, 80);

    // Add traveler signature
    const travelerSig = travelerSigRef.current.getTrimmedCanvas().toDataURL("image/png");
    pdf.addImage(travelerSig, "PNG", 10, 90, 80, 40);
    pdf.text("Traveler Signature", 10, 135);

    // Add agent signature
    const agentSig = agentSigRef.current.getTrimmedCanvas().toDataURL("image/png");
    pdf.addImage(agentSig, "PNG", 110, 90, 80, 40);
    pdf.text("Agent Signature", 110, 135);

    pdf.save("TravelAgentReport.pdf");
  };

  return (
    <div style={{maxWidth: 600, margin: "auto"}}>
      <h2>Travel Agent Reports</h2>
      <input type="text" name="bookingNo" placeholder="Booking No." onChange={handleChange} />
      <input type="text" name="name" placeholder="Name" onChange={handleChange} />
      <input type="text" name="country" placeholder="Country" onChange={handleChange} />
      <input type="text" name="agentName" placeholder="Agent Name" onChange={handleChange} />
      <label>Stay from:</label>
      <input type="date" name="stayFrom" onChange={handleChange} />
      <label>Stay to:</label>
      <input type="date" name="stayTo" onChange={handleChange} />
      <select name="problemType" onChange={handleChange}>
        <option value="">Select Problem Type</option>
        <option value="Booking Issue">Booking Issue</option>
        <option value="Accommodation">Accommodation</option>
        <option value="Other">Other</option>
      </select>
      <textarea name="reportText" placeholder="Report text" onChange={handleChange} />

      <div style={{display: "flex", justifyContent: "space-between", marginTop: 20}}>
        <div>
          <p>Traveler Signature:</p>
          <SignatureCanvas ref={travelerSigRef} backgroundColor="white" penColor="black" canvasProps={{width: 250, height: 100, className: "sigCanvas"}} />
        </div>
        <div>
          <p>Agent Signature:</p>
          <SignatureCanvas ref={agentSigRef} backgroundColor="white" penColor="black" canvasProps={{width: 250, height: 100, className: "sigCanvas"}} />
        </div>
      </div>

      <button onClick={generatePDF} style={{marginTop: 20}}>Export to PDF</button>
      <button onClick={clearSignatures} style={{marginLeft: 10}}>Clear Signatures</button>
    </div>
  );
}

export default TravelAgentReports;
