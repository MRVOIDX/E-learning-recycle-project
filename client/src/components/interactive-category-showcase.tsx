import { Card, CardContent } from "@/components/ui/card";
import { WASTE_CATEGORIES, WasteCategory } from "@/lib/types";
import { useMouseTilt, useMouseParallax } from "@/lib/mouse-interactions";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Zap, Leaf, Recycle, ArrowRight, Star, Trash2, RotateCcw, TreePine, Battery } from "lucide-react";

interface InteractiveCategoryShowcaseProps {
  onCategorySelect: (categoryId: string) => void;
}

function TransformationPortalCard({ 
  category, 
  onSelect, 
  delay = 0 
}: { 
  category: WasteCategory; 
  onSelect: (id: string) => void;
  delay?: number;
}) {
  const { elementRef: tiltRef, tilt } = useMouseTilt(25);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; rotation: number; scale: number }>>([]);
  const [energyLevel, setEnergyLevel] = useState(0);

  useEffect(() => {
    if (isHovered) {
      setIsTransforming(true);
      // Create energy particles
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 300,
        y: Math.random() * 400,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5
      }));
      setParticles(newParticles);
      
      // Animate energy level
      const interval = setInterval(() => {
        setEnergyLevel(prev => (prev >= 100 ? 0 : prev + 8));
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setIsTransforming(false);
      setParticles([]);
      setEnergyLevel(0);
    }
  }, [isHovered]);

  const getPortalColors = (categoryId: string) => {
    const colors = {
      plastic: {
        primary: 'from-cyan-400 via-blue-500 to-indigo-600',
        secondary: 'from-cyan-300 to-blue-400',
        accent: 'text-cyan-400',
        glow: 'shadow-cyan-500/50'
      },
      glass: {
        primary: 'from-emerald-400 via-green-500 to-teal-600',
        secondary: 'from-emerald-300 to-green-400',
        accent: 'text-emerald-400',
        glow: 'shadow-emerald-500/50'
      },
      organic: {
        primary: 'from-yellow-400 via-amber-500 to-orange-600',
        secondary: 'from-yellow-300 to-amber-400',
        accent: 'text-yellow-400',
        glow: 'shadow-amber-500/50'
      },
      ewaste: {
        primary: 'from-purple-400 via-pink-500 to-rose-600',
        secondary: 'from-purple-300 to-pink-400',
        accent: 'text-purple-400',
        glow: 'shadow-purple-500/50'
      }
    };
    return colors[categoryId as keyof typeof colors] || colors.plastic;
  };

  const getWasteInputs = (categoryId: string) => {
    const inputs = {
      plastic: ['🍼', '🥤', '🧴', '🛍️'],
      glass: ['🍾', '🫙', '🥛', '🍺'],
      organic: ['🍌', '🍎', '🥕', '🥬'],
      ewaste: ['📱', '💻', '🔋', '⌚']
    };
    return inputs[categoryId as keyof typeof inputs] || ['♻️'];
  };

  const getTransformedOutputs = (categoryId: string) => {
    const outputs = {
      plastic: ['👕', '🧱', '⛽', '🛴'],
      glass: ['🏺', '💡', '🪟', '🍾'],
      organic: ['🌱', '🌾', '💊', '🔋'],
      ewaste: ['🔧', '🥇', '🧲', '⚡']
    };
    return outputs[categoryId as keyof typeof outputs] || ['✨'];
  };

  const getStatusLightColor = (categoryId: string) => {
    const lightColors = {
      plastic: 'bg-cyan-400',
      glass: 'bg-emerald-400', 
      organic: 'bg-yellow-400',
      ewaste: 'bg-purple-400'
    };
    return lightColors[categoryId as keyof typeof lightColors] || 'bg-blue-400';
  };

  const colors = getPortalColors(category.id);
  const inputs = getWasteInputs(category.id);
  const outputs = getTransformedOutputs(category.id);

  return (
    <div 
      className="group perspective-1000 scale-in relative"
      style={{ animationDelay: `${delay}ms` }}
      ref={tiltRef as any}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Energy Field Background */}
      {isHovered && (
        <div className="absolute inset-0 -z-10">
          <div className={`absolute inset-0 rounded-full bg-gradient-radial ${colors.primary} opacity-20 animate-pulse blur-3xl scale-150`} />
          <div className={`absolute inset-0 rounded-full bg-gradient-radial ${colors.secondary} opacity-30 animate-ping blur-2xl`} style={{animationDelay: '0.5s'}} />
        </div>
      )}

      {/* Floating Energy Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute pointer-events-none z-10 ${colors.accent} opacity-70`}
          style={{
            left: particle.x,
            top: particle.y,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animation: `energy-float 3s ease-in-out infinite`,
            animationDelay: `${particle.id * 0.2}s`,
          }}
        >
          <div className="w-3 h-3 bg-current rounded-full animate-ping" />
        </div>
      ))}

      <div 
        className={`
          relative cursor-pointer transition-all duration-700 transform-gpu
          ${isTransforming ? 'scale-105' : 'scale-100'}
        `}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isTransforming ? 'scale(1.05)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
        }}
        onClick={() => onSelect(category.id)}
        data-testid={`card-category-${category.id}`}
      >
        {/* Main Portal Frame */}
        <div className={`
          relative w-full h-96 bg-gradient-to-b from-gray-900 via-slate-800 to-gray-900
          rounded-3xl shadow-2xl border-4 border-slate-700
          ${isTransforming ? colors.glow + ' shadow-2xl' : ''}
          overflow-hidden transition-all duration-500
        `}>
          
          {/* Portal Ring */}
          <div className="absolute inset-8">
            <div className={`
              w-full h-full rounded-full border-8 ${colors.primary} 
              ${isTransforming ? 'animate-spin-slow border-opacity-100' : 'border-opacity-60'}
              transition-all duration-500 shadow-inner
            `}>
              
              {/* Inner Portal Core */}
              <div className="absolute inset-8">
                <div className={`
                  w-full h-full rounded-full bg-gradient-radial ${colors.primary}
                  ${isTransforming ? 'animate-pulse opacity-80' : 'opacity-40'}
                  relative overflow-hidden transition-all duration-500
                `}>
                  
                  {/* Transformation Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Input Side */}
                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-500 ${isTransforming ? 'scale-75 opacity-60' : 'scale-100 opacity-100'}`}>
                      <div className="flex flex-col space-y-2">
                        {inputs.slice(0, 2).map((input, i) => (
                          <div key={i} className="text-2xl animate-bounce" style={{animationDelay: `${i * 0.3}s`}}>
                            {input}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Center Energy Burst */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`
                        w-16 h-16 rounded-full bg-white 
                        ${isTransforming ? 'animate-ping scale-150 opacity-100' : 'scale-75 opacity-60'}
                        flex items-center justify-center text-3xl transition-all duration-500
                      `}>
                        {category.icon}
                      </div>
                    </div>

                    {/* Output Side */}
                    <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-500 ${isTransforming ? 'scale-125 opacity-100' : 'scale-75 opacity-60'}`}>
                      <div className="flex flex-col space-y-2">
                        {outputs.slice(0, 2).map((output, i) => (
                          <div key={i} className="text-2xl animate-bounce" style={{animationDelay: `${i * 0.3 + 0.8}s`}}>
                            {output}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transformation Arrow */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <ArrowRight className={`w-8 h-8 text-white ${isTransforming ? 'animate-pulse scale-125' : 'scale-100'} transition-all duration-500`} />
                    </div>
                  </div>

                  {/* Energy Level Indicator */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/40 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                      <div 
                        className={`h-full bg-gradient-to-r ${colors.secondary} transition-all duration-300 rounded-full`}
                        style={{ width: `${energyLevel}%` }}
                      />
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-white/80 text-xs font-medium">
                        {isTransforming ? `Energy: ${energyLevel}%` : 'Portal Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Portal Effects */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={`
                          absolute w-1 h-8 bg-white/60 
                          ${isTransforming ? 'opacity-100 animate-pulse' : 'opacity-0'}
                        `}
                        style={{
                          left: `${50 + Math.cos(i * Math.PI / 4) * 40}%`,
                          top: `${50 + Math.sin(i * Math.PI / 4) * 40}%`,
                          transform: `rotate(${i * 45}deg)`,
                          transformOrigin: 'center bottom',
                          animationDelay: `${i * 0.125}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portal Status Lights */}
          <div className="absolute top-4 left-4 flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${isTransforming && energyLevel > i * 30 ? getStatusLightColor(category.id) : 'bg-gray-600'}
                `}
              />
            ))}
          </div>

          {/* Category Label */}
          <div className="absolute top-4 right-4 bg-black/60 rounded-full px-4 py-2 backdrop-blur-sm">
            <span className={`text-sm font-bold ${colors.accent}`}>
              {category.id.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Information Panel */}
        <div className={`
          bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900
          rounded-b-3xl p-6 border-x-4 border-b-4 border-slate-700
          ${isTransforming ? colors.glow : ''}
          relative overflow-hidden transition-all duration-500
        `}>
          {/* Tech Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          <div className="relative z-10 text-center">
            <h3 className={`
              font-heading font-bold text-xl mb-3 ${colors.accent}
              ${isTransforming ? 'scale-105 animate-pulse' : ''} 
              transition-all duration-300
            `}>
              {category.name}
            </h3>
            
            <p className="text-gray-300 mb-4 leading-relaxed text-sm">
              {category.description}
            </p>

            {/* Transformation Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-lg font-bold ${colors.accent}`}>⚡</div>
                <div className="text-xs text-gray-400">Transform</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${colors.accent}`}>🔄</div>
                <div className="text-xs text-gray-400">Process</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${colors.accent}`}>✨</div>
                <div className="text-xs text-gray-400">Renew</div>
              </div>
            </div>

            {/* Portal Status */}
            <div className={`
              ${isTransforming ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'}
              transition-all duration-300
            `}>
              <div className={`inline-flex items-center gap-2 ${colors.accent} font-medium text-sm`}>
                <span>{isTransforming ? 'Portal Active' : 'Enter Portal'}</span>
                <ArrowRight className={`w-4 h-4 ${isTransforming ? 'animate-pulse' : ''} transition-transform duration-200`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InteractiveCategoryShowcase({ onCategorySelect }: InteractiveCategoryShowcaseProps) {
  const { elementRef: parallaxRef, offset } = useMouseParallax(0.05);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="relative py-32 overflow-hidden" ref={parallaxRef as any}>
      {/* Animated background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      />
      
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 30%, rgba(147, 51, 234, 0.1) 50%, transparent 70%),
              linear-gradient(-45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)
            `,
            backgroundSize: '100px 100px, 100px 100px',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-8 py-3 mb-8 border border-white/20">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-foreground/80 font-semibold">Interactive Categories</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
          </div>
          
          <h2 className="font-heading font-bold text-5xl md:text-7xl mb-8">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
              Portal Network
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              Transformation Hub
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Enter the futuristic transformation portals and witness the magical process of turning waste into valuable resources.
            <span className="font-semibold text-primary"> Experience the future of recycling</span> with cutting-edge portal technology.
          </p>
        </div>
        
        {/* Interactive Category Grid */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 transition-all duration-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          style={{ transitionDelay: '300ms' }}
        >
          {WASTE_CATEGORIES.map((category, index) => (
            <TransformationPortalCard
              key={category.id}
              category={category}
              onSelect={onCategorySelect}
              delay={index * 200}
            />
          ))}
        </div>
        
        {/* Bottom CTA Section */}
        <div className={`text-center mt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{transitionDelay: '600ms'}}>
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full px-8 py-4 backdrop-blur-sm border border-primary/20">
            <div className="flex items-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-foreground/80 font-medium">
              Hover over any category to explore its interactive features
            </span>
            <div className="flex items-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-2 h-2 bg-secondary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2 + 0.6}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}