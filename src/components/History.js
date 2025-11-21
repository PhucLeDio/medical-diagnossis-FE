import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://medical-diagnossis-be.vercel.app/api/diagnosis";
// const API_URL = "http://localhost:5000/api/diagnosis";

function History() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  const fetchDiagnoses = async () => {
    try {
      const response = await axios.get(API_URL);
      setDiagnoses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử:", error);
      setMessage({ type: "danger", text: "Không thể tải lịch sử chẩn đoán" });
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage({ type: "success", text: "Đã xóa bản ghi thành công" });
        fetchDiagnoses();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        setMessage({ type: "danger", text: "Không thể xóa bản ghi" });
      }
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchDiagnoses();
    } else {
      try {
        const response = await axios.get(`${API_URL}/search/${value}`);
        setDiagnoses(response.data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRiskColor = (level) => {
    if (level === "Thấp") return "#28a745";
    if (level === "Trung bình") return "#ffc107";
    return "#dc3545";
  };

  if (loading) {
    return <div className="loading">⏳ Đang tải dữ liệu...</div>;
  }

  return (
    <div className="card">
      <h2>📋 Lịch Sử Chẩn Đoán</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên bệnh nhân..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {diagnoses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
          <h3>📭 Chưa có lịch sử chẩn đoán</h3>
          <p>Hãy thực hiện chẩn đoán đầu tiên!</p>
        </div>
      ) : (
        <div className="history-list">
          {diagnoses.map((diagnosis) => (
            <div
              key={diagnosis._id}
              className="history-item"
              style={{ borderLeftColor: getRiskColor(diagnosis.riskLevel) }}
            >
              <div className="history-header">
                <div>
                  <h3 style={{ color: "#333", marginBottom: "5px" }}>
                    {diagnosis.patientName}
                  </h3>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    📅 {formatDate(diagnosis.createdAt)}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: getRiskColor(diagnosis.riskLevel),
                  }}
                >
                  {diagnosis.riskPercentage}%
                </div>
              </div>

              <div className="history-info">
                <div className="info-item">
                  <span className="info-label">Giới tính</span>
                  <span className="info-value">{diagnosis.patientGender}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tuổi</span>
                  <span className="info-value">
                    {diagnosis.patientAge} tuổi
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Mức độ nguy cơ</span>
                  <span
                    className="info-value"
                    style={{ color: getRiskColor(diagnosis.riskLevel) }}
                  >
                    {diagnosis.riskLevel}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Huyết áp</span>
                  <span className="info-value">
                    {diagnosis.ap_hi}/{diagnosis.ap_lo}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">BMI</span>
                  <span className="info-value">{diagnosis.bmi.toFixed(1)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Cholesterol</span>
                  <span className="info-value">
                    {diagnosis.cholesterol === 1
                      ? "Bình thường"
                      : diagnosis.cholesterol === 2
                      ? "Trên BT"
                      : "Cao"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  padding: "15px",
                  borderRadius: "8px",
                  marginTop: "15px",
                }}
              >
                <strong style={{ color: "#667eea" }}>Có thể mắc:</strong>
                <div style={{ marginTop: "10px" }}>
                  {diagnosis.possibleDiseases.map((disease, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "8px",
                        marginBottom: "5px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{disease.name}</span>
                      <span style={{ fontWeight: "bold", color: "#667eea" }}>
                        {disease.probability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {diagnosis.notes && (
                <div
                  style={{
                    marginTop: "15px",
                    fontStyle: "italic",
                    color: "#666",
                  }}
                >
                  📝 Ghi chú: {diagnosis.notes}
                </div>
              )}

              <div className="history-actions" style={{ marginTop: "15px" }}>
                <button
                  onClick={() => handleDelete(diagnosis._id)}
                  className="btn btn-danger"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "20px", textAlign: "center", color: "#666" }}>
        <p>
          Tổng số bản ghi: <strong>{diagnoses.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default History;
