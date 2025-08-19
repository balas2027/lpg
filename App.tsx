import React, { useState, useCallback } from 'react';
import { INITIAL_REPORTS } from './constants/locations';
import type { Report } from './types';
import { ReportStatus } from './types';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { UserPage } from './components/UserPage';
import { Header } from './components/Header';

export type Role = 'USER' | 'ADMIN';
export type User = { email: string; role: Role };

const App: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addReport = useCallback((newReportData: Omit<Report, 'id' | 'timestamp' | 'userEmail' | 'status'>, user: User) => {
    const report: Report = {
      ...newReportData,
      id: new Date().toISOString(),
      timestamp: new Date(),
      userEmail: user.email,
      status: ReportStatus.OPEN,
    };
    setReports(prevReports => [...prevReports, report]);
  }, []);
  
  const resolveReport = useCallback((reportId: string) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId ? { ...report, status: ReportStatus.RESOLVED } : report
      )
    );
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="flex-grow relative">
        {currentUser.role === 'ADMIN' ? (
          <AdminPage reports={reports} onResolveReport={resolveReport} />
        ) : (
          <UserPage reports={reports} addReport={(data) => addReport(data, currentUser)} />
        )}
      </main>
    </div>
  );
};

export default App;
