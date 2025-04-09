// Renders editing form forr schedules: inputs and buttons
interface EditFormProps {
  mode: string;
  setMode: (s: string) => void;
  waterFrequency: string;
  setWaterFrequency: (s: string) => void;
  waterAmount: string;
  setWaterAmount: (s: string) => void;
  waterSettingsChange: () => void;
  showSaved: boolean;
}
export function EditForm({
  mode,
  setMode,
  waterFrequency,
  setWaterFrequency,
  waterAmount,
  setWaterAmount,
  waterSettingsChange,
  showSaved,
}: EditFormProps) {
  return ( //formatting and defining input options and updating the schedule
    <>
      <div className="flex flex-col">
        <label>Schedule type:</label>
        <select
          className="w-75 bg-white text-[#3b522f] border border-[#3b522f] px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b522f]"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="preset">preset</option>
          <option value="manual">manual</option>
        </select>
      </div>

      {mode === "manual" && (
        <>
          <div className="flex flex-col">
            <label>Water Frequency:</label>
            <select
              className="w-75 bg-white text-[#3b522f] border border-[#3b522f] px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b522f]"
              value={waterFrequency}
              onChange={(e) => setWaterFrequency(e.target.value)}
            >
              <option value="0">Daily</option>
              <option value="1">Weekly</option>
              <option value="2">Bi-Weekly</option>
              <option value="3">Monthly</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Water Amount (ml):</label>
            <input
              className="w-full bg-white text-[#3b522f] border border-[#3b522f] px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b522f]"
              type="text"
              value={waterAmount}
              onChange={(e) => setWaterAmount(e.target.value)}
            />
          </div>
        </>
      )}
      {mode === "preset" && <p style={{ fontStyle: "italic", margin: 0 }}></p>}

      <div>
        <button
          className="bg-[#3b522f] text-white px-4 py-2 rounded-md hover:bg-[#2e4024] transition"
          onClick={waterSettingsChange}
        >
          Save Schedule
        </button>
        {showSaved && (
          <small style={{ color: "green", marginLeft: "0.5rem" }}>
            ✓ Saved
          </small>
        )}
      </div>
    </>
  );
}
