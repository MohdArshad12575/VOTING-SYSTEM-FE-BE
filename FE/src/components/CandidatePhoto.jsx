import { useState } from "react";
import { getInitials } from "../utils/helpers";

export default function CandidatePhoto({ name, imageUrl, size = "md" }) {
  const [failed, setFailed] = useState(false);

  const sizeClass =
    size === "lg" ? "candidate-photo-lg" : size === "sm" ? "candidate-photo-sm" : "candidate-photo";

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={sizeClass}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={`${sizeClass} candidate-photo-fallback`} aria-hidden="true">
      {getInitials(name)}
    </div>
  );
}
