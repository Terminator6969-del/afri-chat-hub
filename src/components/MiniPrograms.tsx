import React, { useState } from 'react';
import { ArrowLeft, Star, Gamepad2, Calculator, Camera, Music, MapPin, Coffee, ShoppingBag, Clock, Crown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MiniProgramsProps {
  onBack: () => void;
}

const MiniPrograms: React.FC<MiniProgramsProps> = ({ onBack }) => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const miniApps = [
    {
      id: 'calculator',
      name: 'Calculator',
      icon: <Calculator className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      category: 'Utilities'
    },
    {
      id: 'weather',
      name: 'Weather',
      icon: <MapPin className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      category: 'Utilities'
    },
    {
      id: 'music',
      name: 'Music Player',
      icon: <Music className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      category: 'Entertainment'
    },
    {
      id: 'game-snake',
      name: 'Snake Game',
      icon: <Gamepad2 className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      category: 'Games'
    },
    {
      id: 'coffee-finder',
      name: 'Coffee Finder',
      icon: <Coffee className="w-6 h-6" />,
      color: 'from-amber-500 to-amber-600',
      category: 'Food & Drink'
    },
    {
      id: 'shopping',
      name: 'Shopping List',
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'from-pink-500 to-pink-600',
      category: 'Productivity'
    }
  ];

  const categories = ['All', 'Games', 'Utilities', 'Entertainment', 'Food & Drink', 'Productivity'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredApps = selectedCategory === 'All' 
    ? miniApps 
    : miniApps.filter(app => app.category === selectedCategory);

  const renderMiniApp = () => {
    switch (selectedApp) {
      case 'calculator':
        return <CalculatorApp onBack={() => setSelectedApp(null)} />;
      case 'game-snake':
        return <SnakeGame onBack={() => setSelectedApp(null)} />;
      case 'weather':
        return <WeatherApp onBack={() => setSelectedApp(null)} />;
      default:
        return null;
    }
  };

  if (selectedApp) {
    return renderMiniApp();
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Mini Programs</h1>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Mini Programs Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          {filteredApps.map((app, index) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app.id)}
              className="flex flex-col items-center gap-2 p-4 hover:bg-muted/50 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg",
                app.color
              )}>
                {app.icon}
              </div>
              <span className="text-xs text-center text-foreground font-medium">{app.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Calculator Mini App
const CalculatorApp: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperation = (op: string) => {
    setOperation(op);
    setPreviousValue(display);
    setDisplay('0');
  };

  const calculate = () => {
    if (operation && previousValue) {
      const prev = parseFloat(previousValue);
      const current = parseFloat(display);
      let result = 0;

      switch (operation) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          result = prev / current;
          break;
      }

      setDisplay(result.toString());
      setOperation(null);
      setPreviousValue(null);
    }
  };

  const clear = () => {
    setDisplay('0');
    setOperation(null);
    setPreviousValue(null);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Calculator</h1>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-background rounded-2xl p-6 shadow-lg">
          <div className="bg-muted rounded-xl p-4 mb-4">
            <div className="text-right text-2xl font-mono font-bold">{display}</div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button onClick={clear} className="col-span-2 bg-destructive text-destructive-foreground rounded-xl p-4 font-semibold">Clear</button>
            <button onClick={() => handleOperation('/')} className="bg-primary text-primary-foreground rounded-xl p-4 font-semibold">÷</button>
            <button onClick={() => handleOperation('*')} className="bg-primary text-primary-foreground rounded-xl p-4 font-semibold">×</button>
            
            {[7, 8, 9].map(num => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="bg-muted hover:bg-muted/80 rounded-xl p-4 font-semibold">{num}</button>
            ))}
            <button onClick={() => handleOperation('-')} className="bg-primary text-primary-foreground rounded-xl p-4 font-semibold">−</button>
            
            {[4, 5, 6].map(num => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="bg-muted hover:bg-muted/80 rounded-xl p-4 font-semibold">{num}</button>
            ))}
            <button onClick={() => handleOperation('+')} className="bg-primary text-primary-foreground rounded-xl p-4 font-semibold">+</button>
            
            {[1, 2, 3].map(num => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="bg-muted hover:bg-muted/80 rounded-xl p-4 font-semibold">{num}</button>
            ))}
            <button onClick={calculate} className="row-span-2 bg-accent text-accent-foreground rounded-xl p-4 font-semibold">=</button>
            
            <button onClick={() => handleNumber('0')} className="col-span-2 bg-muted hover:bg-muted/80 rounded-xl p-4 font-semibold">0</button>
            <button onClick={() => handleNumber('.')} className="bg-muted hover:bg-muted/80 rounded-xl p-4 font-semibold">.</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Snake Game Mini App
const SnakeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Snake Game</h1>
          <div className="ml-auto">
            <span className="text-sm font-medium">Score: {score}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="bg-background rounded-2xl p-6 shadow-lg w-full max-w-sm">
          <div className="aspect-square bg-muted rounded-xl mb-4 flex items-center justify-center">
            {!gameStarted ? (
              <div className="text-center">
                <Gamepad2 className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">Tap to start playing</p>
                <button 
                  onClick={() => setGameStarted(true)}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold"
                >
                  Start Game
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">🐍</div>
                <p className="text-sm text-muted-foreground">Game in progress...</p>
                <button 
                  onClick={() => {
                    setGameStarted(false);
                    setScore(Math.floor(Math.random() * 100));
                  }}
                  className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-semibold mt-2"
                >
                  End Game
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Weather App
const WeatherApp: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900">
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 hover:bg-muted rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Weather</h1>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-background rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Cape Town</h2>
            <div className="text-6xl mb-2">☀️</div>
            <div className="text-3xl font-bold mb-1">24°C</div>
            <p className="text-muted-foreground">Sunny</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">💨</div>
              <p className="text-sm text-muted-foreground">Wind</p>
              <p className="font-semibold">12 km/h</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">💧</div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-semibold">68%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPrograms;