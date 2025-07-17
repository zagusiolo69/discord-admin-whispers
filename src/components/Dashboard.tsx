
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, Settings, Webhook, Download, Activity, Zap, Shield, Server, Copy, Check, RefreshCw } from 'lucide-react';
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
    <div className="p-4 max-w-6xl mx-auto">
      {/* Compact Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-md"></div>
              <div className="relative bg-gray-900 border border-purple-500/30 rounded-lg p-2">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                <span className="text-purple-400">Zav</span> Logs
              </h1>
              <p className="text-gray-400 text-xs">
                FiveM Logging System
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
              <RefreshCw className={`w-3 h-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
              Odśwież
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyConfig}
              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? 'Skopiowane' : 'Kopiuj'}
            </Button>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                <Server className="w-2 h-2 mr-1" />
                FiveM
              </Badge>
              <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                <Shield className="w-2 h-2 mr-1" />
                Discord
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Compact Tab Navigation */}
        <TabsList className="bg-gray-900 border border-gray-800 p-1 rounded-lg w-full">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-all duration-200 px-3 py-2 rounded-md flex-1"
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Compact Tab Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          <TabsContent value="logs" className="mt-0">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-800 rounded-t-lg pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Konfiguracja Logów
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Skonfiguruj komendy i eventy które mają być logowane na Discord
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <CommandsConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="mt-0">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-800 rounded-t-lg pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Webhook className="w-4 h-4 text-purple-400" />
                  Konfiguracja Webhooks
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Ustaw webhooks Discord dla różnych typów logów
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <WebhookConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="mt-0">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-b border-gray-800 rounded-t-lg pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  Generator Skryptów FiveM
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  Wygeneruj kompletny zasób FiveM z UI i skryptami Lua
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <LuaGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Compact Quick Actions */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Card className="group bg-gray-900/30 border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-all duration-200">
          <CardContent className="p-3 text-center">
            <div className="bg-purple-500/10 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-200">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-white">Szybki Start</h3>
            <p className="text-gray-400 text-xs mb-2">
              Skonfiguruj podstawowe komendy
            </p>
            <Button variant="outline" size="sm" className="text-xs bg-gray-800 border-gray-700 hover:bg-gray-700">
              Rozpocznij
            </Button>
          </CardContent>
        </Card>

        <Card className="group bg-gray-900/30 border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-all duration-200">
          <CardContent className="p-3 text-center">
            <div className="bg-purple-500/10 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-200">
              <Download className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-white">Pobierz Zasób</h3>
            <p className="text-gray-400 text-xs mb-2">
              Wygeneruj kompletny zasób FiveM
            </p>
            <Button variant="outline" size="sm" className="text-xs bg-gray-800 border-gray-700 hover:bg-gray-700">
              Pobierz
            </Button>
          </CardContent>
        </Card>

        <Card className="group bg-gray-900/30 border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-all duration-200">
          <CardContent className="p-3 text-center">
            <div className="bg-purple-500/10 rounded-full w-8 h-8 mx-auto mb-2 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-200">
              <Webhook className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-white">Test Webhooks</h3>
            <p className="text-gray-400 text-xs mb-2">
              Przetestuj połączenia z Discord
            </p>
            <Button variant="outline" size="sm" className="text-xs bg-gray-800 border-gray-700 hover:bg-gray-700">
              Testuj
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
