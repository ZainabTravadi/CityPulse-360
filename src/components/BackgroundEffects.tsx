import smartCityHero from "@/assets/smart-city-hero.jpg";

const BackgroundEffects = () => {
  return (
    <>
      {/* Fixed background image */}
      <div className="fixed inset-0 z-[-2]">
        <img 
          src={smartCityHero} 
          alt="Smart City Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-space-deep/80 via-space-deep/60 to-space-deep/90"></div>
      </div>
      
      {/* Animated city lights effect */}
      <div className="fixed inset-0 z-[-1] city-lights opacity-30"></div>
      
      {/* Additional space particles */}
      <div className="fixed inset-0 z-[-1] starfield">
        <div className="absolute top-10 left-10 w-1 h-1 bg-secondary-glow rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-32 w-1 h-1 bg-primary-glow rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-success-glow rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-warning rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-secondary-glow rounded-full animate-pulse delay-1500"></div>
        <div className="absolute top-3/4 left-20 w-1 h-1 bg-primary-glow rounded-full animate-pulse delay-3000"></div>
      </div>
    </>
  );
};

export default BackgroundEffects;