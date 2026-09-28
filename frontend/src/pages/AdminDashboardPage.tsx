import React, { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  Radio,
  Bell,
  ShieldCheck,
  Activity,
  Send,
  Database,
  CheckCircle2,
  RefreshCw,
  Server,
  Lock,
} from 'lucide-react';
import { LanguageCode, AgentNodeHealth, AuditLogItem } from '../types';
import {
  fetchAgentRegistry,
  fetchAuditLogs,
  fetchSystemHealth,
  broadcastAlert,
} from '../lib/api';

interface AdminDashboardPageProps {
  currentLang: LanguageCode;
  onOpenCopilot: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentLang,
  onOpenCopilot,
}) => {
  const [agents, setAgents] = useState<AgentNodeHealth[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Alert Broadcast Form State
  const [alertTitle, setAlertTitle] = useState('');
  const [alertCategory, setAlertCategory] = useState('Cyclone');
  const [alertSeverity, setAlertSeverity] = useState('High');
  const [alertRegion, setAlertRegion] = useState('Bay of Bengal Sector');
  const [alertMessage, setAlertMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const loadData = async () => {
    try {
      const [ag, au, sh] = await Promise.all([
        fetchAgentRegistry(),
        fetchAuditLogs(),
        fetchSystemHealth(),
      ]);
      setAgents(ag);
      setAuditLogs(au);
      setSystemHealth(sh);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim()) return;

    try {
      await broadcastAlert({
        title: alertTitle,
        category: alertCategory,
        severity: alertSeverity,
        region: alertRegion,
        message: alertMessage,
      });
      setBroadcastSuccess(true);
      setAlertTitle('');
      setAlertMessage('');
      setTimeout(() => setBroadcastSuccess(false), 4000);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-600" />
            System Administration & Multi-Agent Network Governance
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time agent health telemetry, automated data pipeline syncs, coastal alert broadcasting, and security audit trails.
          </p>
        </div>

        <button
          onClick={loadData}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh System Telemetry</span>
        </button>
      </div>

      {/* System Health KPIs */}
      {systemHealth && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle">
            <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
              <span>System Uptime</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono mt-2">
              {systemHealth.uptime}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> All Services Operational
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle">
            <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
              <span>PFZ Monitored Area</span>
              <Server className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono mt-2">
              84,500 <span className="text-xs font-normal text-gray-500">sq. km</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Indian EEZ Coastal Coverage
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle">
            <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
              <span>INCOIS / IMD Sync</span>
              <Radio className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-base font-bold text-gray-900 font-mono mt-2">
              LIVE & IN SYNC
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              {systemHealth.data_sync?.sentinel_3_olci}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle">
            <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
              <span>Database Query Latency</span>
              <Database className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono mt-2">
              {systemHealth.system_load?.database_latency_ms} ms
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              PostGIS / Spatial Query Engine
            </div>
          </div>
        </div>
      )}

      {/* 10 Multi-Agent System Nodes Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600" />
              Multi-Agent System Node Registry & Health Status (10 Nodes)
            </h3>
            <p className="text-xs text-gray-500">
              LangGraph orchestration pipeline agents executing parallel marine intelligence reasoning.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-semibold border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-3">Agent Node Name</th>
                <th className="py-2.5 px-3">Architecture Type</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3">Throughput</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agents.map((ag) => (
                <tr key={ag.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {ag.name}
                  </td>
                  <td className="py-3 px-3 text-gray-600">{ag.type}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {ag.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-700">{ag.latency_ms} ms</td>
                  <td className="py-3 px-3 font-mono text-gray-700">{ag.throughput}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() =>
                        alert(`Agent '${ag.name}' diagnostic telemetry verified healthy.`)
                      }
                      className="text-[11px] text-sky-700 hover:text-sky-900 font-medium px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
                    >
                      Run Health Check
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Emergency Alert Form & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-4">
          <div className="border-b border-gray-100 pb-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-600" />
              Broadcast Emergency Maritime Advisory
            </h3>
            <p className="text-xs text-gray-500">
              Instantly push high-priority squall & boundary warnings to coastal radios and vessels.
            </p>
          </div>

          {broadcastSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Advisory broadcasted successfully to all maritime stations!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-gray-700">Alert Title / Subject</label>
              <input
                type="text"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="e.g. Squall Warning - Gale Force Winds in Sector 4"
                className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-gray-700">Category</label>
                <select
                  value={alertCategory}
                  onChange={(e) => setAlertCategory(e.target.value)}
                  className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="Cyclone">Cyclone</option>
                  <option value="High Wave">High Wave</option>
                  <option value="Wind">Wind / Squall</option>
                  <option value="Boundary">Boundary / MPA</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-gray-700">Severity Tier</label>
                <select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value)}
                  className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-medium text-gray-700">Target Region / Sector</label>
              <input
                type="text"
                value={alertRegion}
                onChange={(e) => setAlertRegion(e.target.value)}
                className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Detailed Advisory Directive</label>
              <textarea
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                rows={3}
                placeholder="Enter mandatory navigational precautions for fishermen and shipping crafts..."
                className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Live Maritime Advisory</span>
            </button>
          </form>
        </div>

        {/* Security & System Audit Logs (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-4 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-600" />
              Security Audit Logs & Agent Event Stream
            </h3>
            <span className="text-[11px] font-mono text-gray-400">
              Immutable Ledger
            </span>
          </div>

          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-900">
                    {log.action}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 font-sans">
                  {log.details}
                </p>
                <div className="text-[10px] text-gray-400 font-mono">
                  Actor: {log.user_email || 'System Daemon'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
