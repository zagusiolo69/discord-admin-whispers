
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, Settings, Webhook, Download, Play, Server, Activity } from 'lucide-react';
import { WebhookConfig } from './WebhookConfig';
import { CommandsConfig } from './CommandsConfig';
import { LuaGenerator } from './LuaGenerator';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('logs');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-fivem-dark/20">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-fivem-primary via-fivem-secondary to-fivem-accent shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  Zav Logs
                </h1>
                <p className="text-white/90 text-lg font-medium">
                  System logowania komend i eventów dla FiveM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Server className="w-4 h-4 mr-1" />
                FiveM Ready
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Code className="w-4 h-4 mr-1" />
                Lua Generator
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Activity className="w-4 h-4 mr-1" />
                Events & Commands
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border-2 border-fivem-primary/20 rounded-xl p-1">
            <TabsTrigger 
              value="logs" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-fivem-primary data-[state=active]:to-fivem-secondary data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              Konfiguracja Logów
            </TabsTrigger>
            <TabsTrigger 
              value="webhooks" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-fivem-primary data-[state=active]:to-fivem-secondary data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Webhook className="w-4 h-4" />
              Webhooks Discord
            </TabsTrigger>
            <TabsTrigger 
              value="generator" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-fivem-primary data-[state=active]:to-fivem-secondary data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              <Code className="w-4 h-4" />
              Generator Lua
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-6">
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-fivem-primary/20">
              <CardHeader className="bg-gradient-to-r from-fivem-primary/10 to-fivem-secondary/10 border-b border-fivem-primary/20">
                <CardTitle className="text-2xl text-fivem-primary flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  Konfiguracja Logów
                </CardTitle>
                <CardDescription className="text-base">
                  Skonfiguruj komendy i eventy które mają być logowane na Discord
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <CommandsConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-fivem-primary/20">
              <CardHeader className="bg-gradient-to-r from-fivem-primary/10 to-fivem-secondary/10 border-b border-fivem-primary/20">
                <CardTitle className="text-2xl text-fivem-primary flex items-center gap-2">
                  <Webhook className="w-6 h-6" />
                  Konfiguracja Webhooks
                </CardTitle>
                <CardDescription className="text-base">
                  Ustaw webhooks Discord dla różnych typów logów
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <WebhookConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-fivem-primary/20">
              <CardHeader className="bg-gradient-to-r from-fivem-primary/10 to-fivem-secondary/10 border-b border-fivem-primary/20">
                <CardTitle className="text-2xl text-fivem-primary flex items-center gap-2">
                  <Code className="w-6 h-6" />
                  Generator Skryptów Lua
                </CardTitle>
                <CardDescription className="text-base">
                  Wygeneruj gotowe skrypty Lua na podstawie Twojej konfiguracji
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <LuaGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group shadow-xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-fivem-primary/20 hover:border-fivem-primary/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-fivem-primary to-fivem-secondary rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-fivem-primary">Szybki Start</h3>
              <p className="text-muted-foreground">
                Skonfiguruj podstawowe komendy i eventy w kilka kliknięć
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-fivem-secondary/20 hover:border-fivem-secondary/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-fivem-secondary to-fivem-accent rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-fivem-secondary">Pobierz Zasoby</h3>
              <p className="text-muted-foreground">
                Wygeneruj i pobierz gotowy zasób FiveM
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-fivem-accent/20 hover:border-fivem-accent/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-br from-fivem-accent to-fivem-primary rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Webhook className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-fivem-accent">Test Webhooks</h3>
              <p className="text-muted-foreground">
                Przetestuj połączenia z Discord
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
