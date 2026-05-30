export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function partyColor(party = "") {
  let hash = 0;
  for (let i = 0; i < party.length; i += 1) {
    hash = party.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hues = [220, 260, 300, 340, 180, 200, 240];
  const hue = hues[Math.abs(hash) % hues.length];
  return {
    bg: `hsl(${hue} 70% 95%)`,
    text: `hsl(${hue} 60% 35%)`,
    border: `hsl(${hue} 50% 85%)`
  };
}

export function getErrorMessage(err, fallback = "Something went wrong") {
  return err?.response?.data?.error || err?.response?.data?.message || fallback;
}
