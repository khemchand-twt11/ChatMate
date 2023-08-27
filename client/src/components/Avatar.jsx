export default function Avatar({ userId, username }) {
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-200",
    "bg-gray-200",
  ];

  const userIdBase10 = parseInt(userId, 16);
  // console.log(userIdBase10);
  const colorIndex = userIdBase10 % colors.length;

  const bgColorClass = colors[colorIndex];
  // console.log(bgColorClass);
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColorClass}`}
    >
      <div>{username[0]}</div>
    </div>
  );
}
