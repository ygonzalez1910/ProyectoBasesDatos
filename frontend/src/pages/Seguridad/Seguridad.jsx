import React, { useState } from 'react';
import { Shield, Users, Key, UserPlus, UserMinus, Lock, Settings, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SecurityModule = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'admin', roles: ['DBA', 'ADMIN'], status: 'active' },
    { id: 2, name: 'user1', roles: ['READ'], status: 'active' },
  ]);

  const [selectedUser, setSelectedUser] = useState('');
  const [newUserData, setNewUserData] = useState({
    username: '',
    password: '',
    roles: []
  });

  const availableRoles = ['DBA', 'ADMIN', 'READ', 'WRITE'];

  const handleCreateUser = () => {
    // Implementar lógica de creación
    console.log('Crear usuario:', newUserData);
  };

  const handleDeleteUser = (userId) => {
    // Implementar lógica de eliminación
    console.log('Eliminar usuario:', userId);
  };

  const handleChangePassword = () => {
    // Implementar lógica de cambio de contraseña
    console.log('Cambiar contraseña para:', selectedUser);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Gestión de Seguridad</h1>
          <p className="text-gray-500">Administración de usuarios y privilegios del sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Crear Usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Crear Usuario
            </CardTitle>
            <CardDescription>
              Crea un nuevo usuario con roles específicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Input 
                  placeholder="Nombre de usuario" 
                  value={newUserData.username}
                  onChange={(e) => setNewUserData({...newUserData, username: e.target.value})}
                />
              </div>
              <div>
                <Input 
                  type="password" 
                  placeholder="Contraseña" 
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Seleccionar Roles</label>
                <div className="flex flex-wrap gap-2">
                  {availableRoles.map(role => (
                    <Button
                      key={role}
                      variant={newUserData.roles.includes(role) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newRoles = newUserData.roles.includes(role)
                          ? newUserData.roles.filter(r => r !== role)
                          : [...newUserData.roles, role];
                        setNewUserData({...newUserData, roles: newRoles});
                      }}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={handleCreateUser}
              >
                Crear Usuario
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Gestión de Usuarios Existentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestión de Usuarios
            </CardTitle>
            <CardDescription>
              Administra usuarios existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select 
                value={selectedUser} 
                onValueChange={setSelectedUser}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedUser && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      variant="outline"
                      onClick={handleChangePassword}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Cambiar Contraseña
                    </Button>
                    <Button 
                      className="flex-1"
                      variant="destructive"
                      onClick={() => handleDeleteUser(selectedUser)}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Eliminar Usuario
                    </Button>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Roles Asignados</label>
                    <div className="flex flex-wrap gap-2">
                      {users.find(u => u.name === selectedUser)?.roles.map(role => (
                        <span
                          key={role}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección de Roles y Privilegios */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Roles y Privilegios
            </CardTitle>
            <CardDescription>
              Gestiona roles y privilegios del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="roles">
              <TabsList className="mb-4">
                <TabsTrigger value="roles">Roles del Sistema</TabsTrigger>
                <TabsTrigger value="privileges">Privilegios</TabsTrigger>
              </TabsList>
              
              <TabsContent value="roles">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRoles.map(role => (
                    <Card key={role}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{role}</div>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="privileges">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Los privilegios se muestran basados en los roles seleccionados.
                  </AlertDescription>
                </Alert>
                <div className="mt-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2">Privilegio</th>
                        <th className="pb-2">Descripción</th>
                        <th className="pb-2">Roles Asociados</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">CREATE SESSION</td>
                        <td>Permite iniciar sesión en la base de datos</td>
                        <td>DBA, ADMIN, READ</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">CREATE TABLE</td>
                        <td>Permite crear tablas</td>
                        <td>DBA, ADMIN</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">SELECT ANY TABLE</td>
                        <td>Permite consultar cualquier tabla</td>
                        <td>DBA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityModule;