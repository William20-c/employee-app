import React from "react";

const TablaEmpleados = ({ empleados }) => (
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Salario</th>
      </tr>
    </thead>
    <tbody>
      {empleados.map((empleado) => (
        <tr key={empleado.id}>
          <td>{empleado.id}</td>
          <td>{empleado.nombre}</td>
          <td>{empleado.correo}</td>
          <td>{empleado.salario}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TablaEmpleados;
