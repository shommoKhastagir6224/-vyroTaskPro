import React from "react";

const Pages = () => {
  return (
    <div>
      {/* // AI Studio Agent ke ai dhoroner UI banate bolun: */}
      <div className="grid grid-cols-12 gap-4 p-6 bg-[#020617] text-white">
        {/* Feature 1: The Routine Grid (Large Box) */}
        <div className="col-span-8 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <h3 className="text-2xl font-bold text-cyan-400">
            Dynamic Routine Planner
          </h3>
          <p className="text-gray-400">
            Manage your day with a grid that locks focus.
          </p>
          <div className="mt-4 opacity-50">
            {" "}
            {/* Routine Preview Image or Mini Grid Here */}{" "}
          </div>
        </div>

        {/* Feature 2: Stopwatch/Focus (Tall Box) */}
        <div className="col-span-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 flex flex-col justify-between">
          <h3 className="text-xl font-bold">Auto-Focus Stopwatch</h3>
          <div className="text-4xl font-mono self-center my-10">25:00</div>
          <p className="text-sm">
            Auto-blurs your screen to keep you in the zone.
          </p>
        </div>

        {/* Feature 3: Progress Analytics (Small Box) */}
        <div className="col-span-4 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-lg font-semibold">Weekly Analytics</h3>
          <div className="h-20 w-20 mx-auto mt-4">
            {" "}
            {/* Mini Pie Chart Here */}{" "}
          </div>
        </div>

        {/* Feature 4: Habit Tracker (Small Box) */}
        <div className="col-span-8 bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Habit Streaks</h3>
            <p className="text-gray-400 text-sm">
              Track your daily 1% improvements.
            </p>
          </div>
          <div className="flex gap-2"> {/* Green Check Circles Here */} </div>
        </div>
      </div>
    </div>
  );
};

export default Pages;
