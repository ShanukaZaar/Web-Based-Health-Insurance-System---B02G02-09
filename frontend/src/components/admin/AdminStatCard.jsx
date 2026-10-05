import React from 'react';

const AdminStatCard = ({ title, value, subtext, icon: Icon, color = 'emerald', trend }) => {
  const colorMap = {
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      val: 'text-slate-900',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-200',
      val: 'text-slate-900',
    },
    cyan: {
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-200',
      val: 'text-slate-900',
    },
    indigo: {
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-200',
      val: 'text-slate-900',
    },
    purple: {
      iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      val: 'text-slate-900',
    },
    rose: {
      iconBg: 'bg-red-50 text-red-700 border border-red-200',
      val: 'text-slate-900',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-800 border border-amber-200',
      val: 'text-slate-900',
    },
    sky: {
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-200',
      val: 'text-slate-900',
    },
  };

  const activeTheme = colorMap[color] || colorMap.emerald;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${activeTheme.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className={`text-2xl font-bold tracking-tight ${activeTheme.val}`}>{value}</span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {trend}
          </span>
        )}
      </div>

      {subtext && <p className="text-xs text-slate-500 mt-1.5">{subtext}</p>}
    </div>
  );
};

export default AdminStatCard;
