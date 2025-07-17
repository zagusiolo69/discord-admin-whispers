
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
    <div className="min-h-screen bg-gradient-to-br from-fivem-darker via-fivem-dark to-fivem-dark fivem-ui">
      {/* Header with enhanced dark theme */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-animated opacity-20"></div>
        <div className="relative border-b border-fivem-primary/30 glass-purple">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-fivem-primary to-fivem-secondary rounded-xl blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-fivem-primary to-fivem-secondary rounded-xl p-4 neon-purple">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-fivem-primary via-fivem-secondary to-fivem-accent bg-clip-text text-transparent mb-2 tracking-tight">
                    Zav Logs
                  </h1>
                  <p className="text-foreground/80 text-xl font-medium">
                    Advanced FiveM Logging System with Discord Integration
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="glass-purple text-fivem-primary border-fivem-primary/30 text-sm px-4 py-2">
                  <Server className="w-4 h-4 mr-2" />
                  FiveM Ready
                </Badge>
                <Badge variant="secondary" className="glass-purple text-fivem-secondary border-fivem-secondary/30 text-sm px-4 py-2">
                  <Code className="w-4 h-4 mr-2" />
                  Lua Generator
                </Badge>
                <Badge variant="secondary" className="glass-purple text-fivem-accent border-fivem-accent/30 text-sm px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Discord Webhooks
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 fivem-container">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 fivem-card p-2 rounded-xl">
            <TabsTrigger 
              value="logs" 
              className="flex items-center gap-2 data-[state=active]:fivem-button data-[state=active]:text-white rounded-lg transition-all duration-300 py-3"
            >
              <Settings className="w-5 h-5" />
              Konfiguracja Logów
            </TabsTrigger>
            <TabsTrigger 
              value="webhooks" 
              className="flex items-center gap-2 data-[state=active]:fivem-button data-[state=active]:text-white rounded-lg transition-all duration-300 py-3"
            >
              <Webhook className="w-5 h-5" />
              Webhooks Discord
            </TabsTrigger>
            <TabsTrigger 
              value="generator" 
              className="flex items-center gap-2 data-[state=active]:fivem-button data-[state=active]:text-white rounded-lg transition-all duration-300 py-3"
            >
              <Code className="w-5 h-5" />
              Generator Lua
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-6">
            <Card className="fivem-card">
              <CardHeader className="bg-gradient-to-r from-fivem-primary/10 to-fivem-secondary/10 border-b border-fivem-primary/20 rounded-t-lg">
                <CardTitle className="text-2xl text-fivem-primary flex items-center gap-3">
                  <Activity className="w-7 h-7" />
                  Konfiguracja Logów
                </CardTitle>
                <CardDescription className="text-base text-foreground/70">
                  Skonfiguruj komendy i eventy które mają być logowane na Discord
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <CommandsConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card className="fivem-card">
              <CardHeader className="bg-gradient-to-r from-fivem-primary/10 to-fivem-secondary/10 border-b border-fivem-primary/20 rounded-t-lg">
                <CardTitle className="text-2xl text-fivem-primary flex items-center gap-3">
                  <Webhook className="w-7 h-7" />
                  Konfiguracja Webhooks
                </CardTitle>
                <CardDescription className="text-base text-foreground/70">
                  Ustaw webhooks Discord dla różnych typów logów
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <WebhookConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <Card className="fivem-card">
              <CardHeader className="bg-gradient-to-r from-fivem-primary/10 to-fivem-secondary/10 border-b border-fivem-primary/20 rounded-t-lg">
                <CardTitle className="text-2xl text-fivem-primary flex items-center gap-3">
                  <Code className="w-7 h-7" />
                  Generator Skryptów FiveM
                </CardTitle>
                <CardDescription className="text-base text-foreground/70">
                  Wygeneruj kompletny zasób FiveM z UI i skryptami Lua
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <LuaGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="group fivem-card cursor-pointer">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-fivem-primary to-fivem-secondary rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-fivem-primary to-fivem-secondary rounded-full w-20 h-20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 neon-purple">
                  <Play className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-fivem-primary">Szybki Start</h3>
              <p className="text-muted-foreground">
                Skonfiguruj podstawowe komendy i eventy w kilka kliknięć
              </p>
            </CardContent>
          </Card>

          <Card className="group fivem-card cursor-pointer">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-fivem-secondary to-fivem-accent rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-fivem-secondary to-fivem-accent rounded-full w-20 h-20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 neon-purple">
                  <Download className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-fivem-secondary">Pobierz Zasób</h3>
              <p className="text-muted-foreground">
                Wygeneruj i pobierz kompletny zasób FiveM
              </p>
            </CardContent>
          </Card>

          <Card className="group fivem-card cursor-pointer">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-fivem-accent to-fivem-primary rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-fivem-accent to-fivem-primary rounded-full w-20 h-20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 neon-purple">
                  <Globe className="w-10 h-10 text-white" />
                </div>
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
