import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { BookOpen, Users, Database, School } from 'lucide-react';

const Dashboard = () => {
  return (
    <Container fluid className="p-4">
      {/* Header Section */}
      <Card className="mb-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Sistema de Administración de Bases de Datos</h1>
              <p className="text-lg opacity-90">Panel de Control Principal</p>
            </div>
            <Database className="h-16 w-16 opacity-80" />
          </div>
        </CardBody>
      </Card>

      {/* University Info Section */}
      <Row className="mb-4">
        <Col md="8">
          <Card className="h-100 shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <School className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Información Institucional</h2>
              </div>
              <div className="space-y-3">
                <p className="text-lg font-semibold text-gray-700">Universidad Nacional</p>
                <p className="text-gray-600">Facultad de Ciencias Exactas y Naturales</p>
                <p className="text-gray-600">Escuela de Informática</p>
                <p className="text-gray-600">Sede Interuniversitaria de Alajuela</p>
                <div className="mt-4">
                  <p className="text-gray-700"><strong>Curso:</strong> EIF-402 Administración de Bases de Datos</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md="4">
          <Card className="h-100 shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Proyecto Final</h2>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600"><strong>Profesor:</strong></p>
                <p className="text-gray-700">MAP. Rodolfo Sánchez Sánchez</p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Team Section */}
      <Card className="shadow-lg">
        <CardBody className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Users className="h-8 w-8 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Equipo de Desarrollo</h2>
          </div>
          <Row className="mt-4">
            <Col md="6">
              <Card className="border-0 bg-gray-50">
                <CardBody className="p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Desarrollador</h3>
                  <p className="text-gray-600">Pablo Alvarado Umaña</p>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card className="border-0 bg-gray-50">
                <CardBody className="p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Desarrolladora</h3>
                  <p className="text-gray-600">Yuliana Gonzalez Chaves</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Dashboard;