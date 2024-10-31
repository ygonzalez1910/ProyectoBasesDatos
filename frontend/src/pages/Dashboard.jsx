import React from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { BookOpen, Users, Database, School } from 'lucide-react';
import { FaUserGraduate, FaCode } from 'react-icons/fa';

const Dashboard = () => {
  const styles = {
    gradient: {
      background: "linear-gradient(45deg, #2c3e50 0%, #3498db 100%)",
      color: "white",
    },
    divider: {
      width: "25%",
      margin: "0 auto",
      borderTop: "2px solid #e3e6f0",
    },
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col className="text-center">
          <h2 className="display-4 mb-2">Sistema de Administración de Bases de Datos</h2>
          <p className="text-muted lead">Panel de Control Principal</p>
          <hr style={styles.divider} className="my-3" />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md="8">
          <Card className="shadow-lg h-100">
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <School size={20} className="me-3" />
                <CardTitle tag="h5" className="mb-0">Información Institucional</CardTitle>
              </div>
            </CardHeader>
            <CardBody className="p-5 overflow-y-auto">
              <div className="space-y-3">
                <p className="text-lg font-semibold text-gray-700">Universidad Nacional</p>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <p><strong>Facultad:</strong> Ciencias Exactas y Naturales</p>
                  <p><strong>Escuela:</strong> Informática</p>
                  <p><strong>Sede:</strong> Interuniversitaria de Alajuela</p>
                  <p><strong>Curso:</strong> EIF-402 Administración de Bases de Datos</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md="4">
          <Card className="shadow-lg h-100">
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <BookOpen size={20} className="me-3" />
                <CardTitle tag="h5" className="mb-0">Proyecto Final</CardTitle>
              </div>
            </CardHeader>
            <CardBody className="p-5 text-center">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600 font-semibold mb-2">Profesor</p>
                <p className="text-gray-800 text-lg">MAP. Rodolfo Sánchez Sánchez</p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-lg">
        <CardHeader className="py-3" style={styles.gradient}>
          <div className="d-flex align-items-center">
            <Users size={20} className="me-3" />
            <CardTitle tag="h5" className="mb-0">Equipo de Desarrollo</CardTitle>
          </div>
        </CardHeader>
        <CardBody className="p-5">
          <Row className="mt-3">
            <Col md="6" className="mb-4">
              <Card className="border-0 bg-gray-50 shadow-sm">
                <CardBody className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <FaUserGraduate className="text-4xl text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Desarrollador</h3>
                  <p className="text-gray-600">Pablo Alvarado Umaña</p>
                </CardBody>
              </Card>
            </Col>
            <Col md="6" className="mb-4">
              <Card className="border-0 bg-gray-50 shadow-sm">
                <CardBody className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <FaUserGraduate className="text-4xl text-pink-600" />
                  </div>
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