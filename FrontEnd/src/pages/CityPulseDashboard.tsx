import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import Analytics from "@/components/Analytics";
import ZonesClustering from "@/components/ZonesClustering";
import SentimentAnalysis from "@/components/SentimentAnalysis";
import AlertsNotifications from "@/components/AlertsNotifications";
import BackgroundEffects from "@/components/BackgroundEffects";

const CityPulseDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleRefresh = () => window.location.reload();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['dashboard', 'analytics', 'zones', 'sentiment', 'alerts'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-space text-foreground">
      <BackgroundEffects />
      <Navigation 
      activeSection={activeSection} onNavigate={handleNavigate} onRefresh={handleRefresh} />
      
      <main>
        <Dashboard />
        <Analytics />
        <ZonesClustering />
        <SentimentAnalysis />
        <AlertsNotifications />
      </main>
    </div>
  );
};

export default CityPulseDashboard;