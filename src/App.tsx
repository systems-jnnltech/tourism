import React, { useState } from 'react';
import { TourismProvider, useTourism } from './context/TourismContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { AuditTrailModal } from './components/common/AuditTrailModal';
import { BackupRestoreModal } from './components/common/BackupRestoreModal';
import { NotificationModal } from './components/common/NotificationModal';
import { GISMapModal } from './components/common/GISMapModal';
import { WorkflowManualModal } from './components/common/WorkflowManualModal';

// 15 System Module Views
import { DashboardView } from './components/modules/DashboardView';
import { TouristArrivalView } from './components/modules/TouristArrivalView';
import { EstablishmentView } from './components/modules/EstablishmentView';
import { MSMEView } from './components/modules/MSMEView';
import { DestinationView } from './components/modules/DestinationView';
import { EventsView } from './components/modules/EventsView';
import { AdminFinanceView } from './components/modules/AdminFinanceView';
import { ResearchPlanningView } from './components/modules/ResearchPlanningView';
import { PolicyRegulationView } from './components/modules/PolicyRegulationView';
import { ProductDevelopmentView } from './components/modules/ProductDevelopmentView';
import { MarketingPromotionView } from './components/modules/MarketingPromotionView';
import { SocialMediaView } from './components/modules/SocialMediaView';
import { TIACView } from './components/modules/TIACView';
import { FeedbackGrievanceView } from './components/modules/FeedbackGrievanceView';
import { DocumentManagementView } from './components/modules/DocumentManagementView';
import { ReportsView } from './components/modules/ReportsView';

import { ShieldAlert, Lock, RefreshCw } from 'lucide-react';
import { ModuleKey } from './types';

const MainLayout: React.FC = () => {
  const { currentModule, setCurrentModule, currentUser, canAccess, municipalityInfo } = useTourism();

  // Global modals
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [gisModalOpen, setGisModalOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [selectedGisDestId, setSelectedGisDestId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenGIS = (destId?: string) => {
    setSelectedGisDestId(destId);
    setGisModalOpen(true);
  };

  // Check RBAC permission for current active module
  const hasAccess = canAccess(currentModule);

  const renderModule = () => {
    if (!hasAccess) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-2xl border border-rose-200 shadow-sm text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Access Restricted by Role Security</h3>
          <p className="text-xs text-slate-600 mt-2">
            Your current logged-in role (<strong className="text-slate-900">{currentUser.role}</strong>) does not have authorization to access the <strong>{currentModule}</strong> module under Municipal Tourism Office security policy.
          </p>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-200">
            Switch to <strong>Administrator</strong> or <strong>Municipal Tourism Officer</strong> via the top navigation bar to access this module.
          </div>
          <button
            onClick={() => setCurrentModule('dashboard')}
            className="mt-5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    switch (currentModule) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenGIS={handleOpenGIS}
            onOpenNotify={() => setNotificationModalOpen(true)}
          />
        );
      case 'tourists':
        return <TouristArrivalView />;
      case 'establishments':
        return <EstablishmentView />;
      case 'msmes':
        return <MSMEView />;
      case 'destinations':
        return <DestinationView />;
      case 'events':
        return <EventsView />;
      case 'admin_finance':
        return <AdminFinanceView />;
      case 'research_planning':
        return <ResearchPlanningView />;
      case 'policy_regulation':
        return <PolicyRegulationView />;
      case 'product_dev':
        return <ProductDevelopmentView />;
      case 'marketing':
        return <MarketingPromotionView />;
      case 'social_media':
        return <SocialMediaView />;
      case 'tiac':
        return <TIACView initialTab="assistance" />;
      case 'feedback':
        return <TIACView initialTab="tfrgs" />;
      case 'documents':
        return <DocumentManagementView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView onOpenGIS={() => setGisModalOpen(true)} />;
    }
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased overflow-hidden print:h-auto print:overflow-visible print:bg-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onOpenAudit={() => setAuditModalOpen(true)}
        onOpenBackup={() => setBackupModalOpen(true)}
        onOpenNotify={() => setNotificationModalOpen(true)}
        onOpenGIS={() => setGisModalOpen(true)}
        onOpenManual={() => setManualModalOpen(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />

      {/* Main Container with Sidebar and Content View */}
      <div className="flex-1 flex flex-row min-h-0 overflow-hidden relative print:overflow-visible print:h-auto print:static">
        {/* Modular Left Sidebar Navigation */}
        <Sidebar
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onOpenGIS={() => setGisModalOpen(true)}
        />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50/70 dark:bg-slate-950/90 pb-16 print:overflow-visible print:h-auto print:p-0 print:m-0 print:bg-white transition-colors duration-200">
          {renderModule()}
        </main>
      </div>

      {/* Global Modals */}
      <AuditTrailModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />
      <BackupRestoreModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
      />
      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
      <GISMapModal
        isOpen={gisModalOpen}
        onClose={() => {
          setGisModalOpen(false);
          setSelectedGisDestId(undefined);
        }}
        selectedDestinationId={selectedGisDestId}
      />
      <WorkflowManualModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TourismProvider>
      <MainLayout />
    </TourismProvider>
  );
}
