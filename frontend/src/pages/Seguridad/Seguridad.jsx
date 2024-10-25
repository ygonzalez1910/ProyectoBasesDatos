import React, { useState } from 'react';
import { Shield, Users, Key, Lock, Database, Code, Server, Cog } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Seguridad = () => {
  const [createRoleData, setCreateRoleData] = useState({
    roleName: '',
    roleType: 'basic', // basic, password, application, external, global
    password: '',
    schema: '',
    package: ''
  });

  const [selectedSchema, setSelectedSchema] = useState('');
  const [showSchemaPrivileges, setShowSchemaPrivileges] = useState(false);

  // Simulated data - replace with actual API calls
  const schemas = ['HR', 'SYSTEM', 'SYS'];
  const objectTypes = ['TABLE', 'VIEW', 'SEQUENCE', 'PROCEDURE', 'PACKAGE', 'FUNCTION'];

  const handleCreateRole = () => {
    // Implementar lógica según el tipo de rol
    console.log('Crear rol:', createRoleData);
  };

  const RoleCreationForm = () => (
    <div className="space-y-4">
      <div>
        <Label>Nombre del Rol</Label>
        <Input 
          value={createRoleData.roleName}
          onChange={(e) => setCreateRoleData({...createRoleData, roleName: e.target.value})}
          placeholder="Nombre del rol"
        />
      </div>

      <div>
        <Label>Tipo de Rol</Label>
        <Select 
          value={createRoleData.roleType}
          onValueChange={(value) => setCreateRoleData({...createRoleData, roleType: value})}
        >
          <SelectTrigger>
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
        <div>
          <Label>Contraseña</Label>
          <Input 
            type="password"
            value={createRoleData.password}
            onChange={(e) => setCreateRoleData({...createRoleData, password: e.target.value})}
            placeholder="Contraseña del rol"
          />
        </div>
      )}

      {createRoleData.roleType === 'application' && (
        <>
          <div>
            <Label>Schema</Label>
            <Input 
              value={createRoleData.schema}
              onChange={(e) => setCreateRoleData({...createRoleData, schema: e.target.value})}
              placeholder="Nombre del schema"
            />
          </div>
          <div>
            <Label>Package</Label>
            <Input 
              value={createRoleData.package}
              onChange={(e) => setCreateRoleData({...createRoleData, package: e.target.value})}
              placeholder="Nombre del package"
            />
          </div>
        </>
      )}

      <Button className="w-full" onClick={handleCreateRole}>
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
        <div className="space-y-4">
          <Select value={selectedSchema} onValueChange={setSelectedSchema}>
            <SelectTrigger>
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
            <div className="border rounded-lg p-4">
              <div className="space-y-3">
                {objectTypes.map(type => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label>{type}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      {type === 'TABLE' && (
                        <>
                          <Label className="text-sm">SELECT</Label>
                          <Switch />
                          <Label className="text-sm">INSERT</Label>
                          <Switch />
                          <Label className="text-sm">UPDATE</Label>
                          <Switch />
                          <Label className="text-sm">DELETE</Label>
                          <Switch />
                        </>
                      )}
                      {(type === 'VIEW' || type === 'SEQUENCE') && (
                        <>
                          <Label className="text-sm">SELECT</Label>
                          <Switch />
                        </>
                      )}
                      {(type === 'PROCEDURE' || type === 'PACKAGE' || type === 'FUNCTION') && (
                        <>
                          <Label className="text-sm">EXECUTE</Label>
                          <Switch />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Gestión de Roles
        </CardTitle>
        <CardDescription>
          Administración de roles y privilegios del sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create">
          <TabsList className="mb-4">
            <TabsTrigger value="create">Crear Rol</TabsTrigger>
            <TabsTrigger value="assign">Asignar Privilegios</TabsTrigger>
            <TabsTrigger value="sysdba">Roles SYSDBA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Crear Nuevo Rol</CardTitle>
                    <CardDescription>
                      Define las características del nuevo rol
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RoleCreationForm />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Privilegios del Rol</CardTitle>
                    <CardDescription>
                      Asigna privilegios al rol
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SchemaPrivilegesSection />
                    
                    <Button variant="outline" className="w-full">
                      <Key className="h-4 w-4 mr-2" />
                      Asignar Privilegios del Sistema
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="assign">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Asignar Roles a Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">Usuario 1</SelectItem>
                      <SelectItem value="user2">Usuario 2</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="border rounded-lg p-4">
                    <Label className="mb-2 block">Roles Disponibles</Label>
                    <div className="space-y-2">
                      {['CONNECT', 'RESOURCE', 'DBA', 'SYSDBA'].map(role => (
                        <div key={role} className="flex items-center justify-between">
                          <Label>{role}</Label>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Gestión de Roles SYSDBA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2">Usuario</th>
                        <th className="pb-2">SYSDBA</th>
                        <th className="pb-2">SYSOPER</th>
                        <th className="pb-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">SYS</td>
                        <td>TRUE</td>
                        <td>TRUE</td>
                        <td>
                          <Button variant="ghost" size="sm">
                            <Cog className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">DBA_USER</td>
                        <td>TRUE</td>
                        <td>FALSE</td>
                        <td>
                          <Button variant="ghost" size="sm">
                            <Cog className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
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
  );
};

export default Seguridad;