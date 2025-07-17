import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, Settings, Webhook, Download, Play, Server } from 'lucide-react';
import { WebhookConfig } from './WebhookConfig';
import { CommandsConfig } from './CommandsConfig';
import { LuaGenerator } from './LuaGenerator';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('commands');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-primary">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                FiveM Admin Logger
              </h1>
              <p className="text-white/80 text-lg">
                Generator skryptów Lua do logowania komend administracyjnych
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Server className="w-4 h-4 mr-1" />
                FiveM Ready
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Code className="w-4 h-4 mr-1" />
                Lua Generator
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card border">
            <TabsTrigger value="commands" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Konfiguracja Komend
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              Webhooks Discord
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Generator Lua
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commands" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl text-fivem-primary">
                  Komendy Administracyjne
                </CardTitle>
                <CardDescription>
                  Skonfiguruj komendy które mają być logowane na Discord
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommandsConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl text-fivem-primary">
                  Konfiguracja Webhooks
                </CardTitle>
                <CardDescription>
                  Ustaw webhooks Discord dla różnych typów logów
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WebhookConfig />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl text-fivem-primary">
                  Generator Skryptów Lua
                </CardTitle>
                <CardDescription>
                  Wygeneruj gotowe skrypty Lua na podstawie Twojej konfiguracji
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LuaGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Play className="w-12 h-12 text-fivem-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Szybki Start</h3>
              <p className="text-muted-foreground text-sm">
                Skonfiguruj podstawowe komendy w kilka kliknięć
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="w-12 h-12 text-fivem-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pobierz Skrypty</h3>
              <p className="text-muted-foreground text-sm">
                Wygeneruj i pobierz gotowe pliki .lua
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Webhook className="w-12 h-12 text-fivem-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Test Webhooks</h3>
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