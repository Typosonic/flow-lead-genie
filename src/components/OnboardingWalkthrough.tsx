
import { useState } from "react";
import { ArrowRight, CheckCircle, Calendar, MessageSquare, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingWalkthrough = ({ onComplete }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    leadFormId: "",
    calendarLink: "",
    smsMessage: "",
    followUpPreference: "both"
  });

  const steps = [
    {
      title: "Welcome to Agent-flow",
      description: "Let's set up your AI automation in just a few steps",
      component: "welcome"
    },
    {
      title: "Connect Your Lead Source",
      description: "Link your Meta Ad Form or paste a Lead Form ID",
      component: "lead-source"
    },
    {
      title: "Add Your Calendar",
      description: "Connect your booking calendar (Calendly, etc.)",
      component: "calendar"
    },
    {
      title: "Customize Your Messages",
      description: "Set up your intro SMS and follow-up preferences",
      component: "messages"
    },
    {
      title: "Launch Your Agent",
      description: "Your AI automation is ready to go!",
      component: "launch"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    toast({
      title: "🎉 Agent Deployed Successfully!",
      description: "Your AI automation is now active and ready to follow up with leads.",
    });
    onComplete();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = () => {
    switch (steps[currentStep].component) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-brand-500 to-blue-600 rounded-3xl flex items-center justify-center">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Welcome to Agent-flow</h2>
              <p className="text-muted-foreground leading-relaxed">
                Transform your lead follow-up with AI automation. We'll help you set up an intelligent agent 
                that follows up with every lead via SMS and voice calls, so you never miss an opportunity.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 text-brand-500" />
                <p className="text-sm font-medium">Smart SMS</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-brand-500" />
                <p className="text-sm font-medium">Auto Booking</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                <Zap className="h-6 w-6 mx-auto mb-2 text-brand-500" />
                <p className="text-sm font-medium">Voice Calls</p>
              </div>
            </div>
          </div>
        );

      case "lead-source":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Connect Your Lead Source</h2>
              <p className="text-muted-foreground">
                Paste your Facebook Lead Form ID or Meta Ads form URL
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="leadForm">Facebook Lead Form ID</Label>
                <Input
                  id="leadForm"
                  placeholder="e.g., 123456789012345"
                  value={formData.leadFormId}
                  onChange={(e) => updateFormData("leadFormId", e.target.value)}
                  className="bg-background/50 border-border/40"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Find this in your Facebook Ads Manager → Forms Library
                </p>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm">
                  💡 <strong>Need help?</strong> We can also connect directly to your Meta Ads account 
                  for automatic lead syncing.
                </p>
              </div>
            </div>
          </div>
        );

      case "calendar":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Add Your Calendar Link</h2>
              <p className="text-muted-foreground">
                Connect your booking calendar so leads can schedule appointments
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="calendar">Calendar Link (Calendly, etc.)</Label>
                <Input
                  id="calendar"
                  placeholder="https://calendly.com/your-name"
                  value={formData.calendarLink}
                  onChange={(e) => updateFormData("calendarLink", e.target.value)}
                  className="bg-background/50 border-border/40"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be included in your follow-up messages
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-sm">
                  📅 <strong>Pro tip:</strong> Use a dedicated calendar link for tracking which leads 
                  came from AI follow-up vs other sources.
                </p>
              </div>
            </div>
          </div>
        );

      case "messages":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Customize Your Messages</h2>
              <p className="text-muted-foreground">
                Set up your intro SMS message and follow-up preferences
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="smsMessage">Intro SMS Message</Label>
                <Textarea
                  id="smsMessage"
                  placeholder="Hi {name}! Thanks for your interest in our services. I'd love to chat about how we can help you. When's a good time for a quick call?"
                  value={formData.smsMessage}
                  onChange={(e) => updateFormData("smsMessage", e.target.value)}
                  className="bg-background/50 border-border/40 min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {`{name}`} to personalize with the lead's name
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border/40 cursor-pointer hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="followUp" 
                      value="sms"
                      className="text-brand-500"
                      onChange={(e) => updateFormData("followUpPreference", e.target.value)}
                    />
                    <div>
                      <p className="font-medium">SMS Only</p>
                      <p className="text-sm text-muted-foreground">Text messages only</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border/40 cursor-pointer hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="followUp" 
                      value="both"
                      defaultChecked
                      className="text-brand-500"
                      onChange={(e) => updateFormData("followUpPreference", e.target.value)}
                    />
                    <div>
                      <p className="font-medium">SMS + Voice</p>
                      <p className="text-sm text-muted-foreground">Recommended</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "launch":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">You're All Set!</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your AI agent is configured and ready to start following up with leads. 
                It will automatically send SMS messages and make voice calls based on your preferences.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-r from-brand-500/10 to-blue-600/10 border border-brand-500/20">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Your agent will monitor your lead form for new submissions</p>
                <p>✅ Each lead gets an instant SMS within 5 minutes</p>
                <p>✅ Follow-up calls are made automatically</p>
                <p>✅ Booking links are shared when leads show interest</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-morphism border-border/40">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onComplete}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip
            </Button>
          </div>
          <Progress value={(currentStep + 1) / steps.length * 100} className="mb-6" />
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pb-8">
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="border-border/40"
            >
              Previous
            </Button>
            <Button onClick={nextStep} className="btn-gradient">
              {currentStep === steps.length - 1 ? (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Launch Agent
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWalkthrough;
