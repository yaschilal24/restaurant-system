export default function SearchBar({ value, onChange, placeholder = '🔍  Search menu...' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-base max-w-md"
    />
  );
}