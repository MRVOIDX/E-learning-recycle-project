import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, XCircle, Info } from "lucide-react";
import { WasteCard } from "@/components/waste-card";
import { WASTE_CATEGORIES, WASTE_DETAILS } from "@/lib/types";

export default function Guide() {
  const [selectedWaste, setSelectedWaste] = useState<string | null>(null);

  const handleWasteSelect = (category: string) => {
    setSelectedWaste(category);
  };

  const handleCloseDetails = () => {
    setSelectedWaste(null);
  };

  return (
    <div className="fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl mb-4" data-testid="text-page-title">
            Waste Sorting Guide
          </h1>
          <p className="text-muted-foreground text-lg">
            Learn how to properly sort different types of waste
          </p>
        </div>

        {/* Waste Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {WASTE_CATEGORIES.map((category) => (
            <WasteCard
              key={category.id}
              category={category.id}
              onClick={() => handleWasteSelect(category.id)}
            />
          ))}
        </div>

        {/* Detailed Information Panel */}
        {selectedWaste && (
          <Card className="shadow-lg border border-border" data-testid="card-waste-details">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-2xl" data-testid="text-waste-details-title">
                  {WASTE_DETAILS[selectedWaste]?.title}
                </h2>
                <Button
                  onClick={handleCloseDetails}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-muted rounded-lg"
                  data-testid="button-close-details"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* What Goes In */}
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-2" />
                    What Goes In
                  </h3>
                  <ul className="space-y-2">
                    {WASTE_DETAILS[selectedWaste]?.whatGoesIn.map((item, index) => (
                      <li key={index} className="flex items-center text-muted-foreground" data-testid={`text-goes-in-${index}`}>
                        <span className="w-2 h-2 bg-success rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What Stays Out */}
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3 flex items-center">
                    <XCircle className="w-5 h-5 text-destructive mr-2" />
                    What Stays Out
                  </h3>
                  <ul className="space-y-2">
                    {WASTE_DETAILS[selectedWaste]?.whatStaysOut?.map((item, index) => (
                      <li key={index} className="flex items-center text-muted-foreground" data-testid={`text-stays-out-${index}`}>
                        <span className="w-2 h-2 bg-destructive rounded-full mr-3"></span>
                        {item}
                      </li>
                    )) || (
                      <li className="text-muted-foreground">No specific restrictions</li>
                    )}
                  </ul>
                </div>

                {/* Preparation Steps */}
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-3">Preparation Steps</h3>
                  <ol className="space-y-2">
                    {WASTE_DETAILS[selectedWaste]?.instructions.map((step, index) => (
                      <li key={index} className="flex items-start text-muted-foreground" data-testid={`text-instruction-${index}`}>
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                {WASTE_DETAILS[selectedWaste]?.tips && (
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-3 flex items-center">
                      <Info className="w-5 h-5 text-accent mr-2" />
                      Pro Tips
                    </h3>
                    <ul className="space-y-2">
                      {WASTE_DETAILS[selectedWaste].tips.map((tip, index) => (
                        <li key={index} className="text-muted-foreground" data-testid={`text-tip-${index}`}>
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className={`mt-6 p-4 rounded-lg ${
                selectedWaste === 'plastic' ? 'bg-blue-50' :
                selectedWaste === 'glass' ? 'bg-green-50' :
                selectedWaste === 'organic' ? 'bg-amber-50' : 'bg-purple-50'
              }`}>
                <div className="flex">
                  <Info className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${
                    selectedWaste === 'plastic' ? 'text-blue-600' :
                    selectedWaste === 'glass' ? 'text-green-600' :
                    selectedWaste === 'organic' ? 'text-amber-600' : 'text-purple-600'
                  }`} />
                  <p className={`text-sm ${
                    selectedWaste === 'plastic' ? 'text-blue-800' :
                    selectedWaste === 'glass' ? 'text-green-800' :
                    selectedWaste === 'organic' ? 'text-amber-800' : 'text-purple-800'
                  }`} data-testid="text-waste-info">
                    <strong>Did you know?</strong> {WASTE_DETAILS[selectedWaste]?.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
