import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, MapPin, Clock, Phone, Navigation } from "lucide-react";

interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  phone: string;
  hours: string;
  acceptedTypes: string[];
  distance: string;
}

export default function Locator() {
  const [zipCode, setZipCode] = useState("");
  const [searchZip, setSearchZip] = useState("");
  const queryClient = useQueryClient();

  // Query for all centers to check if any exist in the system
  const { data: allCenters = [], isLoading: isLoadingAll } = useQuery<RecyclingCenter[]>({
    queryKey: ['/api/recycling/centers'],
    queryFn: async () => {
      const response = await fetch('/api/recycling/centers');
      const data = await response.json();
      return data;
    },
  });

  // Query for centers based on search
  const { data: centers = [], isLoading } = useQuery<RecyclingCenter[]>({
    queryKey: ['/api/recycling/centers', { zipCode: searchZip }],
    queryFn: async ({ queryKey }) => {
      const [url, params] = queryKey;
      const zipCodeParam = (params as { zipCode: string }).zipCode;
      const searchParams = new URLSearchParams();
      if (zipCodeParam && zipCodeParam.trim()) {
        searchParams.append('zipCode', zipCodeParam.trim());
      }
      const fullUrl = `${url}?${searchParams.toString()}`;
      console.log(`[DEBUG] Frontend: Making API call to ${fullUrl}`);
      console.log(`[DEBUG] Frontend: zipCode parameter:`, zipCodeParam);
      const response = await fetch(fullUrl);
      const data = await response.json();
      console.log(`[DEBUG] Frontend: Received response:`, data);
      console.log(`[DEBUG] Frontend: centers.length=${data.length}`);
      return data;
    },
    enabled: !!searchZip, // Enable when searchZip is set
  });

  const handleSearch = () => {
    if (!zipCode.trim()) return;
    const currentZip = zipCode.trim();
    console.log(`[DEBUG] Frontend: handleSearch called with zipCode:`, currentZip);
    setSearchZip(currentZip);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getAcceptedTypesColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('plastic')) return 'bg-blue-100 text-blue-800';
    if (lowerType.includes('glass')) return 'bg-green-100 text-green-800';
    if (lowerType.includes('electronic') || lowerType.includes('battery')) return 'bg-purple-100 text-purple-800';
    if (lowerType.includes('paper')) return 'bg-amber-100 text-amber-800';
    if (lowerType.includes('appliance')) return 'bg-gray-100 text-gray-800';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl mb-4" data-testid="text-page-title">
            Find Recycling Centers
          </h1>
          <p className="text-muted-foreground text-lg">
            Locate nearby recycling and drop-off points in your area
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 pr-4 py-3"
              data-testid="input-zip-code"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
          <Button
            onClick={handleSearch}
            className="w-full mt-3 bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90"
            disabled={isLoading || !zipCode.trim()}
            data-testid="button-search-centers"
          >
            {isLoading ? "Searching..." : "Search Centers"}
          </Button>
        </div>

        {/* Map Placeholder */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Interactive map will show recycling centers near your location
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchZip ? `Showing results for ${searchZip}` : "Enter a ZIP code to see nearby centers"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Searching for recycling centers...</p>
          </div>
        )}

        {/* Show empty state when no centers exist in the system */}
        {!isLoadingAll && allCenters.length === 0 && !searchZip && (
          <Card className="text-center py-16" data-testid="card-empty-system">
            <CardContent>
              <div className="max-w-md mx-auto">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="font-heading font-semibold text-xl mb-4">No Recycling Centers Available</h3>
                <p className="text-muted-foreground mb-6">
                  There are currently no recycling centers in our database. Our administrators will be adding locations soon.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                  <p className="font-medium mb-2">📍 What you can do in the meantime:</p>
                  <ul className="text-left space-y-1">
                    <li>• Contact your local waste management authority</li>
                    <li>• Check your city's official website for recycling information</li>
                    <li>• Ask neighbors about local recycling options</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show search results empty state */}
        {!isLoading && searchZip && centers.length === 0 && allCenters.length > 0 && (
          <Card className="text-center py-12" data-testid="card-no-results">
            <CardContent>
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">No Centers Found</h3>
              <p className="text-muted-foreground">
                No recycling centers found for ZIP code {searchZip}. Try a different ZIP code or contact your local waste management authority.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {centers.map((center: RecyclingCenter) => (
            <Card key={center.id} className="shadow-sm hover:shadow-md transition-shadow" data-testid={`card-center-${center.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg mb-2" data-testid={`text-center-name-${center.id}`}>
                      {center.name}
                    </h3>
                    <p className="text-muted-foreground mb-2" data-testid={`text-center-address-${center.id}`}>
                      {center.address}
                    </p>
                    <div className="flex items-center space-x-4 text-sm mb-3">
                      {center.hours && (
                        <span className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          <span data-testid={`text-center-hours-${center.id}`}>{center.hours}</span>
                        </span>
                      )}
                      {center.distance && (
                        <span className="flex items-center text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span data-testid={`text-center-distance-${center.id}`}>{center.distance}</span>
                        </span>
                      )}
                      {center.phone && (
                        <span className="flex items-center text-muted-foreground">
                          <Phone className="w-4 h-4 mr-1" />
                          <span data-testid={`text-center-phone-${center.id}`}>{center.phone}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {center.acceptedTypes.map((type, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs ${getAcceptedTypesColor(type)}`}
                          data-testid={`tag-accepted-type-${center.id}-${index}`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
                      onClick={() => {
                        // In a real app, this would open directions in maps app
                        if (navigator.geolocation && center.address) {
                          const encodedAddress = encodeURIComponent(center.address);
                          const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
                          window.open(mapsUrl, '_blank');
                        }
                      }}
                      data-testid={`button-directions-${center.id}`}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button
                      variant="outline"
                      className="border border-border text-foreground px-4 py-2 text-sm font-medium hover:bg-muted"
                      onClick={() => {
                        if (center.phone) {
                          window.location.href = `tel:${center.phone}`;
                        }
                      }}
                      data-testid={`button-contact-${center.id}`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
