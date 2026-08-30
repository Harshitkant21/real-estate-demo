import { DATA_SOURCE_REGISTRY } from '../../config/dataSources';
import { DataStatusBadge } from './DataStatusBadge';
import { ShieldCheck, Database } from 'lucide-react';

export const SourceRegister = () => {
  const sources = Object.values(DATA_SOURCE_REGISTRY);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-luxury font-bold text-xl text-stone-900">
              MITTAL & CO. Market Provenance Register
            </h3>
            <p className="text-xs text-stone-500">
              Verified source attribution and regulatory compliance register for Dubai Land Department & open market feeds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Market Telemetry Assurance</span>
        </div>
      </div>

      {/* Source Register Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-stone-200 text-[10px] uppercase font-bold text-stone-400">
              <th className="py-3 px-3">Market Telemetry Agency</th>
              <th className="py-3 px-3">Verification Frequency</th>
              <th className="py-3 px-3">Provenance Status</th>
              <th className="py-3 px-3">Advisory Policy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {sources.map((source) => (
              <tr key={source.id} className="hover:bg-stone-50 transition-colors">
                <td className="py-3.5 px-3 font-semibold text-stone-900">
                  <div className="space-y-0.5">
                    <span>{source.sourceName}</span>
                    <span className="block text-[10px] text-stone-400 font-sans font-medium">{source.providerAgency}</span>
                  </div>
                </td>

                <td className="py-3.5 px-3 text-[11px]">
                  {source.refreshFrequency}
                </td>

                <td className="py-3.5 px-3">
                  <DataStatusBadge status={source.defaultStatus} sourceName={source.providerAgency} />
                </td>

                <td className="py-3.5 px-3 text-stone-500 text-[11px]">
                  {source.licenseUsageNotes || 'Verified against official Dubai Land Department master records.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
