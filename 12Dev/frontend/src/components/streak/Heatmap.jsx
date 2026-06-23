import React, { useMemo } from 'react';

const Heatmap = ({ activities = [] }) => {
  // Map activities to a lookup table: { "YYYY-MM-DD": count }
  const activityMap = useMemo(() => {
    const map = {};
    activities.forEach(act => {
      map[act.date] = act.count;
    });
    return map;
  }, [activities]);

  // Generate date cells for the last 365 days aligned to weeks
  const gridData = useMemo(() => {
    const cells = [];
    const today = new Date();
    
    // We want to show exactly 53 weeks of data (53 * 7 = 371 days)
    // Find the starting date: today - 370 days
    const startDate = new Date();
    startDate.setDate(today.getDate() - 370);
    
    // Align starting date to the beginning of the week (Sunday, day 0)
    const startDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDayOfWeek);
    
    const currDate = new Date(startDate);
    
    while (currDate <= today || cells.length < 371) {
      const dateStr = currDate.toISOString().split('T')[0];
      const count = activityMap[dateStr] || 0;
      
      cells.push({
        date: dateStr,
        count,
        dayOfWeek: currDate.getDay(),
        month: currDate.toLocaleString('default', { month: 'short' }),
        dayOfMonth: currDate.getDate()
      });
      
      currDate.setDate(currDate.getDate() + 1);
    }
    return cells;
  }, [activityMap]);

  // Group cells into weeks (arrays of 7 days)
  const weeks = useMemo(() => {
    const tempWeeks = [];
    for (let i = 0; i < gridData.length; i += 7) {
      tempWeeks.push(gridData.slice(i, i + 7));
    }
    return tempWeeks;
  }, [gridData]);

  // Determine color class based on submission count
  const getColorClass = (count) => {
    if (count === 0) return 'bg-slate-900 border-slate-950/20 hover:border-slate-700';
    if (count === 1) return 'bg-emerald-950 text-emerald-400 border-emerald-900 hover:border-emerald-700';
    if (count === 2) return 'bg-emerald-800 text-emerald-300 border-emerald-700 hover:border-emerald-500';
    if (count === 3) return 'bg-emerald-600 text-emerald-200 border-emerald-500 hover:border-emerald-300';
    return 'bg-emerald-400 text-emerald-950 border-emerald-300 hover:bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.4)]';
  };

  // Month labels positioning logic
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = '';
    
    weeks.forEach((week, index) => {
      // Find first day of the week with a valid label
      const firstDay = week[0];
      if (firstDay && firstDay.month !== lastMonth) {
        labels.push({ month: firstDay.month, index });
        lastMonth = firstDay.month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="card bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-200">Activity Heatmap</h3>
          <p className="text-xs text-slate-500 mt-0.5">Your coding submissions over the past year</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
          <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-900" />
          <div className="w-3 h-3 rounded bg-emerald-800 border border-emerald-700" />
          <div className="w-3 h-3 rounded bg-emerald-600 border border-emerald-500" />
          <div className="w-3 h-3 rounded bg-emerald-400 border border-emerald-300" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="flex flex-col min-w-[760px] select-none">
          
          {/* Month Header */}
          <div className="relative h-6 text-xs text-slate-500">
            {monthLabels.map((label, i) => (
              <span 
                key={i} 
                className="absolute"
                style={{ left: `${label.index * 13 + 32}px` }}
              >
                {label.month}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Day labels (Sun, Tue, Thu, Sat) */}
            <div className="flex flex-col justify-between text-[10px] text-slate-500 w-6 h-[91px] pr-1 py-0.5">
              <span>Sun</span>
              <span className="opacity-0">Mon</span>
              <span>Tue</span>
              <span className="opacity-0">Wed</span>
              <span>Thu</span>
              <span className="opacity-0">Fri</span>
              <span>Sat</span>
            </div>

            {/* Grid Columns */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`w-[10px] h-[10px] rounded-[2px] border transition-all duration-150 tooltip cursor-pointer ${getColorClass(day.count)}`}
                      data-tip={`${day.count} solved on ${day.month} ${day.dayOfMonth}, ${day.date.split('-')[0]}`}
                    >
                      <span className="sr-only">
                        {day.count} solved on {day.date}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
