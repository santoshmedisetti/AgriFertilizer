import { useState } from 'react';
import { useGetReportsQuery } from '../../../redux/slices/adminApiSlice';
import Button from '../../../components/ui/Button';
import { FaDownload, FaPrint, FaTable } from 'react-icons/fa';

const ReportsTab = () => {
  const [reportType, setReportType] = useState('sales');
  
  // Skip query if no type is selected (though we have a default)
  const { data, isLoading, isFetching } = useGetReportsQuery(reportType);

  const reportData = data?.data || [];
  const columns = reportData.length > 0 ? Object.keys(reportData[0]) : [];

  const handleExportCSV = () => {
    if (reportData.length === 0) return;
    const csvRows = [];
    
    // Header
    csvRows.push(columns.join(','));
    
    // Data
    reportData.forEach(row => {
      const values = columns.map(col => {
        let val = row[col] === null || row[col] === undefined ? '' : row[col].toString();
        // Escape quotes and commas
        val = val.replace(/"/g, '""');
        return `"${val}"`;
      });
      csvRows.push(values.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportType}_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Generate Reports</h2>
            <div className="flex gap-2">
              {['sales', 'inventory', 'customers'].map(type => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${
                    reportType === type ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {type} Report
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={handlePrint} disabled={reportData.length === 0} className="gap-2 flex-1 md:flex-none">
              <FaPrint /> Print
            </Button>
            <Button onClick={handleExportCSV} disabled={reportData.length === 0} className="gap-2 flex-1 md:flex-none">
              <FaDownload /> Export CSV
            </Button>
          </div>
        </div>

        {/* Data Grid Preview */}
        <div className="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
            <FaTable className="text-gray-400" />
            <h3 className="font-bold text-gray-700 dark:text-gray-300 capitalize text-sm">{reportType} Data Preview</h3>
          </div>
          
          <div className="overflow-x-auto max-h-[500px]">
            {isLoading || isFetching ? (
              <div className="p-12 text-center text-gray-500">Generating report...</div>
            ) : reportData.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No data available for this report.</div>
            ) : (
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-800/80 sticky top-0">
                  <tr>
                    {columns.map(col => (
                      <th key={col} className="p-4 font-bold uppercase tracking-wider text-xs whitespace-nowrap">
                        {col.replace(/([A-Z])/g, ' $1').trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {reportData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20">
                      {columns.map(col => (
                        <td key={col} className="p-4 whitespace-nowrap">{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsTab;
