import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Webhook, TestTube, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookData {
  id: string;
  name: string;
  url: string;
  category: string;
  color: string;
  username: string;
  avatar: string;
  enabled: boolean;
  lastTest?: Date;
  status?: 'success' | 'error' | 'pending';
}

const webhookCategories = [
  { value: 'economy', label: 'Ekonomia', color: '#10b981' },
  { value: 'vehicles', label: 'Pojazdy', color: '#3b82f6' },
  { value: 'items', label: 'Przedmioty', color: '#f59e0b' },
  { value: 'jobs', label: 'Praca', color: '#8b5cf6' },
  { value: 'moderation', label: 'Moderacja', color: '#ef4444' },
  { value: 'general', label: 'Ogólne', color: '#6b7280' }
];

export function WebhookConfig() {
  const [webhooks, setWebhooks] = useState<WebhookData[]>([
    {
      id: '1',
      name: 'Ekonomia Logger',
      url: '',
      category: 'economy',
      color: '#10b981',
      username: 'FiveM Economy Bot',
      avatar: '',
      enabled: true
    },
    {
      id: '2',
      name: 'Moderacja Logger', 
      url: '',
      category: 'moderation',
      color: '#ef4444',
      username: 'FiveM Moderation Bot',
      avatar: '',
      enabled: true
    }
  ]);
  
  const [testMessage, setTestMessage] = useState('');
  const [selectedWebhook, setSelectedWebhook] = useState<string>('');
  const { toast } = useToast();

  const updateWebhook = (id: string, updates: Partial<WebhookData>) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === id ? { ...webhook, ...updates } : webhook
    ));
    toast({
      title: "Webhook zaktualizowany",
      description: "Zmiany zostały zapisane"
    });
  };

  const testWebhook = async (webhook: WebhookData) => {
    if (!webhook.url) {
      toast({
        title: "Błąd",
        description: "Wprowadź URL webhook-a",
        variant: "destructive"
      });
      return;
    }

    setWebhooks(prev => prev.map(w => 
      w.id === webhook.id ? { ...w, status: 'pending' } : w
    ));

    try {
      const testPayload = {
        username: webhook.username || 'FiveM Admin Logger',
        avatar_url: webhook.avatar || '',
        embeds: [{
          title: "🧪 Test Webhook",
          description: testMessage || "Test połączenia z webhook-iem Discord",
          color: parseInt(webhook.color.replace('#', ''), 16),
          fields: [
            {
              name: "Timestamp",
              value: new Date().toLocaleString('pl-PL'),
              inline: true
            },
            {
              name: "Status",
              value: "Test successful ✅",
              inline: true
            }
          ],
          footer: {
            text: "FiveM Admin Logger • Test"
          },
          timestamp: new Date().toISOString()
        }]
      };

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(testPayload)
      });

      setWebhooks(prev => prev.map(w => 
        w.id === webhook.id ? { 
          ...w, 
          status: 'success',
          lastTest: new Date()
        } : w
      ));

      toast({
        title: "Test webhook-a zakończony",
        description: "Sprawdź kanał Discord czy wiadomość została wysłana"
      });

    } catch (error) {
      setWebhooks(prev => prev.map(w => 
        w.id === webhook.id ? { ...w, status: 'error' } : w
      ));

      toast({
        title: "Błąd testu",
        description: "Sprawdź URL webhook-a i spróbuj ponownie",
        variant: "destructive"
      });
    }
  };

  const addWebhook = () => {
    const newWebhook: WebhookData = {
      id: Date.now().toString(),
      name: 'Nowy Webhook',
      url: '',
      category: 'general',
      color: '#6b7280',
      username: 'FiveM Bot',
      avatar: '',
      enabled: true
    };

    setWebhooks(prev => [...prev, newWebhook]);
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    toast({
      title: "Webhook usunięty",
      description: "Webhook został usunięty z listy"
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="webhooks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          {/* Add Webhook Button */}
          <div className="flex justify-end">
            <Button onClick={addWebhook} className="bg-gradient-primary">
              <Webhook className="w-4 h-4 mr-2" />
              Dodaj Webhook
            </Button>
          </div>

          {/* Webhooks List */}
          <div className="space-y-4">
            {webhooks.map(webhook => (
              <Card key={webhook.id} className="border-l-4" style={{ borderLeftColor: webhook.color }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{webhook.name}</CardTitle>
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: webhook.color,
                          color: webhook.color
                        }}
                      >
                        {webhookCategories.find(cat => cat.value === webhook.category)?.label}
                      </Badge>
                      {webhook.status && (
                        <Badge variant={webhook.status === 'success' ? 'default' : 'destructive'}>
                          {webhook.status === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {webhook.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {webhook.status === 'success' ? 'Działa' : 'Błąd'}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteWebhook(webhook.id)}
                    >
                      Usuń
                    </Button>
                  </div>
                  {webhook.lastTest && (
                    <CardDescription>
                      Ostatni test: {webhook.lastTest.toLocaleString('pl-PL')}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`webhook-url-${webhook.id}`}>URL Webhook-a</Label>
                      <Input
                        id={`webhook-url-${webhook.id}`}
                        type="url"
                        placeholder="https://discord.com/api/webhooks/..."
                        value={webhook.url}
                        onChange={(e) => updateWebhook(webhook.id, { url: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`webhook-category-${webhook.id}`}>Kategoria</Label>
                      <Select value={webhook.category} onValueChange={(value) => updateWebhook(webhook.id, { category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {webhookCategories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: cat.color }}
                                />
                                {cat.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`webhook-username-${webhook.id}`}>Nazwa Bota</Label>
                      <Input
                        id={`webhook-username-${webhook.id}`}
                        placeholder="FiveM Logger Bot"
                        value={webhook.username}
                        onChange={(e) => updateWebhook(webhook.id, { username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`webhook-color-${webhook.id}`}>Kolor Embed</Label>
                      <Input
                        id={`webhook-color-${webhook.id}`}
                        type="color"
                        value={webhook.color}
                        onChange={(e) => updateWebhook(webhook.id, { color: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => testWebhook(webhook)}
                      disabled={!webhook.url || webhook.status === 'pending'}
                      variant="outline"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      {webhook.status === 'pending' ? 'Testowanie...' : 'Test Webhook'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Webhook-a</CardTitle>
              <CardDescription>
                Wyślij testową wiadomość do wybranego webhook-a
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-webhook">Wybierz Webhook</Label>
                <Select value={selectedWebhook} onValueChange={setSelectedWebhook}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz webhook do testu" />
                  </SelectTrigger>
                  <SelectContent>
                    {webhooks.filter(w => w.url).map(webhook => (
                      <SelectItem key={webhook.id} value={webhook.id}>
                        {webhook.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-message">Wiadomość testowa</Label>
                <Textarea
                  id="test-message"
                  placeholder="Test webhook-a z aplikacji FiveM Admin Logger"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={() => {
                  const webhook = webhooks.find(w => w.id === selectedWebhook);
                  if (webhook) testWebhook(webhook);
                }}
                disabled={!selectedWebhook}
                className="w-full bg-gradient-primary"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Wyślij Test
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}