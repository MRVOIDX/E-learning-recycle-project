import { Card, CardContent } from "@/components/ui/card";
import { WASTE_CATEGORIES } from "@/lib/types";
import { Sparkles, Zap, Leaf, Recycle } from "lucide-react";

interface WasteCardProps {
  category: string;
  onClick: () => void;
  className?: string;
}

export function WasteCard({ category, onClick, className = "" }: WasteCardProps) {
  const wasteInfo = WASTE_CATEGORIES.find(c => c.id === category);
  
  if (!wasteInfo) return null;

  const getTipText = (category: string) => {
    switch (category) {
      case 'plastic':
        return 'Recyclable • Clean First';
      case 'glass':
        return 'Infinitely Recyclable';
      case 'organic':
        return 'Compostable • Nature-Friendly';
      case 'ewaste':
        return 'Specialized Collection Required';
      default:
        return 'Follow Guidelines';
    }
  };

  const getDecorationIcon = (category: string) => {
    switch (category) {
      case 'plastic':
        return <Recycle className="w-4 h-4" />;
      case 'glass':
        return <Sparkles className="w-4 h-4" />;
      case 'organic':
        return <Leaf className="w-4 h-4" />;
      case 'ewaste':
        return <Zap className="w-4 h-4" />;
      default:
        return <Recycle className="w-4 h-4" />;
    }
  };

  return (
    <Card 
      className={`group relative overflow-hidden cursor-pointer transition-all duration-500 hover-lift border-2 ${wasteInfo.borderColor} bg-gradient-to-br ${wasteInfo.gradient} backdrop-blur-sm ${wasteInfo.effects} ${className}`}
      onClick={onClick}
      data-testid={`card-waste-${category}`}
    >
      {/* Animated background pattern */}
      <div className={`absolute inset-0 opacity-20 ${wasteInfo.pattern}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
        {getDecorationIcon(category)}
      </div>
      
      {/* Animated sparkles */}
      <div className="absolute top-6 left-6">
        <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      <div className="absolute bottom-8 right-8">
        <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
      </div>
      
      <CardContent className="relative p-8">
        {/* Enhanced Icon Container */}
        <div className="relative mx-auto mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
          {/* Glow effect */}
          <div className={`absolute inset-0 ${wasteInfo.iconBg} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
          
          {/* Main icon container */}
          <div className={`relative w-20 h-20 ${wasteInfo.iconBg} rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
            <span className="text-3xl filter drop-shadow-sm">{wasteInfo.icon}</span>
            
            {/* Orbiting elements */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
          </div>
        </div>
        
        {/* Enhanced Title */}
        <h3 className={`font-heading font-bold text-xl text-center mb-3 ${wasteInfo.accent} group-hover:scale-105 transition-transform duration-300`} data-testid={`text-waste-name-${category}`}>
          {wasteInfo.name}
        </h3>
        
        {/* Enhanced Description */}
        <p className="text-muted-foreground text-center mb-6 leading-relaxed" data-testid={`text-waste-description-${category}`}>
          {wasteInfo.description}
        </p>
        
        {/* Creative Status Badge */}
        <div className="relative">
          <div className={`glass-effect rounded-full px-4 py-2 border ${wasteInfo.borderColor} group-hover:shadow-md transition-all duration-300`}>
            <p className={`text-sm font-semibold text-center ${wasteInfo.accent} flex items-center justify-center gap-2`} data-testid={`text-waste-tip-${category}`}>
              {getDecorationIcon(category)}
              {getTipText(category)}
            </p>
          </div>
          
          {/* Animated border effect */}
          <div className={`absolute inset-0 rounded-full border-2 ${wasteInfo.borderColor} opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse`}></div>
        </div>
        
        {/* Hidden hover indicator */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-center">
            <div className={`inline-flex items-center text-sm ${wasteInfo.accent} font-medium`}>
              <span>Click to learn more</span>
              <div className="ml-2 w-1 h-1 bg-current rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
