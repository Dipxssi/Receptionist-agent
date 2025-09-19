import Link from 'next/link';
import BotIcon from '../components/BotIcon';
import { getBots, getCallLogs, getEmployees } from '@/lib/data-utils';
import CallIcon from '../components/CallIcon';
import EmployeesIcon from '../components/EmployeesIcon';
import StatusIcon from '../components/StatusIcon';

const fallbackData = {
  bots: [
    { id: 'bot_1', name: 'Main Reception Agent', status: 'active' }
  ],
  callLogs: [
    {
      id: 'call_1',
      visitor: 'John Smith',
      employee: 'Sarah Johnson',
      department: 'Engineering',
      duration: 45,
      status: 'completed',
      arrivalTime: new Date()
    },
    {
      id: 'call_2',
      visitor: 'Mike Chen',
      employee: 'Lisa Rodriguez',
      department: 'HR',
      duration: 62,
      status: 'completed',
      arrivalTime: new Date()
    }
  ],
  employees: [
    { id: 'emp_1', name: 'Sarah Johnson', department: 'Engineering', floor: '3rd', room: '305' },
    { id: 'emp_2', name: 'Lisa Rodriguez', department: 'HR', floor: '2nd', room: '201' }
  ]
};

export default async function Dashboard() {
  let bots, callLogs, employees;
  let usingFallback = false;
  try {
    [bots, callLogs, employees] = await Promise.all([
      getBots(),
      getCallLogs(),
      getEmployees()
    ]);
  } catch (error) {
    console.error('Database connection failed, using fallback data:', error);
    bots = fallbackData.bots;
    callLogs = fallbackData.callLogs;
    employees = fallbackData.employees;
    usingFallback = true;
  }
  return (
    <div className="space-y-6">
      {usingFallback && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Demo Mode:</strong> Using sample data. Database connection will be restored shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    <BotIcon className="w-5 h-5 text-white" />
                  </span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Bots
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {bots.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    <CallIcon className="w-5 h-5 text-white" />
                  </span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Calls
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {callLogs.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    <EmployeesIcon className="w-5 h-5 text-white" />
                  </span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Employees
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {employees.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    <StatusIcon className="w-5 h-5 text-white" />
                  </span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Status
                  </dt>
                  <dd className="text-lg font-medium text-green-600">
                    Active
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/bots"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
            >
              Manage Bots
            </Link>
            <Link
              href="/dashboard/calls"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
            >
              View Call Logs
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Call Logs */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Calls
          </h3>
          {callLogs.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {callLogs.slice(0, 5).map((call) => (
                    <tr key={call.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {call.visitor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.employee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.duration}s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {call.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No calls yet. Test your webhooks to see data here!</p>
          )}
        </div>
      </div>
    </div>
  );
}
