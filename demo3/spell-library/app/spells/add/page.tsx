// app/spells/add/page.tsx
'use client';

import { useState, useEffect } from 'react';
import SpellForm from '../../../components/SpellForm';
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import styles from './page.module.css';

export default function AddSpellPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Set sidebar to open by default on desktop, closed by default on mobile
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <SpellForm isEditMode={false} />
      </div>
      
      {isMobile && (
        <button 
          className={styles.toggleButton} 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '✕' : '?'}
        </button>
      )}
      
      {isMobile && isSidebarOpen && (
        <div 
          className={`${styles.sidebarBackdrop} ${isSidebarOpen ? styles.backdropVisible : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <CopilotKit runtimeUrl="/api/copilotkit">
        <div 
          className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
        >
          <CopilotSidebar
            instructions={"Help the user catalog Harry Potter Spells"}
            labels={{
              initial: "Hello! I can help you catalog Harry Potter spells. What would you like to do?",
            }}
            defaultOpen={true}
            clickOutsideToClose={isMobile}
          />
        </div>
      </CopilotKit>
    </div>
  );
}
