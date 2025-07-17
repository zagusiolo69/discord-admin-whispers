
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Settings, Webhook, Download, Play, Server, Activity, Zap, Shield, Globe, ChevronLeft, ChevronRight, Copy, Check, RefreshCw } from 'lucide-react';
import { WebhookConfig } from './WebhookConfig';
import { CommandsConfig } from './CommandsConfig';
import { LuaGenerator } from './LuaGenerator';
import { toast } from '@/hooks/use-toast';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('logs');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'logs', label: 'Konfiguracja Logów', icon: Settings },
    { id: 'webhooks', label: 'Webhooks Discord', icon: Webhook },
    { id: 'generator', label: 'Generator Lua', icon: Code }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  const handlePreviousTab = () => {
    const prevIndex = currentTabIndex > 0 ? currentTabIndex - 1 : tabs.length - 1;
    setActiveTab(tabs[prevIndex].id);
  };

  const handleNextTab = () => {
    const nextIndex = currentTabIndex < tabs.length - 1 ? currentTabIndex + 1 : 0;
    setActiveTab(tabs[nextIndex].id);
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText('Example configuration copied!');
    setCopied(true);
    toast({
      title: "Skopiowane!",
      description: "Konfiguracja została skopiowana do schowka",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIsGenerating(true);
    toast({
      title: "Odświeżanie...",
      description: "Aktualizowanie konfiguracji",
    });
    setTimeout(() => setIsGenerating(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-md"></div>
                <div className="relative bg-gray-900 border border-purple-500/30 rounded-lg p-3">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  <span className="text-purple-400">Zav</span> Logs
                </h1>
                <p className="text-gray-400 text-sm">
                  Advanced FiveM Logging System
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isGenerating}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Odśwież
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyConfig}
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Skopiowane' : 'Kopiuj'}
              </Button>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                  <Server className="w-3 h-3 mr-1" />
                  FiveM
                </Badge>
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Discord
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation with Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousTab}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Poprzedni
            </Button>

            <TabsList className="bg-gray-900 border border-gray-800 p-1 rounded-lg">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-all duration-200 px-4 py-2 rounded-md"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextTab}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              Następny
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Tab Content with Scrolling */}
          <ScrollArea className="h-[calc(100vh-200px)] w-full">
            <TabsContent value="logs" className="space-y-4 mt-0">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-800 rounded-t-lg">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Konfiguracja Logów
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Skonfiguruj komendy i eventy które mają być logowane na Discord
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <CommandsConfig />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-4 mt-0">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-800 rounded-t-lg">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Webhook className="w-5 h-5 text-purple-400" />
                    Konfiguracja Webhooks
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Ustaw webhooks Discord dla różnych typów logów
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <WebhookConfig />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="generator" className="space-y-4 mt-0">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-800 rounded-t-lg">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-400" />
                    Generator Skryptów FiveM
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Wygeneruj kompletny zasób FiveM z UI i skryptami Lua
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <LuaGenerator />
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="group bg-gray-900/30 border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-all duration-200">
            <CardContent className="p-4 text-center">
              <div className="relative mb-4">
                <div className="bg-purple-500/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-200">
                  <Play className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Szybki Start</h3>
              <p className="text-gray-400 text-sm">
                Skonfiguruj podstawowe komendy i eventy
              </p>
              <Button variant="outline" size="sm" className="mt-3 bg-gray-800 border-gray-700 hover:bg-gray-700">
                Rozpocznij
              </Button>
            </CardContent>
          </Card>

          <Card className="group bg-gray-900/30 border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-all duration-200">
            <CardContent className="p-4 text-center">
              <div className="relative mb-4">
                <div className="bg-purple-500/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-200">
                  <Download className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Pobierz Zasób</h3>
              <p className="text-gray-400 text-sm">
                Wygeneruj i pobierz kompletny zasób FiveM
              </p>
              <Button variant="outline" size="sm" className="mt-3 bg-gray-800 border-gray-700 hover:bg-gray-700">
                Pobierz
              </Button>
            </CardContent>
          </Card>

          <Card className="group bg-gray-900/30 border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-all duration-200">
            <CardContent className="p-4 text-center">
              <div className="relative mb-4">
                <div className="bg-purple-500/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-200">
                  <Globe className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Test Webhooks</h3>
              <p className="text-gray-400 text-sm">
                Przetestuj połączenia z Discord
              </p>
              <Button variant="outline" size="sm" className="mt-3 bg-gray-800 border-gray-700 hover:bg-gray-700">
                Testuj
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
