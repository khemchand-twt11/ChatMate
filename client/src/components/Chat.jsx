export default function Chat() {
  return (
    <div className="flex h-screen">
      <div className="bg-blue-100 w-1/4">contacts</div>
      <div className="bg-blue-300 w-3/4">
        <div>messages with selected person</div>
        <div>
          <input
            type="text"
            placeholder="type your message..."
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );
}
