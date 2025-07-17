
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, Settings, Webhook, Download, Play, Server, Activity, Zap, Shield, Globe } from 'lucide-react';
import { WebhookConfig } from './WebhookConfig';
import { CommandsConfig } from './CommandsConfig';
import { LuaGenerator } from './LuaGenerator';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('logs');

  return (
    <div className="min-h-screen bg-gradient-to-br from-fivem-darker via-fivem-dark to-background fivem-ui">
      {/* Header with subtle dark theme */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-animated opacity-10"></div>
        <div className="relative border-b border-border/50 glass">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-fivem-primary/20 rounded-lg blur-md"></div>
                  <div className="relative bg-card border border-fivem-primary/30 rounded-lg p-3 neon-purple">
                    <Activity className="w-6 h-6 text-fivem-primary" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1 tracking-tight">
                    <span className="text-fivem-primary">Zav</span> Logs
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Advanced FiveM Logging System with Discord Integration
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="glass text-xs px-3 py-1">
                  <Server className="w-3 h-3 mr-1" />
                  FiveM Ready
                </Badge>
                <Badge variant="secondary" className="glass text-xs px-3 py-1">
                  <Code className="w-3 h-3 mr-1" />
                  Lua Generator
                </Badge>
                <Badge variant="secondary" className="glass text-xs px-3 py-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Discord Integration
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 h-full overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 fivem-card p-1 rounded-lg">
            <TabsTrigger 
              value="logs" 
              className="flex items-center gap-2 data-[state=active]:fivem-button data-[state=active]:text-white rounded-md transition-all duration-300 py-2"
            >
              <Settings className="w-4 h-4" />
              Konfiguracja Logów
            </TabsTrigger>
            <TabsTrigger 
              value="webhooks" 
              className="flex items-center gap-2 data-[state=active]:fivem-button data-[state=active]:text-white rounded-md transition-all duration-300 py-2"
            >
              <Webhook className="w-4 h-4" />
              Webhooks Discord
            </TabsTrigger>
            <TabsTrigger 
              value="generator" 
              className="flex items-center gap-2 data-[state=active]:fivem-button data-[state=active]:text-white rounded-md transition-all duration-300 py-2"
            >
              <Code className="w-4 h-4" />
              Generator Lua
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <Card className="fivem-card">
              <CardHeader className="bg-gradient-to-r from-fivem-primary/5 to-fivem-primary/10 border-b border-border/50 rounded-t-lg">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <Activity className="w-5 h-5 text-fivem-primary" />
                  Konfiguracja Logów
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Skonfiguruj komendy i eventy które mają być logowane na Discord
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <CommandsConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <Card className="fivem-card">
              <CardHeader className="bg-gradient-to-r from-fivem-primary/5 to-fivem-primary/10 border-b border-border/50 rounded-t-lg">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-fivem-primary" />
                  Konfiguracja Webhooks
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Ustaw webhooks Discord dla różnych typów logów
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <WebhookConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="space-y-4">
            <Card className="fivem-card">
              <CardHeader className="bg-gradient-to-r from-fivem-primary/5 to-fivem-primary/10 border-b border-border/50 rounded-t-lg">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <Code className="w-5 h-5 text-fivem-primary" />
                  Generator Skryptów FiveM
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Wygeneruj kompletny zasób FiveM z UI i skryptami Lua
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <LuaGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Subtle Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="group fivem-card cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="relative mb-4">
                <div className="bg-fivem-primary/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center group-hover:bg-fivem-primary/20 transition-colors duration-300">
                  <Play className="w-6 h-6 text-fivem-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Szybki Start</h3>
              <p className="text-muted-foreground text-sm">
                Skonfiguruj podstawowe komendy i eventy
              </p>
            </CardContent>
          </Card>

          <Card className="group fivem-card cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="relative mb-4">
                <div className="bg-fivem-primary/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center group-hover:bg-fivem-primary/20 transition-colors duration-300">
                  <Download className="w-6 h-6 text-fivem-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Pobierz Zasób</h3>
              <p className="text-muted-foreground text-sm">
                Wygeneruj i pobierz kompletny zasób FiveM
              </p>
            </CardContent>
          </Card>

          <Card className="group fivem-card cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="relative mb-4">
                <div className="bg-fivem-primary/10 rounded-full w-12 h-12 mx-auto flex items-center justify-center group-hover:bg-fivem-primary/20 transition-colors duration-300">
                  <Globe className="w-6 h-6 text-fivem-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Test Webhooks</h3>
              <p className="text-muted-foreground text-sm">
                Przetestuj połączenia z Discord
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
