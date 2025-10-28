import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/diagnosis";

function DiagnosisForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: 30,
    patientGender: "Nam",
    age: 30,
    ap_hi: 120,
    ap_lo: 80,
    height_cm: 170,
    weight_kg: 70,
    smoke: 0,
    alco: 0,
    active: 1,
    gender: 1,
    cholesterol: 1,
    gluc: 1,
    notes: "",
  });

  const [bmi, setBmi] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Tính BMI
  useEffect(() => {
    if (formData.height_cm > 0 && formData.weight_kg > 0) {
      const calculatedBmi =
        formData.weight_kg / Math.pow(formData.height_cm / 100, 2);
      setBmi(calculatedBmi.toFixed(2));
    }
  }, [formData.height_cm, formData.weight_kg]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Đồng bộ age và patientAge
    if (name === "age" || name === "patientAge") {
      setFormData({
        ...formData,
        age: parseInt(value),
        patientAge: parseInt(value),
      });
    } else if (name === "patientGender") {
      setFormData({
        ...formData,
        patientGender: value,
        gender: value === "Nam" ? 2 : 1,
      });
    } else if (
      name === "smoke" ||
      name === "alco" ||
      name === "active" ||
      name === "gender" ||
      name === "cholesterol" ||
      name === "gluc"
    ) {
      setFormData({
        ...formData,
        [name]: parseInt(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? parseFloat(value) : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const dataToSend = {
        ...formData,
        bmi: parseFloat(bmi),
      };

      const response = await axios.post(API_URL, dataToSend);
      setResult(response.data);
      setMessage({
        type: "success",
        text: "Chẩn đoán thành công! Kết quả đã được lưu vào lịch sử.",
      });

      // Scroll to result
      setTimeout(() => {
        document
          .querySelector(".result")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Lỗi:", error);
      setMessage({
        type: "danger",
        text: "Có lỗi xảy ra khi chẩn đoán. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (level) => {
    if (level === "Thấp") return "low-risk";
    if (level === "Trung bình") return "medium-risk";
    return "high-risk";
  };

  return (
    <div className="card">
      <h2>🩺 Chẩn Đoán Nguy Cơ Bệnh Tim Mạch</h2>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
        Nhập các thông tin bệnh nhân để đánh giá nguy cơ mắc bệnh
      </p>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit}>
        <h3 style={{ color: "#667eea", marginBottom: "15px" }}>
          Thông tin cá nhân
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="form-group">
            <label>Tuổi *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Giới tính *</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="patientGender"
                value="Nam"
                checked={formData.patientGender === "Nam"}
                onChange={handleChange}
              />
              Nam
            </label>
            <label>
              <input
                type="radio"
                name="patientGender"
                value="Nữ"
                checked={formData.patientGender === "Nữ"}
                onChange={handleChange}
              />
              Nữ
            </label>
          </div>
        </div>

        <h3
          style={{ color: "#667eea", marginTop: "30px", marginBottom: "15px" }}
        >
          Chỉ số sinh học
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label>Huyết áp tâm thu (mmHg) *</label>
            <input
              type="number"
              name="ap_hi"
              value={formData.ap_hi}
              onChange={handleChange}
              min="50"
              max="250"
              required
            />
          </div>

          <div className="form-group">
            <label>Huyết áp tâm trương (mmHg) *</label>
            <input
              type="number"
              name="ap_lo"
              value={formData.ap_lo}
              onChange={handleChange}
              min="40"
              max="200"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Chiều cao (cm) *</label>
            <input
              type="number"
              name="height_cm"
              value={formData.height_cm}
              onChange={handleChange}
              min="100"
              max="250"
              required
            />
          </div>

          <div className="form-group">
            <label>Cân nặng (kg) *</label>
            <input
              type="number"
              name="weight_kg"
              value={formData.weight_kg}
              onChange={handleChange}
              min="30"
              max="200"
              required
            />
          </div>
        </div>

        {bmi > 0 && (
          <div className="bmi-display">
            📊 Chỉ số BMI: {bmi}{" "}
            {bmi < 18.5
              ? "(Gầy)"
              : bmi < 25
              ? "(Bình thường)"
              : bmi < 30
              ? "(Thừa cân)"
              : "(Béo phì)"}
          </div>
        )}

        <h3
          style={{ color: "#667eea", marginTop: "30px", marginBottom: "15px" }}
        >
          Xét nghiệm
        </h3>
        <div className="form-row">
          <div className="form-group">
            <label>Mức Cholesterol *</label>
            <select
              name="cholesterol"
              value={formData.cholesterol}
              onChange={handleChange}
              required
            >
              <option value="1">Bình thường</option>
              <option value="2">Trên bình thường</option>
              <option value="3">Cao</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mức Glucose *</label>
            <select
              name="gluc"
              value={formData.gluc}
              onChange={handleChange}
              required
            >
              <option value="1">Bình thường</option>
              <option value="2">Trên bình thường</option>
              <option value="3">Cao</option>
            </select>
          </div>
        </div>

        <h3
          style={{ color: "#667eea", marginTop: "30px", marginBottom: "15px" }}
        >
          Lối sống
        </h3>
        <div className="form-group">
          <label>Hút thuốc?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="smoke"
                value="0"
                checked={formData.smoke === 0}
                onChange={handleChange}
              />
              Không
            </label>
            <label>
              <input
                type="radio"
                name="smoke"
                value="1"
                checked={formData.smoke === 1}
                onChange={handleChange}
              />
              Có
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Uống rượu?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="alco"
                value="0"
                checked={formData.alco === 0}
                onChange={handleChange}
              />
              Không
            </label>
            <label>
              <input
                type="radio"
                name="alco"
                value="1"
                checked={formData.alco === 1}
                onChange={handleChange}
              />
              Có
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Vận động thể chất?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="active"
                value="1"
                checked={formData.active === 1}
                onChange={handleChange}
              />
              Có
            </label>
            <label>
              <input
                type="radio"
                name="active"
                value="0"
                checked={formData.active === 0}
                onChange={handleChange}
              />
              Không
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Ghi chú (tùy chọn)</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Thêm ghi chú nếu cần..."
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "⏳ Đang xử lý..." : "🔍 Chẩn Đoán Ngay"}
        </button>
      </form>

      {result && (
        <div className={`result ${getRiskClass(result.riskLevel)}`}>
          <h3>📊 Kết Quả Chẩn Đoán</h3>
          <div className="percentage">{result.riskPercentage}%</div>
          <p style={{ fontSize: "20px", marginBottom: "20px" }}>
            Mức độ nguy cơ: <strong>{result.riskLevel}</strong>
          </p>

          <div className="diseases-list">
            <h4>⚠️ Có thể bị các bệnh sau:</h4>
            {result.possibleDiseases.map((disease, index) => (
              <div key={index} className="disease-item">
                <span>{disease.name}</span>
                <span style={{ fontWeight: "bold" }}>
                  Khả năng: {disease.probability}
                </span>
              </div>
            ))}
          </div>

          <p
            style={{ marginTop: "20px", fontSize: "14px", fontStyle: "italic" }}
          >
            ⚠️ Lưu ý: Đây chỉ là kết quả sơ bộ dựa trên các chỉ số đầu vào. Vui
            lòng đến gặp bác sĩ để được chẩn đoán chính xác.
          </p>
        </div>
      )}
    </div>
  );
}

export default DiagnosisForm;
