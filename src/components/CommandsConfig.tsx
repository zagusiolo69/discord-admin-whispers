
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit3, Save, Command, Zap, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LogItem {
  id: string;
  name: string;
  type: 'command' | 'event';
  description: string;
  enabled: boolean;
  category: string;
  logFormat: string;
}

const defaultLogItems: LogItem[] = [
  {
    id: '1',
    name: 'givecar',
    type: 'command',
    description: 'Daje pojazd graczowi',
    enabled: true,
    category: 'Pojazdy',
    logFormat: '**Admin:** {admin}\n**Komenda:** /givecar\n**Gracz:** {target}\n**Pojazd:** {vehicle}'
  },
  {
    id: '2',
    name: 'giveitem',
    type: 'command',
    description: 'Daje przedmiot graczowi',
    enabled: true,
    category: 'Przedmioty',
    logFormat: '**Admin:** {admin}\n**Komenda:** /giveitem\n**Gracz:** {target}\n**Przedmiot:** {item}\n**Ilość:** {amount}'
  },
  {
    id: '3',
    name: 'setjob',
    type: 'command',
    description: 'Ustawia pracę graczowi',
    enabled: true,
    category: 'Praca',
    logFormat: '**Admin:** {admin}\n**Komenda:** /setjob\n**Gracz:** {target}\n**Praca:** {job}\n**Stopień:** {grade}'
  },
  {
    id: '4',
    name: 'givemoney',
    type: 'command',
    description: 'Daje pieniądze graczowi',
    enabled: true,
    category: 'Ekonomia',
    logFormat: '**Admin:** {admin}\n**Komenda:** /givemoney\n**Gracz:** {target}\n**Kwota:** ${amount}\n**Typ:** {moneyType}'
  },
  {
    id: '5',
    name: 'kick',
    type: 'command',
    description: 'Wyrzuca gracza z serwera',
    enabled: true,
    category: 'Moderacja',
    logFormat: '**Admin:** {admin}\n**Komenda:** /kick\n**Gracz:** {target}\n**Powód:** {reason}'
  },
  {
    id: '6',
    name: 'ban',
    type: 'command',
    description: 'Banuje gracza',
    enabled: true,
    category: 'Moderacja',
    logFormat: '**Admin:** {admin}\n**Komenda:** /ban\n**Gracz:** {target}\n**Czas:** {duration}\n**Powód:** {reason}'
  },
  {
    id: '7',
    name: 'playerConnecting',
    type: 'event',
    description: 'Gracz łączy się z serwerem',
    enabled: true,
    category: 'Eventy',
    logFormat: '**Event:** playerConnecting\n**Gracz:** {playerName}\n**ID:** {playerId}\n**Steam:** {steamId}'
  },
  {
    id: '8',
    name: 'playerDropped',
    type: 'event',
    description: 'Gracz opuszcza serwer',
    enabled: true,
    category: 'Eventy',
    logFormat: '**Event:** playerDropped\n**Gracz:** {playerName}\n**ID:** {playerId}\n**Powód:** {reason}'
  },
  {
    id: '9',
    name: 'chatMessage',
    type: 'event',
    description: 'Wiadomość na czacie',
    enabled: false,
    category: 'Eventy',
    logFormat: '**Event:** chatMessage\n**Gracz:** {playerName}\n**Wiadomość:** {message}'
  }
];

export function CommandsConfig() {
  const [logItems, setLogItems] = useState<LogItem[]>(defaultLogItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLogItem, setNewLogItem] = useState<Partial<LogItem>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const categories = Array.from(new Set(logItems.map(item => item.category)));

  const toggleLogItem = (id: string) => {
    setLogItems(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
    toast({
      title: "Zaktualizowano element",
      description: "Status elementu został zmieniony"
    });
  };

  const updateLogItem = (id: string, updates: Partial<LogItem>) => {
    setLogItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setEditingId(null);
    toast({
      title: "Zaktualizowano element",
      description: "Zmiany zostały zapisane"
    });
  };

  const addLogItem = () => {
    if (!newLogItem.name || !newLogItem.description || !newLogItem.type) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive"
      });
      return;
    }

    const logItem: LogItem = {
      id: Date.now().toString(),
      name: newLogItem.name || '',
      type: newLogItem.type as 'command' | 'event',
      description: newLogItem.description || '',
      enabled: true,
      category: newLogItem.category || 'Inne',
      logFormat: newLogItem.logFormat || `**${newLogItem.type === 'command' ? 'Komenda' : 'Event'}:** ${newLogItem.name}\n**Gracz:** {playerName}`
    };

    setLogItems(prev => [...prev, logItem]);
    setNewLogItem({});
    setShowAddForm(false);
    toast({
      title: "Dodano element",
      description: `${logItem.type === 'command' ? 'Komenda' : 'Event'} "${logItem.name}" został dodany`
    });
  };

  const deleteLogItem = (id: string) => {
    setLogItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Usunięto element",
      description: "Element został usunięty z listy"
    });
  };

  const commands = logItems.filter(item => item.type === 'command');
  const events = logItems.filter(item => item.type === 'event');

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-fivem-primary/10 to-fivem-primary/5 border-fivem-primary/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-fivem-primary mb-2">
              {logItems.length}
            </div>
            <p className="text-sm text-muted-foreground">Wszystkich elementów</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-fivem-secondary/10 to-fivem-secondary/5 border-fivem-secondary/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-fivem-secondary mb-2">
              {commands.length}
            </div>
            <p className="text-sm text-muted-foreground">Komend</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-fivem-accent/10 to-fivem-accent/5 border-fivem-accent/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-fivem-accent mb-2">
              {events.length}
            </div>
            <p className="text-sm text-muted-foreground">Eventów</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {logItems.filter(item => item.enabled).length}
            </div>
            <p className="text-sm text-muted-foreground">Aktywnych</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Log Item Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-fivem-primary to-fivem-secondary hover:from-fivem-primary/80 hover:to-fivem-secondary/80 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj Nowy Element
        </Button>
      </div>

      {/* Add Log Item Form */}
      {showAddForm && (
        <Card className="border-fivem-primary/30 bg-gradient-to-br from-fivem-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-fivem-primary">Nowy Element Logowania</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="log-name">Nazwa</Label>
                <Input
                  id="log-name"
                  placeholder="np. givecar lub playerConnecting"
                  value={newLogItem.name || ''}
                  onChange={(e) => setNewLogItem(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="log-type">Typ</Label>
                <Select value={newLogItem.type} onValueChange={(value) => setNewLogItem(prev => ({ ...prev, type: value as 'command' | 'event' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="command">Komenda</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="log-category">Kategoria</Label>
                <Input
                  id="log-category"
                  placeholder="np. Pojazdy, Eventy"
                  value={newLogItem.category || ''}
                  onChange={(e) => setNewLogItem(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="log-desc">Opis</Label>
              <Input
                id="log-desc"
                placeholder="Opis funkcji"
                value={newLogItem.description || ''}
                onChange={(e) => setNewLogItem(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="log-format">Format logu</Label>
              <Textarea
                id="log-format"
                placeholder="**Admin:** {admin}\n**Komenda:** /{name}"
                value={newLogItem.logFormat || ''}
                onChange={(e) => setNewLogItem(prev => ({ ...prev, logFormat: e.target.value }))}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addLogItem} className="bg-gradient-to-r from-fivem-primary to-fivem-secondary">
                <Save className="w-4 h-4 mr-2" />
                Dodaj
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Anuluj
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log Items by Category */}
      {categories.map(category => (
        <Card key={category} className="shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-fivem-primary" />
                <span>{category}</span>
              </div>
              <Badge variant="outline" className="border-fivem-primary/30">
                {logItems.filter(item => item.category === category).length} elementów
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logItems
                .filter(item => item.category === category)
                .map(logItem => (
                <div key={logItem.id} className="border rounded-lg p-4 space-y-3 bg-gradient-to-r from-card to-card/50 hover:from-fivem-primary/5 hover:to-fivem-secondary/5 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={logItem.enabled}
                        onCheckedChange={() => toggleLogItem(logItem.id)}
                      />
                      <div className="flex items-center gap-2">
                        {logItem.type === 'command' ? (
                          <Command className="w-4 h-4 text-fivem-primary" />
                        ) : (
                          <Zap className="w-4 h-4 text-fivem-secondary" />
                        )}
                        <div>
                          <h4 className="font-semibold">
                            {logItem.type === 'command' ? '/' : ''}{logItem.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{logItem.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={logItem.enabled ? "default" : "secondary"}>
                        {logItem.enabled ? "Aktywny" : "Nieaktywny"}
                      </Badge>
                      <Badge variant="outline" className={
                        logItem.type === 'command' 
                          ? "border-fivem-primary/30 text-fivem-primary" 
                          : "border-fivem-secondary/30 text-fivem-secondary"
                      }>
                        {logItem.type === 'command' ? 'Komenda' : 'Event'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(editingId === logItem.id ? null : logItem.id)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLogItem(logItem.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {editingId === logItem.id && (
                    <div className="space-y-3 border-t pt-3">
                      <div>
                        <Label>Format logu Discord</Label>
                        <Textarea
                          value={logItem.logFormat}
                          onChange={(e) => updateLogItem(logItem.id, { logFormat: e.target.value })}
                          className="font-mono text-sm"
                          rows={4}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Dostępne zmienne: {'{admin}'}, {'{target}'}, {'{playerName}'}, {'{playerId}'}, {'{amount}'}, {'{reason}'}, {'{item}'}, {'{vehicle}'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
