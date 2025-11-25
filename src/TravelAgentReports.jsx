import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";

// Country and Phone Code Data
const countries = [
  { name: "United States", code: "US", phoneCode: "+1" },
  { name: "United Kingdom", code: "GB", phoneCode: "+44" },
  { name: "Canada", code: "CA", phoneCode: "+1" },
  { name: "Australia", code: "AU", phoneCode: "+61" },
  { name: "Germany", code: "DE", phoneCode: "+49" },
  { name: "France", code: "FR", phoneCode: "+33" },
  { name: "Italy", code: "IT", phoneCode: "+39" },
  { name: "Spain", code: "ES", phoneCode: "+34" },
  { name: "Netherlands", code: "NL", phoneCode: "+31" },
  { name: "Belgium", code: "BE", phoneCode: "+32" },
  { name: "Switzerland", code: "CH", phoneCode: "+41" },
  { name: "Austria", code: "AT", phoneCode: "+43" },
  { name: "Portugal", code: "PT", phoneCode: "+351" },
  { name: "Ireland", code: "IE", phoneCode: "+353" },
  { name: "Denmark", code: "DK", phoneCode: "+45" },
  { name: "Sweden", code: "SE", phoneCode: "+46" },
  { name: "Norway", code: "NO", phoneCode: "+47" },
  { name: "Finland", code: "FI", phoneCode: "+358" },
  { name: "Poland", code: "PL", phoneCode: "+48" },
  { name: "Czech Republic", code: "CZ", phoneCode: "+420" },
  { name: "Hungary", code: "HU", phoneCode: "+36" },
  { name: "Romania", code: "RO", phoneCode: "+40" },
  { name: "Greece", code: "GR", phoneCode: "+30" },
  { name: "Turkey", code: "TR", phoneCode: "+90" },
  { name: "Russia", code: "RU", phoneCode: "+7" },
  { name: "China", code: "CN", phoneCode: "+86" },
  { name: "Japan", code: "JP", phoneCode: "+81" },
  { name: "South Korea", code: "KR", phoneCode: "+82" },
  { name: "India", code: "IN", phoneCode: "+91" },
  { name: "Singapore", code: "SG", phoneCode: "+65" },
  { name: "Thailand", code: "TH", phoneCode: "+66" },
  { name: "Malaysia", code: "MY", phoneCode: "+60" },
  { name: "Indonesia", code: "ID", phoneCode: "+62" },
  { name: "Philippines", code: "PH", phoneCode: "+63" },
  { name: "Vietnam", code: "VN", phoneCode: "+84" },
  { name: "United Arab Emirates", code: "AE", phoneCode: "+971" },
  { name: "Saudi Arabia", code: "SA", phoneCode: "+966" },
  { name: "Israel", code: "IL", phoneCode: "+972" },
  { name: "Egypt", code: "EG", phoneCode: "+20" },
  { name: "South Africa", code: "ZA", phoneCode: "+27" },
  { name: "Nigeria", code: "NG", phoneCode: "+234" },
  { name: "Kenya", code: "KE", phoneCode: "+254" },
  { name: "Brazil", code: "BR", phoneCode: "+55" },
  { name: "Argentina", code: "AR", phoneCode: "+54" },
  { name: "Chile", code: "CL", phoneCode: "+56" },
  { name: "Colombia", code: "CO", phoneCode: "+57" },
  { name: "Mexico", code: "MX", phoneCode: "+52" },
  { name: "New Zealand", code: "NZ", phoneCode: "+64" },
  { name: "South Africa", code: "ZA", phoneCode: "+27" },
  { name: "Morocco", code: "MA", phoneCode: "+212" },
  { name: "Tunisia", code: "TN", phoneCode: "+216" },
  { name: "Algeria", code: "DZ", phoneCode: "+213" },
  { name: "Peru", code: "PE", phoneCode: "+51" },
  { name: "Venezuela", code: "VE", phoneCode: "+58" },
  { name: "Uruguay", code: "UY", phoneCode: "+598" },
  { name: "Paraguay", code: "PY", phoneCode: "+595" },
  { name: "Bolivia", code: "BO", phoneCode: "+591" },
  { name: "Ecuador", code: "EC", phoneCode: "+593" },
  { name: "Costa Rica", code: "CR", phoneCode: "+506" },
  { name: "Panama", code: "PA", phoneCode: "+507" },
  { name: "Guatemala", code: "GT", phoneCode: "+502" },
  { name: "Honduras", code: "HN", phoneCode: "+504" },
  { name: "El Salvador", code: "SV", phoneCode: "+503" },
  { name: "Nicaragua", code: "NI", phoneCode: "+505" },
  { name: "Jamaica", code: "JM", phoneCode: "+1876" },
  { name: "Cuba", code: "CU", phoneCode: "+53" },
  { name: "Haiti", code: "HT", phoneCode: "+509" },
  { name: "Dominican Republic", code: "DO", phoneCode: "+1809" },
  { name: "Puerto Rico", code: "PR", phoneCode: "+1787" },
  { name: "Trinidad and Tobago", code: "TT", phoneCode: "+1868" },
  { name: "Barbados", code: "BB", phoneCode: "+1246" },
  { name: "Bahamas", code: "BS", phoneCode: "+1242" },
  { name: "Belize", code: "BZ", phoneCode: "+501" },
  { name: "Guyana", code: "GY", phoneCode: "+592" },
  { name: "Suriname", code: "SR", phoneCode: "+597" },
  { name: "French Guiana", code: "GF", phoneCode: "+594" },
];

function TravelAgentReports() {
  const travelerSigRef = useRef(null);
  const agentSigRef = useRef(null);
  const [view, setView] = useState('form'); // 'form' or 'dashboard'
  const [savedReports, setSavedReports] = useState([]);
  const [formData, setFormData] = useState({
    bookingNo: "",
    name: "",
    phone: "",
    phoneCode: "+1",
    country: "",
    countryCode: "US",
    hotelName: "",
    agentName: "",
    stayFrom: "",
    stayTo: "",
    problemType: "",
    reportText: "",
  });

  // Load saved reports from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('travelAgentReports');
    if (saved) {
      setSavedReports(JSON.parse(saved));
    }
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travelAgentReports', JSON.stringify(savedReports));
  }, [savedReports]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleCountryChange = (e) => {
    const selectedCountry = countries.find(country => country.code === e.target.value);
    if (selectedCountry) {
      setFormData({
        ...formData,
        countryCode: selectedCountry.code,
        country: selectedCountry.name,
        phoneCode: selectedCountry.phoneCode
      });
    }
  };

  const clearSignatures = () => {
    travelerSigRef.current.clear();
    agentSigRef.current.clear();
  };

  const saveReport = () => {
    if (!formData.bookingNo || !formData.name) {
      alert('Please fill in at least Booking No and Name');
      return;
    }

    const travelerCanvas = travelerSigRef.current.getCanvas();
    const agentCanvas = agentSigRef.current.getCanvas();
    
    const newReport = {
      id: Date.now(),
      ...formData,
      travelerSignature: travelerCanvas.toDataURL("image/png"),
      agentSignature: agentCanvas.toDataURL("image/png"),
      createdAt: new Date().toLocaleString()
    };

    setSavedReports([newReport, ...savedReports]);
    setFormData({
      bookingNo: "",
      name: "",
      phone: "",
      email: "",
      country: "",
      hotelName: "",
      agentName: "",
      stayFrom: "",
      stayTo: "",
      problemType: "",
      reportText: "",
    });
    clearSignatures();
    alert(`Thank you! Your report has been saved successfully.\n\nReport ID: ${newReport.id}\nBooking No: ${newReport.bookingNo}`);
  };

  const generatePDF = () => {
    if (!formData.bookingNo || !formData.name) {
      alert('Please fill in at least Booking No and Name before generating PDF');
      return;
    }

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('Travel Agent Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Divider line
    pdf.setDrawColor(52, 152, 219);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;

    // Information section
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    
    // Left column
    pdf.text(`Booking No: ${formData.bookingNo}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Name: ${formData.name}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Phone: ${formData.phone || 'N/A'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Email: ${formData.email || 'N/A'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Country: ${formData.country || 'N/A'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Hotel: ${formData.hotelName || 'N/A'}`, 20, yPosition);
    yPosition += 15;

    // Right column
    const rightColumnX = pageWidth / 2 + 10;
    pdf.text(`Agent: ${formData.agentName || 'N/A'}`, rightColumnX, yPosition - 35);
    yPosition += 8;
    pdf.text(`Stay From: ${formData.stayFrom || 'N/A'}`, rightColumnX, yPosition - 27);
    yPosition += 8;
    pdf.text(`Stay To: ${formData.stayTo || 'N/A'}`, rightColumnX, yPosition - 19);
    yPosition += 8;
    pdf.text(`Problem Type: ${formData.problemType || 'N/A'}`, rightColumnX, yPosition - 11);
    yPosition += 15;

    // Report section
    pdf.setFont(undefined, 'bold');
    pdf.text('Report:', 20, yPosition);
    yPosition += 8;
    pdf.setFont(undefined, 'normal');
    
    // Word wrap for report text
    const reportLines = pdf.splitTextToSize(formData.reportText || 'No report provided', pageWidth - 40);
    pdf.text(reportLines, 20, yPosition);
    yPosition += reportLines.length * 6 + 15;

    // Signatures section
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFont(undefined, 'bold');
    pdf.text('Signatures:', 20, yPosition);
    yPosition += 15;

    // Get signature canvases
    const travelerCanvas = travelerSigRef.current.getCanvas();
    const agentCanvas = agentSigRef.current.getCanvas();
    
    // Scale signatures to fit better
    const signatureWidth = 80;
    const signatureHeight = 30;
    
    // Traveler signature
    if (travelerCanvas) {
      const travelerSig = travelerCanvas.toDataURL("image/png");
      pdf.addImage(travelerSig, "PNG", 20, yPosition, signatureWidth, signatureHeight);
      pdf.text('Traveler Signature', 20, yPosition + signatureHeight + 5);
    }
    
    // Agent signature
    if (agentCanvas) {
      const agentSig = agentCanvas.toDataURL("image/png");
      pdf.addImage(agentSig, "PNG", pageWidth - 100, yPosition, signatureWidth, signatureHeight);
      pdf.text('Agent Signature', pageWidth - 100, yPosition + signatureHeight + 5);
    }

    // Footer
    const footerY = pageHeight - 20;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, footerY, { align: 'center' });

    pdf.save(`TravelAgentReport_${formData.bookingNo || 'Report'}.pdf`);
  };

  const deleteReport = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setSavedReports(savedReports.filter(report => report.id !== id));
    }
  };

  const exportAllReports = () => {
    if (savedReports.length === 0) {
      alert('No reports to export');
      return;
    }

    const csvContent = [
      ['Booking No', 'Name', 'Phone Code', 'Phone', 'Email', 'Country', 'Hotel Name', 'Agent Name', 'Stay From', 'Stay To', 'Problem Type', 'Report Text', 'Created At'],
      ...savedReports.map(report => [
        report.bookingNo,
        report.name,
        report.phoneCode,
        report.phone,
        report.email,
        report.country,
        report.hotelName,
        report.agentName,
        report.stayFrom,
        report.stayTo,
        report.problemType,
        report.reportText,
        report.createdAt
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'travel-agent-reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportReportPDF = (report) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('Travel Agent Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Divider line
    pdf.setDrawColor(52, 152, 219);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;

    // Information section
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    
    // Left column
    pdf.text(`Booking No: ${report.bookingNo}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Name: ${report.name}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Phone: ${report.phone || 'N/A'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Email: ${report.email || 'N/A'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Country: ${report.country || 'N/A'}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Hotel: ${report.hotelName || 'N/A'}`, 20, yPosition);
    yPosition += 15;

    // Right column
    const rightColumnX = pageWidth / 2 + 10;
    pdf.text(`Agent: ${report.agentName || 'N/A'}`, rightColumnX, yPosition - 35);
    yPosition += 8;
    pdf.text(`Stay From: ${report.stayFrom || 'N/A'}`, rightColumnX, yPosition - 27);
    yPosition += 8;
    pdf.text(`Stay To: ${report.stayTo || 'N/A'}`, rightColumnX, yPosition - 19);
    yPosition += 8;
    pdf.text(`Problem Type: ${report.problemType || 'N/A'}`, rightColumnX, yPosition - 11);
    yPosition += 15;

    // Report section
    pdf.setFont(undefined, 'bold');
    pdf.text('Report:', 20, yPosition);
    yPosition += 8;
    pdf.setFont(undefined, 'normal');
    
    // Word wrap for report text
    const reportLines = pdf.splitTextToSize(report.reportText || 'No report provided', pageWidth - 40);
    pdf.text(reportLines, 20, yPosition);
    yPosition += reportLines.length * 6 + 15;

    // Signatures section
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFont(undefined, 'bold');
    pdf.text('Signatures:', 20, yPosition);
    yPosition += 15;

    // Add signatures
    if (report.travelerSignature) {
      pdf.addImage(report.travelerSignature, "PNG", 20, yPosition, 80, 30);
      pdf.text('Traveler Signature', 20, yPosition + 35);
    }
    
    if (report.agentSignature) {
      pdf.addImage(report.agentSignature, "PNG", pageWidth - 100, yPosition, 80, 30);
      pdf.text('Agent Signature', pageWidth - 100, yPosition + 35);
    }

    // Footer
    const footerY = pageHeight - 20;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, footerY, { align: 'center' });
    pdf.text(`Report ID: ${report.id}`, pageWidth / 2, footerY + 8, { align: 'center' });

    pdf.save(`TravelAgentReport_${report.bookingNo || 'Report'}_${report.id}.pdf`);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Travel Agent Reports</h1>
        <div className="nav-buttons">
          <button className={`nav-btn ${view === 'form' ? 'active' : ''}`} onClick={() => setView('form')}>
            <span className="btn-icon">📝</span> New Report
          </button>
          <button className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            <span className="btn-icon">📊</span> Dashboard ({savedReports.length})
          </button>
        </div>
      </div>

      {view === 'form' ? (
        <div className="form-container fade-in">
          <div className="form-section">
            <h2>Report Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bookingNo">Booking No *</label>
                <input
                  type="text"
                  id="bookingNo"
                  name="bookingNo"
                  placeholder="Enter booking number"
                  value={formData.bookingNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter traveler name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="phone-input-group">
                  <select
                    id="phoneCode"
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleChange}
                    className="phone-code-select"
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.phoneCode}>
                        {country.phoneCode}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="phone-number-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleCountryChange}
                  className="country-select"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name} (+{country.phoneCode})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="hotelName">Hotel Name</label>
                <input
                  type="text"
                  id="hotelName"
                  name="hotelName"
                  placeholder="Enter hotel name"
                  value={formData.hotelName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="agentName">Agent Name</label>
                <input
                  type="text"
                  id="agentName"
                  name="agentName"
                  placeholder="Enter agent name"
                  value={formData.agentName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="stayFrom">Stay From</label>
                <input
                  type="date"
                  id="stayFrom"
                  name="stayFrom"
                  value={formData.stayFrom}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="stayTo">Stay To</label>
                <input
                  type="date"
                  id="stayTo"
                  name="stayTo"
                  value={formData.stayTo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="problemType">Type of Problem</label>
              <select
                id="problemType"
                name="problemType"
                value={formData.problemType}
                onChange={handleChange}
              >
                <option value="">Select Problem Type</option>
                <option value="Booking Issue">Booking Issue</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Service">Service</option>
                <option value="Payment">Payment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reportText">Report</label>
              <textarea
                id="reportText"
                name="reportText"
                placeholder="Enter detailed report..."
                value={formData.reportText}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>

          <div className="signatures-section">
            <h2>Signatures</h2>
            <div className="signatures-container">
              <div className="signature-box">
                <h3>Traveler Signature</h3>
                <SignatureCanvas
                  ref={travelerSigRef}
                  backgroundColor="white"
                  penColor="black"
                  canvasProps={{ width: 300, height: 120, className: "sigCanvas" }}
                />
              </div>
              <div className="signature-box">
                <h3>Agent Signature</h3>
                <SignatureCanvas
                  ref={agentSigRef}
                  backgroundColor="white"
                  penColor="black"
                  canvasProps={{ width: 300, height: 120, className: "sigCanvas" }}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={saveReport}>
              <span className="btn-icon">💾</span> Save Report
            </button>
            <button className="btn btn-secondary" onClick={generatePDF}>
              <span className="btn-icon">📄</span> Export to PDF
            </button>
            <button className="btn btn-outline" onClick={clearSignatures}>
              <span className="btn-icon">🗑️</span> Clear Signatures
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard-container fade-in">
          <div className="dashboard-header">
            <h2>Reports Dashboard</h2>
            <button className="btn btn-export" onClick={exportAllReports}>
              <span className="btn-icon">📥</span> Export All to CSV
            </button>
          </div>
          
          {savedReports.length === 0 ? (
            <div className="empty-state">
              <p>📋 No reports saved yet. Create your first report!</p>
            </div>
          ) : (
            <div className="reports-grid">
              {savedReports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <h3>Report #{report.bookingNo}</h3>
                    <span className="report-date">📅 {report.createdAt}</span>
                  </div>
                  <div className="report-content">
                    <p><strong>👤 Name:</strong> {report.name}</p>
                    <p><strong>📱 Phone:</strong> {report.phoneCode} {report.phone}</p>
                    <p><strong>📧 Email:</strong> {report.email}</p>
                    <p><strong>🌍 Country:</strong> {report.country}</p>
                    <p><strong>🏨 Hotel:</strong> {report.hotelName}</p>
                    <p><strong>👤 Agent:</strong> {report.agentName}</p>
                    <p><strong>⚠️ Problem:</strong> {report.problemType}</p>
                    <p><strong>📝 Report:</strong> {report.reportText}</p>
                  </div>
                  <div className="report-signatures">
                    <div className="signature-preview">
                      <h4>✍️ Traveler Signature</h4>
                      <img src={report.travelerSignature} alt="Traveler signature" className="signature-img" />
                    </div>
                    <div className="signature-preview">
                      <h4>✍️ Agent Signature</h4>
                      <img src={report.agentSignature} alt="Agent signature" className="signature-img" />
                    </div>
                  </div>
                  <div className="report-actions">
                    <button 
                      className="btn btn-view" 
                      onClick={() => {
                        setView('form');
                        setFormData({
                          bookingNo: report.bookingNo,
                          name: report.name,
                          phone: report.phone,
                          email: report.email,
                          country: report.country,
                          hotelName: report.hotelName,
                          agentName: report.agentName,
                          stayFrom: report.stayFrom,
                          stayTo: report.stayTo,
                          problemType: report.problemType,
                          reportText: report.reportText,
                        });
                      }}
                    >
                      <span className="btn-icon">👁️</span> View
                    </button>
                    <button 
                      className="btn btn-export" 
                      onClick={() => exportReportPDF(report)}
                    >
                      <span className="btn-icon">📄</span> Export PDF
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => deleteReport(report.id)}
                    >
                      <span className="btn-icon">🗑️</span> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TravelAgentReports;
