import { useState } from "react";

export default function PasswordField({ name, value, onChange, placeholder = "Enter password", required = true }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field-wrap">
      <input
        className="field"
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className="field-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
