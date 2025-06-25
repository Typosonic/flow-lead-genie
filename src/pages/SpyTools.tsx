
import { useState } from "react";
import { Eye, ExternalLink, Heart, Search, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const SpyTools = () => {
  const [searchUrl, setSearchUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Mock ad data for demonstration
  const mockAds = [
    {
      id: 1,
      headline: "Get More Leads in 30 Days",
      description: "Our proven system helps local businesses increase leads by 300%. Book a free consultation today!",
      cta: "Book Free Call",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      engagement: "2.3K likes, 89 comments",
      adType: "Image",
      runningDays: "14 days",
      saved: false
    },
    {
      id: 2,
      headline: "Transform Your Business with AI",
      description: "Automate your customer follow-up and never miss a lead again. See how our clients increased sales by 150%.",
      cta: "Learn More",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
      engagement: "1.8K likes, 65 comments",
      adType: "Video",
      runningDays: "7 days",
      saved: true
    },
    {
      id: 3,
      headline: "Stop Losing Customers",
      description: "95% of leads never get followed up properly. Our automated system ensures every lead gets attention.",
      cta: "Get Started",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
      engagement: "3.1K likes, 124 comments",
      adType: "Carousel",
      runningDays: "21 days",
      saved: false
    }
  ];

  const handleSearch = async () => {
    if (!searchUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Facebook page URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockAds);
      setIsLoading(false);
      toast({
        title: "Search Complete",
        description: `Found ${mockAds.length} active ads for this business`,
      });
    }, 2000);
  };

  const handleSaveAd = (adId: number) => {
    setSearchResults(results => 
      results.map(ad => 
        ad.id === adId ? { ...ad, saved: !ad.saved } : ad
      )
    );
    
    const ad = searchResults.find(a => a.id === adId);
    toast({
      title: ad?.saved ? "Removed from saved" : "Saved to inspirations",
      description: ad?.saved ? "Ad removed from your collection" : "Ad saved to your inspiration folder",
    });
  };

  const handleCopyAd = (ad: any) => {
    const adText = `Headline: ${ad.headline}\nDescription: ${ad.description}\nCTA: ${ad.cta}`;
    navigator.clipboard.writeText(adText);
    toast({
      title: "Copied to clipboard",
      description: "Ad content copied successfully",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Competitor Spy Tools</h1>
        <p className="text-muted-foreground">Discover what ads your competitors are running</p>
      </div>

      {/* Search Section */}
      <Card className="glass-morphism border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Spy on Competitor Ads
          </CardTitle>
          <CardDescription>
            Enter a Facebook business page URL to see their active advertisements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="https://facebook.com/business-page-name"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                className="bg-background/50 border-border/40"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="btn-gradient px-8"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Show Active Ads
                </>
              )}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            💡 Tip: Use the exact Facebook page URL for best results (e.g., facebook.com/companybusiness)
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Advertisements ({searchResults.length})</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border/40">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {searchResults.map((ad) => (
              <Card key={ad.id} className="glass-morphism border-border/40 overflow-hidden">
                <div className="relative">
                  <img 
                    src={ad.image} 
                    alt={ad.headline}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-black/70 text-white border-0">
                      {ad.adType}
                    </Badge>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSaveAd(ad.id)}
                      className={`h-8 w-8 p-0 ${ad.saved ? 'bg-red-500 hover:bg-red-600' : 'bg-black/70 hover:bg-black/80'}`}
                    >
                      <Heart className={`h-4 w-4 ${ad.saved ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{ad.headline}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {ad.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-brand-500/30 text-brand-400">
                        {ad.cta}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Running for {ad.runningDays}</span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground border-t border-border/40 pt-4">
                      📊 {ad.engagement}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-border/40"
                        onClick={() => handleCopyAd(ad)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-border/40"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchResults.length === 0 && !isLoading && (
        <Card className="glass-morphism border-border/40 text-center py-12">
          <CardContent>
            <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Ready to Spy on Competitors?</h3>
            <p className="text-muted-foreground mb-4">
              Enter a Facebook business page URL above to discover their active ad campaigns
            </p>
            <div className="text-sm text-muted-foreground">
              🔍 Get insights into their messaging, offers, and creative strategies
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpyTools;
