import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit3, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminCommand {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  logFormat: string;
}

const defaultCommands: AdminCommand[] = [
  {
    id: '1',
    name: 'givecar',
    description: 'Daje pojazd graczowi',
    enabled: true,
    category: 'Pojazdy',
    logFormat: '**Admin:** {admin}\n**Komenda:** /givecar\n**Gracz:** {target}\n**Pojazd:** {vehicle}'
  },
  {
    id: '2',
    name: 'giveitem',
    description: 'Daje przedmiot graczowi',
    enabled: true,
    category: 'Przedmioty',
    logFormat: '**Admin:** {admin}\n**Komenda:** /giveitem\n**Gracz:** {target}\n**Przedmiot:** {item}\n**Ilość:** {amount}'
  },
  {
    id: '3',
    name: 'setjob',
    description: 'Ustawia pracę graczowi',
    enabled: true,
    category: 'Praca',
    logFormat: '**Admin:** {admin}\n**Komenda:** /setjob\n**Gracz:** {target}\n**Praca:** {job}\n**Stopień:** {grade}'
  },
  {
    id: '4',
    name: 'givemoney',
    description: 'Daje pieniądze graczowi',
    enabled: true,
    category: 'Ekonomia',
    logFormat: '**Admin:** {admin}\n**Komenda:** /givemoney\n**Gracz:** {target}\n**Kwota:** ${amount}\n**Typ:** {moneyType}'
  },
  {
    id: '5',
    name: 'kick',
    description: 'Wyrzuca gracza z serwera',
    enabled: true,
    category: 'Moderacja',
    logFormat: '**Admin:** {admin}\n**Komenda:** /kick\n**Gracz:** {target}\n**Powód:** {reason}'
  },
  {
    id: '6',
    name: 'ban',
    description: 'Banuje gracza',
    enabled: true,
    category: 'Moderacja',
    logFormat: '**Admin:** {admin}\n**Komenda:** /ban\n**Gracz:** {target}\n**Czas:** {duration}\n**Powód:** {reason}'
  }
];

export function CommandsConfig() {
  const [commands, setCommands] = useState<AdminCommand[]>(defaultCommands);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCommand, setNewCommand] = useState<Partial<AdminCommand>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const categories = Array.from(new Set(commands.map(cmd => cmd.category)));

  const toggleCommand = (id: string) => {
    setCommands(prev => prev.map(cmd => 
      cmd.id === id ? { ...cmd, enabled: !cmd.enabled } : cmd
    ));
    toast({
      title: "Zaktualizowano komendę",
      description: "Status komendy został zmieniony"
    });
  };

  const updateCommand = (id: string, updates: Partial<AdminCommand>) => {
    setCommands(prev => prev.map(cmd => 
      cmd.id === id ? { ...cmd, ...updates } : cmd
    ));
    setEditingId(null);
    toast({
      title: "Zaktualizowano komendę",
      description: "Zmiany zostały zapisane"
    });
  };

  const addCommand = () => {
    if (!newCommand.name || !newCommand.description) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive"
      });
      return;
    }

    const command: AdminCommand = {
      id: Date.now().toString(),
      name: newCommand.name || '',
      description: newCommand.description || '',
      enabled: true,
      category: newCommand.category || 'Inne',
      logFormat: newCommand.logFormat || '**Admin:** {admin}\n**Komenda:** /{name}\n**Cel:** {target}'
    };

    setCommands(prev => [...prev, command]);
    setNewCommand({});
    setShowAddForm(false);
    toast({
      title: "Dodano komendę",
      description: `Komenda "${command.name}" została dodana`
    });
  };

  const deleteCommand = (id: string) => {
    setCommands(prev => prev.filter(cmd => cmd.id !== id));
    toast({
      title: "Usunięto komendę",
      description: "Komenda została usunięta z listy"
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-fivem-primary">
              {commands.length}
            </div>
            <p className="text-sm text-muted-foreground">Wszystkich komend</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {commands.filter(cmd => cmd.enabled).length}
            </div>
            <p className="text-sm text-muted-foreground">Aktywnych</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-fivem-secondary">
              {categories.length}
            </div>
            <p className="text-sm text-muted-foreground">Kategorii</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Command Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Dodaj Komendę
        </Button>
      </div>

      {/* Add Command Form */}
      {showAddForm && (
        <Card className="border-fivem-primary/20">
          <CardHeader>
            <CardTitle className="text-fivem-primary">Nowa Komenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cmd-name">Nazwa komendy</Label>
                <Input
                  id="cmd-name"
                  placeholder="np. teleport"
                  value={newCommand.name || ''}
                  onChange={(e) => setNewCommand(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="cmd-category">Kategoria</Label>
                <Input
                  id="cmd-category"
                  placeholder="np. Teleportacja"
                  value={newCommand.category || ''}
                  onChange={(e) => setNewCommand(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cmd-desc">Opis</Label>
              <Input
                id="cmd-desc"
                placeholder="Opis funkcji komendy"
                value={newCommand.description || ''}
                onChange={(e) => setNewCommand(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="cmd-format">Format logu</Label>
              <Textarea
                id="cmd-format"
                placeholder="**Admin:** {admin}\n**Komenda:** /{name}"
                value={newCommand.logFormat || ''}
                onChange={(e) => setNewCommand(prev => ({ ...prev, logFormat: e.target.value }))}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addCommand} className="bg-gradient-primary">
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

      {/* Commands by Category */}
      {categories.map(category => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{category}</span>
              <Badge variant="outline">
                {commands.filter(cmd => cmd.category === category).length} komend
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commands
                .filter(cmd => cmd.category === category)
                .map(command => (
                <div key={command.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={command.enabled}
                        onCheckedChange={() => toggleCommand(command.id)}
                      />
                      <div>
                        <h4 className="font-semibold">/{command.name}</h4>
                        <p className="text-sm text-muted-foreground">{command.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={command.enabled ? "default" : "secondary"}>
                        {command.enabled ? "Aktywna" : "Nieaktywna"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(editingId === command.id ? null : command.id)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCommand(command.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {editingId === command.id && (
                    <div className="space-y-3 border-t pt-3">
                      <div>
                        <Label>Format logu Discord</Label>
                        <Textarea
                          value={command.logFormat}
                          onChange={(e) => updateCommand(command.id, { logFormat: e.target.value })}
                          className="font-mono text-sm"
                          rows={4}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Dostępne zmienne: {'{admin}'}, {'{target}'}, {'{amount}'}, {'{reason}'}, {'{item}'}, {'{vehicle}'}
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