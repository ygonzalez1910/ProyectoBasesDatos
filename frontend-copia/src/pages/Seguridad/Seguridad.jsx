import React, { useState } from 'react';
import { Shield, Users, Key, Lock, Database, Code, Server, Cog } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Switch } from "../../components/ui/Switch";
import { Label } from "../../components/ui/Label";


const Seguridad = () => {
  const [createRoleData, setCreateRoleData] = useState({
    roleName: '',
    roleType: 'basic',
    password: '',
    schema: '',
    package: ''
  });

  const [selectedSchema, setSelectedSchema] = useState('');
  const schemas = ['HR', 'SYSTEM', 'SYS'];
  const objectTypes = ['TABLE', 'VIEW', 'SEQUENCE', 'PROCEDURE', 'PACKAGE', 'FUNCTION'];

  const handleCreateRole = () => {
    console.log('Crear rol:', createRoleData);
  };

  const RoleCreationForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Nombre del Rol</Label>
        <Input 
          value={createRoleData.roleName}
          onChange={(e) => setCreateRoleData({...createRoleData, roleName: e.target.value})}
          placeholder="Nombre del rol"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Tipo de Rol</Label>
        <Select 
          value={createRoleData.roleType}
          onValueChange={(value) => setCreateRoleData({...createRoleData, roleType: value})}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar tipo de rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Rol Básico (NOT IDENTIFIED)</SelectItem>
            <SelectItem value="password">Rol con Contraseña</SelectItem>
            <SelectItem value="application">Rol de Aplicación</SelectItem>
            <SelectItem value="external">Rol Externo (SO)</SelectItem>
            <SelectItem value="global">Rol Global (Directorio)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {createRoleData.roleType === 'password' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Contraseña</Label>
          <Input 
            type="password"
            value={createRoleData.password}
            onChange={(e) => setCreateRoleData({...createRoleData, password: e.target.value})}
            placeholder="Contraseña del rol"
            className="w-full"
          />
        </div>
      )}

      {createRoleData.roleType === 'application' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Schema</Label>
            <Input 
              value={createRoleData.schema}
              onChange={(e) => setCreateRoleData({...createRoleData, schema: e.target.value})}
              placeholder="Nombre del schema"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Package</Label>
            <Input 
              value={createRoleData.package}
              onChange={(e) => setCreateRoleData({...createRoleData, package: e.target.value})}
              placeholder="Nombre del package"
              className="w-full"
            />
          </div>
        </div>
      )}

      <Button className="w-full mt-6" onClick={handleCreateRole}>
        Crear Rol
      </Button>
    </div>
  );

  const SchemaPrivilegesSection = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Database className="h-4 w-4 mr-2" />
          Asignar Privilegios de Schema
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Privilegios de Schema</DialogTitle>
          <DialogDescription>
            Asignar privilegios de schema al rol
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <Select value={selectedSchema} onValueChange={setSelectedSchema}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar Schema" />
            </SelectTrigger>
            <SelectContent>
              {schemas.map(schema => (
                <SelectItem key={schema} value={schema}>
                  {schema}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSchema && (
            <div className="border rounded-lg p-6 space-y-4 bg-white">
              {objectTypes.map(type => (
                <div key={type} className="flex items-center justify-between py-2 border-b last:border-0">
                  <Label className="font-medium">{type}</Label>
                  <div className="flex items-center gap-6">
                    {type === 'TABLE' && (
                      <>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">SELECT</Label>
                          <Switch />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">INSERT</Label>
                          <Switch />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">UPDATE</Label>
                          <Switch />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">DELETE</Label>
                          <Switch />
                        </div>
                      </>
                    )}
                    {(type === 'VIEW' || type === 'SEQUENCE') && (
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">SELECT</Label>
                        <Switch />
                      </div>
                    )}
                    {(type === 'PROCEDURE' || type === 'PACKAGE' || type === 'FUNCTION') && (
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">EXECUTE</Label>
                        <Switch />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-7xl p-8">
        <Card className="w-full shadow-lg">
          <CardHeader className="border-b bg-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lock className="h-6 w-6" />
              Gestión de Roles
            </CardTitle>
            <CardDescription className="text-gray-600">
              Administración de roles y privilegios del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="create" className="space-y-6">
              <TabsList className="w-full justify-start bg-white border-b p-0 h-12">
                <TabsTrigger 
                  value="create" 
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full"
                >
                  Crear Rol
                </TabsTrigger>
                <TabsTrigger 
                  value="assign" 
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full"
                >
                  Asignar Privilegios
                </TabsTrigger>
                <TabsTrigger 
                  value="sysdba" 
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full"
                >
                  Roles SYSDBA
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="create">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="shadow-sm">
                    <CardHeader className="bg-white">
                      <CardTitle className="text-lg font-semibold">Crear Nuevo Rol</CardTitle>
                      <CardDescription>
                        Define las características del nuevo rol
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <RoleCreationForm />
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <CardHeader className="bg-white">
                      <CardTitle className="text-lg font-semibold">Privilegios del Rol</CardTitle>
                      <CardDescription>
                        Asigna privilegios al rol
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <SchemaPrivilegesSection />
                      <Button variant="outline" className="w-full">
                        <Key className="h-4 w-4 mr-2" />
                        Asignar Privilegios del Sistema
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
    
              <TabsContent value="assign">
                <Card className="shadow-sm">
                  <CardHeader className="bg-white">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                      <Users className="h-5 w-5" />
                      Asignar Roles a Usuarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar Usuario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user1">Usuario 1</SelectItem>
                          <SelectItem value="user2">Usuario 2</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="border rounded-lg p-6 bg-white">
                        <Label className="text-lg font-medium mb-4 block">Roles Disponibles</Label>
                        <div className="space-y-4">
                          {['CONNECT', 'RESOURCE', 'DBA', 'SYSDBA'].map(role => (
                            <div key={role} className="flex items-center justify-between py-2 border-b last:border-0">
                              <Label className="font-medium">{role}</Label>
                              <Switch />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sysdba">
                <Card className="shadow-sm">
                  <CardHeader className="bg-white">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                      <Shield className="h-5 w-5" />
                      Gestión de Roles SYSDBA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="rounded-lg border bg-white overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="text-left p-4 font-medium">Usuario</th>
                              <th className="text-left p-4 font-medium">SYSDBA</th>
                              <th className="text-left p-4 font-medium">SYSOPER</th>
                              <th className="text-left p-4 font-medium">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-4">SYS</td>
                              <td className="p-4">TRUE</td>
                              <td className="p-4">TRUE</td>
                              <td className="p-4">
                                <Button variant="ghost" size="sm">
                                  <Cog className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-4">DBA_USER</td>
                              <td className="p-4">TRUE</td>
                              <td className="p-4">FALSE</td>
                              <td className="p-4">
                                <Button variant="ghost" size="sm">
                                  <Cog className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>
                          Asignar SYSDBA a Usuario
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Seguridad;